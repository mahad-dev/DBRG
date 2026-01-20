import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User as UserIcon, Building2, Mail, Phone, MapPin, FileText, Shield } from "lucide-react";
import { userApi, type UserProfile } from "@/services/userApi";
import { toast } from "react-toastify";

interface ViewUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

interface Permission {
  id: number;
  name: string;
  key: string;
  parentId: number | null;
  parent: any;
}

interface AdminUserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: number;
  permissions: Permission[];
}

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | undefined | null }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/10">
    <Icon className="w-5 h-5 text-[#C6A95F] mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-white/60 text-sm mb-1">{label}</p>
      <p className="text-white text-base font-medium break-words">{value || "N/A"}</p>
    </div>
  </div>
);

const getRoleText = (role: number): string => {
  switch (role) {
    case 0:
      return "Super Admin";
    case 1:
      return "Admin";
    case 2:
      return "User";
    default:
      return "Unknown";
  }
};

export default function ViewUserModal({ open, onClose, userId }: ViewUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adminData, setAdminData] = useState<AdminUserData | null>(null);

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    }
  }, [open, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUserById(userId);
      if (response.status) {
        // Check if it's an admin user (has role and permissions) or regular user
        if (response.data.role !== undefined && response.data.permissions) {
          setAdminData(response.data);
          setUserProfile(null);
        } else {
          setUserProfile(response.data);
          setAdminData(null);
        }
      } else {
        toast.error(response.message || "Failed to fetch user details");
      }
    } catch (error: any) {
      console.error("Fetch User Error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserProfile(null);
    setAdminData(null);
    onClose();
  };

  // Group permissions by parent
  const groupPermissions = (permissions: Permission[]) => {
    const grouped: { [key: string]: Permission[] } = {};
    const parents: Permission[] = [];

    permissions.forEach(perm => {
      if (perm.parentId === null) {
        parents.push(perm);
        grouped[perm.key] = [];
      }
    });

    permissions.forEach(perm => {
      if (perm.parentId !== null && perm.parent) {
        if (!grouped[perm.parent.key]) {
          grouped[perm.parent.key] = [];
        }
        grouped[perm.parent.key].push(perm);
      }
    });

    return { grouped, parents };
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1a1a] text-white border-[#C6A95F] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#C6A95F] flex items-center gap-2">
            <UserIcon className="w-6 h-6" />
            User Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F] mb-4" />
            <p className="text-white/60">Loading user details...</p>
          </div>
        ) : adminData ? (
          <div className="space-y-1">
            {/* Admin User Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#C6A95F] mb-3">User Information</h3>
              <div className="space-y-0">
                <InfoRow icon={UserIcon} label="Name" value={adminData.fullName} />
                <InfoRow icon={Mail} label="Email" value={adminData.email} />
                <InfoRow icon={Phone} label="Phone" value={adminData.phoneNumber} />
                <InfoRow icon={Shield} label="Role" value={getRoleText(adminData.role)} />
              </div>
            </div>

            {/* Permissions */}
            {adminData.permissions && adminData.permissions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#C6A95F] mb-3">Permissions</h3>
                <div className="space-y-4">
                  {(() => {
                    const { grouped, parents } = groupPermissions(adminData.permissions);
                    return parents.map(parent => (
                      <div key={parent.id} className="border-b border-white/10 pb-3">
                        <h4 className="text-white font-medium mb-2">{parent.name}</h4>
                        {grouped[parent.key] && grouped[parent.key].length > 0 && (
                          <ul className="ml-4 space-y-1">
                            {grouped[parent.key].map(perm => (
                              <li key={perm.id} className="text-white/70 text-sm">
                                • {perm.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        ) : userProfile ? (
          <div className="space-y-1">
            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#C6A95F] mb-3">Personal Information</h3>
              <div className="space-y-0">
                <InfoRow icon={UserIcon} label="Name" value={userProfile.name} />
                <InfoRow icon={Mail} label="Email" value={userProfile.email} />
                <InfoRow icon={Phone} label="Phone" value={userProfile.phone} />
              </div>
            </div>

            {/* Company Information */}
            {(userProfile.companyName || userProfile.companyAddress || userProfile.companyCountry) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#C6A95F] mb-3">Company Information</h3>
                <div className="space-y-0">
                  <InfoRow icon={Building2} label="Company Name" value={userProfile.companyName} />
                  <InfoRow icon={MapPin} label="Company Address" value={userProfile.companyAddress} />
                  <InfoRow icon={MapPin} label="Company Country" value={userProfile.companyCountry} />
                  <InfoRow icon={FileText} label="License Number" value={userProfile.licenseNumber} />
                </div>
              </div>
            )}

            {/* Profile Picture */}
            {userProfile.pictureUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#C6A95F] mb-3">Profile Picture</h3>
                <img
                  src={userProfile.pictureUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-[#C6A95F]"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-white/60">No user data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
