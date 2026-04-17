import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpeg";
import hero2 from "@/assets/hero-2.jpeg";
import hero3 from "@/assets/hero-3.jpeg";
import hero4 from "@/assets/hero-4.jpeg";

const slides = [heroBg, hero2, hero3, hero4];

export function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out"
            style={{
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? "translateX(0)" : i < idx ? "translateX(-100%)" : "translateX(100%)",
              transition: "opacity 1s ease-in-out, transform 1.2s ease-out",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand/85 via-brand/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-32 md:py-44">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-brand/40 px-4 py-2 text-xs font-semibold text-gold backdrop-blur">
            ✦ AI-Powered Learning Platform
          </span>
          <h1 className="mt-8 font-display text-6xl font-bold leading-tight text-gold md:text-7xl">
            Study Smarter.<br />Test Adaptively.<br />Interview Ready.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-foreground/90">
            GMNoteBook combines intelligent note-taking, adaptive assessments, and AI mock interviews — helping you go from understanding concepts to acing exams and landing jobs.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-bold text-gold-foreground transition hover:brightness-95">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="inline-flex items-center rounded-lg border border-brand-foreground/40 px-6 py-3 font-semibold text-brand-foreground transition hover:bg-brand-foreground/10">
              See How It Works
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-gold" : "w-4 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
