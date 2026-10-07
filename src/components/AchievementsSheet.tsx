import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trophy, Star, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points: number;
}

interface AchievementsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
  achievements: Achievement[];
}

const POSSIBLE_ACHIEVEMENTS = [
  { id: "first_session", title: "First Steps", description: "Complete your first session", icon: "🌱" },
  { id: "five_sessions", title: "Building Habits", description: "Complete 5 sessions", icon: "🔥" },
  { id: "ten_sessions", title: "Dedicated Practitioner", description: "Complete 10 sessions", icon: "⭐" },
  { id: "first_100", title: "Century Club", description: "Earn 100 points", icon: "💯" },
  { id: "first_500", title: "Rising Star", description: "Earn 500 points", icon: "🌟" },
  { id: "first_1000", title: "Wellness Champion", description: "Earn 1000 points", icon: "🏆" },
  { id: "breathing_master", title: "Breathing Master", description: "Complete 5 breathing sessions", icon: "🌬️" },
  { id: "focus_guru", title: "Focus Guru", description: "Complete 5 focus sessions", icon: "🎯" },
  { id: "rest_expert", title: "Rest Expert", description: "Complete 5 rest sessions", icon: "😌" },
];

export default function AchievementsSheet({ open, onOpenChange, points, achievements }: AchievementsSheetProps) {
  const earnedIds = achievements.map(a => a.id);

  const getLevel = () => {
    if (points >= 1000) return { name: "Master", color: "text-amber-400", next: null };
    if (points >= 500) return { name: "Expert", color: "text-primary", next: 1000 };
    if (points >= 200) return { name: "Practitioner", color: "text-primary", next: 500 };
    if (points >= 50) return { name: "Beginner", color: "text-emerald-400", next: 200 };
    return { name: "Newcomer", color: "text-muted-foreground", next: 50 };
  };

  const level = getLevel();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-orbitron text-xl text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Achievements
          </SheetTitle>
        </SheetHeader>

        {/* Points Summary */}
        <div className="mt-6 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Points</p>
              <p className="text-3xl font-orbitron font-bold text-amber-400">{points}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Level</p>
              <p className={cn("text-lg font-orbitron font-bold", level.color)}>{level.name}</p>
            </div>
          </div>
          
          {level.next && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress to next level</span>
                <span>{points}/{level.next}</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{ width: `${(points / level.next) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-4 rounded-xl bg-muted/20 border border-border/30 text-center">
            <Star className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-lg font-orbitron font-bold">{achievements.length}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-border/30 text-center">
            <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-lg font-orbitron font-bold">{POSSIBLE_ACHIEVEMENTS.length - achievements.length}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-border/30 text-center">
            <Award className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-lg font-orbitron font-bold">{Math.round((achievements.length / POSSIBLE_ACHIEVEMENTS.length) * 100)}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>

        {/* Achievements List */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">All Achievements</h3>
          
          {POSSIBLE_ACHIEVEMENTS.map((ach) => {
            const isEarned = earnedIds.includes(ach.id);
            const earnedData = achievements.find(a => a.id === ach.id);
            
            return (
              <div
                key={ach.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  isEarned 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-muted/10 border-border/30 opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                    isEarned ? "bg-primary/20" : "bg-muted/30 grayscale"
                  )}>
                    {ach.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "font-semibold",
                      isEarned ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {ach.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                    {isEarned && earnedData && (
                      <p className="text-xs text-primary mt-1">
                        Earned {new Date(earnedData.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {isEarned && (
                    <div className="text-primary">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
