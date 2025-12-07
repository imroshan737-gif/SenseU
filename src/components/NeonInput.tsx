import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-muted-foreground tracking-wide uppercase font-orbitron">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl",
              "bg-muted/30 border border-border/50",
              "text-foreground placeholder:text-muted-foreground/50",
              "font-exo tracking-wide",
              "transition-all duration-300",
              "focus:outline-none focus:border-primary/70",
              "focus:shadow-[0_0_0_2px_hsl(180_100%_50%/0.2),0_0_20px_hsl(180_100%_50%/0.15)]",
              "hover:border-primary/30",
              icon && "pl-12",
              error && "border-destructive/50 focus:border-destructive",
              className
            )}
            {...props}
          />
          <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5" />
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
      </div>
    );
  }
);

NeonInput.displayName = "NeonInput";

export default NeonInput;
