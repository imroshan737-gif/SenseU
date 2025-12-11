import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  Volume2, 
  Bell, 
  Sparkles, 
  Shield, 
  Trash2, 
  Download,
  Monitor,
  Zap
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NeonButton from "./NeonButton";
import BackgroundMusicSettings from "./BackgroundMusicSettings";
import { toast } from "@/hooks/use-toast";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const [settings, setSettings] = useState({
    animations3D: true,
    particleEffects: true,
    soundEffects: false,
    darkMode: true,
    notifications: true,
    emailAlerts: false,
    stressAlerts: true,
    reducedMotion: false,
    animationSpeed: [50],
  });

  const updateSetting = (key: string, value: boolean | number[]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} has been updated.`,
    });
  };

  const settingGroups = [
    {
      title: "Visual Effects",
      icon: Sparkles,
      settings: [
        { key: "animations3D", label: "3D Animations", description: "Enable immersive 3D effects" },
        { key: "particleEffects", label: "Particle Effects", description: "Floating particles in background" },
        { key: "reducedMotion", label: "Reduced Motion", description: "Minimize animations for accessibility" },
      ],
    },
    {
      title: "Audio",
      icon: Volume2,
      settings: [
        { key: "soundEffects", label: "Sound Effects", description: "UI sounds and ambient audio" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        { key: "notifications", label: "Push Notifications", description: "Receive real-time alerts" },
        { key: "emailAlerts", label: "Email Alerts", description: "Daily summary emails" },
        { key: "stressAlerts", label: "Stress Alerts", description: "Alert when stress is high" },
      ],
    },
    {
      title: "Display",
      icon: Monitor,
      settings: [
        { key: "darkMode", label: "Dark Mode", description: "Use dark theme (recommended)" },
      ],
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background/95 backdrop-blur-xl border-l border-primary/20 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-orbitron text-xl text-gradient flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8 mt-6">
          {settingGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-sm font-orbitron uppercase tracking-wider text-primary flex items-center gap-2">
                <group.icon className="w-4 h-4" />
                {group.title}
              </h3>
              <div className="space-y-3">
                {group.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      checked={settings[setting.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Background Music Settings */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
            <BackgroundMusicSettings />
          </div>

          {/* Animation Speed Slider */}
          <div className="space-y-4">
            <h3 className="text-sm font-orbitron uppercase tracking-wider text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Animation Speed
            </h3>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">Slow</span>
                <span className="text-xs text-muted-foreground">Fast</span>
              </div>
              <Slider
                value={settings.animationSpeed}
                onValueChange={(value) => updateSetting("animationSpeed", value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="space-y-4">
            <h3 className="text-sm font-orbitron uppercase tracking-wider text-primary flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Data
            </h3>
            <div className="space-y-3">
              <NeonButton 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Data Export", description: "Your data export will be ready in a few minutes." })}
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </NeonButton>
              <NeonButton 
                variant="danger" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Delete Data", description: "Please contact support to delete your data.", variant: "destructive" })}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Data
              </NeonButton>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
