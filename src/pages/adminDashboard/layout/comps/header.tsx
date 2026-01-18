"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Settings, LogOut, ChevronDown } from "lucide-react";
import { userApi } from "@/services/userApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LogoutDialog from "@/components/LogoutDialog";

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export default function Header({ setMobileOpen }: HeaderProps) {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [profileImageUrl, setProfileImageUrl] = useState("/static/UserImg.png");
  const [userRole] = useState("Admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getUserProfile();
      if (response.status && response.data) {
        setName(response.data.name || response.data.email?.split('@')[0] || "User");

        // If there's a picture URL, use it
        if (response.data.pictureUrl) {
          setProfileImageUrl(response.data.pictureUrl);
        } else if (response.data.pictureId) {
          // Construct URL from pictureId
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
          setProfileImageUrl(`${apiBaseUrl}/UploadDetails/GetDocument?documentId=${response.data.pictureId}`);
        }

        // Update role if available
        // if (response.data.directorName) {
        //   setUserRole("Director");
        // }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <header className="w-full lg:border md:border-white rounded-xl lg:px-4 lg:py-1.5 flex items-center justify-between">
        {/* LEFT: HAMBURGER (MOBILE ONLY) */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-white cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={32} color="#C6A95F" />
        </button>

        {/* SEARCH BAR — commented out as per request */}
        {/* <div className="hidden lg:flex items-center bg-[#FFFFFF26] px-3 py-1 rounded-lg w-[300px]">
          <Input
            placeholder="Search"
            className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder-white text-[14px]"
          />
          <Search size={16} className="text-white -ml-6" />
        </div> */}

        {/* Empty div to maintain layout spacing on desktop */}
        <div className="hidden lg:block" />

        <div className="flex items-center gap-2 lg:hidden">
          <img src="/DBRG-logo.svg" alt="DBRG" className="w-[42px] h-[47px]" />

          <span className="font-gilroy font-bold text-[23px] leading-[150%] tracking-[-0.03em] align-middle text-[#C6A95F]">
            DBRG
          </span>
        </div>

        {/* PROFILE SECTION WITH DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10 border border-white">
              <AvatarImage src={profileImageUrl} alt="User Avatar" />
              <AvatarFallback>{name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            <div className="hidden lg:block text-left">
              <p className="text-[#757575] text-[18px] font-semibold">
                {name}
              </p>
              <p className="text-[#B3B3B3] text-[16px]">{userRole}</p>
            </div>

            <ChevronDown
              size={20}
              className={`hidden lg:block text-[#B3B3B3] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/admin/dashboard/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#3A3A3A] transition-colors cursor-pointer"
              >
                <Settings size={18} className="text-[#C6A95F]" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setLogoutDialogOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#3A3A3A] transition-colors cursor-pointer border-t border-[#3A3A3A]"
              >
                <LogOut size={18} className="text-[#C6A95F]" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* LOGOUT CONFIRMATION DIALOG */}
      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}
