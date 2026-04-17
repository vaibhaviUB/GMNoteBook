import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Briefcase, Sparkles, Play, CheckCircle2, Clock, History, MessageSquare, ArrowRight, RotateCcw, FileText, Download, Plus, Trash2, AlertCircle, Target, TrendingUp, BookOpen, X } from "lucide-react";
import { DashboardLayout, PageHeader, PageTabs } from "@/components/DashboardLayout";

export const Route = createFileRoute("/dashboard/career")({
  component: Career,
});

type Tab = "interview" | "resume" | "skills";

function Career() {
  const [tab, setTab] = useState<Tab>("interview");
  return (
    <DashboardLayout>
      <PageHeader tag="Career Prep" title="Land Your" accent="Dream Role" subtitle="Mock interviews, resume builder, and skill gap analysis — all in one place." />
      <PageTabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "interview", label: "Mock Interview", icon: Mic },
          { id: "resume", label: "Resume", icon: FileText },
          { id: "skills", label: "Skill Gap", icon: Target },
        ]}
      />
      {tab === "interview" && <MockInterview />}
      {tab === "resume" && <ResumeBuilder />}
      {tab === "skills" && <SkillGap />}
    </DashboardLayout>
  );
}

/* ─────────── Mock Interview ─────────── */

type Track = { title: string; desc: string; level: string; questions: { q: string; ideal: string; keywords: string[] }[] };

const TRACKS: Track[] = [
  { title: "Software Engineering", desc: "DSA, system design, behavioral", level: "All levels", questions: [
    { q: "Tell me about yourself and your engineering background.", ideal: "Mention education, projects, tech stack, and what excites you.", keywords: ["project", "experience", "team", "built", "learned"] },
    { q: "Explain the difference between an array and a linked list.", ideal: "Arrays: O(1) access. Linked lists: O(n) access, dynamic.", keywords: ["memory", "pointer", "access", "insert", "contiguous"] },
    { q: "Describe a time you debugged a difficult production issue.", ideal: "Use STAR. Show ownership.", keywords: ["root cause", "logs", "fixed", "team", "monitoring"] },
    { q: "How would you design a URL shortener?", ideal: "Hashing, base62, DB schema, caching, scaling.", keywords: ["hash", "database", "cache", "scale", "redirect"] },
  ]},
  { title: "Data Science", desc: "Statistics, ML, case studies", level: "Intermediate", questions: [
    { q: "Explain bias-variance tradeoff.", ideal: "Bias: wrong assumptions. Variance: sensitivity to data.", keywords: ["bias", "variance", "overfit", "underfit", "model"] },
    { q: "How would you handle missing data?", ideal: "Analyze pattern, then impute or drop.", keywords: ["impute", "mean", "drop", "missing", "pattern"] },
    { q: "Difference between supervised and unsupervised learning?", ideal: "Supervised: labeled. Unsupervised: finds structure.", keywords: ["label", "cluster", "predict", "target", "structure"] },
  ]},
  { title: "Product Manager", desc: "Strategy, metrics, prioritization", level: "Senior", questions: [
    { q: "How would you improve our product?", ideal: "Clarify user, define metric, prioritize.", keywords: ["user", "metric", "prioritize", "feature", "data"] },
    { q: "Tell me about a product you launched.", ideal: "Problem, users, solution, metrics.", keywords: ["launch", "users", "metric", "feedback", "iterate"] },
    { q: "How do you say no to a feature request?", ideal: "Listen, share strategy, propose alternative.", keywords: ["strategy", "data", "user", "tradeoff", "roadmap"] },
  ]},
];

function evaluate(answer: string, keywords: string[]) {
  const a = answer.toLowerCase();
  const words = a.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const matched = keywords.filter((k) => a.includes(k.toLowerCase())).length;
  const coverage = keywords.length ? matched / keywords.length : 0;
  let comm = 50;
  if (wordCount >= 40) comm += 25; else if (wordCount >= 20) comm += 15; else if (wordCount >= 10) comm += 5;
  if (/[.!?]/.test(answer)) comm += 10;
  if (wordCount > 200) comm -= 10;
  comm = Math.max(0, Math.min(100, comm));
  const tech = Math.round(coverage * 100);
  const score = Math.round(tech * 0.6 + comm * 0.4);
  const feedback: string[] = [];
  if (wordCount < 15) feedback.push("Too short — aim for 60–120 words with a concrete example.");
  if (wordCount > 200) feedback.push("Too long — tighten and lead with the headline.");
  if (coverage < 0.4) feedback.push(`Mention more concepts: ${keywords.filter((k) => !a.includes(k.toLowerCase())).slice(0, 3).join(", ")}.`);
  if (coverage >= 0.6) feedback.push("Strong keyword coverage.");
  if (!feedback.length) feedback.push("Solid answer overall. Add a measurable result.");
  return { score, tech, comm, feedback };
}

function MockInterview() {
  const [active, setActive] = useState<Track | null>(null);
  const [step, setStep] = useState<"select" | "interview" | "results">("select");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [history, setHistory] = useState([
    { date: "Apr 12", track: "Software Engineering", score: 78, questions: 5 },
    { date: "Apr 8", track: "Data Science", score: 65, questions: 4 },
  ]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (step === "interview") {
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }
  }, [step, qIdx]);

  const start = (t: Track) => { setActive(t); setStep("interview"); setQIdx(0); setAnswers([]); setCurrent(""); setSeconds(0); };
  const next = () => {
    if (!active) return;
    const newAnswers = [...answers, current];
    setAnswers(newAnswers); setCurrent(""); setSeconds(0);
    if (qIdx + 1 >= active.questions.length) {
      const evals = active.questions.map((q, i) => evaluate(newAnswers[i] || "", q.keywords));
      const avg = Math.round(evals.reduce((s, e) => s + e.score, 0) / evals.length);
      setHistory([{ date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), track: active.title, score: avg, questions: active.questions.length }, ...history]);
      setStep("results");
    } else setQIdx(qIdx + 1);
  };
  const reset = () => { setStep("select"); setActive(null); setQIdx(0); setAnswers([]); setCurrent(""); };

  if (step === "results" && active) {
    const evals = active.questions.map((q, i) => evaluate(answers[i] || "", q.keywords));
    const avg = Math.round(evals.reduce((s, e) => s + e.score, 0) / evals.length);
    return (
      <div>
        <div className="rounded-2xl bg-gradient-to-br from-brand to-gold/70 p-6 text-brand-foreground">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Overall Score · {active.title}</p>
          <p className="mt-3 font-display text-6xl font-bold">{avg}</p>
          <p className="mt-1 text-sm opacity-80">{avg >= 80 ? "Excellent" : avg >= 60 ? "Good" : "Keep practicing"}</p>
        </div>
        <div className="mt-6 space-y-4">
          {active.questions.map((q, i) => (
            <div key={i} className="rounded-2xl bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <p className="font-semibold">Q{i + 1}. {q.q}</p>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${evals[i].score >= 70 ? "bg-emerald-100 text-emerald-700" : evals[i].score >= 40 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{evals[i].score}/100</span>
              </div>
              <p className="mt-3 rounded-lg bg-soft p-3 text-sm italic text-muted-foreground">{answers[i] || "(no answer)"}</p>
              <div className="mt-3 rounded-lg border border-gold/30 bg-gold/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold">AI Feedback</p>
                <ul className="mt-2 space-y-1 text-sm">{evals[i].feedback.map((f, j) => <li key={j}>• {f}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
        <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-brand-foreground">
          <RotateCcw className="h-4 w-4" /> Try Another Track
        </button>
      </div>
    );
  }

  if (step === "interview" && active) {
    const q = active.questions[qIdx];
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return (
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-gold" /> {mm}:{ss}</div>
          <div className="flex gap-1">
            {active.questions.map((_, i) => <span key={i} className={`h-1.5 w-10 rounded-full ${i < qIdx ? "bg-gold" : i === qIdx ? "bg-brand" : "bg-soft"}`} />)}
          </div>
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold">Q{qIdx + 1}: {q.q}</h2>
        <textarea value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Type your answer..." className="mt-5 h-48 w-full rounded-lg border border-border bg-soft p-4 text-sm outline-none focus:border-gold" />
        <div className="mt-2 text-xs text-muted-foreground">{current.trim().split(/\s+/).filter(Boolean).length} words · STAR works for behavioral questions</div>
        <div className="mt-5 flex justify-between">
          <button onClick={reset} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={next} disabled={current.trim().length < 5} className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground disabled:opacity-50">
            {qIdx + 1 >= active.questions.length ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {TRACKS.map((t) => (
          <div key={t.title} className="rounded-2xl border-2 border-border bg-card p-6 transition hover:border-gold/40">
            <Briefcase className="h-6 w-6 text-gold" />
            <h3 className="mt-3 text-lg font-bold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold">{t.level}</span>
              <span className="text-xs text-muted-foreground">{t.questions.length} questions</span>
            </div>
            <button onClick={() => start(t)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-brand-foreground">
              <Play className="h-4 w-4" /> Start Interview
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2"><History className="h-5 w-5 text-gold" /><h2 className="text-lg font-bold">Performance History</h2></div>
        <div className="mt-4 space-y-3">
          {history.map((h, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold">{h.track}</p>
                <p className="text-xs text-muted-foreground">{h.date} · {h.questions} questions</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${h.score >= 70 ? "bg-emerald-100 text-emerald-700" : h.score >= 40 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{h.score}/100</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────── Resume Builder ─────────── */

type Experience = { id: string; role: string; company: string; period: string; bullets: string[] };

function ResumeBuilder() {
  const [name, setName] = useState("Your Name");
  const [title, setTitle] = useState("Computer Science Student");
  const [email, setEmail] = useState("you@example.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [summary, setSummary] = useState("Driven CS student passionate about building scalable web apps and exploring AI/ML.");
  const [skills, setSkills] = useState<string[]>(["JavaScript", "React", "Python", "SQL"]);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", role: "Web Dev Intern", company: "Tech Co", period: "Jun – Aug 2025", bullets: ["Built dashboard reducing load time by 40%", "Shipped 3 features used by 500+ users"] },
  ]);

  const feedback = useMemo(() => {
    const items: { type: "good" | "warn"; text: string }[] = [];
    if (summary.split(/\s+/).length < 15) items.push({ type: "warn", text: "Summary too short. Aim 25–40 words." });
    else items.push({ type: "good", text: "Summary length is solid." });
    if (skills.length < 6) items.push({ type: "warn", text: "Add at least 6 skills for ATS matching." });
    else items.push({ type: "good", text: `${skills.length} skills — good keyword coverage.` });
    const allBullets = experiences.flatMap((e) => e.bullets);
    const quantified = allBullets.filter((b) => /\d/.test(b)).length;
    if (quantified < allBullets.length / 2) items.push({ type: "warn", text: "Quantify more achievements (numbers, %)." });
    else items.push({ type: "good", text: "Strong use of metrics." });
    const score = Math.max(20, 100 - items.filter((i) => i.type === "warn").length * 12);
    return { items, score };
  }, [summary, skills, experiences]);

  const addSkill = () => { const v = skillInput.trim(); if (v && !skills.includes(v)) setSkills([...skills, v]); setSkillInput(""); };

  const downloadResume = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${name} — Resume</title>
      <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 30px;color:#222}
      h1{margin:0;font-size:30px}h2{border-bottom:2px solid #4C2424;padding-bottom:4px;color:#4C2424}
      .meta{color:#666;font-size:14px}.skill{display:inline-block;background:#f3efe8;padding:4px 10px;border-radius:12px;margin:2px}</style></head><body>
      <h1>${name}</h1><p class="meta">${title} · ${email} · ${phone}</p>
      <h2>Summary</h2><p>${summary}</p>
      <h2>Skills</h2><p>${skills.map((s) => `<span class="skill">${s}</span>`).join(" ")}</p>
      <h2>Experience</h2>${experiences.map((e) => `<div><b>${e.role}</b> — ${e.company} <span class="meta">(${e.period})</span><ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul></div>`).join("")}
      </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${name.replace(/\s+/g, "_")}_Resume.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">Header</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
          </div>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Professional summary" className="mt-3 h-20 w-full rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1 text-sm">
                {s}<button onClick={() => setSkills(skills.filter((x) => x !== s))}><X className="h-3 w-3 text-muted-foreground" /></button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add skill" className="flex-1 rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
            <button onClick={addSkill} className="rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold">Experience</h3>
            <button onClick={() => setExperiences([...experiences, { id: Date.now().toString(), role: "", company: "", period: "", bullets: [""] }])} className="text-xs font-semibold text-brand">+ Add</button>
          </div>
          <div className="space-y-4">
            {experiences.map((e) => (
              <div key={e.id} className="rounded-lg border border-border p-3">
                <div className="grid gap-2 md:grid-cols-3">
                  <input value={e.role} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, role: ev.target.value } : x))} placeholder="Role" className="rounded border border-border bg-soft px-2 py-1.5 text-sm outline-none" />
                  <input value={e.company} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, company: ev.target.value } : x))} placeholder="Company" className="rounded border border-border bg-soft px-2 py-1.5 text-sm outline-none" />
                  <input value={e.period} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, period: ev.target.value } : x))} placeholder="Period" className="rounded border border-border bg-soft px-2 py-1.5 text-sm outline-none" />
                </div>
                {e.bullets.map((b, bi) => (
                  <input key={bi} value={b} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, bullets: x.bullets.map((bb, bbi) => bbi === bi ? ev.target.value : bb) } : x))} placeholder="• Achievement (start with verb, include metric)" className="mt-2 w-full rounded border border-border bg-soft px-2 py-1.5 text-sm outline-none" />
                ))}
                <div className="mt-2 flex justify-between text-xs">
                  <button onClick={() => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, bullets: [...x.bullets, ""] } : x))} className="text-brand">+ Bullet</button>
                  <button onClick={() => setExperiences(experiences.filter((x) => x.id !== e.id))} className="text-rose-600"><Trash2 className="inline h-3 w-3" /> Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-brand to-gold/70 p-6 text-brand-foreground">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-widest opacity-80">Resume Score</p></div>
          <p className="mt-2 font-display text-6xl font-bold">{feedback.score}</p>
          <p className="text-sm opacity-80">/ 100</p>
          <button onClick={downloadResume} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30">
            <Download className="h-4 w-4" /> Download Resume
          </button>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">AI Feedback</h3>
          <ul className="space-y-2">
            {feedback.items.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                {f.type === "good" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />}
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Skill Gap ─────────── */

const ROLES: Record<string, { skill: string; weight: number }[]> = {
  "Software Engineer": [
    { skill: "Data Structures", weight: 5 }, { skill: "Algorithms", weight: 5 }, { skill: "System Design", weight: 4 },
    { skill: "Git", weight: 3 }, { skill: "JavaScript", weight: 4 }, { skill: "React", weight: 3 }, { skill: "SQL", weight: 4 },
  ],
  "Data Scientist": [
    { skill: "Python", weight: 5 }, { skill: "Statistics", weight: 5 }, { skill: "Machine Learning", weight: 5 },
    { skill: "Pandas", weight: 4 }, { skill: "SQL", weight: 4 }, { skill: "Visualization", weight: 3 },
  ],
  "Frontend Developer": [
    { skill: "HTML", weight: 4 }, { skill: "CSS", weight: 5 }, { skill: "JavaScript", weight: 5 },
    { skill: "React", weight: 5 }, { skill: "TypeScript", weight: 4 }, { skill: "Accessibility", weight: 3 },
  ],
};

type Level = 0 | 1 | 2 | 3 | 4 | 5;

function SkillGap() {
  const [role, setRole] = useState<keyof typeof ROLES>("Software Engineer");
  const [userSkills, setUserSkills] = useState<Record<string, Level>>({ JavaScript: 4, React: 3, Git: 3, "Data Structures": 2, SQL: 2 });

  const required = ROLES[role];
  const analysis = useMemo(() => {
    const items = required.map((r) => {
      const have = userSkills[r.skill] || 0;
      const target = 4;
      const gap = Math.max(0, target - have);
      return { ...r, have, target, gap, status: gap === 0 ? "strong" : gap <= 1 ? "okay" : gap <= 2 ? "weak" : "missing" };
    });
    const totalWeight = required.reduce((s, r) => s + r.weight * 4, 0);
    const earned = items.reduce((s, i) => s + Math.min(i.have, 4) * i.weight, 0);
    const readiness = Math.round((earned / totalWeight) * 100);
    const gaps = items.filter((i) => i.gap > 0).sort((a, b) => b.gap * b.weight - a.gap * a.weight);
    return { items, readiness, gaps };
  }, [required, userSkills]);

  const setLevel = (skill: string, level: Level) => setUserSkills({ ...userSkills, [skill]: level });
  const allSkills = Array.from(new Set([...Object.keys(userSkills), ...required.map((r) => r.skill)]));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold">Target role:</span>
        {Object.keys(ROLES).map((r) => (
          <button key={r} onClick={() => setRole(r as keyof typeof ROLES)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${role === r ? "bg-brand text-brand-foreground" : "bg-card border border-border"}`}>{r}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">Your Skills (rate 0–5)</h3>
            <div className="space-y-3">
              {allSkills.map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-40 text-sm font-medium">{s}</span>
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setLevel(s, n as Level)} className={`h-7 flex-1 rounded ${(userSkills[s] || 0) >= n ? "bg-gold" : "bg-soft"}`} />
                    ))}
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-gold">{userSkills[s] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Gap Breakdown for {role}</h3>
            <div className="space-y-3">
              {analysis.items.map((i) => (
                <div key={i.skill} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{i.skill} <span className="ml-2 text-xs text-muted-foreground">weight {i.weight}/5</span></p>
                      <p className="text-xs text-muted-foreground">You: {i.have}/5 · Target: {i.target}/5</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${i.status === "strong" ? "bg-emerald-100 text-emerald-700" : i.status === "okay" ? "bg-gold/15 text-gold" : i.status === "weak" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{i.status}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft">
                    <div className="bg-gold" style={{ width: `${(i.have / 5) * 100}%`, height: "100%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-brand to-gold/70 p-6 text-brand-foreground">
            <div className="flex items-center gap-2"><Target className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-widest opacity-80">Job Readiness</p></div>
            <p className="mt-2 font-display text-6xl font-bold">{analysis.readiness}%</p>
            <p className="text-sm opacity-80">for {role}</p>
            <div className="mt-3 h-2 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${analysis.readiness}%` }} /></div>
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gold" /><h3 className="text-sm font-bold uppercase tracking-widest text-gold">Top Priorities</h3></div>
            <ol className="mt-3 space-y-2">
              {analysis.gaps.slice(0, 5).map((g, i) => (
                <li key={g.skill} className="flex items-center gap-3 rounded-lg bg-soft p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{g.skill}</p>
                    <p className="text-xs text-muted-foreground">Gap: {g.gap} levels</p>
                  </div>
                </li>
              ))}
              {analysis.gaps.length === 0 && <li className="text-sm text-emerald-600">🎉 No gaps — you're job ready!</li>}
            </ol>
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-gold" /><h3 className="text-sm font-bold uppercase tracking-widest text-gold">Next Step</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">Head to the <b>AI Assistant → Resources</b> tab for curated study materials on your top gap skills.</p>
          </div>
        </div>
      </div>
    </>
  );
}
