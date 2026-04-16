import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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
          <div className="pt-2">
            <button
              type="submit"
              className="w-full gradient-gold hover:opacity-90 text-secondary-foreground font-bold py-3.5 rounded-xl shadow-card transition-all text-[15px]"
            >
              Log In
            </button>
          </div>
        </form>

        <p className="text-center text-[13px] text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gold font-semibold hover:underline transition-all">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
