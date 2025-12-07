import { Shield, Lock, Trash2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";

interface PrivacyNoticeProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function PrivacyNotice({ onAccept, onDecline }: PrivacyNoticeProps) {
  return (
    <GlassCard className="max-w-md mx-auto" glow>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-orbitron font-bold">Privacy Notice</h2>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            We analyze <strong className="text-foreground">typing patterns & answers</strong> to 
            estimate your stress level. This helps us provide personalized recommendations.
          </p>

          <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
            <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <strong className="text-foreground">Your data is secure</strong>
              <p className="text-xs mt-1">
                Raw text is stored encrypted. Typing patterns are processed locally 
                and only aggregated metrics are sent to our servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
            <Trash2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <strong className="text-foreground">You're in control</strong>
              <p className="text-xs mt-1">
                You can delete your data anytime from Settings → Privacy → Delete My Data.
              </p>
            </div>
          </div>

          <div className="p-3 border border-stress-rising/30 bg-stress-rising/5 rounded-lg">
            <p className="text-xs">
              <strong className="text-stress-rising">Important:</strong> This is not a clinical 
              diagnosis. For emergencies, please call local services or use the AI-SOS button.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-3 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Decline (Limited Mode)
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-3 rounded-xl bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-colors font-medium"
          >
            I Understand
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
