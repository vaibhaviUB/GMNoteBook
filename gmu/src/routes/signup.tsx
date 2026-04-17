import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, AuthField, inputClass } from "@/components/AuthShell";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthShell>
      <h1 className="mt-6 text-center font-display text-3xl font-bold text-foreground">Create Your Account</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Start your smart learning journey today.</p>
      <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}>
        <div className="grid gap-4 md:grid-cols-2">
          <AuthField label="Full Name"><input placeholder="John Doe" className={inputClass} /></AuthField>
          <AuthField label="Phone Number"><input placeholder="+1 (555) 000-0000" className={inputClass} /></AuthField>
          <AuthField label="College Name"><input placeholder="University Name" className={inputClass} /></AuthField>
          <AuthField label="Department"><input placeholder="e.g., CS, IS" className={inputClass} /></AuthField>
          <AuthField label="Select Program">
            <select className={inputClass}><option>Select Program</option><option>B.Tech</option><option>M.Tech</option><option>MBA</option></select>
          </AuthField>
          <AuthField label="Select Semester">
            <select className={inputClass}><option>Select Semester</option>{Array.from({length:8}).map((_,i)=><option key={i}>Sem {i+1}</option>)}</select>
          </AuthField>
        </div>
        <AuthField label="USN / Roll Number"><input placeholder="USN / Roll Number" className={inputClass} /></AuthField>
        <AuthField label="Email Address"><input type="email" placeholder="trupti12@gmail.com" className={inputClass} /></AuthField>
        <AuthField label="Password">
          <div className="relative">
            <input type={show ? "text" : "password"} placeholder="••••••" className={inputClass} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </AuthField>
        <button className="mt-7 w-full rounded-lg bg-gradient-to-r from-gold to-gold/80 py-3 font-bold text-gold-foreground transition hover:brightness-95">
          Create Free Account
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already tracking your goals? <Link to="/login" className="font-bold text-gold">Log In</Link>
      </p>
    </AuthShell>
  );
}
