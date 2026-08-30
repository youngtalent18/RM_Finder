import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const hasVerified = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, [location.search]);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);

        toast.success("Email verified successfully!", {
          id: "verify-success",
        });

        setStatus("success");

        setTimeout(() => {
          navigate("/", {
            state: {
              openLogin: true,
              verified: true,
            },
          });
        }, 1500);
      } catch (err) {
        setStatus("error");

        toast.error(
          err.response?.data?.message || "Verification failed",
          { id: "verify-error" }
        );
      }
    };

    verify();
  }, [token, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Enter your email first", { id: "resend-no-email" });
      return;
    }

    try {
      setResendLoading(true);

      const res = await api.post("/auth/resend-verification", {
        email,
      });

      toast.success(
        res.data.message || "Verification email sent",
        { id: "resend-success" }
      );

      setCooldown(res.data.retryAfter || 60);
    } catch (err) {
      if (err.response?.status === 429) {
        setCooldown(err.response.data.retryAfter);
      }

      toast.error(
        err.response?.data?.message || "Failed to resend email",
        { id: "resend-error" }
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      <div className="w-full max-w-md text-center bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">

        {/* ICON */}
        <div className="flex justify-center">
          {status === "loading" && (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Loader2 className="animate-spin text-indigo-400" size={26} />
            </div>
          )}

          {status === "success" && (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <CheckCircle2 className="text-indigo-400" size={28} />
            </div>
          )}

          {status === "error" && (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <XCircle className="text-red-400" size={28} />
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="space-y-2">
          {status === "loading" && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Verifying your email
              </h2>
              <p className="text-sm text-slate-400">
                Please wait while we confirm your account
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold text-indigo-400">
                Email verified
              </h2>
              <p className="text-sm text-slate-400">
                Redirecting you to your dashboard...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold text-red-400">
                Verification failed
              </h2>
              <p className="text-sm text-slate-400">
                This link may be expired or invalid
              </p>
            </>
          )}
        </div>

        {/* LOADING BAR */}
        {status === "loading" && (
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-indigo-500 animate-pulse" />
          </div>
        )}

        {/* ERROR ACTIONS */}
        {status === "error" && (
          <div className="space-y-4 pt-2">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-slate-800 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleResend}
              disabled={resendLoading || cooldown > 0}
              className={`w-full py-2.5 rounded-md text-sm font-medium transition
                ${
                  cooldown > 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                } text-white`}
            >
              {resendLoading
                ? "Sending..."
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend verification email"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition"
            >
              Go back home
            </button>

          </div>
        )}
      </div>
    </div>
  );
}