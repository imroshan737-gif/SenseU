import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-primary text-primary-foreground border-transparent hover:bg-primary-glow",
      secondary:
        "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary-glow",
      ghost:
        "bg-transparent text-foreground/85 border-border hover:bg-foreground/[0.04] hover:text-foreground hover:border-foreground/20",
      danger:
        "bg-destructive/12 text-destructive border-destructive/35 hover:bg-destructive/20 hover:border-destructive/60",
    };

    const sizes = {
      sm: "h-9 px-4 text-[13px]",
      md: "h-11 px-5 text-sm",
      lg: "h-[52px] px-7 text-[15px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg border font-orbitron font-medium",
          "transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out",
          "active:scale-[0.985]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100",
          variants[variant],
          sizes[size],
          glow && variant === "primary" && "shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.6)] hover:shadow-[0_10px_28px_-10px_hsl(var(--primary)/0.7)]",
          glow && variant === "secondary" && "shadow-[0_8px_24px_-12px_hsl(var(--secondary)/0.6)] hover:shadow-[0_10px_28px_-10px_hsl(var(--secondary)/0.7)]",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">{children}</span>
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export default NeonButton;
