import { useState } from "react";
import { ArrowLeft, Mail, Lock, Key } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NeonInput from "@/components/NeonInput";
import NeonButton from "@/components/NeonButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ForgotPasswordProps {
  onBack: () => void;
}

type Step = "email" | "otp" | "reset";

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState<number>(0);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      // Set expiry for 10 minutes
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
      setStep("otp");
      toast.success("Reset link sent! Check your email inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    if (Date.now() > otpExpiry) {
      toast.error("Code has expired. Please request a new one.");
      setStep("email");
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP with Supabase
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "recovery",
      });

      if (error) throw error;

      setStep("reset");
      toast.success("Code verified! Set your new password.");
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password reset successfully!");
      onBack();
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeRemaining = () => {
    const remaining = Math.max(0, Math.ceil((otpExpiry - Date.now()) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <GlassCard className="w-full max-w-md relative z-10" glow>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </button>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-3">
          <Key className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-orbitron font-bold text-gradient">
          {step === "email" && "Forgot Password"}
          {step === "otp" && "Enter Code"}
          {step === "reset" && "New Password"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {step === "email" && "We'll send a reset code to your email"}
          {step === "otp" && `Code expires in ${getTimeRemaining()}`}
          {step === "reset" && "Create a strong new password"}
        </p>
      </div>

      {step === "email" && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <NeonInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <NeonButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Code"}
          </NeonButton>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <NeonInput
            label="Verification Code"
            type="text"
            placeholder="Enter 6-digit code"
            icon={<Key className="w-5 h-5" />}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
          />
          <NeonButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </NeonButton>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp("");
            }}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Didn't receive code? Resend
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <NeonInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <NeonInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <NeonButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </NeonButton>
        </form>
      )}
    </GlassCard>
  );
}
