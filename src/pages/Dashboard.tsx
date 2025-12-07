import { useState } from "react";
import { 
  Heart, 
  Brain, 
  Zap, 
  Moon, 
  Wind, 
  Target, 
  Leaf, 
  Users, 
  AlertTriangle,
  Settings,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import GlassCard from "@/components/GlassCard";
import StressAura from "@/components/StressAura";
import DigitalTwin from "@/components/DigitalTwin";
import VitalsTile from "@/components/VitalsTile";
import AIGuardianOrb from "@/components/AIGuardianOrb";
import InterventionCard from "@/components/InterventionCard";
import EmotionalTimeline from "@/components/EmotionalTimeline";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [stressLevel] = useState(35);
  const [showGuardianChat, setShowGuardianChat] = useState(false);

  const timelineData = [
    { time: "6AM", value: 20, event: "Morning routine" },
    { time: "8AM", value: 25 },
    { time: "10AM", value: 45, event: "Study session" },
    { time: "12PM", value: 35 },
    { time: "2PM", value: 55, event: "Exam prep" },
    { time: "4PM", value: 40 },
    { time: "6PM", value: 30, event: "Break time" },
    { time: "8PM", value: 35 },
  ];

  const getStressState = () => {
    if (stressLevel <= 20) return "calm";
    if (stressLevel <= 40) return "balanced";
    if (stressLevel <= 60) return "rising";
    if (stressLevel <= 80) return "high";
    return "critical";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />

      {/* Top Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/30">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary" />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-lg text-gradient">MindGuard</h1>
              <p className="text-xs text-muted-foreground">AI Wellness System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-xl border border-border/30">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground/50"
            />
          </div>
          <button className="relative p-2 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </button>
          <button className="p-2 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-sm font-orbitron text-primary">JD</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Vitals */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground mb-4">
              Live Vitals
            </h3>
            <VitalsTile
              title="Heart Rate"
              value={72}
              unit="BPM"
              icon={Heart}
              trend="stable"
              color="cyan"
            />
            <VitalsTile
              title="Stress Score"
              value={stressLevel}
              unit="%"
              icon={Brain}
              trend="down"
              color="violet"
            />
            <VitalsTile
              title="Focus Level"
              value={85}
              unit="%"
              icon={Target}
              trend="up"
              color="green"
            />
            <VitalsTile
              title="Energy Level"
              value={68}
              unit="%"
              icon={Zap}
              trend="stable"
              color="amber"
            />
            <VitalsTile
              title="Sleep Quality"
              value={7.5}
              unit="hrs"
              icon={Moon}
              trend="up"
              color="violet"
            />
          </div>

          {/* Center Panel - Digital Twin & Stress Aura */}
          <div className="col-span-12 lg:col-span-6">
            <GlassCard className="h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-visible">
              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-orbitron text-primary uppercase tracking-wider">
                  System Active
                </span>
              </div>

              {/* Main Visualization */}
              <div className="relative flex items-center justify-center">
                <StressAura level={stressLevel} size={320} />
                <div className="absolute">
                  <DigitalTwin stressLevel={stressLevel} />
                </div>
              </div>

              {/* AI Status */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Your current state is{" "}
                  <span className={cn(
                    "font-orbitron font-semibold",
                    stressLevel <= 40 ? "text-stress-calm" : stressLevel <= 60 ? "text-stress-rising" : "text-stress-high"
                  )}>
                    {getStressState().toUpperCase()}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  AI Guardian is monitoring 24/7
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-6">
                {["Breathe", "Focus", "Rest"].map((action) => (
                  <button
                    key={action}
                    className="px-4 py-2 rounded-lg bg-muted/30 border border-border/30 text-sm font-orbitron text-muted-foreground hover:text-primary hover:border-primary/30 transition-all hover:scale-105"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Panel - Interventions & Recommendations */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
                Interventions
              </h3>
              <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <InterventionCard
              title="Quick Breathe"
              description="30-second calming breath exercise"
              duration="30 sec"
              icon={Wind}
              type="micro"
            />
            <InterventionCard
              title="Deep Focus"
              description="Pomodoro timer with distractions blocked"
              duration="25 min"
              icon={Target}
              type="focus"
            />
            <InterventionCard
              title="Recovery Break"
              description="Guided relaxation session"
              duration="10 min"
              icon={Leaf}
              type="recovery"
            />
            <InterventionCard
              title="Connect"
              description="Check in with a study buddy"
              duration="5 min"
              icon={Users}
              type="social"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* Emotional Timeline */}
          <div className="col-span-12 lg:col-span-8">
            <GlassCard>
              <EmotionalTimeline data={timelineData} />
            </GlassCard>
          </div>

          {/* Emergency SOS */}
          <div className="col-span-12 lg:col-span-4">
            <InterventionCard
              title="Emergency SOS"
              description="Immediate AI crisis support with professional resources"
              duration="Instant"
              icon={AlertTriangle}
              type="emergency"
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Floating AI Guardian Orb */}
      <div className="fixed bottom-8 right-8 z-50">
        <AIGuardianOrb
          stressLevel={getStressState()}
          size="lg"
          onClick={() => setShowGuardianChat(!showGuardianChat)}
        />
      </div>

      {/* AI Chat Panel (hidden by default) */}
      {showGuardianChat && (
        <div className="fixed bottom-28 right-8 z-50 w-80 animate-scale-in">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
              <div>
                <h4 className="font-orbitron font-semibold text-sm">AI Guardian</h4>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              <div className="p-3 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  I notice your stress levels have been manageable today. Great work on that morning routine! Would you like a quick focus boost?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask your guardian..."
                className="flex-1 px-3 py-2 bg-muted/30 rounded-lg text-sm outline-none border border-border/30 focus:border-primary/50 transition-colors"
              />
              <button className="p-2 bg-primary/20 rounded-lg text-primary hover:bg-primary/30 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
