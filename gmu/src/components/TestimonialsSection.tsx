import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Computer Science Student",
    quote: "The adaptive tests pinpointed exactly where I was weak. I improved my exam scores by 30% in just two months!",
  },
  {
    name: "Rahul Verma",
    role: "MBA Aspirant",
    quote: "Mock interviews on GMNoteBook gave me the confidence I needed. I cleared my first real interview with flying colors.",
  },
  {
    name: "Ananya Patel",
    role: "Engineering Graduate",
    quote: "Smart notes saved me hours of study time. The AI summaries are incredibly accurate and useful during revision.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-secondary tracking-widest uppercase mb-3 px-3 py-1 rounded-full border border-secondary/20">
            Student Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 mb-4">
            Loved by Learners
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="text-sm font-bold text-card-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
