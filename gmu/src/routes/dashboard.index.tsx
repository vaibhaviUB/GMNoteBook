import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Brain, Mic, Flame, Target, BarChart3, LayoutGrid, TrendingUp, Award, AlertTriangle, Trophy, Crown, Star, Lock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DashboardLayout, PageTabs } from "@/components/DashboardLayout";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

type Tab = "overview" | "progress" | "rewards";

const stats = [
  { icon: BookOpen, label: "Notes Created", value: "24", sub: "+3 this week", color: "text-gold" },
  { icon: Brain, label: "Tests Taken", value: "12", sub: "85% avg score", color: "text-emerald-600" },
  { icon: Mic, label: "Mock Interviews", value: "6", sub: "2 scheduled", color: "text-brand" },
  { icon: Flame, label: "Study Streak", value: "7 days", sub: "Personal best!", color: "text-orange-500" },
];

const goals = [
  { label: "Study Hours (15h goal)", value: 10.5, max: 15, display: "10.5 / 15h" },
  { label: "Quizzes Completed (5 goal)", value: 3, max: 5, display: "3 / 5" },
  { label: "Notes Reviewed (10 goal)", value: 8, max: 10, display: "8 / 10" },
];

const quick = [
  { icon: BookOpen, title: "Notes", desc: "Create & organize your study notes", to: "/dashboard/notes" as const },
  { icon: Brain, title: "AI & Tests", desc: "Ask questions, take adaptive quizzes", to: "/dashboard/ai" as const },
  { icon: Mic, title: "Career Prep", desc: "Mock interviews & resume", to: "/dashboard/career" as const },
  { icon: Target, title: "Planner", desc: "Schedule & exam countdown", to: "/dashboard/planner" as const },
];

const subjects = [
  { name: "Data Structures", score: 88, taken: 12 },
  { name: "Algorithms", score: 76, taken: 9 },
  { name: "Operating Systems", score: 92, taken: 6 },
  { name: "Databases", score: 70, taken: 8 },
  { name: "Networks", score: 65, taken: 5 },
  { name: "Web Dev", score: 81, taken: 10 },
];

const week = [
  { day: "Mon", hours: 3, score: 72 },
  { day: "Tue", hours: 5, score: 78 },
  { day: "Wed", hours: 2, score: 65 },
  { day: "Thu", hours: 7, score: 84 },
  { day: "Fri", hours: 6, score: 82 },
  { day: "Sat", hours: 4, score: 88 },
  { day: "Sun", hours: 8, score: 91 },
];

const radar = subjects.map((s) => ({ subject: s.name.split(" ")[0], score: s.score, full: 100 }));

const BADGES = [
  { id: "b1", name: "First Steps", desc: "Complete your first quiz", earned: true, icon: Star },
  { id: "b2", name: "Streak Starter", desc: "Maintain a 3-day streak", earned: true, icon: Flame },
  { id: "b3", name: "Week Warrior", desc: "7-day learning streak", earned: true, icon: Flame },
  { id: "b4", name: "Knowledge Seeker", desc: "Create 20+ notes", earned: true, icon: Star },
  { id: "b5", name: "Quiz Master", desc: "Score 90%+ on 5 quizzes", earned: false, icon: Trophy },
  { id: "b6", name: "Interview Ace", desc: "Complete 10 mock interviews", earned: false, icon: Award },
  { id: "b7", name: "Marathon Mind", desc: "30-day learning streak", earned: false, icon: Crown },
  { id: "b8", name: "Resource Curator", desc: "Upload 25 resources", earned: false, icon: Star },
];

const LEADERS = [
  { rank: 1, name: "Aman Reddy", points: 4820, streak: 42 },
  { rank: 2, name: "Priya Sharma", points: 4310, streak: 28 },
  { rank: 3, name: "Karan Patel", points: 3950, streak: 18 },
  { rank: 4, name: "You", points: 3220, streak: 7, you: true },
  { rank: 5, name: "Sana Khan", points: 2980, streak: 14 },
  { rank: 6, name: "Vikram T.", points: 2540, streak: 9 },
];

function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <DashboardLayout>
      <div>
        <h1 className="font-display text-4xl font-bold text-foreground">Welcome back! 👋</h1>
        <p className="mt-1 text-muted-foreground">Your study overview at a glance.</p>
      </div>

      <div className="mt-6">
        <PageTabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "progress", label: "Progress", icon: BarChart3 },
            { id: "rewards", label: "Rewards", icon: Trophy },
          ]}
        />
      </div>

      {tab === "overview" && (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-foreground">{s.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-bold">Weekly Goals</h2>
            </div>
            <div className="mt-6 space-y-5">
              {goals.map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{g.label}</span>
                    <span className="font-semibold">{g.display}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-soft">
                    <div className="h-full bg-brand" style={{ width: `${(g.value / g.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="mt-10 text-xl font-bold">Quick Actions</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {quick.map((q) => (
              <Link key={q.title} to={q.to} className="rounded-2xl bg-card p-6 transition hover:shadow-md hover:border-gold/40 border border-border">
                <q.icon className="h-7 w-7 text-gold" />
                <h3 className="mt-4 text-lg font-bold">{q.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{q.desc}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      {tab === "progress" && <ProgressView />}
      {tab === "rewards" && <RewardsView />}
    </DashboardLayout>
  );
}

function ProgressView() {
  const avg = Math.round(subjects.reduce((a, b) => a + b.score, 0) / subjects.length);
  const totalTests = subjects.reduce((a, b) => a + b.taken, 0);
  const top = [...subjects].sort((a, b) => b.score - a.score)[0];
  const weakAreas = [...subjects].sort((a, b) => a.score - b.score).slice(0, 3);
  const totalHours = week.reduce((a, b) => a + b.hours, 0);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        {[
          { icon: TrendingUp, label: "Avg. Accuracy", v: `${avg}%`, sub: "+6% vs last month" },
          { icon: Target, label: "Tests Taken", v: String(totalTests), sub: "across 6 subjects" },
          { icon: Award, label: "Top Subject", v: top.name.split(" ")[0], sub: `${top.score}% accuracy` },
          { icon: BarChart3, label: "Study Hours", v: `${totalHours}h`, sub: "this week" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <s.icon className="h-5 w-5 text-gold" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{s.v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Score Trend (Last 7 Days)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={week}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="var(--gold)" strokeWidth={3} dot={{ fill: "var(--gold)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Study Hours This Week">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={week}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="hours" fill="var(--brand)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject Mastery Radar">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radar}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--muted-foreground)" fontSize={11} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={10} />
              <Radar dataKey="score" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject Performance">
          <div className="space-y-3 pt-2">
            {subjects.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="font-semibold">{s.score}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-soft">
                  <div className={`h-full transition-all ${s.score >= 85 ? "bg-emerald-500" : s.score >= 70 ? "bg-gold" : "bg-destructive/80"}`} style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-gold" />
          <h2 className="font-display text-lg font-bold">Focus Areas — Personalized for You</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {weakAreas.map((w) => (
            <div key={w.name} className="rounded-xl bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{w.name}</p>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">{w.score}%</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Recommendation: review fundamentals and take a focused quiz.</p>
              <Link to="/dashboard/ai" className="mt-3 inline-block text-xs font-semibold text-gold hover:underline">Practice now →</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function RewardsView() {
  const [points, setPoints] = useState(3220);
  const earned = BADGES.filter((b) => b.earned).length;
  const level = Math.floor(points / 1000) + 1;
  const progressInLevel = (points % 1000) / 10;
  const you = LEADERS.find((l) => "you" in l && l.you);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-brand to-gold/70 p-5 text-brand-foreground md:col-span-2">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Level {level}</p>
          </div>
          <p className="mt-2 font-display text-5xl font-bold">{points.toLocaleString()}</p>
          <p className="text-sm opacity-80">XP · {1000 - (points % 1000)} XP to level {level + 1}</p>
          <div className="mt-3 h-2 rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progressInLevel}%` }} />
          </div>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <Flame className="h-5 w-5 text-orange-500" />
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Streak</p>
          <p className="mt-1 font-display text-4xl font-bold">7🔥</p>
          <p className="text-xs text-muted-foreground">days in a row</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <Trophy className="h-5 w-5 text-gold" />
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Rank</p>
          <p className="mt-1 font-display text-4xl font-bold">#{you?.rank ?? "—"}</p>
          <p className="text-xs text-muted-foreground">of {LEADERS.length} students</p>
        </div>
      </div>

      <h3 className="mt-8 font-display text-lg font-bold">Badges ({earned}/{BADGES.length})</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((b) => (
          <div key={b.id} className={`rounded-2xl border-2 p-5 text-center transition ${b.earned ? "border-gold bg-gold/5" : "border-border bg-card opacity-60"}`}>
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${b.earned ? "bg-gradient-to-br from-gold to-brand text-white" : "bg-soft"}`}>
              {b.earned ? <b.icon className="h-7 w-7" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <p className="mt-3 font-bold">{b.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-8 font-display text-lg font-bold">Leaderboard</h3>
      <div className="mt-4 rounded-2xl bg-card p-5 shadow-sm">
        <ul className="divide-y divide-border">
          {LEADERS.map((l) => {
            const isYou = "you" in l && l.you;
            return (
              <li key={l.rank} className={`flex items-center justify-between py-4 ${isYou ? "rounded-lg bg-gold/5 px-3" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    l.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white"
                    : l.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                    : l.rank === 3 ? "bg-gradient-to-br from-orange-400 to-amber-700 text-white"
                    : "bg-soft"
                  }`}>
                    {l.rank <= 3 ? <Crown className="h-4 w-4" /> : l.rank}
                  </span>
                  <div>
                    <p className="font-semibold">{l.name} {isYou && <span className="ml-2 text-xs font-bold text-gold">YOU</span>}</p>
                    <p className="text-xs text-muted-foreground">🔥 {l.streak}-day streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-gold">{l.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={() => setPoints(points + 50)} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">
        <Star className="h-4 w-4" /> Simulate +50 XP
      </button>
    </>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <h3 className="mb-3 font-display text-base font-bold">{title}</h3>
      {children}
    </div>
  );
}
