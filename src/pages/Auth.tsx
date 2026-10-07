import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
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
        
        // Always require assessment on every sign-in (fresh baseline each session)
        localStorage.removeItem(`neuroaura_assessment_done:${userId}`);
        navigate("/assessment", { replace: true });
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

  // ✅ FIXED: Google Sign-In using Supabase directly
  const handleGoogleSignIn = useCallback(async () => {
    try {
      const redirectTo = `${window.location.origin}/assessment`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      // The page will redirect to Google; no further code runs here
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
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-background">
      {showVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="text-center space-y-5">
            <div className="relative mx-auto w-16 h-16">
              <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-primary-foreground/80" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h2 className="font-orbitron text-lg font-semibold">Identity Verified</h2>
              <p className="text-sm text-muted-foreground">Initializing your AI Guardian…</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-[420px]">
        <GlassCard className="p-7 sm:p-8">
          <div className="mb-7">
            <div className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary/10 border border-primary/20">
                <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground/90" />
              </div>
              <span className="font-orbitron text-[17px] font-semibold">NeuroAura</span>
            </div>
            <h1 className="mt-6 font-orbitron text-[26px] font-semibold leading-[1.15]">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              {isLogin
                ? "Sign in to continue with your wellness guardian."
                : "A few seconds to set up your proactive wellness guardian."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`h-9 rounded-lg text-[13px] font-medium transition-colors ${
                isLogin
                  ? "bg-foreground/[0.08] text-foreground shadow-[0_1px_0_0_hsl(var(--foreground)/0.06)_inset]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`h-9 rounded-lg text-[13px] font-medium transition-colors ${
                !isLogin
                  ? "bg-foreground/[0.08] text-foreground shadow-[0_1px_0_0_hsl(var(--foreground)/0.06)_inset]"
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
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-[34px] flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <NeonButton type="submit" size="lg" className="w-full group" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "Access Portal" : "Create Account"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </NeonButton>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-[12px] uppercase tracking-[0.08em] text-muted-foreground/70">
                or continue with
              </span>
            </div>
          </div>

          <NeonButton
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={handleGoogleSignIn}
            type="button"
          >
            <svg className="mr-2 w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </NeonButton>
        </GlassCard>

        <p className="mt-6 text-center text-[12.5px] text-muted-foreground/70">
          Protected by end-to-end encrypted sessions.
        </p>
      </div>
    </div>
  );
};


export default Auth;