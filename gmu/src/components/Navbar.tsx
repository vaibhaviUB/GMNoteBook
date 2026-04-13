import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full z-30 nav-bg sticky top-0 border-b border-[#3b1c1c]">
      <div className="max-w-7xl mx-auto px-6 py-4 lg:py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="GMNoteBook Logo" className="w-11 h-11 rounded-full object-cover bg-white shadow-sm" />
          <span className="text-2xl font-display font-bold text-gold">GMNoteBook</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition-colors">How It Works</a>
          <a href="#testimonials" className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition-colors">Testimonials</a>
          <a href="#contact" className="text-sm font-medium text-primary-foreground/80 hover:text-gold transition-colors">Contact</a>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-gold border border-secondary/40 px-5 py-2 rounded-md hover:bg-secondary/10 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold gradient-gold text-secondary-foreground px-5 py-2 rounded-md shadow-card hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gold"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-primary-foreground/10">
          <a href="#features" className="text-sm text-primary-foreground/80 hover:text-gold py-2">Features</a>
          <a href="#how-it-works" className="text-sm text-primary-foreground/80 hover:text-gold py-2">How It Works</a>
          <a href="#testimonials" className="text-sm text-primary-foreground/80 hover:text-gold py-2">Testimonials</a>
          <a href="#contact" className="text-sm text-primary-foreground/80 hover:text-gold py-2">Contact</a>
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1 text-center text-sm font-semibold text-gold border border-secondary/40 px-4 py-2 rounded-md">Log In</Link>
            <Link to="/signup" className="flex-1 text-center text-sm font-semibold gradient-gold text-secondary-foreground px-4 py-2 rounded-md">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
