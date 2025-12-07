import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, User, ArrowRight, Fingerprint, Eye, EyeOff } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import GlassCard from "@/components/GlassCard";
import NeonInput from "@/components/NeonInput";
import NeonButton from "@/components/NeonButton";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerified, setShowVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setShowVerified(true);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Welcome to MindGuard AI", {
      description: "Your AI Guardian is now online.",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Verified overlay */}
      {showVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-up">
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Fingerprint className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-orbitron font-bold neon-text">Identity Verified</h2>
            <p className="text-muted-foreground">Initializing your AI Guardian...</p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main auth card */}
      <GlassCard className="w-full max-w-md relative z-10 animate-scale-in" glow>
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
          </div>
          <h1 className="text-2xl font-orbitron font-bold text-gradient">MindGuard AI</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your Proactive Mental Wellness Guardian
          </p>
        </div>

        {/* Toggle Login/Signup */}
        <div className="flex gap-2 p-1 bg-muted/30 rounded-xl mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-orbitron transition-all ${
              isLogin
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-orbitron transition-all ${
              !isLogin
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth method tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAuthMethod("email")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              authMethod === "email"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setAuthMethod("phone")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              authMethod === "phone"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <NeonInput
              label="Full Name"
              placeholder="Enter your name"
              icon={<User className="w-5 h-5" />}
            />
          )}

          {authMethod === "email" ? (
            <NeonInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
            />
          ) : (
            <NeonInput
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="w-5 h-5" />}
            />
          )}

          <div className="relative">
            <NeonInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
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
              <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors">
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

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-card text-sm text-muted-foreground">or continue with</span>
          </div>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-2 gap-3">
          <NeonButton variant="ghost" className="flex items-center justify-center gap-2">
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
            Google
          </NeonButton>
          <NeonButton variant="ghost" className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            University
          </NeonButton>
        </div>

        {/* Biometric hint */}
        <div className="mt-6 pt-6 border-t border-border/30">
          <button className="w-full flex items-center justify-center gap-3 py-3 text-muted-foreground hover:text-primary transition-colors group">
            <Fingerprint className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Enable Biometric Login</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Auth;
