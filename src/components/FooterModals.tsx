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
        </div>
      </DialogContent>
    </Dialog>
  );
}
