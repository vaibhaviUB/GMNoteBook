import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="GMNoteBook Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-display font-bold text-gold">GMNoteBook</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Log in to continue learning</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-secondary/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-secondary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full gradient-gold text-secondary-foreground font-semibold py-3 rounded-lg shadow-card hover:opacity-90 transition-opacity text-sm"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gold font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
