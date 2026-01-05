import { Lock } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="bg-[#C6A95F]/10 p-6 rounded-full">
            <Lock className="w-16 h-16 text-[#C6A95F]" />
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-[#C6A95F] mb-3">Access Denied</h2>
        <p className="text-white/70 text-lg">
          You don't have permission to view this page.
        </p>
        <p className="text-white/50 text-sm mt-2">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
