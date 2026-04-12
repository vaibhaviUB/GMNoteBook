import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center nav-bg rounded-3xl p-12 md:p-20 shadow-elevated relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-secondary/5" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-secondary/5" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gold mb-4">
            Your Learning Journey Starts Here
          </h2>
          <p className="text-primary-foreground/60 mb-10 max-w-md mx-auto">
            Join students who are already studying smarter, testing adaptively, and interviewing with confidence.
          </p>
          <Link
            to="/signup"
            className="gradient-gold text-secondary-foreground font-semibold px-10 py-4 rounded-lg shadow-elevated hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
