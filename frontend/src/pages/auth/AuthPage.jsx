import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckSquare, Lock, Mail, Loader2, ArrowRight, Eye, EyeOff, User2, Phone, Loader } from "lucide-react";
import userStore from "../../store/user.js";
import api from "../../lib/axios";
import ForgotPassword from "../../auth/ForgotPassword";
import RMF from "../../assets/RMF.png"

const AuthPage = () => {
    const [mode, setMode] = useState("login");
    const { signIn, register } = userStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [phone, setPhone] = useState("");
    const [registerErr, setRegisterErr] = useState("");
    const [loginErr, setLoginErr] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [resendErr, setResendErr] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginErr("");

        if (!email || !password) {
        setLoginErr("All fields are required");
        return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setLoginErr("Enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            await signIn({email, password});
            setShowResend(false);
            navigate("/");
        }catch(error){
            const message =
            error?.response?.data?.message ||
            error.message ||
            "login failed";

            const status = error?.response?.status;
            if (status === 403) {
                setShowResend(true);
            }

            setLoginErr(message);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterErr("");

        if (!firstName || !phone || !lastName || !email || !password) {
            setRegisterErr("All fields are required");
            return;
        }

        if(phone && !phone.startsWith("0") && !phone.startsWith("+233")){
            setRegisterErr("Phone number must start with 0 or +233");
            return;
        }else if( phone.startsWith("0") && phone.length < 10 || phone.startsWith("+233") && phone.length < 13){
            setRegisterErr("Phone number not up to");
            return;
        }

        if (password.length < 6) {
            setRegisterErr("Password must be at least 6 characters");
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setRegisterErr("Enter a valid email address");
            return;
        }

        if (password !== confirmPassword) {
            setRegisterErr("Passwords do not match");
            return;
        }

        try{
            setLoading(true);
            await register({ firstName, lastName, phone, email, password, confirmPassword});
            setMode("login");

        }catch(error){
             const message =
                error?.response?.data?.message ||
                error.message ||
                "Registration failed";

                setRegisterErr(message);
        }finally{
            setLoading(false);
        }
    }

    const handleResend = async (e) => {
        e.preventDefault();

        try {
        setResendLoading(true);

        const res = await api.post("/auth/resend-verification", {email});

        setSuccess(res.data.message || "Verification email sent");

        setCooldown(res.data.retryAfter || 60);
        } catch (err) {
        if (err.response?.status === 429) {
            const seconds = err.response.data.retryAfter;
            setCooldown(seconds);
        }

        setResendErr(err.response?.data?.message || "Failed to resend email");

        } finally {
            setResendLoading(false);
        }
    }

    const inputClass = "h-11 pl-9 pr-10";
    const primaryButtonClass =
    "inline-flex h-11 w-full items-center justify-center rounded-xl border-0 gradient-primary font-semibold text-white transition hover:opacity-90";

  return (
    <div className="min-h-screen bg-background flex">
        <aside className="hidden lg:flex flex-col justify-between w-120 shrink-0 gradient-hero p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ROOMMATE-FINDER</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Find your ideal roommate, live
            
            <span className="text-white/70"> better together.</span>
            </h2>

            <ul className="space-y-3 text-sm text-white/80">
                {[
                    "Create your profile and set your roommate preferences",
                    "Discover compatible roommates based on your preferences",
                    "Connect and chat with potential roommates",
                    "Browse verified profiles for safer roommate matching",
                ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                    </span>
                    {feature}
                    </li>
                ))}
            </ul>
        </div>

        <p className="text-white/40 text-xs">
          Copyright {new Date().getFullYear()} RM-FINDER. Powered by Codecraze.
        </p>
      </aside>
        <main className="relative flex-1 flex items-center justify-center p-4 ">
            <img src={RMF} alt="rmf image" className="absolute inset-0 w-full h-full object-left"/>
            <div className="absolute inset-0 bg-black/50"/>
            <div className="relative z-10 w-full max-w-100">
                <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
                    <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
                        <CheckSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl text-slate-100 font-medium">Welcome to Roommate Finder</span>
                </div>

                
                    {mode === "login" && (
                        <div className="text-center mb-6">
                            <p className="text-xs text-gray-100">
                                Sign in to your <span className="font-medium italic">RM-F</span> account
                            </p>
                        </div>
                    )} 
                {   
                    mode === "register" && (
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-100">
                            Join <span className="font-medium italic">RM-F</span> to get started
                        </p>
                    </div>
                    )
                }
                {
                    mode === "forgot" && (<div className="text-center mb-6">
                        <p className="text-xs sm:text-sm text-gray-100">
                            Enter your email and we’ll send you a reset link
                        </p>
                    </div>
                    )
                }

                <div className="flex rounded-xl bg-muted p-1 mb-4" >
                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            mode === "login"
                            ? "bg-white shadow text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("register")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            mode === "register"
                            ? "bg-white shadow text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        >
                        Create Account
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            mode === "forgot"
                            ? "bg-white shadow text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        >
                        Forgot Password
                    </button>
                </div>

                {
                    mode === "login" ? loginErr && (
                        <div className="bg-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
                            {loginErr}
                        </div>
                    ): registerErr && (
                        <div className="bg-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
                            {registerErr}
                        </div>
                    )
                }
                {
                    success && (
                        <div className="bg-green-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
                            {success}
                        </div>
                    )
                }
                {
                    resendErr && (
                        <div className="bg-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
                            {resendErr}
                        </div>
                    )
                }

                {
                    mode === "login" ? (
                        <form onSubmit={handleLogin} className="space-y-3">

                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        placeholder="you@gmail.com"
                                        onChange={(e)=>{ 
                                            setLoginErr(""); 
                                            setEmail(e.target.value);
                                        }}
                                        value={email}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                        
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        onChange={(e)=>{
                                            setLoginErr(""); 
                                            setPassword(e.target.value);
                                        }}
                                        value={password}
                                        className={inputClass}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        onClick={()=>setShowPassword((p)=>!p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        { showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={primaryButtonClass}>
                                {
                                    loading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                    ) : (
                                        <ArrowRight className="w-4 h-4 mr-2"/>
                                    )
                                }
                                Sign In
                            </button>
                            <p  onClick={()=>setMode("forgot")}
                                className="text-center text-gray-100 text-xs sm:text-sm cursor-pointer hover:underline"
                                >
                                Forgot password?
                            </p>
                           {showResend && (
                            <div className="text-center space-y-2 pt-2">

                                <p className="text-xs sm:text-sm text-red-500">
                                Please verify your email to continue
                                </p>

                                <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendLoading || cooldown > 0}
                                className={`text-xs sm:text-sm font-medium
                                    ${
                                    cooldown > 0
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-indigo-500 hover:underline"
                                    }`}
                                >
                                {resendLoading ? (
                                    <span className="flex items-center justify-center gap-1">
                                    <Loader size={14} className="animate-spin" />
                                    Sending...
                                    </span>
                                ) : cooldown > 0 ? (
                                    `Resend in ${cooldown}s`
                                ) : (
                                    "Resend verification email"
                                )}
                                </button>
                            </div>
                            )}
                        </form>
                        ) : 
                        mode === "register" ? (
                        <form onSubmit={handleRegister} className="space-y-3">
                            <div className="space-y-2">
                                <div className="relative">
                                    <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="name"
                                        placeholder="firstName"
                                        onChange={(e)=>{
                                            setRegisterErr(""); 
                                            setfirstName(e.target.value);
                                        }}
                                        value={firstName}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="name"
                                        placeholder="lastName"
                                        onChange={(e)=>{
                                            setRegisterErr(""); 
                                            setlastName(e.target.value);
                                        }}
                                        value={lastName}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="phone"
                                        placeholder="phone number"
                                        onChange={(e)=>{
                                            setRegisterErr(""); 
                                            setPhone(e.target.value);
                                        }}
                                        value={phone}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        placeholder="you@gmail.com"
                                        onChange={(e)=>{
                                            setRegisterErr(""); 
                                            setEmail(e.target.value);
                                        }}
                                        value={email}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={(e)=>{
                                            setRegisterErr(""); 
                                            setPassword( e.target.value);
                                        }}
                                        value={password}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                        
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="confirm password"
                                        onChange={(e)=>{
                                            setRegisterErr(""); 
                                            setConfirmPassword(e.target.value)
                                        }}
                                        value={confirmPassword}
                                        className={inputClass}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        onClick={()=>setShowPassword((p)=>!p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        { showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                            </div>

                            <button type="submit" disabled={loading} className={primaryButtonClass}>
                                {
                                    loading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                    ) : (
                                        <ArrowRight className="w-4 h-4 mr-2"/>
                                    )
                                }
                                Create Account
                            </button>
                        </form>
                    ) : mode === "forgot" ? (
                            <ForgotPassword setMode={setMode}/>
                    ) : null
                }

            </div>
        </main>
    </div>
  )
}

export default AuthPage