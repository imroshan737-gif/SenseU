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
import heroAsset from "@/assets/senseu-hero-neural.png.asset.json";
import DemoPreview from "@/components/DemoPreview";
import { PrivacyModal, TermsModal, ContactModal } from "@/components/FooterModals";
import { useState, useEffect, useRef } from "react";

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
    },
    {
      icon: Target,
      title: "Focus Enhancement",
      description: "Smart study sessions with concentration techniques and distraction blocking.",
    },
    {
      icon: Moon,
      title: "Sleep Optimization",
      description: "Track and improve your sleep quality for better cognitive performance.",
    },
    {
      icon: Zap,
      title: "Energy Management",
      description: "Monitor energy levels and get personalized break recommendations.",
    },
    {
      icon: Shield,
      title: "Mental Health Shield",
      description: "Proactive intervention system that detects early warning signs.",
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Understand your emotional patterns and build resilience over time.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Take Assessment",
      description:
        "Complete a quick stress assessment to establish your baseline and get personalized insights.",
      icon: Brain,
    },
    {
      step: "02",
      title: "Get AI Insights",
      description:
        "Our AI analyzes your patterns and provides real-time recommendations tailored to you.",
      icon: Activity,
    },
    {
      step: "03",
      title: "Improve Daily",
      description:
        "Follow guided sessions, track progress, and watch your wellness score improve over time.",
      icon: Target,
    },
  ];

  const stats = [
    { value: "40%", label: "Stress Reduction" },
    { value: "2x", label: "Focus Boost" },
    { value: "85%", label: "Better Sleep" },
    { value: "24/7", label: "AI Support" },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-sage-bg text-sage-text">
      {/* Hero — neural image as background, pre-login only */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroAsset.url}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[72%_35%]"
          />
          {/* Legibility gradients — text side falls to solid #070A09 */}
          <div className="absolute inset-0 bg-gradient-to-r from-sage-bg via-sage-bg/85 to-transparent" />
          <div className="absolute inset-0 bg-sage-bg/45 lg:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-sage-bg" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sage-bg/80 to-transparent" />
        </div>

        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300 ease-out ${
            navVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-[1160px] items-center justify-between border-b border-sage-line/60 px-6 py-4 lg:px-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-sage-line bg-sage-card">
                <div className="h-2 w-2 rounded-full bg-sage-accent" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-sage-text">
                NeuroAura
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate("/auth?mode=login")}
                className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-sage-muted transition-colors duration-200 hover:text-sage-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-accent/60"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="flex h-9 items-center gap-2 rounded-[10px] bg-sage-accent px-4 text-sm font-semibold text-sage-bg transition-colors duration-200 hover:bg-sage-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-accent/60"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero content — asymmetric 2-column */}
        <div className="mx-auto grid min-h-[92svh] w-full max-w-[1160px] items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-36">
          <div className="max-w-[600px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-line-strong bg-sage-card/70 px-3.5 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sage-accent" />
              <span className="text-[12.5px] font-medium text-sage-muted">
                AI-Powered Wellness Platform
              </span>
            </div>

            <h1 className="mt-7 font-exo text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.03em] text-sage-text sm:text-5xl lg:text-[3.5rem]">
              Your mental wellness{" "}
              <span className="text-sage-accent">guardian, always on.</span>
            </h1>

            <p className="mt-6 max-w-[520px] text-base leading-[1.7] text-sage-muted sm:text-[17px]">
              An intelligent platform that predicts stress, prevents burnout, and helps students
              achieve peak performance — powered by advanced AI.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="group inline-flex h-12 items-center justify-center rounded-[10px] bg-sage-accent px-6 text-[15px] font-semibold text-sage-bg transition-colors duration-200 hover:bg-sage-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-accent/60"
              >
                Begin Your Journey
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => setShowDemoTour(true)}
                className="inline-flex h-12 items-center justify-center rounded-[10px] border border-sage-line-strong bg-sage-bg/40 px-6 text-[15px] font-medium text-sage-text transition-colors duration-200 hover:bg-sage-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-accent/60"
              >
                <Sparkles className="mr-2 w-4 h-4 text-sage-accent" />
                Explore Demo
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={scrollToFeatures}
          aria-label="Scroll to features"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 text-sage-muted/50 transition-colors duration-200 hover:text-sage-muted"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </section>

      {/* Stats */}
      <section className="relative px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1160px] grid-cols-2 gap-y-8 border-t border-sage-line py-12 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-exo text-[28px] font-semibold tracking-[-0.02em] text-sage-text">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[11.5px] font-medium uppercase tracking-[0.08em] text-sage-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features — editorial hierarchy */}
      <section ref={featuresRef} className="relative bg-sage-section px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1160px]">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-line bg-sage-card px-3 py-1">
              <BarChart3 className="w-3 h-3 text-sage-accent" />
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-sage-muted">
                Features
              </span>
            </div>
            <h2 className="mt-6 font-exo text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-sage-text sm:text-[38px]">
              Intelligent features, quietly working
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-sage-muted">
              Cutting-edge AI designed for student mental wellness — precise, private, and always
              attentive.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {/* Featured card */}
            <div className="group rounded-2xl border border-sage-line bg-sage-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-sage-accent/40 sm:col-span-2 lg:col-span-3 lg:row-span-2 lg:p-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sage-line bg-sage-surface">
                <Brain className="h-5 w-5 text-sage-accent" />
              </div>
              <h3 className="mt-6 font-exo text-xl font-semibold tracking-[-0.02em] text-sage-text lg:text-[22px]">
                AI Stress Detection
              </h3>
              <p className="mt-3 max-w-[420px] text-[15px] leading-[1.7] text-sage-muted">
                Real-time stress monitoring with predictive analytics to prevent burnout before it
                happens.
              </p>
            </div>

            {/* Supporting cards */}
            {features.slice(1).map((feature, i) => (
              <div
                key={feature.title}
                className={`group rounded-2xl border border-sage-line bg-sage-card p-7 transition-all duration-200 hover:-translate-y-1 hover:border-sage-accent/40 ${
                  i < 2 ? "lg:col-span-3" : "lg:col-span-2"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sage-line bg-sage-surface">
                  <feature.icon className="h-[18px] w-[18px] text-sage-accent" />
                </div>
                <h3 className="mt-5 font-exo text-[16.5px] font-semibold tracking-[-0.02em] text-sage-text">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-sage-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1160px]">
          <div className="max-w-[620px]">
            <h2 className="font-exo text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-sage-text sm:text-[38px]">
              How it works
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-sage-muted">
              Three simple steps to transform your mental wellness.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative border-t border-sage-line pt-7">
                <div className="flex items-center gap-3">
                  <span className="font-exo text-[12px] font-semibold tracking-[0.1em] text-sage-accent">
                    {item.step}
                  </span>
                  <span className="h-px flex-1 bg-sage-line" />
                  <item.icon className="h-4 w-4 text-sage-muted" />
                </div>
                <h3 className="mt-4 font-exo text-[17px] font-semibold tracking-[-0.02em] text-sage-text">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-sage-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 pb-24 pt-4 lg:px-10">
        <div className="mx-auto max-w-[1160px]">
          <div className="rounded-2xl border border-sage-line bg-sage-card px-8 py-12 text-center sm:px-14">
            <h2 className="mx-auto max-w-[520px] font-exo text-[26px] font-semibold leading-[1.18] tracking-[-0.03em] text-sage-text sm:text-[32px]">
              Ready to transform your wellness?
            </h2>
            <p className="mx-auto mt-4 max-w-[440px] text-[15px] leading-[1.7] text-sage-muted">
              Join students who have taken control of their mental health with NeuroAura.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="inline-flex h-12 items-center justify-center rounded-[10px] bg-sage-accent px-6 text-[15px] font-semibold text-sage-bg transition-colors duration-200 hover:bg-sage-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-accent/60"
              >
                Get Started Free
              </button>
              <button
                onClick={() => setShowDemoTour(true)}
                className="inline-flex h-12 items-center justify-center rounded-[10px] border border-sage-line-strong bg-transparent px-6 text-[15px] font-medium text-sage-text transition-colors duration-200 hover:bg-sage-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-accent/60"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-sage-line px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-sage-line bg-sage-card">
              <div className="h-1.5 w-1.5 rounded-full bg-sage-accent" />
            </div>
            <span className="text-[13px] text-sage-muted">
              <span className="font-semibold text-sage-text">NeuroAura</span> — Made to help
              students thrive
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-[13px] text-sage-muted transition-colors duration-200 hover:text-sage-text"
            >
              Privacy
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="text-[13px] text-sage-muted transition-colors duration-200 hover:text-sage-text"
            >
              Terms
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="text-[13px] text-sage-muted transition-colors duration-200 hover:text-sage-text"
            >
              Contact
            </button>
          </div>
          <div className="text-[11px] tracking-[0.08em] text-sage-muted/50">v2.0.1</div>
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
