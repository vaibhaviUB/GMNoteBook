import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import campusHero from "@/assets/campus-hero.png";
import aiLearningBg from "@/assets/ai-learning-bg.png";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "engineering_block.jpeg",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      {/* Background Carousel Container */}
      <div 
        className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: `translateX(-${currentImageIndex * 100}%)`
        }}
      >
        {images.map((img, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={img}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 hero-overlay" />

      {/* Carousel Indicators (Dots) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentImageIndex 
                ? "w-8 h-2.5 bg-gold" 
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

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
