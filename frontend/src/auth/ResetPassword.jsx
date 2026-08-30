import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", {
        id: "reset-invalid",
      });
      return;
    }

    try {
      setLoading(true);

      await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success("Password reset successful", {
        id: "reset-success",
      });

      navigate("/?login=open", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong";

      toast.error(message, { id: "reset-error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-900">

      <div className="w-full max-w-md bg-slate-100 text-gray-900 rounded-xl shadow-lg p-5 sm:p-6 space-y-5">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Lock className="text-indigo-500" size={22} />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">
            Reset Password
          </h2>

          <p className="text-xs sm:text-sm text-gray-500">
            Enter your new password below
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleReset} className="space-y-4">

          {/* PASSWORD INPUT */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              New password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="w-full px-3 py-2.5 pr-10 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-indigo-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className={`w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-xs sm:text-sm text-gray-500">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/?login=open")}
            className="text-indigo-600 underline cursor-pointer"
          >
            Back to login
          </span>
        </p>
      </div>
    </div>
  );
}
