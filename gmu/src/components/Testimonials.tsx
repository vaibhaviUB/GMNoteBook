import { Star } from "lucide-react";

const items = [
  { quote: "The adaptive tests pinpointed exactly where I was weak. I improved my exam scores by 30% in just two months!", name: "Priya Sharma", role: "Computer Science Student" },
  { quote: "Mock interviews on GMNoteBook gave me the confidence I needed. I cleared my first real interview with flying colors.", name: "Rahul Verma", role: "MBA Aspirant" },
  { quote: "Smart notes saved me hours of study time. The AI summaries are incredibly accurate and useful during revision.", name: "Ananya Patel", role: "Engineering Graduate" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-soft py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-gold/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold">
            Student Stories
          </span>
          <h2 className="mt-6 font-display text-5xl font-bold text-foreground">Loved by Learners</h2>
        </div>
        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {items.map((t) => (
            <div key={t.name} className="rounded-2xl bg-card p-8 shadow-sm">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-gold" />)}
              </div>
              <p className="mt-5 italic leading-relaxed text-foreground/80">"{t.quote}"</p>
              <div className="mt-8">
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
