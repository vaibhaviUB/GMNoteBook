// Generate quiz questions automatically from a note's HTML/text content.
// Three question types: fill-in-the-blank, true/false, and multiple choice.

export type QuizQuestion =
  | { id: string; type: "fill"; prompt: string; answer: string; context: string }
  | { id: string; type: "tf"; prompt: string; answer: boolean; context: string }
  | { id: string; type: "mcq"; prompt: string; options: string[]; answerIndex: number; context: string };

const STOPWORDS = new Set([
  "the","a","an","and","or","but","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","must","can","this","that","these",
  "those","it","its","of","in","on","at","to","for","with","by","from","as","into","than","then",
  "so","such","not","no","yes","if","when","where","while","also","because","about","which","who",
  "whom","whose","what","why","how","there","here","they","them","their","you","your","we","our",
  "i","me","my","he","she","his","her","him","one","two","three","very","more","most","some","any",
  "all","each","every","other","same","just","only","own","over","under","up","down","out","off",
  "again","further","once","both","few","many","much","run","like","using","use","used"
]);

function htmlToText(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 240 && /[a-zA-Z]/.test(s));
}

function keywords(text: string): string[] {
  const counts = new Map<string, number>();
  const tokens = text.match(/[A-Za-z][A-Za-z\-]{2,}/g) ?? [];
  for (const raw of tokens) {
    const w = raw.toLowerCase();
    if (STOPWORDS.has(w) || w.length < 4) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  // Prefer capitalized terms (likely concepts) and frequency
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);
}

function pickKeywordFromSentence(sentence: string, ranked: string[]): string | null {
  const words = sentence.match(/[A-Za-z][A-Za-z\-]{3,}/g) ?? [];
  for (const k of ranked) {
    const hit = words.find((w) => w.toLowerCase() === k);
    if (hit) return hit;
  }
  // fallback: longest non-stopword in the sentence
  const candidates = words
    .filter((w) => !STOPWORDS.has(w.toLowerCase()) && w.length >= 5)
    .sort((a, b) => b.length - a.length);
  return candidates[0] ?? null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function generateQuiz(html: string, count = 8): QuizQuestion[] {
  const text = htmlToText(html);
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [];
  const ranked = keywords(text);
  const distractorPool = ranked.slice(0, 30);

  const used = new Set<string>();
  const out: QuizQuestion[] = [];
  const shuffled = shuffle(sentences);

  for (const sentence of shuffled) {
    if (out.length >= count) break;
    const kw = pickKeywordFromSentence(sentence, ranked);
    if (!kw || used.has(kw.toLowerCase())) continue;
    used.add(kw.toLowerCase());

    const blanked = sentence.replace(new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`), "_____");
    const type = out.length % 3; // rotate types

    if (type === 0) {
      out.push({ id: uid(), type: "fill", prompt: blanked, answer: kw, context: sentence });
    } else if (type === 1) {
      // True/False — half the time, swap the keyword with a distractor to make it false
      const flip = Math.random() < 0.5;
      const distractor = distractorPool.find((d) => d.toLowerCase() !== kw.toLowerCase());
      const altered = flip && distractor
        ? sentence.replace(new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`), distractor)
        : sentence;
      out.push({
        id: uid(),
        type: "tf",
        prompt: altered,
        answer: !flip || !distractor,
        context: sentence,
      });
    } else {
      const distractors = shuffle(distractorPool.filter((d) => d.toLowerCase() !== kw.toLowerCase())).slice(0, 3);
      if (distractors.length < 3) {
        out.push({ id: uid(), type: "fill", prompt: blanked, answer: kw, context: sentence });
        continue;
      }
      const options = shuffle([kw, ...distractors]);
      out.push({
        id: uid(),
        type: "mcq",
        prompt: blanked,
        options,
        answerIndex: options.findIndex((o) => o.toLowerCase() === kw.toLowerCase()),
        context: sentence,
      });
    }
  }

  return out;
}
