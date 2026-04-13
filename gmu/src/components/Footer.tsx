import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="nav-bg py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="GMNoteBook Logo" className="w-8 h-8 rounded-full object-cover bg-white shadow-sm" />
            <span className="font-display font-bold text-gold">GMNoteBook</span>
          </div>


        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center">
          <p className="text-xs text-primary-foreground/40">
            © 2026 GMNoteBook. Smart Learning, Testing & Interview Companion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
