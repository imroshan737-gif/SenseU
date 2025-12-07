import { useState, useRef, useCallback } from "react";

export interface TypingMetrics {
  timeToFirstKey: number;
  typingSpeedCPS: number;
  typingSpeedWPM: number;
  totalTimeMs: number;
  idlePausesCount: number;
  idlePauseTotalDuration: number;
  backspaceCount: number;
  correctionRatio: number;
  answerLength: number;
  keystrokeRhythmVariability: number;
}

interface KeystrokeEvent {
  timestamp: number;
  key: string;
  isBackspace: boolean;
}

export function useTypingMetrics() {
  const [metrics, setMetrics] = useState<Partial<TypingMetrics>>({});
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const firstKeyTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  const idlePausesRef = useRef<{ count: number; totalDuration: number }>({ count: 0, totalDuration: 0 });
  const backspaceCountRef = useRef(0);
  const totalCharsTypedRef = useRef(0);

  const IDLE_THRESHOLD_MS = 2000; // 2 seconds pause = idle

  const startTracking = useCallback(() => {
    startTimeRef.current = Date.now();
    keystrokesRef.current = [];
    firstKeyTimeRef.current = null;
    lastKeyTimeRef.current = null;
    idlePausesRef.current = { count: 0, totalDuration: 0 };
    backspaceCountRef.current = 0;
    totalCharsTypedRef.current = 0;
    setMetrics({});
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    const key = e.key;
    const isBackspace = key === "Backspace";

    if (!firstKeyTimeRef.current) {
      firstKeyTimeRef.current = now;
    }

    // Check for idle pause
    if (lastKeyTimeRef.current) {
      const gap = now - lastKeyTimeRef.current;
      if (gap >= IDLE_THRESHOLD_MS) {
        idlePausesRef.current.count++;
        idlePausesRef.current.totalDuration += gap;
      }
    }

    lastKeyTimeRef.current = now;

    if (isBackspace) {
      backspaceCountRef.current++;
    } else if (key.length === 1) {
      totalCharsTypedRef.current++;
    }

    keystrokesRef.current.push({
      timestamp: now,
      key,
      isBackspace,
    });
  }, []);

  const calculateMetrics = useCallback((finalText: string): TypingMetrics => {
    const now = Date.now();
    const totalTimeMs = startTimeRef.current ? now - startTimeRef.current : 0;
    const timeToFirstKey = startTimeRef.current && firstKeyTimeRef.current 
      ? firstKeyTimeRef.current - startTimeRef.current 
      : 0;

    const answerLength = finalText.length;
    const words = finalText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const typingDurationSeconds = totalTimeMs / 1000;
    const typingSpeedWPM = typingDurationSeconds > 0 ? (words / typingDurationSeconds) * 60 : 0;
    const typingSpeedCPS = typingDurationSeconds > 0 ? answerLength / typingDurationSeconds : 0;

    const correctionRatio = totalCharsTypedRef.current > 0 
      ? backspaceCountRef.current / totalCharsTypedRef.current 
      : 0;

    // Calculate keystroke rhythm variability
    let rhythmVariability = 0;
    const keystrokes = keystrokesRef.current.filter(k => !k.isBackspace && k.key.length === 1);
    if (keystrokes.length > 2) {
      const intervals: number[] = [];
      for (let i = 1; i < keystrokes.length; i++) {
        intervals.push(keystrokes[i].timestamp - keystrokes[i - 1].timestamp);
      }
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
      rhythmVariability = Math.sqrt(variance) / mean; // Coefficient of variation
    }

    const calculatedMetrics: TypingMetrics = {
      timeToFirstKey,
      typingSpeedCPS: Math.round(typingSpeedCPS * 100) / 100,
      typingSpeedWPM: Math.round(typingSpeedWPM * 10) / 10,
      totalTimeMs,
      idlePausesCount: idlePausesRef.current.count,
      idlePauseTotalDuration: idlePausesRef.current.totalDuration,
      backspaceCount: backspaceCountRef.current,
      correctionRatio: Math.round(correctionRatio * 1000) / 1000,
      answerLength,
      keystrokeRhythmVariability: Math.round(rhythmVariability * 1000) / 1000,
    };

    setMetrics(calculatedMetrics);
    return calculatedMetrics;
  }, []);

  return {
    metrics,
    startTracking,
    handleKeyDown,
    calculateMetrics,
  };
}
