import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, Trash2, Check, Bell, BellOff, Clock, Flag } from "lucide-react";
import { DashboardLayout, PageHeader } from "@/components/DashboardLayout";

export const Route = createFileRoute("/dashboard/planner")({
  component: Planner,
});

type Task = { id: string; title: string; subject: string; date: string; due: string; priority: "low" | "med" | "high"; reminder: boolean; done: boolean };
type Exam = { id: string; name: string; date: string };

function daysUntil(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function Planner() {
  const today = new Date().toISOString().slice(0, 10);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Revise OS Memory Management", subject: "OS", date: "Today", due: today, priority: "high", reminder: true, done: false },
    { id: "2", title: "Take Adaptive Quiz - DBMS", subject: "DBMS", date: "Tomorrow", due: today, priority: "med", reminder: true, done: false },
    { id: "3", title: "Mock interview - SDE Behavioral", subject: "Career", date: "Friday", due: today, priority: "med", reminder: false, done: true },
  ]);
  const [exams, setExams] = useState<Exam[]>([
    { id: "e1", name: "Mid-sem DBMS", date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) },
    { id: "e2", name: "End-sem OS", date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) },
  ]);
  const [view, setView] = useState<"daily" | "weekly">("daily");

  const [t, setT] = useState("");
  const [subj, setSubj] = useState("General");
  const [d, setD] = useState(today);
  const [pri, setPri] = useState<Task["priority"]>("med");
  const [rem, setRem] = useState(true);

  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [reminders, setReminders] = useState<string[]>([]);

  // Reminder check (simulated — every render computes due-soon items)
  useEffect(() => {
    const due = tasks.filter((x) => x.reminder && !x.done && x.due === today).map((x) => x.title);
    setReminders(due);
  }, [tasks, today]);

  const add = () => {
    if (!t.trim()) return;
    const dueDate = new Date(d);
    const dateLabel = dueDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    setTasks([{ id: crypto.randomUUID(), title: t, subject: subj, date: dateLabel, due: d, priority: pri, reminder: rem, done: false }, ...tasks]);
    setT("");
  };

  const addExam = () => {
    if (!examName.trim() || !examDate) return;
    setExams([...exams, { id: crypto.randomUUID(), name: examName, date: examDate }].sort((a, b) => a.date.localeCompare(b.date)));
    setExamName(""); setExamDate("");
  };

  const toggle = (id: string) => setTasks(tasks.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const remove = (id: string) => setTasks(tasks.filter((x) => x.id !== id));
  const toggleReminder = (id: string) => setTasks(tasks.map((x) => x.id === id ? { ...x, reminder: !x.reminder } : x));

  const grouped = useMemo(() => {
    if (view === "daily") {
      return [{ label: "Today", items: tasks.filter((x) => x.due === today) }, { label: "Upcoming", items: tasks.filter((x) => x.due !== today) }];
    }
    const week: Record<string, Task[]> = {};
    tasks.forEach((x) => { (week[x.date] ||= []).push(x); });
    return Object.entries(week).map(([label, items]) => ({ label, items }));
  }, [tasks, view, today]);

  const completedCount = tasks.filter((x) => x.done).length;

  return (
    <DashboardLayout>
      <PageHeader tag="Study Planner" title="Plan &" accent="Remind" subtitle="Daily/weekly schedule, exam countdown & reminder system." />

      {reminders.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gold/40 bg-gold/10 p-4">
          <div className="flex items-center gap-2 font-semibold text-gold">
            <Bell className="h-5 w-5" /> {reminders.length} reminder{reminders.length > 1 ? "s" : ""} due today
          </div>
          <ul className="mt-2 space-y-1 text-sm text-foreground">
            {reminders.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-card p-6 shadow-sm">
            <h2 className="font-bold">Add Task</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Task title" className="rounded-lg border border-border bg-soft px-4 py-2 text-sm outline-none focus:border-gold" />
              <input value={subj} onChange={(e) => setSubj(e.target.value)} placeholder="Subject" className="rounded-lg border border-border bg-soft px-4 py-2 text-sm outline-none focus:border-gold" />
              <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="rounded-lg border border-border bg-soft px-4 py-2 text-sm outline-none focus:border-gold" />
              <select value={pri} onChange={(e) => setPri(e.target.value as Task["priority"])} className="rounded-lg border border-border bg-soft px-4 py-2 text-sm outline-none focus:border-gold">
                <option value="low">Low priority</option>
                <option value="med">Medium priority</option>
                <option value="high">High priority</option>
              </select>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={rem} onChange={(e) => setRem(e.target.checked)} /> Send reminder
              </label>
              <button onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground">
                <Plus className="h-4 w-4" /> Add Task
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                <h2 className="font-bold">Tasks</h2>
                <span className="text-xs text-muted-foreground">({completedCount}/{tasks.length} done)</span>
              </div>
              <div className="flex gap-1 rounded-lg bg-soft p-1">
                {(["daily", "weekly"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)} className={`rounded-md px-3 py-1 text-xs font-semibold ${view === v ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{v}</button>
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-5">
              {grouped.map((g) => (
                <div key={g.label}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">{g.label}</p>
                  <ul className="mt-2 divide-y divide-border">
                    {g.items.length === 0 && <li className="py-3 text-sm text-muted-foreground">No tasks.</li>}
                    {g.items.map((task) => (
                      <li key={task.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggle(task.id)} className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${task.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border"}`}>
                            {task.done && <Check className="h-3 w-3" />}
                          </button>
                          <div>
                            <p className={`font-semibold ${task.done ? "text-muted-foreground line-through" : ""}`}>{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.subject} · {task.date}
                              <span className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${task.priority === "high" ? "bg-rose-100 text-rose-700" : task.priority === "med" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                <Flag className="h-2.5 w-2.5" /> {task.priority}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleReminder(task.id)} title={task.reminder ? "Reminder on" : "Reminder off"} className={task.reminder ? "text-gold" : "text-muted-foreground"}>
                            {task.reminder ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                          </button>
                          <button onClick={() => remove(task.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-brand to-gold/70 p-6 text-brand-foreground">
            <Clock className="h-5 w-5" />
            <p className="mt-2 text-xs font-bold uppercase tracking-widest opacity-80">Next Exam</p>
            {exams[0] ? (
              <>
                <p className="mt-2 font-display text-2xl font-bold">{exams[0].name}</p>
                <p className="mt-1 font-display text-5xl font-bold">{daysUntil(exams[0].date)}</p>
                <p className="text-sm opacity-80">days to go · {exams[0].date}</p>
              </>
            ) : <p className="mt-2 text-sm opacity-80">No exams scheduled.</p>}
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold">All Exams</h3>
            <ul className="mt-3 space-y-2">
              {exams.map((e) => {
                const days = daysUntil(e.date);
                return (
                  <li key={e.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-semibold">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.date}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${days <= 7 ? "bg-rose-100 text-rose-700" : days <= 30 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {days}d
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 space-y-2">
              <input value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Exam name" className="w-full rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
              <div className="flex gap-2">
                <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="flex-1 rounded-lg border border-border bg-soft px-3 py-2 text-sm outline-none focus:border-gold" />
                <button onClick={addExam} className="rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground">Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
