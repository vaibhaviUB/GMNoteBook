import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpeg";

export function Header() {
  return (
    <header className="bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="GMNoteBook" className="h-10 w-10 rounded-full bg-white object-contain p-1" />
          <span className="font-display text-2xl font-bold text-gold">GMNoteBook</span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          <a href="#features" className="text-sm text-brand-foreground/80 transition hover:text-gold">Features</a>
          <a href="#how" className="text-sm text-brand-foreground/80 transition hover:text-gold">How It Works</a>
          <a href="#testimonials" className="text-sm text-brand-foreground/80 transition hover:text-gold">Testimonials</a>
          <a href="#contact" className="text-sm text-brand-foreground/80 transition hover:text-gold">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-md border border-gold px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-gold-foreground"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-gold px-5 py-2 text-sm font-semibold text-gold-foreground transition hover:brightness-95"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
