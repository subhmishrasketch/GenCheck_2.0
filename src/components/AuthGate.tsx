import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, UserPlus, Shield, Sparkles, Zap } from "lucide-react";

const AuthGate = () => {
  const navigate = useNavigate();

  return (
    <section id="upload-section" className="py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-card rounded-3xl border-2 border-dashed border-border p-12 text-center animate-scale-in relative overflow-hidden group">
          {/* Decorative gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="w-20 h-20 mx-auto mb-6 bg-secondary rounded-2xl flex items-center justify-center animate-float relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse-glow" />
            <Lock className="w-10 h-10 text-muted-foreground relative z-10" />
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2 animate-fade-up">
            Sign in to analyze documents
          </h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto animate-fade-up delay-100">
            Create a free account or sign in to upload and analyze your presentations for AI-generated content.
          </p>

          {/* Mini feature badges */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-up delay-200">
            {[
              { icon: Sparkles, label: "AI Detection" },
              { icon: Shield, label: "Secure" },
              { icon: Zap, label: "Instant" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <item.icon className="w-3.5 h-3.5 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-300">
            <Button
              onClick={() => navigate("/auth")}
              className="btn-primary px-8"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              size="lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthGate;
