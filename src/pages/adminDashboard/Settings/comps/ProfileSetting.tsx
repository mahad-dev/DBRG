import { useState, useEffect, useRef } from "react";
import { userApi, type UserProfile } from "@/services/userApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

const ProfileSetting = () => {
  const {} = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/static/UserImg.png");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserProfile();
      if (response.status && response.data) {
        setProfile(response.data);
        setFormData({
          name: response.data.name || response.data.directorName || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Set profile image
        if (response.data.pictureUrl) {
          setProfileImage(response.data.pictureUrl);
        } else if (response.data.pictureId) {
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
          setProfileImage(`${apiBaseUrl}/UploadDetails/GetDocument?documentId=${response.data.pictureId}`);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || profile.directorName || "",
        phone: profile.phone || "",
        email: profile.email || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      // Upload the document
      const pictureId = await userApi.uploadDocument(file);

      // Update profile with new picture ID
      const response = await userApi.updateUserProfile({
        pictureId: pictureId,
      });

      if (response.status) {
        toast.success("Profile picture updated successfully");

        // Update preview image
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        setProfileImage(`${apiBaseUrl}/UploadDetails/GetDocument?documentId=${pictureId}`);

        // Refresh profile data
        await fetchUserProfile();
      } else {
        toast.error(response.message || "Failed to update profile picture");
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast.error(error?.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      let successMessages: string[] = [];

      // Update name if changed
      if (formData.name !== (profile?.name || profile?.directorName || "")) {
        const response = await userApi.updateUserProfile({
          directorName: formData.name,
        });

        if (response.status) {
          successMessages.push("Name updated");
          // Update localStorage
          localStorage.setItem("name", formData.name);
        } else {
          toast.error(response.message || "Failed to update name");
          return;
        }
      }

      // Handle password reset if user filled password fields
      if (formData.oldPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.oldPassword) {
          toast.error("Please enter your old password");
          return;
        }
        if (!formData.newPassword) {
          toast.error("Please enter a new password");
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("New passwords do not match");
          return;
        }
        if (formData.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }

        const passwordResponse = await userApi.resetPassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        });

        if (passwordResponse.status) {
          successMessages.push("Password reset");
        } else {
          toast.error(passwordResponse.message || "Failed to reset password");
          return;
        }
      }

      if (successMessages.length > 0) {
        toast.success(`Profile updated successfully: ${successMessages.join(", ")}`);

        // Refresh profile data
        await fetchUserProfile();

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        toast.info("No changes to save");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="font-inter">
        <h1 className="text-[#C6A95F] text-3xl font-semibold mb-6">
          Profile Settings
        </h1>
        <div className="bg-[#3e3e3e] rounded-lg p-6 w-[680px]">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter">
      {/* Title */}
      <h1 className="text-[#C6A95F] text-3xl font-semibold mb-6">
        Profile Settings
      </h1>

      {/* Card */}
      <div className="bg-[#3e3e3e] rounded-lg p-6 w-[680px]">
        {/* Profile Picture */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#C6A95F]"
              onError={(e) => {
                e.currentTarget.src = "/static/UserImg.png";
              }}
            />
            <button
              onClick={handleImageClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-[#C6A95F] p-2 rounded-full hover:bg-[#b89a4f] transition-colors disabled:opacity-50"
              title="Change profile picture"
            >
              <Camera size={16} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Profile Picture</p>
            <p className="text-[#B3B3B3] text-sm">Click the camera icon to upload a new picture</p>
            <p className="text-[#B3B3B3] text-xs mt-1">Max size: 5MB (JPG, PNG, GIF)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="w-80 h-10 bg-white rounded-md text-black px-3"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-2 gap-17 mb-5">
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91-987-654-3210"
              className="w-80 h-10 bg-white rounded-md text-black px-3"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="xyz@gmail.com"
              className="w-full h-10 bg-white rounded-md text-black px-3"
              disabled
            />
          </div>
        </div>

        {/* Reset Password */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Reset Password</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
            placeholder="Enter Old Password"
            className="w-80 h-10 bg-white rounded-md text-black px-3 mb-4"
          />

          <div className="grid grid-cols-2 gap-17">
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter New Password"
              className="w-80 h-10 bg-white rounded-md text-black px-3"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-Enter Password"
              className="w-full h-10 bg-white rounded-md text-black px-3"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-6 mt-6">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="cursor-pointer px-6 py-1 border border-white rounded-md text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={loading}
            className="cursor-pointer px-6 py-1 bg-[#C6A95F] text-white rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
