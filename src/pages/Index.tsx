import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Sparkles,
  Activity,
  Target,
  Moon,
  Zap,
  Shield,
  Heart,
  BarChart3,
  UserPlus,
  LogIn,
  ChevronDown,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import NeonButton from "@/components/NeonButton";
import DemoPreview from "@/components/DemoPreview";
import { PrivacyModal, TermsModal, ContactModal } from "@/components/FooterModals";
import { useState, useEffect, useRef, useCallback } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showDemoTour, setShowDemoTour] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      navigate("/auth?mode=signup");
    }
  }, [searchParams, navigate]);

  const handleDemoComplete = () => {
    setShowDemoTour(false);
    navigate("/dashboard?demo=true");
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Brain,
      title: "AI Stress Detection",
      description: "Real-time stress monitoring with predictive analytics to prevent burnout before it happens.",
      gradient: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/30",
      iconColor: "text-cyan-400",
    },
    {
      icon: Target,
      title: "Focus Enhancement",
      description: "Smart study sessions with concentration techniques and distraction blocking.",
      gradient: "from-violet-500/20 to-purple-500/20",
      border: "border-violet-500/30",
      iconColor: "text-violet-400",
    },
    {
      icon: Moon,
      title: "Sleep Optimization",
      description: "Track and improve your sleep quality for better cognitive performance.",
      gradient: "from-indigo-500/20 to-blue-500/20",
      border: "border-indigo-500/30",
      iconColor: "text-indigo-400",
    },
    {
      icon: Zap,
      title: "Energy Management",
      description: "Monitor energy levels and get personalized break recommendations.",
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/30",
      iconColor: "text-amber-400",
    },
    {
      icon: Shield,
      title: "Mental Health Shield",
      description: "Proactive intervention system that detects early warning signs.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
      iconColor: "text-emerald-400",
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Understand your emotional patterns and build resilience over time.",
      gradient: "from-rose-500/20 to-pink-500/20",
      border: "border-rose-500/30",
      iconColor: "text-rose-400",
    },
  ];

  const stats = [
    { value: "40%", label: "Stress Reduction" },
    { value: "2x", label: "Focus Boost" },
    { value: "85%", label: "Better Sleep" },
    { value: "24/7", label: "AI Support" },
  ];

  return (
    <div className="min-h-screen relative bg-background overflow-x-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/90" />
            </div>
            <span className="font-orbitron font-bold text-lg text-gradient">NeuroAura</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium rounded-lg hover:bg-muted/20"
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
        </div>
      </nav>

      {/* Hero Section - Full viewport */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/8 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary/90 tracking-wide">AI-Powered Wellness Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black leading-[0.95] tracking-tight">
            <span className="text-foreground">Your </span>
            <span className="text-gradient">Mental</span>
            <br />
            <span className="text-gradient">Wellness</span>
            <span className="text-foreground"> Guardian</span>
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            An intelligent platform that predicts stress, prevents burnout, and helps students 
            achieve peak performance — powered by advanced AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <NeonButton onClick={() => navigate("/auth?mode=signup")} size="lg" className="group text-base">
              <span className="flex items-center gap-2">
                Begin Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </NeonButton>
            <NeonButton variant="ghost" size="lg" onClick={() => setShowDemoTour(true)} className="text-base">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Demo
            </NeonButton>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-orbitron font-black text-gradient">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToFeatures}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/8 border border-secondary/20">
              <BarChart3 className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-medium text-secondary tracking-wide uppercase">Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-orbitron font-bold">
              <span className="text-gradient">Intelligent Features</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Experience cutting-edge AI technology designed for student mental wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl bg-background/50 border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-orbitron font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-orbitron font-bold">
              <span className="text-gradient">How It Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to transform your mental wellness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take Assessment",
                description: "Complete a quick stress assessment to establish your baseline and get personalized insights.",
                icon: Brain,
                color: "from-cyan-500 to-blue-500",
              },
              {
                step: "02",
                title: "Get AI Insights",
                description: "Our AI analyzes your patterns and provides real-time recommendations tailored to you.",
                icon: Activity,
                color: "from-violet-500 to-purple-500",
              },
              {
                step: "03",
                title: "Improve Daily",
                description: "Follow guided sessions, track progress, and watch your wellness score improve over time.",
                icon: Target,
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-flex mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} opacity-20 absolute inset-0 blur-xl group-hover:opacity-40 transition-opacity`} />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-card to-card border border-border/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-background font-orbitron font-bold text-xs flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-orbitron font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative text-center py-16 px-8">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
                Ready to Transform Your Wellness?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join students who have taken control of their mental health with NeuroAura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NeonButton onClick={() => navigate("/auth?mode=signup")} size="lg">
                  Get Started Free
                </NeonButton>
                <NeonButton variant="ghost" size="lg" onClick={() => setShowDemoTour(true)}>
                  Watch Demo
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-border/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="neon-text font-orbitron">NeuroAura</span> — Made to help students thrive
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowPrivacy(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</button>
            <button onClick={() => setShowTerms(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</button>
            <button onClick={() => setShowContact(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</button>
          </div>
          <div className="text-xs text-muted-foreground/50 font-orbitron">v2.0.1</div>
        </div>
      </footer>

      {/* Modals */}
      <DemoPreview open={showDemoTour} onOpenChange={setShowDemoTour} onComplete={handleDemoComplete} />
      <PrivacyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <ContactModal open={showContact} onOpenChange={setShowContact} />
    </div>
  );
};

export default Index;
