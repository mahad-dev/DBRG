"use client";

import { Checkbox } from "@/components/ui/checkbox";

const permissions = [
  "Application Management",
  "Notification Management",
  "CMS",
  "Payments",
  "User Management",
];

const AddMember = () => {
  return (
    <div className="font-inter mt-5">
      {/* Card */}
      <div className="bg-[#3e3e3e] rounded-lg p-6 w-[680px]">

        {/* Title */}
      <h1 className="text-[#C6A95F] text-3xl font-semibold mb-6">
        Add/Manage Member
      </h1>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Name</label>
          <input
            type="text"
            placeholder="Karthik"
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

        {/* Role & Password */}
        <div className="mb-4 flex gap-7">
          <div>
            <label className="block text-sm mb-2">Role</label>
            <select className="w-80 h-10 bg-white rounded-md text-black px-5 pr-10 ">
              <option >Support Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Re-Enter Password"
              className="w-full h-10 bg-white rounded-md text-black px-3"
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-3 mt-5 font-semibold">
          {permissions.map((permission) => (
            <div
              key={permission}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-10"
            >
              {/* Checkbox + Label */}
              <div className="flex items-center gap-3">
                <Checkbox className="data-[state=checked]:bg-[#C9A85D] data-[state=checked]:border-[#C9A85D] data-[state=checked]:[&_svg]:text-white" />
                <span className="text-white">{permission}</span>
              </div>

              {/* Read Only */}
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="radio"
                  name={permission}
                  defaultChecked
                />
                Read Only
              </label>

              {/* Edit */}
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="radio"
                  name={permission}
                />
                Edit
              </label>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-end gap-6 mt-6">
          <button className="px-6 py-1 bg-[#C6A95F] text-white rounded-md font-medium">
            Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
