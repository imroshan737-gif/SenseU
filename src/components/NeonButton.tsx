import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-primary/20 text-primary border-primary/50 hover:bg-primary/30 hover:border-primary",
      secondary:
        "bg-secondary/20 text-secondary border-secondary/50 hover:bg-secondary/30 hover:border-secondary",
      ghost:
        "bg-transparent text-foreground border-muted hover:bg-muted/20 hover:border-primary/50",
      danger:
        "bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30 hover:border-destructive",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative rounded-xl border font-orbitron font-medium tracking-wider uppercase",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          glow && variant === "primary" && "shadow-[0_0_20px_hsl(180_100%_50%/0.3)] hover:shadow-[0_0_30px_hsl(180_100%_50%/0.5)]",
          glow && variant === "secondary" && "shadow-[0_0_20px_hsl(263_70%_58%/0.3)] hover:shadow-[0_0_30px_hsl(263_70%_58%/0.5)]",
          glow && variant === "danger" && "shadow-[0_0_20px_hsl(0_84%_60%/0.3)] hover:shadow-[0_0_30px_hsl(0_84%_60%/0.5)]",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export default NeonButton;
