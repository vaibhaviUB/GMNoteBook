import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-soft">
      <div className="px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
      <div className="mx-auto max-w-md px-6 pb-16">
        <div className="rounded-2xl border border-brand/30 bg-card p-10 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="" className="h-8 w-8 object-contain" />
            <span className="font-display text-2xl font-bold text-gold">GMNoteBook</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-soft px-4 py-3 text-sm outline-none focus:border-gold";
