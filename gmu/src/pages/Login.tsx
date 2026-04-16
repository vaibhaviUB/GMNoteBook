import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      const errorMsg = err.message || "An error occurred during login.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError("");
    setEmail("");
    setPassword("");
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-[#4C2424] text-gray-800 text-sm focus:outline-none focus:border-[#4C2424] focus:ring-1 focus:ring-[#4C2424] transition-all placeholder:text-gray-400";
  const labelClasses = "text-[11px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#6b1016] transition-colors font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-sm border-2 border-[#4C2424]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
              <img src={logo} alt="GMNoteBook Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-display font-bold text-gold">GMNoteBook</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Log in to continue learning</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={labelClasses}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start justify-between">
                <p className="text-red-700 text-sm flex-1">{error}</p>
                <button
                  type="button"
                  onClick={clearError}
                  className="text-red-700 hover:text-red-900 font-bold text-lg ml-2"
                >
                  ×
                </button>
              </div>
              <p className="text-red-600 text-xs mt-2">
                If you haven't signed up yet, click "Sign Up" below to create a new account.
              </p>
            </div>
          )}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-secondary-foreground font-bold py-3.5 rounded-xl shadow-card transition-all text-[15px]"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-700 font-semibold mb-3">
            Don't have an account? <Link to="/signup" className="text-gold font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
