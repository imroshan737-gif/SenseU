import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import NeonButton from "./NeonButton";

interface SessionGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionType: "breathe" | "focus" | "rest";
  title: string;
  duration: number; // in seconds
  onComplete?: () => void;
}

export default function SessionGuide({ 
  open, 
  onOpenChange, 
  sessionType, 
  title, 
  duration,
  onComplete 
}: SessionGuideProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const breathingSteps = [
    { instruction: "Breathe In", duration: 4, color: "from-cyan-500 to-blue-500", voice: "Breathe in slowly" },
    { instruction: "Hold", duration: 4, color: "from-blue-500 to-violet-500", voice: "Hold your breath" },
    { instruction: "Breathe Out", duration: 6, color: "from-violet-500 to-purple-500", voice: "Breathe out slowly" },
    { instruction: "Rest", duration: 2, color: "from-purple-500 to-cyan-500", voice: "Rest" },
  ];

  const focusSteps = [
    { instruction: "Close Your Eyes", duration: 10, color: "from-violet-500 to-purple-500", voice: "Close your eyes and relax" },
    { instruction: "Set Your Intention", duration: 10, color: "from-purple-500 to-pink-500", voice: "Set your intention for this session" },
    { instruction: "Focus Mode Active", duration: Math.max(duration - 20, 30), color: "from-cyan-500 to-blue-500", voice: "Focus mode is now active. Stay present." },
  ];

  const restSteps = [
    { instruction: "Close Your Eyes", duration: 5, color: "from-indigo-500 to-violet-500", voice: "Close your eyes gently" },
    { instruction: "Relax Your Body", duration: 10, color: "from-violet-500 to-purple-500", voice: "Let go of all tension in your body" },
    { instruction: "Deep Rest Mode", duration: Math.max(duration - 15, 30), color: "from-purple-500 to-indigo-500", voice: "Enter deep rest. Let your mind be still." },
  ];

  const steps = sessionType === "breathe" ? breathingSteps : sessionType === "focus" ? focusSteps : restSteps;

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Speak instruction
  const speakInstruction = useCallback((text: string) => {
    if (!synthRef.current || isMuted) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75; // Slower for soothing effect
    utterance.pitch = 1.1; // Slightly higher for softer feminine tone
    utterance.volume = 0.7; // Softer volume
    
    // Try to use a soft female voice - prioritize known gentle voices
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || // Apple's gentle female voice
      v.name.includes("Victoria") ||
      v.name.includes("Karen") ||
      v.name.includes("Moira") ||
      v.name.includes("Fiona") ||
      v.name.includes("Tessa") ||
      v.name.includes("Veena") ||
      (v.name.includes("Female") && v.lang.startsWith("en")) ||
      (v.name.includes("Google") && v.name.includes("Female")) ||
      v.name.includes("Zira") || // Microsoft's female voice
      v.name.includes("Hazel") ||
      v.name.includes("Susan")
    ) || voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    synthRef.current.speak(utterance);
  }, [isMuted]);

  // Always reset to beginning when opening
  useEffect(() => {
    if (open) {
      setTimeLeft(duration);
      setIsRunning(false);
      setCurrentStep(0);
      setIsComplete(false);
      setHasStarted(false);
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    }
  }, [open, duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsComplete(true);
      speakInstruction("Well done. You've completed the session.");
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, speakInstruction]);

  // Track step changes and speak instructions
  const prevStepRef = useRef(currentStep);
  
  useEffect(() => {
    if (sessionType === "breathe" && isRunning) {
      const totalCycle = breathingSteps.reduce((sum, s) => sum + s.duration, 0);
      const elapsed = duration - timeLeft;
      const cyclePosition = elapsed % totalCycle;
      
      let accumulated = 0;
      for (let i = 0; i < breathingSteps.length; i++) {
        accumulated += breathingSteps[i].duration;
        if (cyclePosition < accumulated) {
          if (i !== prevStepRef.current) {
            setCurrentStep(i);
            speakInstruction(breathingSteps[i].voice);
            prevStepRef.current = i;
          }
          break;
        }
      }
    } else if (isRunning) {
      // For focus/rest sessions
      let accumulated = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulated += steps[i].duration;
        const elapsed = duration - timeLeft;
        if (elapsed < accumulated) {
          if (i !== prevStepRef.current) {
            setCurrentStep(i);
            speakInstruction(steps[i].voice);
            prevStepRef.current = i;
          }
          break;
        }
      }
    }
  }, [timeLeft, isRunning, sessionType, duration, speakInstruction, steps]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const currentStepData = steps[currentStep] || steps[0];

  const handleStart = () => {
    // Always start fresh
    setTimeLeft(duration);
    setCurrentStep(0);
    setIsComplete(false);
    setHasStarted(true);
    setIsRunning(true);
    prevStepRef.current = -1;
    
    // Speak initial instruction
    speakInstruction(steps[0].voice);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleComplete = () => {
    onOpenChange(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-primary/20 max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-xl text-gradient">{title}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 flex flex-col items-center">
          {isComplete ? (
            // Completion State
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-orbitron font-bold text-gradient">Well Done!</h3>
                <p className="text-muted-foreground mt-2">You've completed the session</p>
              </div>
              <NeonButton onClick={handleComplete} size="lg">
                Continue
              </NeonButton>
            </div>
          ) : (
            <>
              {/* Animated Circle */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer ring progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="hsl(var(--muted)/0.3)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner breathing circle */}
                <div
                  className={cn(
                    "w-48 h-48 rounded-full flex flex-col items-center justify-center",
                    "bg-gradient-to-br transition-all duration-1000",
                    currentStepData.color
                  )}
                  style={{
                    transform: sessionType === "breathe" && isRunning 
                      ? currentStep === 0 ? "scale(1.1)" : currentStep === 2 ? "scale(0.9)" : "scale(1)"
                      : "scale(1)",
                  }}
                >
                  <span className="font-orbitron text-4xl font-bold text-white drop-shadow-lg">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm text-white/80 mt-2 font-medium">
                    {currentStepData.instruction}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  {sessionType === "breathe" && "Follow the rhythm. Breathe deeply and calmly."}
                  {sessionType === "focus" && "Block out distractions. Stay present."}
                  {sessionType === "rest" && "Let go of tension. Allow yourself to relax."}
                </p>
                {!isMuted && (
                  <p className="text-xs text-primary mt-2">🔊 Voice guidance enabled</p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-8">
                {hasStarted && (
                  <button
                    onClick={handleStart}
                    className="p-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
                    title="Restart"
                  >
                    <RotateCcw className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
                <NeonButton
                  onClick={isRunning ? handlePause : handleStart}
                  size="lg"
                  className="px-8"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </NeonButton>
              </div>

              {/* Step indicators for breathing */}
              {sessionType === "breathe" && (
                <div className="flex items-center gap-2 mt-6">
                  {breathingSteps.map((step, index) => (
                    <div
                      key={step.instruction}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentStep
                          ? "w-8 bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
