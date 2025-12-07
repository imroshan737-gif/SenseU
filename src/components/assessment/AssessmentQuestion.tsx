import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MCQOption {
  label: string;
  value: string;
}

interface AssessmentQuestionProps {
  id: string;
  type: "mcq" | "text" | "slider";
  question: string;
  options?: MCQOption[];
  placeholder?: string;
  helpText?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  sliderMin?: number;
  sliderMax?: number;
}

export default function AssessmentQuestion({
  id,
  type,
  question,
  options = [],
  placeholder,
  helpText,
  value,
  onChange,
  onKeyDown,
  sliderMin = 0,
  sliderMax = 10,
}: AssessmentQuestionProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMCQSelect = (optionValue: string) => {
    setLocalValue(optionValue);
    onChange(optionValue);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    setLocalValue(numValue);
    onChange(numValue);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <h3 className="text-xl md:text-2xl font-orbitron font-semibold text-foreground leading-relaxed">
          {question}
        </h3>
        {helpText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="mt-1 text-muted-foreground hover:text-primary transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-sm">{helpText}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {type === "mcq" && (
        <div className="grid gap-3">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleMCQSelect(option.value)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all duration-300",
                "hover:scale-[1.02] hover:border-primary/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                localValue === option.value
                  ? "bg-primary/20 border-primary text-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                  : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {type === "text" && (
        <div className="relative">
          <textarea
            value={localValue as string}
            onChange={handleTextChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder || "Share your thoughts..."}
            rows={4}
            className={cn(
              "w-full p-4 rounded-xl border bg-muted/30 border-border/50",
              "text-foreground placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
              "transition-all duration-300 resize-none",
              "input-glow"
            )}
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {(localValue as string).length} characters
          </div>
        </div>
      )}

      {type === "slider" && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              value={localValue as number}
              onChange={handleSliderChange}
              className="w-full h-3 bg-muted/50 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:shadow-[0_0_15px_hsl(var(--primary)/0.5)]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-all
                [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{sliderMin}</span>
              <span className="text-xl font-orbitron font-bold text-primary">
                {localValue}
              </span>
              <span>{sliderMax}</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Not stressed at all</span>
            <span>Extremely stressed</span>
          </div>
        </div>
      )}
    </div>
  );
}
