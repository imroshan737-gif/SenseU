import { useState, useEffect, useCallback, memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Brain, 
  Zap, 
  Moon, 
  Target, 
  Leaf, 
  Users, 
  AlertTriangle,
  Settings,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Trophy
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import GlassCard from "@/components/GlassCard";
import StressAura from "@/components/StressAura";
import DigitalTwin from "@/components/DigitalTwin";
import VitalsTile from "@/components/VitalsTile";
import AIGuardianOrb from "@/components/AIGuardianOrb";
import InterventionCard from "@/components/InterventionCard";
import EmotionalTimeline from "@/components/EmotionalTimeline";
import DemoBadge from "@/components/DemoBadge";
import ProfileSheet from "@/components/ProfileSheet";
import SettingsSheet from "@/components/SettingsSheet";
import NotificationsSheet from "@/components/NotificationsSheet";
import ImprovementTasks from "@/components/ImprovementTasks";
import SessionGuide from "@/components/SessionGuide";
import AIChat from "@/components/AIChat";
import SearchDialog from "@/components/SearchDialog";
import AllSessionsSheet from "@/components/AllSessionsSheet";
import AchievementsSheet from "@/components/AchievementsSheet";
import SessionFeedback from "@/components/SessionFeedback";
import MiniGame from "@/components/MiniGame";
import EmergencySOS from "@/components/EmergencySOS";
import { useRealtimeVitals } from "@/hooks/useRealtimeVitals";
import { usePoints } from "@/hooks/usePoints";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Get stored assessment vitals
const getAssessmentVitals = () => {
  const storedStress = localStorage.getItem("neuroaura_stress_score");
  const storedMood = localStorage.getItem("neuroaura_mood");
  
  const stressScore = storedStress ? parseInt(storedStress) : 35;
  
  // Derive other vitals from stress score
  const focus = Math.max(20, 100 - stressScore - Math.floor(Math.random() * 10));
  const energy = Math.max(30, 90 - (stressScore * 0.5) - Math.floor(Math.random() * 15));
  
  return {
    baseStress: stressScore,
    baseFocus: focus,
    baseEnergy: energy,
  };
};

// Memoized vitals display
const VitalsSection = memo(({ 
  vitals, 
  onImprove 
}: { 
  vitals: { stress: number; focus: number; energy: number }; 
  onImprove: (type: "stress" | "focus" | "energy") => void;
}) => (
  <div className="col-span-12 lg:col-span-3 space-y-4">
    <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground mb-4">Live Vitals</h3>
    {[
      { title: "Stress Score", value: vitals.stress, unit: "%", icon: Brain, color: "violet" as const, type: "stress" as const },
      { title: "Focus Level", value: vitals.focus, unit: "%", icon: Target, color: "green" as const, type: "focus" as const },
      { title: "Energy Level", value: vitals.energy, unit: "%", icon: Zap, color: "amber" as const, type: "energy" as const },
    ].map((vital) => (
      <div key={vital.title} className="relative group">
        <VitalsTile title={vital.title} value={vital.value} unit={vital.unit} icon={vital.icon} trend="stable" color={vital.color} />
        <button 
          onClick={() => onImprove(vital.type)} 
          className="absolute top-2 right-2 px-2 py-1 rounded-md bg-primary/20 text-primary text-xs font-orbitron opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          <TrendingUp className="w-3 h-3" /> Improve
        </button>
      </div>
    ))}
  </div>
));

VitalsSection.displayName = "VitalsSection";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDemo = searchParams.get("demo") === "true";

  // Get vitals based on assessment answers
  const assessmentVitals = getAssessmentVitals();
  
  const { vitals } = useRealtimeVitals(assessmentVitals);

  const { points, addPoints, achievements } = usePoints();

  const [showGuardianChat, setShowGuardianChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showEmergencySOS, setShowEmergencySOS] = useState(false);
  const [completedSession, setCompletedSession] = useState<{ title: string; type: string } | null>(null);
  const [improvementSheet, setImprovementSheet] = useState<{
    open: boolean;
    type: "stress" | "focus" | "energy" | "sleep" | "mood";
  }>({ open: false, type: "stress" });
  const [sessionGuide, setSessionGuide] = useState<{
    open: boolean;
    type: "breathe" | "focus" | "rest";
    title: string;
    duration: number;
  }>({ open: false, type: "breathe", title: "", duration: 0 });

  const [userData, setUserData] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const name = localStorage.getItem("neuroaura_name");
    const email = localStorage.getItem("neuroaura_email");
    setUserData({ name: name || undefined, email: email || undefined });
  }, []);

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

  const getStressState = useCallback(() => {
    if (vitals.stress <= 20) return "calm";
    if (vitals.stress <= 40) return "balanced";
    if (vitals.stress <= 60) return "rising";
    if (vitals.stress <= 80) return "high";
    return "critical";
  }, [vitals.stress]);

  const handleExitDemo = useCallback(() => navigate("/"), [navigate]);
  
  const handleStartSession = useCallback((type: "breathe" | "focus" | "rest", title: string, duration: number) => {
    setSessionGuide({ open: true, type, title, duration });
  }, []);
  
  const handleSessionComplete = useCallback((title: string, type: string) => {
    setCompletedSession({ title, type });
    setShowFeedback(true);
  }, []);

  const handleFeedbackSubmit = useCallback((rating: number, feedback: string) => {
    const sessionPoints = completedSession?.type === "focus" ? 25 : completedSession?.type === "breathe" ? 15 : 20;
    addPoints(sessionPoints, `Completed ${completedSession?.title}`);
    
    setShowFeedback(false);
    setCompletedSession(null);
    
    toast({
      title: "Session Complete! 🎉",
      description: `+${sessionPoints} points earned. Keep up the great work!`,
    });
  }, [completedSession, addPoints]);
  
  const handleImprove = useCallback((type: "stress" | "focus" | "energy" | "sleep" | "mood") => {
    setImprovementSheet({ open: true, type });
  }, []);
  
  const handleEmergencySOS = useCallback(() => {
    setShowEmergencySOS(true);
  }, []);

  const getInitials = useCallback(() => {
    if (isDemo) return "DS";
    if (userData.name) return userData.name.split(" ").map(n => n[0]).join("").toUpperCase();
    return "?";
  }, [isDemo, userData.name]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ParticleBackground />
      
      {isDemo && <DemoBadge onExit={handleExitDemo} />}

      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border/30 bg-background/50 backdrop-blur-sm">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/30">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary" />
          </div>
          <div className="text-left">
            <h1 className="font-orbitron font-bold text-lg text-gradient">NeuroAura</h1>
            <p className="text-xs text-muted-foreground">AI Wellness System</p>
          </div>
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAchievements(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30 hover:border-amber-500/50 transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-orbitron text-amber-400">{points}</span>
          </button>
          
          <button onClick={() => setShowSearch(true)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-xl border border-border/30 hover:border-primary/30 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search...</span>
          </button>
          <button onClick={() => setShowNotifications(true)} className="relative p-2 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <button onClick={() => setShowSettings(true)} className="p-2 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
          <button onClick={() => setShowProfile(true)} className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center hover:scale-105 transition-transform">
            <span className="text-sm font-orbitron text-primary">{getInitials()}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Live Vitals */}
          <VitalsSection vitals={vitals} onImprove={handleImprove} />

          {/* Center Panel */}
          <div className="col-span-12 lg:col-span-6">
            <GlassCard className="h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-visible">
              {/* Mini Game instead of System Active */}
              <div className="absolute top-4 left-4 right-4">
                <MiniGame />
              </div>
              
              <div className="relative flex items-center justify-center mt-24">
                <StressAura level={vitals.stress} size={280} />
                <div className="absolute"><DigitalTwin stressLevel={vitals.stress} /></div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Your current state is{" "}
                  <span className={cn("font-orbitron font-semibold", vitals.stress <= 40 ? "text-stress-calm" : vitals.stress <= 60 ? "text-stress-rising" : "text-stress-high")}>
                    {getStressState().toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                {[{ label: "Breathe", type: "breathe" as const, duration: 60 }, { label: "Focus", type: "focus" as const, duration: 900 }, { label: "Rest", type: "rest" as const, duration: 300 }].map((a) => (
                  <button key={a.label} onClick={() => handleStartSession(a.type, `${a.label} Session`, a.duration)} className="px-4 py-2 rounded-lg bg-muted/30 border border-border/30 text-sm font-orbitron text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                    {a.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Panel */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">Interventions</h3>
              <button 
                onClick={() => setShowAllSessions(true)}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            {/* What You Need Section */}
            <div className="mb-4">
              <h4 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground/70 mb-2">What You Need</h4>
              <div className="relative group">
                <VitalsTile title="Sleep Quality" value={7.5} unit="hrs" icon={Moon} trend="up" color="violet" />
                <button onClick={() => handleImprove("sleep")} className="absolute top-2 right-2 px-2 py-1 rounded-md bg-violet-500/20 text-violet-400 text-xs font-orbitron opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Improve
                </button>
              </div>
            </div>

            <InterventionCard title="Quick Breathe" description="30-second calming breath" duration="30 sec" icon={Leaf} type="micro" onStart={() => handleStartSession("breathe", "Quick Breathe", 30)} />
            <InterventionCard title="Deep Focus" description="Pomodoro timer" duration="15 min" icon={Target} type="focus" onStart={() => handleStartSession("focus", "Deep Focus", 900)} />
            <InterventionCard title="Recovery Break" description="Guided relaxation" duration="10 min" icon={Leaf} type="recovery" onStart={() => handleStartSession("rest", "Recovery Break", 600)} />
            <InterventionCard title="Connect" description="Check in with a buddy" duration="5 min" icon={Users} type="social" onStart={() => toast({ title: "Connecting...", description: "Finding study buddies nearby." })} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 lg:col-span-8">
            <GlassCard>
              <EmotionalTimeline data={timelineData} />
            </GlassCard>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <InterventionCard 
              title="Emergency SOS" 
              description="Immediate AI crisis support" 
              duration="Instant" 
              icon={AlertTriangle} 
              type="emergency" 
              className="h-full" 
              onStart={handleEmergencySOS} 
            />
          </div>
        </div>
      </div>

      {/* Floating AI Orb */}
      <div className="fixed bottom-8 right-8 z-50">
        <AIGuardianOrb stressLevel={getStressState()} size="lg" onClick={() => setShowGuardianChat(!showGuardianChat)} />
      </div>

      {/* Sheets and Dialogs */}
      <AIChat isOpen={showGuardianChat} onClose={() => setShowGuardianChat(false)} isDemo={isDemo} />
      <ProfileSheet open={showProfile} onOpenChange={setShowProfile} isDemo={isDemo} userData={userData} />
      <SettingsSheet open={showSettings} onOpenChange={setShowSettings} />
      <NotificationsSheet open={showNotifications} onOpenChange={setShowNotifications} />
      <ImprovementTasks open={improvementSheet.open} onOpenChange={(open) => setImprovementSheet((prev) => ({ ...prev, open }))} vitalType={improvementSheet.type} />
      <SessionGuide 
        open={sessionGuide.open} 
        onOpenChange={(open) => setSessionGuide((prev) => ({ ...prev, open }))} 
        sessionType={sessionGuide.type} 
        title={sessionGuide.title} 
        duration={sessionGuide.duration}
        onComplete={() => handleSessionComplete(sessionGuide.title, sessionGuide.type)}
      />
      <SearchDialog open={showSearch} onOpenChange={setShowSearch} onOpenProfile={() => setShowProfile(true)} onOpenSettings={() => setShowSettings(true)} onOpenNotifications={() => setShowNotifications(true)} onStartSession={handleStartSession} onImprove={handleImprove} />
      <AllSessionsSheet 
        open={showAllSessions} 
        onOpenChange={setShowAllSessions} 
        onStartSession={handleStartSession}
      />
      <AchievementsSheet 
        open={showAchievements} 
        onOpenChange={setShowAchievements}
        points={points}
        achievements={achievements}
      />
      <SessionFeedback
        open={showFeedback}
        onOpenChange={setShowFeedback}
        sessionTitle={completedSession?.title || ""}
        onSubmit={handleFeedbackSubmit}
      />
      <EmergencySOS
        open={showEmergencySOS}
        onOpenChange={setShowEmergencySOS}
      />
    </div>
  );
};

export default Dashboard;
