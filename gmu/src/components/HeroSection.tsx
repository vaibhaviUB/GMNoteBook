import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import campusHero from "@/assets/campus-hero.png";
import aiLearningBg from "@/assets/ai-learning-bg.png";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "engineering_block.jpeg",
    "ai_study_notes.png",
    "adaptive_assessment.png",
    aiLearningBg
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Carousel */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Background ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs font-medium text-gold">AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-gold leading-tight mb-6 tracking-tight">
            Study Smarter.<br />
            <span className="text-primary-foreground/90">Test Adaptively.</span><br />
            Interview Ready.
          </h1>

          <p className="text-base md:text-lg text-primary-foreground/70 leading-relaxed mb-10 max-w-lg">
            GMNoteBook combines intelligent note-taking, adaptive assessments, and AI mock interviews — helping you go from understanding concepts to acing exams and landing jobs.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="gradient-gold text-secondary-foreground font-semibold px-8 py-3.5 rounded-lg shadow-elevated hover:opacity-90 transition-opacity text-sm inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-primary-foreground/20 text-primary-foreground/80 font-semibold px-8 py-3.5 rounded-lg hover:border-secondary/40 hover:text-gold transition-colors text-sm"
            >
              See How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
