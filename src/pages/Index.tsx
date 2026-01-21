import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Activity, 
  Target,
  Moon,
  Zap,
  CheckCircle,
  UserPlus,
  LogIn
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import AIGuardianOrb from "@/components/AIGuardianOrb";
import DemoPreview from "@/components/DemoPreview";
import { PrivacyModal, TermsModal, ContactModal } from "@/components/FooterModals";
import { cn } from "@/lib/utils";
import { useState, memo, useEffect } from "react";

// Memoized feature card
const FeatureCard = memo(({ feature }: { feature: any }) => (
  <GlassCard
    className="group hover:scale-[1.01] transition-transform duration-300"
  >
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "p-3 rounded-xl",
          feature.color === "cyan"
            ? "bg-primary/10 border border-primary/30"
            : "bg-secondary/10 border border-secondary/30"
        )}
      >
        <feature.icon
          className={cn(
            "w-6 h-6",
            feature.color === "cyan" ? "text-primary" : "text-secondary"
          )}
        />
      </div>
      <div>
        <h3 className="text-lg font-orbitron font-semibold mb-2 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  </GlassCard>
));

FeatureCard.displayName = "FeatureCard";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showDemoTour, setShowDemoTour] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Check for signup param
  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      navigate("/auth?mode=signup");
    }
  }, [searchParams, navigate]);

  const features = [
    {
      icon: Brain,
      title: "AI Stress Detection",
      description: "Real-time stress monitoring with predictive analytics to prevent burnout",
      color: "cyan",
    },
    {
      icon: Target,
      title: "Focus Enhancement",
      description: "Smart study sessions with distraction blocking and concentration techniques",
      color: "violet",
    },
    {
      icon: Moon,
      title: "Sleep Optimization",
      description: "Track and improve your sleep quality for better cognitive performance",
      color: "cyan",
    },
    {
      icon: Zap,
      title: "Energy Management",
      description: "Monitor energy levels and get personalized break recommendations",
      color: "violet",
    },
  ];

  const benefits = [
    "Reduce stress by up to 40%",
    "Improve focus and concentration",
    "Better sleep quality",
    "Increase productivity",
    "Personalized wellness insights",
    "24/7 AI support",
  ];

  const handleShowDemo = () => {
    setShowDemoTour(true);
  };

  const handleDemoComplete = () => {
    setShowDemoTour(false);
    navigate("/dashboard?demo=true");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ParticleBackground />

      {/* Simplified ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/3 rounded-full blur-[100px]" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/30">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary" />
          </div>
          <span className="font-orbitron font-bold text-lg text-gradient">NeuroAura</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth?mode=login")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium border border-border/30 rounded-lg hover:border-primary/30"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </button>
          <NeonButton onClick={() => navigate("/auth?mode=signup")} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign Up</span>
            <span className="sm:hidden">Join</span>
          </NeonButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Floating orbs - hidden on mobile for performance */}
        <div className="absolute left-10 top-20 opacity-30 hidden xl:block">
          <AIGuardianOrb stressLevel="calm" size="sm" />
        </div>
        <div className="absolute right-20 top-40 opacity-40 hidden xl:block">
          <AIGuardianOrb stressLevel="balanced" size="md" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">SenseU</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold leading-tight">
            <span className="text-foreground">Your AI-Powered</span>
            <br />
            <span className="text-gradient neon-text">Mental Wellness</span>
            <br />
            <span className="text-foreground">Guardian</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A tool made to help students manage stress, improve focus, and achieve academic success. 
            Proactive AI that predicts and prevents burnout before it strikes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <NeonButton onClick={() => navigate("/auth?mode=signup")} size="lg" className="group">
              <span className="flex items-center gap-2">
                Begin Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </NeonButton>
            <NeonButton variant="ghost" size="lg" onClick={handleShowDemo}>
              <Sparkles className="w-5 h-5 mr-2" />
              Show Demo
            </NeonButton>
          </div>

          {/* Benefits list */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-left">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              <span className="text-gradient">Intelligent Features</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Experience the future of student wellness with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              <span className="text-gradient">How It Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get started in minutes and transform your mental wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take Assessment",
                description: "Complete a quick stress assessment to establish your baseline",
                icon: Brain,
              },
              {
                step: "02",
                title: "Get Insights",
                description: "Our AI analyzes your patterns and provides personalized recommendations",
                icon: Activity,
              },
              {
                step: "03",
                title: "Improve Daily",
                description: "Follow guided interventions and track your progress over time",
                icon: Target,
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-background font-orbitron font-bold text-sm flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-orbitron font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center py-12">
            <div className="inline-flex mb-6">
              <AIGuardianOrb stressLevel="calm" size="lg" />
            </div>
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-4">
              Ready to Transform Your Wellness?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of students who have taken control of their mental health with NeuroAura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeonButton onClick={() => navigate("/auth?mode=signup")} size="lg">
                Start Free Trial
              </NeonButton>
              <NeonButton variant="ghost" size="lg" onClick={handleShowDemo}>
                Watch Demo
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/30">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="neon-text font-orbitron">NeuroAura</span> — Made to help students thrive
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={() => setShowTerms(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </button>
            <button 
              onClick={() => setShowContact(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>
          <div className="text-xs text-muted-foreground/50 font-orbitron">v2.0.1</div>
        </div>
      </footer>

      {/* Demo Preview */}
      <DemoPreview 
        open={showDemoTour} 
        onOpenChange={setShowDemoTour}
        onComplete={handleDemoComplete}
      />

      {/* Footer Modals */}
      <PrivacyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <ContactModal open={showContact} onOpenChange={setShowContact} />
    </div>
  );
};

export default Index;
