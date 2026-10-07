import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  CheckCircle2, 
  Circle, 
  Target, 
  Brain, 
  Moon, 
  Zap, 
  Coffee, 
  Dumbbell,
  Book,
  Music,
  Droplets,
  Apple
} from "lucide-react";
import { cn } from "@/lib/utils";
import NeonButton from "./NeonButton";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  points: number;
}

interface ImprovementTasksProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vitalType: "stress" | "focus" | "energy" | "sleep" | "mood";
}

export default function ImprovementTasks({ open, onOpenChange, vitalType }: ImprovementTasksProps) {
  const tasksByType: Record<string, Task[]> = {
    stress: [
      { id: "s1", title: "5-Minute Breathing", description: "Complete a guided breathing exercise", icon: Brain, completed: false, points: 10 },
      { id: "s2", title: "Take a Walk", description: "Go for a 10-minute walk outside", icon: Dumbbell, completed: false, points: 15 },
      { id: "s3", title: "Listen to Calming Music", description: "Listen to 15 minutes of relaxing music", icon: Music, completed: true, points: 10 },
      { id: "s4", title: "Hydrate", description: "Drink a full glass of water", icon: Droplets, completed: false, points: 5 },
      { id: "s5", title: "Journaling", description: "Write down 3 things you're grateful for", icon: Book, completed: false, points: 15 },
    ],
    focus: [
      { id: "f1", title: "Pomodoro Session", description: "Complete one 25-minute focus session", icon: Target, completed: false, points: 20 },
      { id: "f2", title: "Clear Workspace", description: "Organize your study/work area", icon: Book, completed: true, points: 10 },
      { id: "f3", title: "Block Distractions", description: "Turn off notifications for 1 hour", icon: Brain, completed: false, points: 15 },
      { id: "f4", title: "Set Daily Goals", description: "Write down 3 tasks to complete today", icon: Target, completed: false, points: 10 },
    ],
    energy: [
      { id: "e1", title: "Power Nap", description: "Take a 20-minute power nap", icon: Moon, completed: false, points: 15 },
      { id: "e2", title: "Light Exercise", description: "Do 10 jumping jacks or stretches", icon: Dumbbell, completed: false, points: 10 },
      { id: "e3", title: "Healthy Snack", description: "Eat a fruit or energy-boosting snack", icon: Apple, completed: true, points: 10 },
      { id: "e4", title: "Fresh Air Break", description: "Step outside for 5 minutes", icon: Coffee, completed: false, points: 10 },
      { id: "e5", title: "Stay Hydrated", description: "Drink 2 glasses of water", icon: Droplets, completed: false, points: 5 },
    ],
    sleep: [
      { id: "sl1", title: "Set Sleep Schedule", description: "Go to bed at the same time tonight", icon: Moon, completed: false, points: 15 },
      { id: "sl2", title: "No Screens Before Bed", description: "Avoid screens 30 min before sleep", icon: Brain, completed: false, points: 20 },
      { id: "sl3", title: "Relaxation Routine", description: "Do a 10-minute wind-down routine", icon: Music, completed: false, points: 15 },
      { id: "sl4", title: "Limit Caffeine", description: "Avoid caffeine after 2 PM", icon: Coffee, completed: true, points: 10 },
    ],
    mood: [
      { id: "m1", title: "Connect with Someone", description: "Call or text a friend or family member", icon: Coffee, completed: false, points: 20 },
      { id: "m2", title: "Gratitude Practice", description: "List 3 things you're grateful for", icon: Book, completed: false, points: 15 },
      { id: "m3", title: "Physical Activity", description: "Get your body moving for 15 minutes", icon: Dumbbell, completed: true, points: 15 },
      { id: "m4", title: "Listen to Uplifting Music", description: "Play your favorite happy songs", icon: Music, completed: false, points: 10 },
    ],
  };

  const [tasks, setTasks] = useState(tasksByType[vitalType] || []);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "Task Completed! 🎉",
        description: `+${task.points} points earned`,
      });
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalPoints = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.points, 0);

  const typeColors = {
    stress: "text-primary",
    focus: "text-primary",
    energy: "text-stress-rising",
    sleep: "text-primary",
    mood: "text-stress-balanced",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-orbitron text-xl text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Improve Your {vitalType.charAt(0).toUpperCase() + vitalType.slice(1)}
          </SheetTitle>
        </SheetHeader>

        {/* Progress */}
        <div className="mt-6 p-4 rounded-xl bg-muted/20 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Today's Progress</span>
            <span className={cn("font-orbitron font-bold", typeColors[vitalType])}>
              {completedCount}/{tasks.length}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {totalPoints} points earned today
          </p>
        </div>

        {/* Tasks */}
        <div className="space-y-3 mt-6">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                "w-full p-4 rounded-lg border transition-colors text-left",
                "hover:border-primary/40",
                task.completed
                  ? "bg-primary/10 border-primary/30"
                  : "bg-muted/20 border-border/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={cn(
                        "font-semibold",
                        task.completed ? "text-primary line-through" : "text-foreground"
                      )}
                    >
                      {task.title}
                    </h4>
                    <span className="text-xs text-primary font-orbitron">+{task.points}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {completedCount === tasks.length && (
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-orbitron font-bold text-primary">All Tasks Complete!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Amazing work! You've earned {totalPoints} points today.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
