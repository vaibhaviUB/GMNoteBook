import { BookOpen, Brain, Mic, TrendingUp, Target, BarChart3 } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Smart Note-Taking", desc: "Create and organize notes with AI-powered summaries, highlights, and contextual suggestions that help you retain more." },
  { icon: Brain, title: "Adaptive Assessments", desc: "Take tests that dynamically adjust difficulty based on your performance, zeroing in on gaps in your knowledge." },
  { icon: Mic, title: "Mock Interviews", desc: "Build real-world confidence with AI-driven demo interviews that simulate actual job scenarios and give instant feedback." },
  { icon: TrendingUp, title: "Personalized Learning Paths", desc: "Get a tailored study plan that adapts to your pace, strengths, and target career goals." },
  { icon: Target, title: "Goal-Oriented Progress", desc: "Set milestones and track your journey from learning concepts to mastering interview-ready skills." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Visualize your performance with detailed insights into strengths, weaknesses, and improvement areas." },
];

export function Features() {
  return (
    <section id="features" className="bg-soft py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-gold/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold">
            Core Features
          </span>
          <h2 className="mt-6 font-display text-5xl font-bold text-foreground">One Platform, Complete Preparation</h2>
          <p className="mt-4 text-muted-foreground">
            From note-taking to interview mastery — GMNoteBook adapts to every stage of your learning journey.
          </p>
        </div>
        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-card p-8 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-gold">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
