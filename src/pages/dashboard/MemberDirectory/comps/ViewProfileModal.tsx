import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Mail, Phone, User } from "lucide-react";
import { userApi } from "@/services/userApi";

interface ViewProfileModalProps {
  userId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profilePictureId: number | null;
  pictureUrl: string | null;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (name && name.trim()) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  }
  return "U";
};



export default function ViewProfileModal({
  userId,
  isOpen,
  onOpenChange,
}: ViewProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getUserProfile(userId);

      if (response.status && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2F2F2F] border-none text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#C6A95F]">
            Member Profile
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C6A95F]" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : profile ? (
          <div className="space-y-6 mt-4">
            {/* Profile Picture and Name */}
            <div className="flex flex-col items-center gap-4">
              {profile.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#C6A95F]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-black text-3xl bg-[#C6A95F]">
                  {getInitials(profile.fullName)}
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">
                  {profile.fullName}
                </h3>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4 bg-[#FFFFFF10] rounded-xl p-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="bg-[#C6A95F] p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60">Email</p>
                  <p className="text-sm text-white truncate">{profile.email}</p>
                </div>
              </div>

              {/* Phone */}
              {profile.phoneNumber && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#C6A95F] p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60">Phone</p>
                    <p className="text-sm text-white">{profile.phoneNumber}</p>
                  </div>
                </div>
              )}

              {/* User ID */}
              <div className="flex items-center gap-3">
                <div className="bg-[#C6A95F] p-2 rounded-lg">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60">Member ID</p>
                  <p className="text-sm text-white/80 font-mono text-xs truncate">{profile.id}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
