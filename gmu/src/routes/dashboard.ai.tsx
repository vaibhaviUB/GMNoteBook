import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Sparkles, Send, FileText, Lightbulb, BookOpen, Wand2, Brain, CheckCircle2, XCircle, RotateCcw, TrendingUp, Target, Zap, ArrowRight, Book, Video, Link2, Search, Upload, Eye, X } from "lucide-react";
import { DashboardLayout, PageHeader, PageTabs } from "@/components/DashboardLayout";

export const Route = createFileRoute("/dashboard/ai")({
  component: AI,
});

type MainTab = "ask" | "tests" | "resources";

function AI() {
  const [tab, setTab] = useState<MainTab>("ask");
  return (
    <DashboardLayout>
      <PageHeader tag="AI Study Hub" title="Learn,  " accent="Practice & Explore" subtitle="Ask the AI tutor, test your knowledge with adaptive quizzes, or browse the resource library." />
      <PageTabs<MainTab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "ask", label: "Ask AI", icon: Sparkles },
          { id: "tests", label: "Practice Tests", icon: Brain },
          { id: "resources", label: "Resources", icon: BookOpen },
        ]}
      />
      {tab === "ask" && <AskAI />}
      {tab === "tests" && <Tests />}
      {tab === "resources" && <Resources />}
    </DashboardLayout>
  );
}

/* ─────────────────── Ask AI ─────────────────── */

type Mode = "chat" | "summarize" | "explain" | "topics";
type Msg = { role: "user" | "ai"; text: string; related?: string[] };

const MODES: { id: Mode; label: string; icon: typeof Sparkles; hint: string }[] = [
  { id: "chat", label: "Ask Anything", icon: Sparkles, hint: "Type any study question" },
  { id: "summarize", label: "Summarize", icon: FileText, hint: "Paste text to summarize" },
  { id: "explain", label: "Explain Simply", icon: Lightbulb, hint: "Explain a concept like I'm five" },
  { id: "topics", label: "Suggest Topics", icon: BookOpen, hint: "What to learn next" },
];

const SUGGESTIONS: Record<Mode, string[]> = {
  chat: ["What is dynamic programming?", "How does TCP differ from UDP?", "Explain database normalization"],
  summarize: ["Summarize chapter on operating systems", "Condense this article into 5 bullets"],
  explain: ["Explain Big-O notation simply", "Explain recursion with an analogy"],
  topics: ["Topics related to neural networks", "Roadmap for full-stack web dev"],
};

function pickRelated(q: string): string[] {
  const map: { keys: string[]; topics: string[] }[] = [
    { keys: ["array", "list", "data structure"], topics: ["Linked Lists", "Hash Tables", "Stacks & Queues"] },
    { keys: ["tree", "graph", "bst"], topics: ["Binary Search Trees", "Graph Traversal", "Heap & Priority Queue"] },
    { keys: ["sort", "search", "algorithm"], topics: ["Merge Sort", "Quick Sort", "Binary Search"] },
    { keys: ["dp", "dynamic", "recursion"], topics: ["Memoization", "Tabulation", "Knapsack Problem"] },
    { keys: ["sql", "database", "table"], topics: ["Joins & Subqueries", "Normalization", "Indexing"] },
    { keys: ["react", "component", "hook"], topics: ["useEffect deep dive", "State management", "Performance"] },
  ];
  for (const m of map) if (m.keys.some((k) => q.includes(k))) return m.topics;
  return ["Big-O Complexity", "System Design Basics", "Practice Problems"];
}

function AskAI() {
  const [mode, setMode] = useState<Mode>("chat");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your AI study assistant. Pick a mode and ask anything — I can summarize notes, explain concepts simply, or recommend what to study next." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  const generate = (text: string, m: Mode): Msg => {
    const lower = text.toLowerCase();
    if (m === "summarize") {
      const lines = text.split(/[.!?\n]+/).filter((l) => l.trim().length > 10).slice(0, 5);
      const bullets = lines.length
        ? lines.map((l, i) => `${i + 1}. ${l.trim().slice(0, 120)}`).join("\n")
        : "• Key concept overview\n• Main principles\n• Practical applications\n• Common pitfalls\n• Practice exercises";
      return { role: "ai", text: `Summary in 5 key points:\n\n${bullets}` };
    }
    if (m === "explain") {
      return { role: "ai", text: `Let me break down "${text}" simply:\n\n🎯 Big idea: think of it as organizing books on a shelf — predictable, easy to find.\n📚 In practice: appears whenever you manage data or coordinate systems.\n🔑 Takeaway: master fundamentals, then explore edge cases.`, related: pickRelated(lower) };
    }
    if (m === "topics") {
      return { role: "ai", text: `Based on "${text}", recommended next topics:`, related: pickRelated(lower) };
    }
    return { role: "ai", text: `Great question! Here's my take on "${text}":\n\nStart with the core definition, then explore real-world applications. Try the Practice Tests tab to test yourself.`, related: pickRelated(lower) };
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, generate(t, mode)]);
      setThinking(false);
    }, 600);
  };

  const currentMode = MODES.find((m) => m.id === mode)!;

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {MODES.map((m) => {
          const active = m.id === mode;
          return (
            <button key={m.id} onClick={() => setMode(m.id)} className={`rounded-xl border-2 p-4 text-left transition ${active ? "border-gold bg-gold/10" : "border-border bg-card hover:border-gold/40"}`}>
              <m.icon className={`h-5 w-5 ${active ? "text-gold" : "text-muted-foreground"}`} />
              <p className="mt-2 text-sm font-bold">{m.label}</p>
              <p className="text-[11px] text-muted-foreground">{m.hint}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-card shadow-sm">
        <div ref={scrollRef} className="max-h-[50vh] space-y-4 overflow-y-auto p-6">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-brand text-brand-foreground" : "bg-soft text-foreground"}`}>
                {m.role === "ai" && <Sparkles className="mb-1 inline h-3 w-3 text-gold" />}
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.related && m.related.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                    {m.related.map((r) => (
                      <button key={r} onClick={() => send(r)} className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-card px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/10">
                        <Wand2 className="h-3 w-3" /> {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {thinking && <div className="flex justify-start"><div className="rounded-2xl bg-soft px-4 py-3 text-sm"><Sparkles className="inline h-3 w-3 animate-pulse text-gold" /> Thinking…</div></div>}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS[mode].map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-soft hover:text-foreground">{s}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`${currentMode.label}: ${currentMode.hint}`} className="flex-1 rounded-lg border border-border bg-soft px-4 py-3 text-sm outline-none focus:border-gold" />
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:brightness-110">
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─────────────────── Tests (Adaptive) ─────────────────── */

type Difficulty = "easy" | "medium" | "hard";
type Question = { q: string; opts: string[]; a: number; difficulty: Difficulty; explain: string };
type Topic = { id: string; name: string; icon: string; description: string; questions: Question[] };

const TOPICS: Topic[] = [
  { id: "ds", name: "Data Structures", icon: "🧱", description: "Arrays, stacks, queues, trees, graphs", questions: [
    { q: "Which data structure uses LIFO ordering?", opts: ["Queue", "Stack", "Heap", "Tree"], a: 1, difficulty: "easy", explain: "Stacks follow Last-In-First-Out." },
    { q: "Time complexity to access an array element by index?", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], a: 2, difficulty: "easy", explain: "Constant-time random access." },
    { q: "Big-O of binary search?", opts: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], a: 2, difficulty: "medium", explain: "Halves the search space each step." },
    { q: "Traversal that visits root → left → right?", opts: ["Inorder", "Preorder", "Postorder", "Level-order"], a: 1, difficulty: "medium", explain: "Preorder visits root first." },
    { q: "Worst-case Quicksort?", opts: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], a: 1, difficulty: "hard", explain: "Bad pivot → O(n²)." },
    { q: "Min-heap extract-min?", opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], a: 1, difficulty: "hard", explain: "Sift-down after removal." },
  ]},
  { id: "algo", name: "Algorithms", icon: "⚡", description: "Sorting, DP, graph algorithms", questions: [
    { q: "Stable sort with O(n log n) worst case?", opts: ["Quicksort", "Heapsort", "Mergesort", "Selection sort"], a: 2, difficulty: "easy", explain: "Mergesort is stable." },
    { q: "Best-case bubble sort (optimized)?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(1)"], a: 0, difficulty: "easy", explain: "Detects no swaps in one pass." },
    { q: "DP requires?", opts: ["Greedy choice", "Overlapping subproblems & optimal substructure", "Divide & conquer", "Random access"], a: 1, difficulty: "medium", explain: "Both properties needed." },
    { q: "Dijkstra fails with?", opts: ["Cycles", "Negative weights", "Many nodes", "Self-loops"], a: 1, difficulty: "medium", explain: "Use Bellman-Ford for negatives." },
    { q: "0/1 Knapsack DP complexity?", opts: ["O(n)", "O(nW)", "O(2^n)", "O(n log W)"], a: 1, difficulty: "hard", explain: "Pseudo-polynomial." },
    { q: "Algorithm for SCCs?", opts: ["Kruskal's", "Tarjan's", "Prim's", "Floyd-Warshall"], a: 1, difficulty: "hard", explain: "Tarjan in O(V+E)." },
  ]},
  { id: "web", name: "Web Development", icon: "🌐", description: "HTML, CSS, JavaScript, React", questions: [
    { q: "HTTP code for 'Not Found'?", opts: ["200", "301", "404", "500"], a: 2, difficulty: "easy", explain: "404." },
    { q: "Which React hook handles side effects?", opts: ["useState", "useMemo", "useEffect", "useRef"], a: 2, difficulty: "easy", explain: "useEffect runs after render." },
    { q: "`flex: 1` expands to?", opts: ["1 1 0%", "1 0 auto", "0 1 auto", "1 1 100%"], a: 0, difficulty: "medium", explain: "grow:1, shrink:1, basis:0%." },
    { q: "When to use useMemo?", opts: ["Every value", "Expensive computations", "Replace useState", "Force re-renders"], a: 1, difficulty: "medium", explain: "Caches expensive computations." },
    { q: "What triggers reconciliation?", opts: ["DOM mutation", "State or props change", "CSS update", "Resize"], a: 1, difficulty: "hard", explain: "State/props changes." },
    { q: "CORS preflight method?", opts: ["GET", "POST", "OPTIONS", "HEAD"], a: 2, difficulty: "hard", explain: "Browser sends OPTIONS." },
  ]},
  { id: "db", name: "Databases & SQL", icon: "🗄️", description: "Queries, indexing, normalization", questions: [
    { q: "SQL keyword to filter rows?", opts: ["WHERE", "SELECT", "JOIN", "ORDER"], a: 0, difficulty: "easy", explain: "WHERE filters before grouping." },
    { q: "PRIMARY KEY enforces?", opts: ["Sorted order", "Unique + not null", "Foreign reference", "Index only"], a: 1, difficulty: "easy", explain: "Unique, non-null, indexed." },
    { q: "Which JOIN keeps all left rows?", opts: ["INNER", "LEFT", "RIGHT", "CROSS"], a: 1, difficulty: "medium", explain: "LEFT JOIN preserves left." },
    { q: "3NF removes?", opts: ["Partial deps", "Transitive deps", "Foreign keys", "Indexes"], a: 1, difficulty: "medium", explain: "Transitive dependencies." },
    { q: "Isolation level preventing phantom reads?", opts: ["Read uncommitted", "Read committed", "Repeatable read", "Serializable"], a: 3, difficulty: "hard", explain: "Only Serializable." },
    { q: "Composite index (a,b) — best query?", opts: ["WHERE b=5", "WHERE a=1 AND b=5", "WHERE c=2", "ORDER BY c"], a: 1, difficulty: "hard", explain: "Leading column required." },
  ]},
];

type Phase = "select" | "quiz" | "result";
type Answer = { topicQ: Question; picked: number; correct: boolean };

function Tests() {
  const [phase, setPhase] = useState<Phase>("select");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [asked, setAsked] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const TOTAL = 6;

  const current = asked[asked.length - 1];

  const startQuiz = (t: Topic) => {
    setTopic(t); setDifficulty("easy");
    setAsked([t.questions.find((q) => q.difficulty === "easy")!]);
    setAnswers([]); setPicked(null); setPhase("quiz");
  };

  const submitAnswer = () => {
    if (picked === null || !current || !topic) return;
    const correct = picked === current.a;
    const newAnswers = [...answers, { topicQ: current, picked, correct }];
    setAnswers(newAnswers); setPicked(null);
    if (newAnswers.length >= TOTAL) { setPhase("result"); return; }
    const order: Difficulty[] = ["easy", "medium", "hard"];
    const idx = order.indexOf(difficulty);
    const nextDiff: Difficulty = correct ? order[Math.min(idx + 1, 2)] : order[Math.max(idx - 1, 0)];
    setDifficulty(nextDiff);
    const usedIds = new Set(newAnswers.map((a) => a.topicQ.q).concat(asked.map((q) => q.q)));
    const pool = topic.questions.filter((q) => !usedIds.has(q.q));
    const exact = pool.filter((q) => q.difficulty === nextDiff);
    setAsked([...asked, (exact[0] ?? pool[0])!]);
  };

  const reset = () => { setPhase("select"); setTopic(null); setAsked([]); setAnswers([]); setPicked(null); };

  const stats = useMemo(() => {
    const score = answers.filter((a) => a.correct).length;
    const byDiff = { easy: { right: 0, total: 0 }, medium: { right: 0, total: 0 }, hard: { right: 0, total: 0 } };
    answers.forEach((a) => { byDiff[a.topicQ.difficulty].total++; if (a.correct) byDiff[a.topicQ.difficulty].right++; });
    const pct = Math.round((score / Math.max(answers.length, 1)) * 100);
    let level = "Beginner";
    if (pct >= 80) level = "Advanced"; else if (pct >= 55) level = "Intermediate";
    return { score, byDiff, pct, level };
  }, [answers]);

  if (phase === "select") {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {TOPICS.map((t) => (
          <button key={t.id} onClick={() => startQuiz(t)} className="group rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/15 text-3xl">{t.icon}</div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Target className="h-3 w-3" /> {TOTAL} questions</span>
                  <span className="inline-flex items-center gap-1"><Zap className="h-3 w-3 text-gold" /> Adaptive</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-gold" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/15">
              <Brain className="h-10 w-10 text-gold" />
            </div>
            <p className="mt-4 font-display text-5xl font-bold">{stats.score}<span className="text-2xl text-muted-foreground">/{TOTAL}</span></p>
            <p className="mt-1 text-sm text-muted-foreground">{stats.pct}% accuracy</p>
            <span className="mt-3 inline-block rounded-full border border-gold/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">{stats.level}</span>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-sm md:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold"><TrendingUp className="h-5 w-5 text-gold" /> Performance by Difficulty</h3>
            <div className="space-y-4">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                const v = stats.byDiff[d];
                const pct = v.total ? (v.right / v.total) * 100 : 0;
                return (
                  <div key={d}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-semibold capitalize">{d}</span>
                      <span className="text-muted-foreground">{v.right}/{v.total}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-soft">
                      <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-display text-lg font-bold">Question Review</h3>
          <div className="space-y-3">
            {answers.map((a, idx) => (
              <div key={idx} className="rounded-lg border border-border p-4 text-sm">
                <div className="flex items-start gap-3">
                  {a.correct ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
                  <div className="flex-1">
                    <p className="font-semibold">{a.topicQ.q}</p>
                    <p className="mt-1 text-muted-foreground">Your: <span className={a.correct ? "text-emerald-600" : "text-destructive"}>{a.topicQ.opts[a.picked]}</span> · Correct: <span className="text-foreground">{a.topicQ.opts[a.topicQ.a]}</span></p>
                    <p className="mt-2 rounded-md bg-soft p-3 text-xs text-muted-foreground">💡 {a.topicQ.explain}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-brand-foreground">
            <RotateCcw className="h-4 w-4" /> Take Another Test
          </button>
        </div>
      </div>
    );
  }

  const progress = (answers.length / TOTAL) * 100;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-semibold">Question {answers.length + 1} of {TOTAL}</span>
        <span className="text-muted-foreground">Difficulty: {difficulty.toUpperCase()}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-soft">
        <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-6 rounded-2xl bg-card p-8 shadow-sm">
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${current!.difficulty === "easy" ? "bg-emerald-500/15 text-emerald-700" : current!.difficulty === "medium" ? "bg-amber-500/15 text-amber-700" : "bg-destructive/15 text-destructive"}`}>{current!.difficulty}</span>
        <h2 className="mt-3 font-display text-2xl font-bold">{current!.q}</h2>
        <div className="mt-6 space-y-3">
          {current!.opts.map((o, idx) => (
            <button key={idx} onClick={() => setPicked(idx)} className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition ${picked === idx ? "border-gold bg-gold/10" : "border-border hover:border-gold/40 hover:bg-soft"}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${picked === idx ? "border-gold bg-gold text-gold-foreground" : "border-border text-muted-foreground"}`}>{String.fromCharCode(65 + idx)}</span>
              <span className="text-sm">{o}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={submitAnswer} disabled={picked === null} className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-brand-foreground transition hover:brightness-110 disabled:opacity-40">
            {answers.length + 1 === TOTAL ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Resources Library ─────────────────── */

type Resource = { id: string; type: "PDF" | "Video" | "eBook" | "Article"; title: string; author: string; tag: string; size?: string; url?: string; keyPoints: string[] };

const SEED_RES: Resource[] = [
  { id: "r1", type: "eBook", title: "Cracking the Coding Interview", author: "Gayle Laakmann", tag: "DSA", keyPoints: ["189 interview questions", "Big-O analysis for every solution", "Behavioral question framework"] },
  { id: "r2", type: "Video", title: "System Design Primer", author: "Tech with Tim", tag: "System Design", keyPoints: ["Load balancing strategies", "SQL vs NoSQL", "Caching patterns"] },
  { id: "r3", type: "PDF", title: "OS Cheat Sheet", author: "GMU Faculty", tag: "OS", keyPoints: ["Process vs thread", "Scheduling algorithms", "Deadlock prevention"] },
  { id: "r4", type: "Article", title: "Modern React Patterns", author: "Kent C. Dodds", tag: "Web Dev", keyPoints: ["Compound components", "State reducer pattern", "Hooks composition"] },
  { id: "r5", type: "Video", title: "SQL in 60 Minutes", author: "freeCodeCamp", tag: "Database", keyPoints: ["JOIN types", "Indexes & optimization", "Window functions"] },
  { id: "r6", type: "eBook", title: "Clean Code", author: "Robert C. Martin", tag: "Best Practices", keyPoints: ["Meaningful naming", "Function purity", "Comments as code smell"] },
];

const RES_ICONS = { PDF: FileText, Video, eBook: Book, Article: Link2 };

function Resources() {
  const [items, setItems] = useState<Resource[]>(SEED_RES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState<Resource | null>(null);

  const filtered = useMemo(() => items.filter((r) => {
    const ms = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.tag.toLowerCase().includes(search.toLowerCase());
    const mt = filter === "all" || r.type === filter;
    return ms && mt;
  }), [items, search, filter]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const type: Resource["type"] = ext === "pdf" ? "PDF" : ["mp4", "mov", "webm"].includes(ext || "") ? "Video" : "Article";
    const url = URL.createObjectURL(file);
    const sizeKB = Math.round(file.size / 1024);
    setItems([{
      id: crypto.randomUUID(), type, title: file.name, author: "You", tag: "Uploaded",
      size: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`, url,
      keyPoints: ["✨ AI extracted: Document structure detected", "✨ AI extracted: Key terminology identified", "✨ AI extracted: Estimated reading time"],
    }, ...items]);
    e.target.value = "";
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:border-gold" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "PDF", "Video", "eBook", "Article"].map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === t ? "bg-brand text-brand-foreground" : "bg-card border border-border"}`}>{t}</button>
          ))}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground">
          <Upload className="h-4 w-4" /> Upload
          <input type="file" className="hidden" onChange={onUpload} accept=".pdf,.mp4,.mov,.webm,.doc,.docx,.txt" />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const Icon = RES_ICONS[r.type];
          return (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5 transition hover:border-gold/40 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/15">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-muted-foreground">{r.type}{r.size ? ` · ${r.size}` : ""}</span>
              </div>
              <h3 className="mt-4 font-bold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.author}</p>
              <div className="mt-3 rounded-lg border border-gold/20 bg-gold/5 p-3">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold"><Sparkles className="h-3 w-3" /> AI Key Points</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {r.keyPoints.slice(0, 2).map((k, i) => <li key={i}>• {k}</li>)}
                </ul>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-gold">#{r.tag}</span>
                <button onClick={() => setPreview(r)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                  <Eye className="h-4 w-4" /> Preview
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="col-span-full py-12 text-center text-muted-foreground">No resources match your search.</p>}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">{preview.title}</h2>
                <p className="text-sm text-muted-foreground">{preview.author} · {preview.type}</p>
              </div>
              <button onClick={() => setPreview(null)} className="rounded-full p-1 hover:bg-soft"><X className="h-5 w-5" /></button>
            </div>
            {preview.url && preview.type === "Video" && <video src={preview.url} controls className="mb-4 w-full rounded-lg" />}
            {preview.url && preview.type === "PDF" && <iframe src={preview.url} className="mb-4 h-96 w-full rounded-lg border border-border" title={preview.title} />}
            {!preview.url && <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-soft text-sm text-muted-foreground">Preview not available — showing AI summary below</div>}
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
              <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gold"><Sparkles className="h-3 w-3" /> AI Extracted Key Points</p>
              <ul className="mt-3 space-y-2 text-sm">
                {preview.keyPoints.map((k, i) => <li key={i}>• {k}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
