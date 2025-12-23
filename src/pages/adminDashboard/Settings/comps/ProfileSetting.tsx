const ProfileSetting = () => {
  return (
    <div className="font-inter">
      {/* Title */}
      <h1 className="text-[#C6A95F] text-3xl font-semibold mb-6">
        Profile Settings
      </h1>

      {/* Card */}
      <div className="bg-[#3e3e3e]  rounded-lg p-6 w-[680px]">
        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Name</label>
          <input
            type="text"
            placeholder="Naved"
            className="w-80 h-10 bg-white rounded-md text-black px-3"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-2 gap-17 mb-5">
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="text"
              placeholder="+91-987-654-3210"
              className="w-80 h-10 bg-white rounded-md text-black px-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              className="w-full h-10 bg-white rounded-md text-black px-3"
            />
          </div>
        </div>

        {/* Reset Password */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Reset Password</label>
          <input
            type="password"
            placeholder="Enter Old Password"
            className="w-80 h-10 bg-white rounded-md text-black px-3 mb-4"
          />

          <div className="grid grid-cols-2 gap-17">
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-80 h-10 bg-white rounded-md text-black px-3"
            />
            <input
              type="password"
              placeholder="Re-Enter Password"
              className="w-full h-10 bg-white rounded-md text-black px-3"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-6 mt-6">
          <button className="px-6 py-1 border border-white rounded-md text-white">
            Cancel
          </button>
          <button className="px-6 py-1 bg-[#C6A95F] text-white rounded-md font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
