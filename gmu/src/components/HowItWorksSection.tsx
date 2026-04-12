import { FileText, BarChart3, Award } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Create & Organize Notes",
    description: "Upload or write your study material. AI auto-generates summaries, flashcards, and key takeaways.",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Take Adaptive Tests",
    description: "Assess your knowledge with tests that adjust in real-time. Get instant feedback on what to study next.",
  },
  {
    icon: Award,
    step: "03",
    title: "Practice & Get Hired",
    description: "Sharpen your skills with mock interviews and personalized learning paths until you're truly job-ready.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-secondary tracking-widest uppercase mb-3 px-3 py-1 rounded-full border border-secondary/20">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 mb-4">
            Three Steps to Mastery
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A simple yet powerful workflow that takes you from notes to career readiness.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-secondary/40 to-transparent" />
              )}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full nav-bg mb-6 relative">
                <s.icon className="w-8 h-8 text-gold" />
                <span className="absolute -top-1 -right-1 text-[10px] font-bold text-secondary-foreground gradient-gold w-6 h-6 rounded-full flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
