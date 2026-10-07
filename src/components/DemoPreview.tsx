import { useState, useEffect, memo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Brain, 
  Target, 
  Moon, 
  Zap, 
  Heart,
  Bell,
  Settings,
  Search,
  Trophy,
  Leaf,
  Users,
  ChevronRight,
  TrendingUp,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import NeonButton from "./NeonButton";
import GlassCard from "./GlassCard";

interface DemoPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

// Simulated demo data
const demoData = {
  user: { name: "Sarah", initials: "SJ" },
  vitals: { stress: 35, focus: 78, energy: 65, sleep: 7.5 },
  timeline: [
    { time: "6AM", value: 20, event: "Morning routine" },
    { time: "8AM", value: 25 },
    { time: "10AM", value: 45, event: "Study session" },
    { time: "12PM", value: 35 },
    { time: "2PM", value: 55, event: "Exam prep" },
    { time: "4PM", value: 40 },
    { time: "Now", value: 35, event: "Break time" },
  ],
  notifications: 3,
  points: 1250,
};

const DemoPreview = memo(({ open, onOpenChange, onComplete }: DemoPreviewProps) => {
  const [animatedVitals, setAnimatedVitals] = useState({ stress: 0, focus: 0, energy: 0 });

  useEffect(() => {
    if (open) {
      // Animate vitals on open
      const timer = setTimeout(() => {
        setAnimatedVitals(demoData.vitals);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAnimatedVitals({ stress: 0, focus: 0, energy: 0 });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border border-border max-w-5xl p-0 overflow-hidden max-h-[90vh]">
        {/* Simulated Dashboard Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div className="text-left">
              <h1 className="font-orbitron font-bold text-sm text-foreground">NeuroAura</h1>
              <p className="text-[10px] text-muted-foreground">Demo Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded border border-amber-500/30">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-orbitron text-amber-400">{demoData.points}</span>
            </div>
            <div className="relative p-1.5 rounded-lg bg-muted/30 border border-border/30">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full text-[8px] flex items-center justify-center text-primary-foreground">{demoData.notifications}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-muted/30 border border-border/30">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-[10px] font-orbitron text-primary">{demoData.user.initials}</span>
            </div>
          </div>
        </div>

        {/* Demo Dashboard Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Panel - Vitals */}
            <div className="col-span-12 md:col-span-3 space-y-3">
              <h3 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">Live Vitals</h3>
              
              {/* Stress */}
              <div className="p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Stress</span>
                  </div>
                  <span className="text-sm font-orbitron text-primary">{animatedVitals.stress}%</span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${animatedVitals.stress}%` }}
                  />
                </div>
              </div>

              {/* Focus */}
              <div className="p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-muted-foreground">Focus</span>
                  </div>
                  <span className="text-sm font-orbitron text-emerald-400">{animatedVitals.focus}%</span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${animatedVitals.focus}%` }}
                  />
                </div>
              </div>

              {/* Energy */}
              <div className="p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-muted-foreground">Energy</span>
                  </div>
                  <span className="text-sm font-orbitron text-amber-400">{animatedVitals.energy}%</span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${animatedVitals.energy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Center - Main Display */}
            <div className="col-span-12 md:col-span-6">
                <div className="rounded-xl bg-card border border-border p-4 text-center min-h-[200px] flex flex-col items-center justify-center">
                {/* Animated Stress Orb */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border border-primary/30" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  Welcome back, <span className="text-primary font-semibold">{demoData.user.name}</span>!
                </p>
                <p className="text-xs text-muted-foreground">
                  Your current state is <span className="text-stress-calm font-orbitron">BALANCED</span>
                </p>

                <div className="flex gap-2 mt-4">
                  {["Breathe", "Focus", "Rest"].map((action) => (
                    <button
                      key={action}
                      className="px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30 text-xs font-orbitron text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Interventions */}
            <div className="col-span-12 md:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground">Quick Actions</h3>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </div>
              
              {[
                { icon: Leaf, title: "Quick Breathe", desc: "30 sec", color: "text-emerald-400" },
                { icon: Target, title: "Deep Focus", desc: "15 min", color: "text-cyan-400" },
                { icon: Users, title: "Connect", desc: "5 min", color: "text-violet-400" },
              ].map((item) => (
                <div key={item.title} className="p-3 rounded-xl bg-card/50 border border-border/30 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <item.icon className={cn("w-4 h-4", item.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4 p-4 rounded-xl bg-card/30 border border-border/30">
            <h3 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground mb-3">Today's Journey</h3>
            <div className="flex items-end justify-between h-20 gap-1">
              {demoData.timeline.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t bg-gradient-to-t from-primary/50 to-primary transition-all duration-500"
                    style={{ height: `${point.value}%` }}
                  />
                  <span className="text-[8px] text-muted-foreground">{point.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 bg-background/50">
          <p className="text-xs text-muted-foreground">
            This is a preview of your personalized dashboard
          </p>
          <div className="flex gap-2">
            <NeonButton variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close Preview
            </NeonButton>
            <NeonButton size="sm" onClick={onComplete}>
              <Play className="w-4 h-4 mr-1" />
              Try It Now
            </NeonButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DemoPreview.displayName = "DemoPreview";

export default DemoPreview;
