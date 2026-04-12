import { BookOpen, Brain, Mic, TrendingUp, Target, BarChart3 } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Smart Note-Taking",
    description: "Create and organize notes with AI-powered summaries, highlights, and contextual suggestions that help you retain more.",
  },
  {
    icon: Brain,
    title: "Adaptive Assessments",
    description: "Take tests that dynamically adjust difficulty based on your performance, zeroing in on gaps in your knowledge.",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    description: "Build real-world confidence with AI-driven demo interviews that simulate actual job scenarios and give instant feedback.",
  },
  {
    icon: TrendingUp,
    title: "Personalized Learning Paths",
    description: "Get tailored recommendations for content and practice based on your unique strengths and improvement areas.",
  },
  {
    icon: Target,
    title: "Goal-Oriented Progress",
    description: "Set learning goals, track milestones, and see clear progress toward exam readiness or career preparation.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Understand your learning patterns with detailed performance dashboards across topics, tests, and interviews.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block text-xs font-bold text-secondary tracking-widest uppercase mb-3 px-3 py-1 rounded-full border border-secondary/20">
            Core Features
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 mb-4">
            One Platform, Complete Preparation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From note-taking to interview mastery — GMNoteBook adapts to every stage of your learning journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl nav-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
