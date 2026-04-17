import { useState, useMemo } from "react";
import { X, Brain, Check, ChevronRight, RefreshCw, Trophy } from "lucide-react";
import { generateQuiz, type QuizQuestion } from "@/lib/quizGenerator";

export function NoteQuizModal({ html, title, onClose }: { html: string; title: string; onClose: () => void }) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateQuiz(html, 8), [html, seed]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const q = questions[idx];
  const total = questions.length;

  const score = useMemo(() => {
    let s = 0;
    for (const qq of questions) {
      const a = answers[qq.id];
      if (qq.type === "fill" && typeof a === "string" && a.trim().toLowerCase() === qq.answer.toLowerCase()) s++;
      if (qq.type === "tf" && typeof a === "boolean" && a === qq.answer) s++;
      if (qq.type === "mcq" && typeof a === "number" && a === qq.answerIndex) s++;
    }
    return s;
  }, [answers, questions]);

  const setAnswer = (val: string | number | boolean) => setAnswers((p) => ({ ...p, [q.id]: val }));
  const next = () => (idx < total - 1 ? setIdx(idx + 1) : setSubmitted(true));
  const restart = () => { setSeed((s) => s + 1); setIdx(0); setAnswers({}); setSubmitted(false); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border bg-brand p-4 text-brand-foreground">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-gold" />
            <div>
              <h3 className="font-display text-lg font-bold leading-tight">Quiz: {title || "Untitled"}</h3>
              <p className="text-xs opacity-80">Auto-generated from your note content</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-white/10"><X className="h-5 w-5" /></button>
        </div>

        {total === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">Not enough content in this note to generate a quiz. Add a few more sentences and try again.</p>
            <button onClick={onClose} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Close</button>
          </div>
        ) : submitted ? (
          <ResultView score={score} total={total} questions={questions} answers={answers} onRestart={restart} onClose={onClose} />
        ) : (
          <>
            <div className="border-b border-border bg-soft px-5 py-2 text-xs">
              <div className="mb-1 flex justify-between text-muted-foreground">
                <span>Question {idx + 1} of {total}</span>
                <span className="uppercase tracking-wider">{q.type === "fill" ? "Fill in the blank" : q.type === "tf" ? "True / False" : "Multiple choice"}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-border">
                <div className="h-full bg-gold transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <p className="mb-6 text-lg font-medium leading-relaxed">{q.prompt}</p>
              <QuestionInput q={q} value={answers[q.id]} onChange={setAnswer} />
            </div>

            <div className="flex items-center justify-between border-t border-border p-4">
              <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button
                onClick={next}
                disabled={answers[q.id] === undefined}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground transition hover:brightness-110 disabled:opacity-40"
              >
                {idx === total - 1 ? "Submit" : "Next"} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function QuestionInput({ q, value, onChange }: { q: QuizQuestion; value: string | number | boolean | undefined; onChange: (v: string | number | boolean) => void }) {
  if (q.type === "fill") {
    return (
      <input
        autoFocus
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer…"
        className="w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-base outline-none focus:border-gold"
      />
    );
  }
  if (q.type === "tf") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            onClick={() => onChange(v)}
            className={`rounded-lg border-2 py-4 text-sm font-semibold transition ${
              value === v ? "border-gold bg-gold/15 text-gold" : "border-border hover:bg-soft"
            }`}
          >
            {v ? "True" : "False"}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {q.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left text-sm transition ${
            value === i ? "border-gold bg-gold/15" : "border-border hover:bg-soft"
          }`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${value === i ? "border-gold bg-gold text-gold-foreground" : "border-border"}`}>
            {String.fromCharCode(65 + i)}
          </span>
          {opt}
        </button>
      ))}
    </div>
  );
}

function ResultView({ score, total, questions, answers, onRestart, onClose }: {
  score: number; total: number; questions: QuizQuestion[]; answers: Record<string, string | number | boolean>;
  onRestart: () => void; onClose: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 80 ? "Excellent!" : pct >= 60 ? "Good work" : pct >= 40 ? "Keep practising" : "Review the note";
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border bg-soft p-6 text-center">
        <Trophy className="mx-auto h-12 w-12 text-gold" />
        <h3 className="mt-3 font-display text-3xl font-bold">{score} / {total}</h3>
        <p className="text-sm text-muted-foreground">{grade} — {pct}%</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {questions.map((q, i) => {
          const a = answers[q.id];
          const correct =
            q.type === "fill" ? typeof a === "string" && a.trim().toLowerCase() === q.answer.toLowerCase() :
            q.type === "tf" ? a === q.answer :
            a === q.answerIndex;
          const correctText = q.type === "fill" ? q.answer : q.type === "tf" ? (q.answer ? "True" : "False") : q.options[q.answerIndex];
          return (
            <div key={q.id} className={`rounded-lg border p-3 text-sm ${correct ? "border-emerald-300 bg-emerald-50" : "border-destructive/40 bg-destructive/5"}`}>
              <div className="flex items-start gap-2">
                {correct ? <Check className="mt-0.5 h-4 w-4 text-emerald-600" /> : <X className="mt-0.5 h-4 w-4 text-destructive" />}
                <div className="flex-1">
                  <p className="font-medium">{i + 1}. {q.prompt}</p>
                  {!correct && <p className="mt-1 text-xs text-muted-foreground">Correct answer: <b>{correctText}</b></p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-border p-4">
        <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm">Close</button>
        <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground hover:brightness-110">
          <RefreshCw className="h-4 w-4" /> New Quiz
        </button>
      </div>
    </div>
  );
}
