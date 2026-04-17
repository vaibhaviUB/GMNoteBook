import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, LogOut, IdCard, GraduationCap, Building2, Users, Mail, Phone } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import avatarFemale from "@/assets/avatar-female.jpeg";
import avatarMale from "@/assets/avatar-male.jpeg";

export const Route = createFileRoute("/dashboard/profile")({
  component: Profile,
});

function Profile() {
  const [editing, setEditing] = useState(false);
  const [gender, setGender] = useState<"female" | "male">("female");
  const [user, setUser] = useState({
    name: "USER3",
    discipline: "is",
    usn: "123456987",
    institution: "gmu",
    section: "btech",
    email: "user3@gmail.com",
    phone: "123456789",
  });

  const avatar = gender === "female" ? avatarFemale : avatarMale;

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-brand to-gold/70 p-12 text-center text-brand-foreground">
        <div className="relative mx-auto h-32 w-32">
          <img
            src={avatar}
            alt={`${gender} avatar`}
            className="h-full w-full rounded-full border-4 border-white/40 object-cover"
          />
          <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold">{user.name}</h1>
        <p className="mt-1 text-brand-foreground/80">{user.discipline}</p>

        {editing && (
          <div className="mt-4 inline-flex gap-2 rounded-full bg-white/10 p-1 backdrop-blur">
            <button
              onClick={() => setGender("female")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${gender === "female" ? "bg-gold text-gold-foreground" : "text-white/80"}`}
            >
              Female
            </button>
            <button
              onClick={() => setGender("male")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${gender === "male" ? "bg-gold text-gold-foreground" : "text-white/80"}`}
            >
              Male
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {[
          { icon: IdCard, label: "USN / Roll Number", key: "usn" },
          { icon: GraduationCap, label: "Discipline", key: "discipline" },
          { icon: Building2, label: "Institution", key: "institution" },
          { icon: Users, label: "Section / Semester", key: "section" },
          { icon: Mail, label: "Email Id", key: "email" },
          { icon: Phone, label: "Phone Number", key: "phone" },
        ].map((f) => (
          <div key={f.key} className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
              <f.icon className="h-5 w-5 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold">{f.label}</p>
              {editing ? (
                <input
                  value={user[f.key as keyof typeof user]}
                  onChange={(e) => setUser({ ...user, [f.key]: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-soft px-2 py-1 text-sm outline-none focus:border-gold"
                />
              ) : (
                <p className="mt-1 font-semibold">{user[f.key as keyof typeof user]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button onClick={() => setEditing(!editing)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-brand-foreground">
          <Camera className="h-4 w-4" /> {editing ? "Save Profile" : "Edit Profile"}
        </button>
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold">
          <LogOut className="h-4 w-4" /> Sign Out
        </Link>
      </div>
    </DashboardLayout>
  );
}
