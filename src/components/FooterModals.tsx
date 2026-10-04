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
  children: React.ReactNode;
}

function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <div className="p-5 rounded-2xl bg-sage-card border border-sage-line transition-colors duration-200 hover:border-sage-accent/40">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-sage-surface border border-sage-line flex items-center justify-center text-sage-accent">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sage-text font-exo font-semibold text-base">{title}</h3>
      </div>
      <div className="text-sm text-sage-muted leading-relaxed">{children}</div>
    </div>
  );
}

function ModalHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="-mx-6 -mt-6 px-6 pt-8 pb-6 mb-2 border-b border-sage-line bg-sage-section">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-sage-surface border border-sage-line flex items-center justify-center text-sage-accent">
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-exo font-semibold tracking-tight text-sage-text">{title}</h2>
          <p className="text-xs text-sage-muted mt-1 tracking-wider uppercase">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyModal({ open, onOpenChange }: FooterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sage-section border border-sage-line max-w-3xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Privacy Policy</DialogTitle>
        </DialogHeader>
        <ModalHeader icon={Shield} title="Privacy Policy" subtitle="Your trust, encrypted" />
        <ScrollArea className="max-h-[65vh] pr-4 -mr-2">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-sage-surface border border-sage-line relative overflow-hidden">
              <Sparkles className="absolute top-3 right-3 w-5 h-5 text-sage-accent/40" />
              <p className="text-sm text-sage-text italic leading-relaxed">
                "Your mind is sacred. Your data is yours. We exist to protect both."
              </p>
            </div>

            <Section icon={Database} title="Data Collection">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Only essential information needed for wellness services</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Stress assessments encrypted at rest and in transit</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />We never sell your data — ever</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Analytics anonymized to improve experience</li>
              </ul>
            </Section>

            <Section icon={Lock} title="Data Security">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Industry-standard end-to-end encryption</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Secure cloud with regular security audits</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Multi-factor authentication for admin access</li>
              </ul>
            </Section>

            <Section icon={Eye} title="Your Rights">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Request a copy of your data anytime</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Delete your account and all data instantly</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-sage-accent mt-0.5 shrink-0" />Opt-out of any communications</li>
              </ul>
            </Section>

            <Section icon={Brain} title="AI & Mental Health">
              Aurora AI processes wellness data locally when possible. Your conversations stay yours — never used for advertising, never sold.
            </Section>

            <Section icon={Cookie} title="Cookies">
              Only essential cookies for authentication and preferences. Zero third-party tracking.
            </Section>

            <p className="text-xs text-center text-sage-muted/60 pt-4 font-exo tracking-wider">
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
    { icon: CheckCircle2, title: "Acceptance", body: "By accessing NeuroAura, you agree to these terms. If not, please don't use our services." },
    { icon: Sparkles, title: "Service", body: "A mental wellness platform helping students manage stress, focus, and wellbeing through AI." },
    { icon: AlertTriangle, title: "Not Medical Advice", body: "NeuroAura is not a substitute for professional medical care. In a crisis, contact emergency services immediately.", warn: true },
    { icon: User, title: "Your Responsibilities", body: "Be 13+, secure your account, don't misuse the platform, provide accurate info." },
    { icon: BookOpen, title: "Intellectual Property", body: "All NeuroAura content is protected by international copyright and trademark laws." },
    { icon: Scale, title: "Limitation of Liability", body: "Service provided 'as is'. We're not liable for damages arising from use." },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sage-section border border-sage-line max-w-3xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Terms & Conditions</DialogTitle>
        </DialogHeader>
        <ModalHeader icon={FileText} title="Terms & Conditions" subtitle="The fine print, made beautiful" />
        <ScrollArea className="max-h-[65vh] pr-4 -mr-2">
          <div className="space-y-4">
            {terms.map((t, i) => (
              <div
                key={t.title}
                className={`relative p-5 rounded-2xl bg-sage-card border transition-colors duration-200 ${t.warn ? 'border-amber-400/40' : 'border-sage-line hover:border-sage-accent/40'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${t.warn ? 'bg-amber-400/10 border-amber-400/40 text-amber-400' : 'bg-sage-surface border-sage-line text-sage-accent'}`}>
                      <t.icon className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-sage-accent text-sage-bg text-[10px] font-exo font-semibold flex items-center justify-center">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-exo font-semibold mb-1 ${t.warn ? 'text-amber-400' : 'text-sage-text'}`}>{t.title}</h3>
                    <p className="text-sm text-sage-muted leading-relaxed">{t.body}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-center text-sage-muted/60 pt-4 font-exo tracking-wider">
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
      <DialogContent className="bg-sage-section border border-sage-line max-w-lg p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Contact Us</DialogTitle>
        </DialogHeader>
        <ModalHeader icon={Mail} title="Get in Touch" subtitle="We'd love to hear from you" />

        <div className="space-y-5 pt-2">
          {/* Owner card */}
          <div className="relative p-6 rounded-2xl bg-sage-surface border border-sage-line overflow-hidden">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-sage-accent flex items-center justify-center text-sage-bg shrink-0">
                <User className="w-10 h-10" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-sage-accent uppercase tracking-[0.2em] mb-1">Founder</p>
                <h3 className="text-2xl font-exo font-semibold tracking-tight text-sage-text mb-2">Roshan J</h3>
                <div className="flex flex-col gap-1.5">
                  <a href="mailto:roshangowda737@gmail.com" className="flex items-center gap-2 text-sm text-sage-muted hover:text-sage-text transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">roshangowda737@gmail.com</span>
                  </a>
                  <a href="https://www.linkedin.com/in/roshan-gowda" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-sage-muted hover:text-sage-text transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="relative p-5 rounded-2xl bg-sage-card border border-sage-line">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-sage-accent" />
              <h3 className="text-sm font-exo font-semibold uppercase tracking-[0.2em] text-sage-text">My Team</h3>
              <div className="flex-1 h-px bg-sage-line" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {team.map((m) => (
                <a
                  key={m.name}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-sage-surface border border-sage-line hover:border-sage-accent/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sage-accent/10 border border-sage-line flex items-center justify-center text-sage-accent font-exo font-semibold text-sm">
                      {m.name[0]}
                    </div>
                    <span className="font-medium text-sage-text group-hover:text-sage-accent transition-colors">{m.name}</span>
                  </div>
                  <Linkedin className="w-4 h-4 text-sage-muted group-hover:text-sage-accent transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
