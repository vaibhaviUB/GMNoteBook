import { FileText, BarChart3, Award } from "lucide-react";

const steps = [
  { n: "01", icon: FileText, title: "Create & Organize Notes", desc: "Upload or write your study material. AI auto-generates summaries, flashcards, and key takeaways." },
  { n: "02", icon: BarChart3, title: "Take Adaptive Tests", desc: "Assess your knowledge with tests that adjust in real-time. Get instant feedback on what to study next." },
  { n: "03", icon: Award, title: "Practice & Get Hired", desc: "Sharpen your skills with mock interviews and personalized learning paths until you're truly job-ready." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-gold/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold">
            How It Works
          </span>
          <h2 className="mt-6 font-display text-5xl font-bold text-foreground">Three Steps to Mastery</h2>
          <p className="mt-4 text-muted-foreground">A simple yet powerful workflow that takes you from notes to career readiness.</p>
        </div>
        <div className="relative mt-16 grid gap-12 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-gold">
                  <s.icon className="h-10 w-10" />
                </div>
                <span className="absolute -right-2 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs font-bold text-gold-foreground">
                  {s.n}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-[60%] top-12 hidden h-px w-[80%] bg-gold/40 md:block" />
              )}
              <h3 className="mt-8 text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
