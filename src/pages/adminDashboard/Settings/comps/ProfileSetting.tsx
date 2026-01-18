import { useState, useEffect, useRef } from "react";
import { userApi, type UserProfile } from "@/services/userApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Camera, Eye, EyeOff } from "lucide-react";

const ProfileSetting = () => {
  const {} = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/static/UserImg.png");
  const [pendingPictureId, setPendingPictureId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          name: response.data.fullName || response.data.name || response.data.directorName || "",
          phone: response.data.phoneNumber || response.data.phone || "",
          email: response.data.email || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Set profile image
        if (response.data.pictureUrl) {
          setProfileImage(response.data.pictureUrl);
        } else if (response.data.profilePictureId || response.data.pictureId) {
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
          const picId = response.data.profilePictureId || response.data.pictureId;
          setProfileImage(`${apiBaseUrl}/UploadDetails/GetDocument?documentId=${picId}`);
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
        name: (profile as any).fullName || profile.name || profile.directorName || "",
        phone: (profile as any).phoneNumber || profile.phone || "",
        email: profile.email || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Reset pending picture and restore original image
      setPendingPictureId(null);
      if (profile.pictureUrl) {
        setProfileImage(profile.pictureUrl);
      } else if ((profile as any).profilePictureId || profile.pictureId) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const picId = (profile as any).profilePictureId || profile.pictureId;
        setProfileImage(`${apiBaseUrl}/UploadDetails/GetDocument?documentId=${picId}`);
      } else {
        setProfileImage("/static/UserImg.png");
      }
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

    // Immediately show preview in UI
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    try {
      setUploading(true);

      // Upload the document and get pictureId
      const pictureId = await userApi.uploadDocument(file);

      // Store the pictureId for later use in save
      setPendingPictureId(pictureId);
      toast.success("Image uploaded. Click 'Save Changes' to update your profile.");

    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast.error(error?.response?.data?.message || "Failed to upload profile picture");
      // Revert to original image on error
      if (profile?.pictureUrl) {
        setProfileImage(profile.pictureUrl);
      } else if (profile?.pictureId) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        setProfileImage(`${apiBaseUrl}/UploadDetails/GetDocument?documentId=${profile.pictureId}`);
      } else {
        setProfileImage("/static/UserImg.png");
      }
    } finally {
      setUploading(false);
      // Clean up the object URL
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSaveChanges = async () => {
    // Validation
    const hasPasswordFields = formData.oldPassword || formData.newPassword || formData.confirmPassword;

    // Validate name
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    // Validate phone number (basic validation)
    if (formData.phone.trim()) {
      // Accept international phone formats: +1 234 567 8901, (123) 456-7890, +91-9876543210, etc.
      const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }

    // Handle password validation
    if (hasPasswordFields) {
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
      if (formData.oldPassword === formData.newPassword) {
        toast.error("New password must be different from old password");
        return;
      }
    }

    try {
      setLoading(true);

      // Get current pictureId - use pending if new image uploaded, otherwise use existing from profile
      const currentPictureId = pendingPictureId ?? (profile as any)?.profilePictureId ?? null;

      // Build request payload - send all fields, null for empty values
      const payload = {
        name: formData.name.trim() || null,
        phoneNumber: formData.phone.trim() || null,
        pictureId: currentPictureId,
        oldPassword: hasPasswordFields ? formData.oldPassword : null,
        newPassword: hasPasswordFields ? formData.newPassword : null,
      };

      const response = await userApi.updateProfileWithPassword(payload);

      if (response.status) {
        toast.success(response.message || "Profile updated successfully");

        // Update localStorage with name
        localStorage.setItem("name", formData.name.trim());

        // Clear pending picture ID after successful save
        setPendingPictureId(null);

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
        toast.error(response.message || "Failed to update profile");
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
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={16} className="text-white" />
              )}
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

          {/* Old Password */}
          <div className="relative w-80 mb-4">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              placeholder="Enter Old Password"
              className="w-full h-10 bg-white rounded-md text-black px-3 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-17">
            {/* New Password */}
            <div className="relative w-80">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter New Password"
                className="w-full h-10 bg-white rounded-md text-black px-3 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-Enter Password"
                className="w-full h-10 bg-white rounded-md text-black px-3 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
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
            disabled={loading || uploading}
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
