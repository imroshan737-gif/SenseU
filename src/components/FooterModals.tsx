import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Mail, User, Lock, Database, Eye, Sparkles, Brain, Cookie, AlertTriangle, CheckCircle2, BookOpen, Scale, Linkedin, ExternalLink, Heart } from "lucide-react";

interface FooterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SectionProps {
  icon: React.ElementType;
  title: string;
  iconColor?: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, iconColor = "text-primary", children }: SectionProps) {
  return (
    <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-foreground font-orbitron font-semibold text-base">{title}</h3>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed pl-1">{children}</div>
      </div>
    </div>
  );
}

function ModalHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="relative -mx-6 -mt-6 px-6 pt-8 pb-6 mb-2 overflow-hidden border-b border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
            <Icon className="w-7 h-7 text-background" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-orbitron font-bold text-gradient">{title}</h2>
          <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyModal({ open, onOpenChange }: FooterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-2xl border border-primary/30 max-w-3xl p-6 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]">
        <DialogHeader>
          <DialogTitle className="sr-only">Privacy Policy</DialogTitle>
        </DialogHeader>
        <ModalHeader icon={Shield} title="Privacy Policy" subtitle="Your trust, encrypted" />
        <ScrollArea className="max-h-[65vh] pr-4 -mr-2">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 relative overflow-hidden">
              <Sparkles className="absolute top-3 right-3 w-5 h-5 text-primary/40" />
              <p className="text-sm text-foreground/90 italic leading-relaxed">
                "Your mind is sacred. Your data is yours. We exist to protect both."
              </p>
            </div>

            <Section icon={Database} title="Data Collection" iconColor="text-cyan-400">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Only essential information needed for wellness services</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Stress assessments encrypted at rest and in transit</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />We never sell your data — ever</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Analytics anonymized to improve experience</li>
              </ul>
            </Section>

            <Section icon={Lock} title="Data Security" iconColor="text-violet-400">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Industry-standard end-to-end encryption</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Secure cloud with regular security audits</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Multi-factor authentication for admin access</li>
              </ul>
            </Section>

            <Section icon={Eye} title="Your Rights" iconColor="text-emerald-400">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Request a copy of your data anytime</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Delete your account and all data instantly</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Opt-out of any communications</li>
              </ul>
            </Section>

            <Section icon={Brain} title="AI & Mental Health" iconColor="text-rose-400">
              Aurora AI processes wellness data locally when possible. Your conversations stay yours — never used for advertising, never sold.
            </Section>

            <Section icon={Cookie} title="Cookies" iconColor="text-amber-400">
              Only essential cookies for authentication and preferences. Zero third-party tracking.
            </Section>

            <p className="text-xs text-center text-muted-foreground/60 pt-4 font-orbitron tracking-wider">
              LAST UPDATED · JANUARY 2026 · roshangowda737@gmail.com
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function TermsModal({ open, onOpenChange }: FooterModalProps) {
  const terms = [
    { icon: CheckCircle2, title: "Acceptance", color: "text-cyan-400", body: "By accessing NeuroAura, you agree to these terms. If not, please don't use our services." },
    { icon: Sparkles, title: "Service", color: "text-violet-400", body: "A mental wellness platform helping students manage stress, focus, and wellbeing through AI." },
    { icon: AlertTriangle, title: "Not Medical Advice", color: "text-amber-400", body: "NeuroAura is not a substitute for professional medical care. In a crisis, contact emergency services immediately.", warn: true },
    { icon: User, title: "Your Responsibilities", color: "text-emerald-400", body: "Be 13+, secure your account, don't misuse the platform, provide accurate info." },
    { icon: BookOpen, title: "Intellectual Property", color: "text-pink-400", body: "All NeuroAura content is protected by international copyright and trademark laws." },
    { icon: Scale, title: "Limitation of Liability", color: "text-blue-400", body: "Service provided 'as is'. We're not liable for damages arising from use." },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-2xl border border-primary/30 max-w-3xl p-6 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]">
        <DialogHeader>
          <DialogTitle className="sr-only">Terms & Conditions</DialogTitle>
        </DialogHeader>
        <ModalHeader icon={FileText} title="Terms & Conditions" subtitle="The fine print, made beautiful" />
        <ScrollArea className="max-h-[65vh] pr-4 -mr-2">
          <div className="space-y-4">
            {terms.map((t, i) => (
              <div
                key={t.title}
                className={`group relative p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border ${t.warn ? 'border-amber-400/40 shadow-[0_0_30px_-10px_hsl(45_100%_50%/0.4)]' : 'border-primary/10 hover:border-primary/30'} transition-all duration-500`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.warn ? 'from-amber-500/30 to-orange-500/20 border-amber-400/40' : 'from-primary/20 to-secondary/20 border-primary/30'} border flex items-center justify-center ${t.color}`}>
                      <t.icon className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary text-background text-[10px] font-orbitron font-bold flex items-center justify-center">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-orbitron font-semibold mb-1 ${t.warn ? 'text-amber-400' : 'text-foreground'}`}>{t.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-center text-muted-foreground/60 pt-4 font-orbitron tracking-wider">
              LAST UPDATED · JANUARY 2026
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function ContactModal({ open, onOpenChange }: FooterModalProps) {
  const team = [
    { name: "Nimish Sharma", url: "https://www.linkedin.com/in/nimish-sharma-b40414386/" },
    { name: "Maneesha G", url: "https://www.linkedin.com/in/maneesha-g-6b29ba353/" },
    { name: "Monalisa K", url: "https://www.linkedin.com/in/monalisa-k-0a06323a2/" },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-2xl border border-primary/30 max-w-lg p-6 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]">
        <DialogHeader>
          <DialogTitle className="sr-only">Contact Us</DialogTitle>
        </DialogHeader>
        <ModalHeader icon={Mail} title="Get in Touch" subtitle="We'd love to hear from you" />

        <div className="space-y-5 pt-2">
          {/* Owner card */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 border border-primary/30 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/40 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                  <User className="w-10 h-10 text-background" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary uppercase tracking-[0.2em] mb-1">Founder</p>
                <h3 className="text-2xl font-orbitron font-bold text-gradient mb-2">Roshan J</h3>
                <div className="flex flex-col gap-1.5">
                  <a href="mailto:roshangowda737@gmail.com" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors group">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">roshangowda737@gmail.com</span>
                  </a>
                  <a href="https://www.linkedin.com/in/roshan-gowda" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-secondary/30">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-orbitron font-bold uppercase tracking-[0.2em] text-gradient">My Team</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-secondary/40 to-transparent" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {team.map((m) => (
                <a
                  key={m.name}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-background/40 border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center text-primary font-orbitron font-bold text-sm">
                      {m.name[0]}
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{m.name}</span>
                  </div>
                  <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
