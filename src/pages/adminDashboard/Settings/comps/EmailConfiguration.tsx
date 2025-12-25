
const EmailConfiguration = () => {
  return (
    <div className="font-inter mt-5">
    
      {/* Card */}
      <div className="bg-[#3e3e3e]  rounded-lg p-6 w-[680px]">

        {/* Title */}
      <h1 className="text-[#C6A95F] text-3xl font-semibold mb-6">
        Email Configuration
      </h1>

        {/* Action*/}
        <div className="mb-5">
          <label className="block text-sm mb-2">Action</label>
          <select className="w-80 h-10 bg-white rounded-md text-black px-3 ">
              <option>New Member application</option>
          </select>
        </div>

        {/* First & Final Approval */}
        <div className="grid grid-cols-2 gap-17 mb-5 border-b-1 pb-6 ">
          <div>
            <label className="block text-sm mb-2">First Approval</label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              className="w-80 h-10 bg-white rounded-md text-black px-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Final Approval</label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              className="w-full h-10 bg-white rounded-md text-black px-3"
            />
          </div>
        </div>

        {/* Action & Notify */}
        
        <div className="mt-2">
          <div>
            <label className="block text-sm mb-2 ">Action</label>
          <select className="w-80 h-10 bg-white rounded-md text-black px-3 ">
              <option>New Member application</option>
          </select>
          </div>

          <div className="mt-2 border-b-1 pb-6">
            <label className="block text-sm mb-2">Notify</label>
            <input
              type="text"
              placeholder="xyz@gmail.com,xyz@gmail.com,xyz@gmail.com"
              className="w-95 h-10 bg-white rounded-md text-black px-3"
            />
          </div>
        </div>

        {/* Action */}
        <div className="mb-5 mt-3">
          <label className="block text-sm mb-2">Action</label>
          <select className="w-80 h-10 bg-white rounded-md text-black px-3 ">
              <option>New Resource</option>
          </select>
        </div>

        {/* Approval & Notify */}

        <div className="grid grid-cols-2 gap-17 mb-5 ">
          <div>
            <label className="block text-sm mb-2">Approval</label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              className="w-80 h-10 bg-white rounded-md text-black px-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Notify</label>
            <input
              type="email"
              placeholder="xyz@gmail.com"
              className="w-full h-10 bg-white rounded-md text-black px-3"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-6 mt-6">
          <button className="px-6 py-1 bg-[#C6A95F] text-white rounded-md font-medium">
            Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfiguration;
