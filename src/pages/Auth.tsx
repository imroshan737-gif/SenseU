import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import GlassCard from "@/components/GlassCard";
import NeonInput from "@/components/NeonInput";
import NeonButton from "@/components/NeonButton";
import ForgotPassword from "@/components/ForgotPassword";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check URL param for initial mode
  const initialMode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(initialMode !== "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Check URL params
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      setShowForgotPassword(true);
    }
    // Update login/signup mode based on URL
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    } else if (mode === "login") {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Only redirect on explicit sign-in events, not on page load
  useEffect(() => {
    let mounted = true;
    
    // Just stop checking auth, don't auto-redirect
    setIsCheckingAuth(false);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      // Only redirect on explicit SIGNED_IN event (after user action)
      if (session && event === 'SIGNED_IN') {
        // Clear legacy global flags (they can incorrectly apply to a different user on the same device)
        localStorage.removeItem("neuroaura_assessment_done");
        localStorage.removeItem("neuroaura_stress_score");
        localStorage.removeItem("neuroaura_mood");

        const userId = session.user.id;
        localStorage.setItem("neuroaura_user_id", userId);

        if (session.user?.user_metadata?.name) {
          localStorage.setItem("neuroaura_name", session.user.user_metadata.name);
        }
        if (session.user?.email) {
          localStorage.setItem("neuroaura_email", session.user.email);
        }
        
        const hasCompletedAssessment = localStorage.getItem(`neuroaura_assessment_done:${userId}`) === "true";
        
        if (!hasCompletedAssessment) {
          navigate("/assessment", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        setShowVerified(true);
        setTimeout(() => {
          toast.success("Welcome back to NeuroAura");
        }, 500);
      } else {
        if (!formData.name) {
          toast.error("Please enter your name");
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/assessment`,
            data: {
              name: formData.name,
            }
          }
        });

        if (error) throw error;

        localStorage.setItem("neuroaura_name", formData.name);
        localStorage.setItem("neuroaura_email", formData.email);

        setShowVerified(true);
        setTimeout(() => {
          toast.success("Welcome to NeuroAura");
        }, 500);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed");
      setIsLoading(false);
    }
  }, [formData, isLogin]);

  const handleGoogleSignIn = useCallback(async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) throw error;
  } catch (error: any) {
    console.error("Google sign in error:", error);
    toast.error(error.message || "Failed to sign in with Google");
  }
}, []);


  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/30 animate-pulse">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary" />
          </div>
        </div>
      </div>
    );
  }

  // Show forgot password flow
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
        <ParticleBackground />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <ParticleBackground />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />

      {showVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20" />
              </div>
            </div>
            <h2 className="text-xl font-orbitron font-bold neon-text">Identity Verified</h2>
            <p className="text-sm text-muted-foreground">Initializing your AI Guardian...</p>
          </div>
        </div>
      )}

      <GlassCard className="w-full max-w-md relative z-10" glow>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary" />
          </div>
          <h1 className="text-2xl font-orbitron font-bold text-gradient">NeuroAura</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your Proactive Mental Wellness Guardian
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-muted/30 rounded-xl mb-5">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-orbitron transition-colors ${
              isLogin
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-orbitron transition-colors ${
              !isLogin
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <NeonInput
              label="Full Name"
              placeholder="Enter your name"
              icon={<User className="w-5 h-5" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}

          <NeonInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div className="relative">
            <NeonInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <NeonButton type="submit" className="w-full group" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isLogin ? "Access Portal" : "Create Account"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </NeonButton>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-card text-sm text-muted-foreground">or continue with</span>
          </div>
        </div>

        <NeonButton 
          variant="ghost" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </NeonButton>
      </GlassCard>
    </div>
  );
};

export default Auth;
