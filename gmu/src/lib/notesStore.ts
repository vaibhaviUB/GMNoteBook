import { useSyncExternalStore } from "react";

export type Note = {
  id: string;
  title: string;
  subject: string;
  tags: string[];
  html: string;
  date: string;
  updated: string;
};

export const SUBJECTS = [
  "Data Structures",
  "Algorithms",
  "Web Development",
  "Databases",
  "Operating Systems",
  "Mathematics",
  "Other",
];

const STORAGE_KEY = "gm_notes_v1";

const seed: Note[] = [
  {
    id: "seed-1",
    title: "Binary Search Trees",
    subject: "Data Structures",
    tags: ["trees", "search", "exam"],
    html: "<h2>Binary Search Trees</h2><p><b>BSTs</b> are ordered binary trees where left &lt; root &lt; right. Operations like <i>insert</i>, <i>delete</i>, and <i>search</i> run in O(log n) on balanced trees.</p><pre><code>function insert(root, val) { ... }</code></pre>",
    date: "17 Apr 2026",
    updated: "17 Apr 2026",
  },
  {
    id: "seed-2",
    title: "Big-O Cheatsheet",
    subject: "Algorithms",
    tags: ["complexity", "reference"],
    html: "<h2>Big-O Cheatsheet</h2><p>Common complexities:</p><ul><li>Constant: <code>O(1)</code></li><li>Logarithmic: <code>O(log n)</code></li><li>Linear: <code>O(n)</code></li><li>Quadratic: <code>O(n²)</code></li></ul>",
    date: "16 Apr 2026",
    updated: "16 Apr 2026",
  },
];

function load(): Note[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as Note[];
  } catch {
    return seed;
  }
}

let state: Note[] = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export function useNotesStore() {
  const notes = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    notes,
    get: (id: string) => state.find((n) => n.id === id),
    add: (n: Note) => {
      state = [n, ...state];
      persist();
    },
    update: (id: string, patch: Partial<Note>) => {
      state = state.map((n) => (n.id === id ? { ...n, ...patch, updated: today() } : n));
      persist();
    },
    remove: (id: string) => {
      state = state.filter((n) => n.id !== id);
      persist();
    },
  };
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
