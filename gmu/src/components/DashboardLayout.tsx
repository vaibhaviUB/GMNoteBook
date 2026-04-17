import { Link, useLocation } from "@tanstack/react-router";
import { User, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";

const topNav = [
  { label: "Dashboard", to: "/dashboard" as const },
  { label: "Notes", to: "/dashboard/notes" as const },
  { label: "AI Assistant", to: "/dashboard/ai" as const },
  { label: "Planner", to: "/dashboard/planner" as const },
  { label: "Career Prep", to: "/dashboard/career" as const },
  { label: "Profile", to: "/dashboard/profile" as const },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (to: string) => to === "/dashboard" ? pathname === to : pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-soft">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="" className="h-9 w-9 rounded-full border-2 border-gold object-contain p-0.5" />
              <span className="font-display text-xl font-bold text-gold">GMNoteBook</span>
            </Link>
            <nav className="hidden items-center gap-7 md:flex">
              {topNav.map((n) => {
                const active = isActive(n.to);
                return (
                  <Link key={n.to} to={n.to} className={`relative pb-1 text-sm transition ${active ? "font-semibold text-gold" : "text-muted-foreground hover:text-foreground"}`}>
                    {n.label}
                    {active && <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gold" />}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/profile" className="relative hidden h-10 w-10 rounded-full bg-gradient-to-br from-gold/30 to-brand/20 md:block" aria-label="Profile">
              <User className="absolute inset-0 m-auto h-5 w-5 text-gold" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
            </Link>
            <Link to="/" className="hidden items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-soft md:inline-flex" title="Sign out">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-border p-2 md:hidden" aria-label="Menu">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-card px-4 py-2 md:hidden">
            {topNav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-sm ${isActive(n.to) ? "bg-soft font-semibold text-gold" : "text-foreground"}`}>
                {n.label}
              </Link>
            ))}
            <Link to="/" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-foreground">
              <LogOut className="mr-2 inline h-4 w-4 text-gold" /> Sign Out
            </Link>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl p-6 md:p-8">{children}</main>
    </div>
  );
}

export function PageTabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; icon?: React.ComponentType<{ className?: string }> }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${active ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.icon && <t.icon className="h-4 w-4" />} {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function PageHeader({ tag, title, accent, subtitle, action }: { tag?: string; title: string; accent?: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {tag && <span className="inline-block rounded-full border border-gold/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">{tag}</span>}
        <h1 className="mt-3 font-display text-4xl font-bold text-foreground">
          {title} {accent && <span className="text-gold">{accent}</span>}
        </h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
