import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Brain, 
  Target, 
  Moon, 
  Zap, 
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import NeonButton from "./NeonButton";

interface DemoTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export default function DemoTour({ open, onOpenChange, onComplete }: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const tourSteps = [
    {
      icon: Brain,
      title: "AI-Powered Stress Detection",
      description: "NeuroAura uses advanced AI to monitor your stress levels in real-time. Our algorithms analyze behavioral patterns to predict stress before it peaks.",
      color: "bg-primary/10 border border-primary/20 text-primary",
      demo: "stress-meter",
    },
    {
      icon: Target,
      title: "Focus Mode",
      description: "Boost your productivity with smart focus sessions. We block distractions and guide you through proven concentration techniques.",
      color: "bg-primary/10 border border-primary/20 text-primary",
      demo: "focus-timer",
    },
    {
      icon: Moon,
      title: "Sleep Optimization",
      description: "Track your sleep quality and receive personalized recommendations to improve your rest and recovery.",
      color: "bg-primary/10 border border-primary/20 text-primary",
      demo: "sleep-tracker",
    },
    {
      icon: Zap,
      title: "Energy Management",
      description: "Monitor your energy levels throughout the day. Get suggestions for breaks and activities to maintain optimal performance.",
      color: "bg-stress-rising/10 border border-stress-rising/20 text-stress-rising",
      demo: "energy-boost",
    },
    {
      icon: Shield,
      title: "24/7 AI Guardian",
      description: "Your personal AI wellness companion is always watching over you, ready to intervene when stress levels rise.",
      color: "bg-stress-balanced/10 border border-stress-balanced/20 text-stress-balanced",
      demo: "guardian",
    },
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-background border border-border max-w-2xl p-0">
        {/* Progress bar */}
        <div className="h-1 bg-muted/30">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Skip button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip Tour
            </button>
          </div>

          {/* Content */}
          <div
            className={cn(
              "transition-all duration-300",
              isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
            )}
          >
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div
                className={cn(
                  "w-24 h-24 rounded-xl flex items-center justify-center",
                  step.color
                )}
              >
                <Icon className="w-12 h-12" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center mb-8">
              <h2 className="font-orbitron text-2xl font-bold mb-4 text-gradient">
                {step.title}
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                {step.description}
              </p>
            </div>

            {/* Demo visualization */}
            <div className="h-32 flex items-center justify-center mb-8">
              {step.demo === "stress-meter" && (
                <div className="flex items-end gap-2">
                  {[20, 35, 45, 60, 40, 25, 30].map((height, i) => (
                    <div
                      key={i}
                      className="w-6 rounded-t bg-primary/70"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              )}
              {step.demo === "focus-timer" && (
                <div className="w-32 h-32 rounded-full border-4 border-primary/40 flex items-center justify-center">
                  <span className="font-orbitron text-2xl text-primary">25:00</span>
                </div>
              )}
              {step.demo === "sleep-tracker" && (
                <div className="flex items-center gap-4">
                  <Moon className="w-12 h-12 text-primary" />
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-primary/50 rounded-full" />
                    <div className="h-2 w-24 bg-primary/30 rounded-full" />
                    <div className="h-2 w-28 bg-primary/40 rounded-full" />
                  </div>
                </div>
              )}
              {step.demo === "energy-boost" && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Zap
                      key={i}
                      className={cn(
                        "w-8 h-8 transition-all",
                        i < 4 ? "text-amber-400" : "text-muted-foreground/30"
                      )}
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              )}
              {step.demo === "guardian" && (
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-stress-balanced/20 border border-stress-balanced/40" />
                </div>
              )}
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentStep ? "w-8 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-center">
              <NeonButton onClick={handleNext} size="lg" className="px-8">
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Start Exploring
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </NeonButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
