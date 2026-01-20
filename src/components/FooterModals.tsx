import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Mail, User } from "lucide-react";

interface FooterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyModal({ open, onOpenChange }: FooterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-primary/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-orbitron text-gradient">
            <Shield className="w-5 h-5 text-primary" />
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <section>
              <h3 className="text-foreground font-semibold mb-2">Your Privacy Matters</h3>
              <p>At NeuroAura, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">Data Collection</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>We collect only essential information needed to provide our wellness services</li>
                <li>Stress assessments and mood data are stored securely and encrypted</li>
                <li>We never sell your personal data to third parties</li>
                <li>Analytics data is anonymized and used only to improve our services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">Data Security</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>All data is encrypted in transit and at rest using industry-standard encryption</li>
                <li>We use secure cloud infrastructure with regular security audits</li>
                <li>Access to user data is strictly limited to authorized personnel</li>
                <li>We implement multi-factor authentication for all admin access</li>
              </ul>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">Your Rights</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>You can request a copy of your data at any time</li>
                <li>You have the right to delete your account and all associated data</li>
                <li>You can opt-out of marketing communications</li>
                <li>You can update your privacy preferences in settings</li>
              </ul>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">AI & Mental Health Data</h3>
              <p>Our AI Guardian processes your stress and wellness data locally when possible. Conversations with the AI are used to provide personalized support but are never used for advertising purposes.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">Cookies & Tracking</h3>
              <p>We use essential cookies for authentication and preferences. We do not use third-party tracking cookies for advertising.</p>
            </section>

            <p className="text-xs text-muted-foreground/70 pt-4">
              Last updated: January 2026. For questions, contact us at roshangowda737@gmail.com
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function TermsModal({ open, onOpenChange }: FooterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-primary/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-orbitron text-gradient">
            <FileText className="w-5 h-5 text-primary" />
            Terms & Conditions
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <section>
              <h3 className="text-foreground font-semibold mb-2">1. Acceptance of Terms</h3>
              <p>By accessing and using NeuroAura, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">2. Service Description</h3>
              <p>NeuroAura is a mental wellness platform designed to help students manage stress, improve focus, and enhance overall wellbeing through AI-powered tools and techniques.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">3. Not Medical Advice</h3>
              <p className="text-amber-400">Important: NeuroAura is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a mental health crisis, please contact a healthcare professional or emergency services immediately.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">4. User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>You must be at least 13 years old to use NeuroAura</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You agree not to misuse the platform or attempt to harm other users</li>
                <li>You will provide accurate information during registration</li>
              </ul>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">5. Intellectual Property</h3>
              <p>All content, features, and functionality of NeuroAura are owned by us and protected by international copyright, trademark, and other intellectual property laws.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">6. Limitation of Liability</h3>
              <p>NeuroAura is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our services.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">7. Account Termination</h3>
              <p>We reserve the right to terminate accounts that violate these terms or engage in harmful behavior.</p>
            </section>

            <section>
              <h3 className="text-foreground font-semibold mb-2">8. Changes to Terms</h3>
              <p>We may update these terms from time to time. Continued use of NeuroAura after changes constitutes acceptance of the new terms.</p>
            </section>

            <p className="text-xs text-muted-foreground/70 pt-4">
              Last updated: January 2026. For questions, contact us at roshangowda737@gmail.com
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function ContactModal({ open, onOpenChange }: FooterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-primary/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-orbitron text-gradient">
            <Mail className="w-5 h-5 text-primary" />
            Contact Us
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Owner</p>
              <p className="text-lg font-orbitron text-foreground">Roshan J</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">E-mail</p>
              <a 
                href="mailto:roshangowda737@gmail.com" 
                className="text-lg font-orbitron text-primary hover:text-primary/80 transition-colors"
              >
                roshangowda737@gmail.com
              </a>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">LinkedIn</p>
              <a 
                href="https://www.linkedin.com/in/roshan-gowda" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-orbitron text-primary hover:text-primary/80 transition-colors"
              >
                Connect
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-border/30">
            <p className="text-xs text-center text-muted-foreground">
              Have questions or feedback? Feel free to reach out. We typically respond within 24-48 hours.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
