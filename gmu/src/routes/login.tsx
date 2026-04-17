import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, AuthField, inputClass } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthShell>
      <h1 className="mt-6 text-center font-display text-3xl font-bold text-foreground">Welcome Back</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Log in to continue learning</p>
      <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}>
        <AuthField label="Email Address">
          <input type="email" placeholder="you@example.com" className={inputClass} />
        </AuthField>
        <AuthField label="Password">
          <div className="relative">
            <input type={show ? "text" : "password"} placeholder="••••••••" className={inputClass} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </AuthField>
        <button className="mt-7 w-full rounded-lg bg-gradient-to-r from-gold to-gold/80 py-3 font-bold text-gold-foreground transition hover:brightness-95">
          Log In
        </button>
      </form>
      <div className="mt-7 border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/signup" className="font-bold text-gold">Sign Up</Link>
      </div>
    </AuthShell>
  );
}
