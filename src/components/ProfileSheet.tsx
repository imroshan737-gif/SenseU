import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { User, Mail, Save, Edit2, LogOut, FileText, Camera } from "lucide-react";
import NeonButton from "./NeonButton";
import NeonInput from "./NeonInput";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDemo?: boolean;
  userData?: {
    name?: string;
    email?: string;
  };
}

export default function ProfileSheet({ open, onOpenChange, isDemo = false, userData }: ProfileSheetProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });

  // Load user data when sheet opens or userData changes
  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        bio: localStorage.getItem("neuroaura_bio") || "",
        avatarUrl: localStorage.getItem("neuroaura_avatar") || "",
      });
    } else if (isDemo) {
      setProfile({
        name: "Demo Student",
        email: "demo@neuroaura.app",
        bio: "This is a demo account showcasing NeuroAura features.",
        avatarUrl: "",
      });
    } else {
      // Load from localStorage if no userData provided
      setProfile({
        name: localStorage.getItem("neuroaura_name") || "",
        email: localStorage.getItem("neuroaura_email") || "",
        bio: localStorage.getItem("neuroaura_bio") || "",
        avatarUrl: localStorage.getItem("neuroaura_avatar") || "",
      });
    }
  }, [userData, isDemo, open]);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("neuroaura_name", profile.name);
    localStorage.setItem("neuroaura_email", profile.email);
    localStorage.setItem("neuroaura_bio", profile.bio);
    if (profile.avatarUrl) {
      localStorage.setItem("neuroaura_avatar", profile.avatarUrl);
    }
    
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("neuroaura_name");
    localStorage.removeItem("neuroaura_email");
    localStorage.removeItem("neuroaura_bio");
    localStorage.removeItem("neuroaura_avatar");
    
    onOpenChange(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (!profile.name) return "?";
    return profile.name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
          <SheetTitle className="font-orbitron text-xl text-foreground">My Profile</SheetTitle>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "p-2 rounded-lg transition-all",
                isEditing 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted/30 text-muted-foreground hover:text-primary"
              )}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center py-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-orbitron text-primary">
                    {getInitials()}
                  </span>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary cursor-pointer hover:bg-primary/80 transition-colors">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <p className="mt-4 font-orbitron text-lg text-foreground">
              {profile.name || "No name set"}
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.email || "No email set"}
            </p>
          </div>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="w-3 h-3" />
              Full Name
            </label>
            {isEditing ? (
              <NeonInput
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl bg-muted/20 border border-border/30 text-foreground">
                {profile.name || <span className="text-muted-foreground italic">Not set</span>}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="w-3 h-3" />
              Email
            </label>
            {isEditing ? (
              <NeonInput
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl bg-muted/20 border border-border/30 text-foreground">
                {profile.email || <span className="text-muted-foreground italic">Not set</span>}
              </div>
            )}
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <label className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Bio (Optional)
            </label>
            {isEditing ? (
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full bg-muted/30 border-border/30 focus:border-primary/50 min-h-[80px]"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl bg-muted/20 border border-border/30 text-foreground min-h-[60px]">
                {profile.bio || <span className="text-muted-foreground italic">No bio added</span>}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="pt-4">
              <NeonButton onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </NeonButton>
            </div>
          )}

          {/* Logout Button */}
          <div className="pt-6 border-t border-border/30 mt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition-all font-orbitron text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
