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

  // URL params
  useEffect(() => {
    if (searchParams.get("reset") === "true") setShowForgotPassword(true);

    const mode = searchParams.get("mode");
    if (mode === "signup") setIsLogin(false);
    if (mode === "login") setIsLogin(true);
  }, [searchParams]);

  // Auth state listener
  useEffect(() => {
    let mounted = true;
    setIsCheckingAuth(false);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (session && event === "SIGNED_IN") {
        localStorage.removeItem("neuroaura_assessment_done");
        localStorage.removeItem("neuroaura_stress_score");
        localStorage.removeItem("neuroaura_mood");

        const userId = session.user.id;
        localStorage.setItem("neuroaura_user_id", userId);

        if (session.user?.user_metadata?.name)
          localStorage.setItem("neuroaura_name", session.user.user_metadata.name);

        if (session.user?.email)
          localStorage.setItem("neuroaura_email", session.user.email);

        const hasCompletedAssessment =
          localStorage.getItem(`neuroaura_assessment_done:${userId}`) === "true";

        navigate(hasCompletedAssessment ? "/dashboard" : "/assessment", {
          replace: true,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Email/password submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
          setTimeout(() => toast.success("Welcome back to NeuroAura"), 500);
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
              emailRedirectTo: `${window.location.origin}/auth`,
              data: { name: formData.name },
            },
          });

          if (error) throw error;

          setShowVerified(true);
          setTimeout(() => toast.success("Welcome to NeuroAura"), 500);
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        toast.error(error.message || "Authentication failed");
        setIsLoading(false);
      }
    },
    [formData, isLogin]
  );

  // ✅ FIXED GOOGLE SIGN-IN
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
        <div className="w-12 h-12 rounded-xl bg-primary/30 animate-pulse" />
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <ParticleBackground />
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      <ParticleBackground />

      {showVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95">
          <h2 className="text-xl font-bold">Identity Verified</h2>
        </div>
      )}

      <GlassCard className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">NeuroAura</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <NeonInput
              label="Full Name"
              icon={<User className="w-5 h-5" />}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}

          <NeonInput
            label="Email"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div className="relative">
            <NeonInput
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <NeonButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : isLogin ? "Login" : "Sign Up"}
          </NeonButton>
        </form>

        <div className="my-4 text-center text-sm">or continue with</div>

        <NeonButton
          variant="ghost"
          className="w-full"
          onClick={handleGoogleSignIn}
          type="button"
        >
          Sign in with Google
        </NeonButton>
      </GlassCard>
    </div>
  );
};

export default Auth;
