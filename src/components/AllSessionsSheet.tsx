import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Leaf, Target, Moon, Brain, Music, Dumbbell, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  durationLabel: string;
  type: "breathe" | "focus" | "rest";
  icon: any;
  color: string;
}

const allSessions: Session[] = [
  // Breathing Sessions
  { id: "b1", title: "Quick Breathe", description: "30-second calming breath", duration: 30, durationLabel: "30 sec", type: "breathe", icon: Leaf, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "b2", title: "Box Breathing", description: "4-4-4-4 breathing pattern", duration: 120, durationLabel: "2 min", type: "breathe", icon: Leaf, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "b3", title: "Deep Calm", description: "Deep breathing for relaxation", duration: 300, durationLabel: "5 min", type: "breathe", icon: Leaf, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "b4", title: "Stress Relief", description: "Extended breathing session", duration: 600, durationLabel: "10 min", type: "breathe", icon: Leaf, color: "bg-primary/10 text-primary border-primary/20" },
  
  // Focus Sessions
  { id: "f1", title: "Quick Focus", description: "Short concentration boost", duration: 300, durationLabel: "5 min", type: "focus", icon: Target, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "f2", title: "Study Sprint", description: "Focused study session", duration: 600, durationLabel: "10 min", type: "focus", icon: Target, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "f3", title: "Deep Focus", description: "Extended concentration", duration: 900, durationLabel: "15 min", type: "focus", icon: Target, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "f4", title: "Flow State", description: "Get into the zone", duration: 900, durationLabel: "15 min", type: "focus", icon: Brain, color: "bg-primary/10 text-primary border-primary/20" },
  
  // Rest Sessions
  { id: "r0", title: "Eyes Closed Relax", description: "Close your eyes and relax for 30 seconds", duration: 30, durationLabel: "30 sec", type: "rest", icon: Moon, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "r1", title: "Micro Break", description: "Quick mental reset", duration: 60, durationLabel: "1 min", type: "rest", icon: Coffee, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "r2", title: "Recovery Break", description: "Guided relaxation", duration: 300, durationLabel: "5 min", type: "rest", icon: Moon, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "r3", title: "Deep Rest", description: "Full relaxation session", duration: 600, durationLabel: "10 min", type: "rest", icon: Moon, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "r4", title: "Power Nap Guide", description: "Guided power nap", duration: 900, durationLabel: "15 min", type: "rest", icon: Moon, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "r5", title: "Relaxing Music", description: "Calm background sounds", duration: 600, durationLabel: "10 min", type: "rest", icon: Music, color: "bg-primary/10 text-primary border-primary/20" },
  { id: "r6", title: "Stretching Guide", description: "Light stretches for tension relief", duration: 300, durationLabel: "5 min", type: "rest", icon: Dumbbell, color: "bg-primary/10 text-primary border-primary/20" },
];

interface AllSessionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartSession: (type: "breathe" | "focus" | "rest", title: string, duration: number) => void;
}

export default function AllSessionsSheet({ open, onOpenChange, onStartSession }: AllSessionsSheetProps) {
  const breathingSessions = allSessions.filter(s => s.type === "breathe");
  const focusSessions = allSessions.filter(s => s.type === "focus");
  const restSessions = allSessions.filter(s => s.type === "rest");

  const handleStart = (session: Session) => {
    onOpenChange(false);
    onStartSession(session.type, session.title, session.duration);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-orbitron text-xl text-foreground">All Sessions</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Breathing Sessions */}
          <div>
            <h3 className="text-sm font-orbitron uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Breathing
            </h3>
            <div className="space-y-3">
              {breathingSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleStart(session)}
                  className="w-full p-4 rounded-lg bg-card border border-border transition-colors text-left group hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg border", session.color)}>
                        <session.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{session.title}</h4>
                        <p className="text-xs text-muted-foreground">{session.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-orbitron text-muted-foreground">{session.durationLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Sessions */}
          <div>
            <h3 className="text-sm font-orbitron uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Focus
            </h3>
            <div className="space-y-3">
              {focusSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleStart(session)}
                  className="w-full p-4 rounded-lg bg-card border border-border transition-colors text-left group hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg border", session.color)}>
                        <session.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{session.title}</h4>
                        <p className="text-xs text-muted-foreground">{session.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-orbitron text-muted-foreground">{session.durationLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rest Sessions */}
          <div>
            <h3 className="text-sm font-orbitron uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Rest & Recovery
            </h3>
            <div className="space-y-3">
              {restSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleStart(session)}
                  className="w-full p-4 rounded-lg bg-card border border-border transition-colors text-left group hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg border", session.color)}>
                        <session.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{session.title}</h4>
                        <p className="text-xs text-muted-foreground">{session.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-orbitron text-muted-foreground">{session.durationLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
