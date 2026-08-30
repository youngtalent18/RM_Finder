import { useState } from "react";
import api from "../lib/axios";
import { Loader2 } from "lucide-react";

const ForgotPassword = ({ setMode }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return setErr("Email is required");
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      setSuccess("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      setErr(
        err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-gray-900 rounded-xl p-5 sm:p-3">

    {
      success && (
          <div className="bg-green-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
              {success}
          </div>
      )
    }

    {
      err && (
          <div className="bg-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
              {err}
          </div>
      )
    }


      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* INPUT */}
        <div className="space-y-1">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => {
              setErr("");
              setEmail(e.target.value);
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-xs sm:text-xm text-gray-500">
        Remember your password?{" "}
        <span
          onClick={() => setMode("login")}
          className="text-indigo-600 underline cursor-pointer"
        >
          Back to login
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;