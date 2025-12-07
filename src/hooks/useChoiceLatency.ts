import { useState, useRef, useCallback } from "react";

export interface ChoiceMetrics {
  questionId: string;
  latencyMs: number;
  answer: string;
}

export function useChoiceLatency() {
  const [metrics, setMetrics] = useState<ChoiceMetrics[]>([]);
  const questionStartTimeRef = useRef<Map<string, number>>(new Map());

  const startQuestion = useCallback((questionId: string) => {
    questionStartTimeRef.current.set(questionId, Date.now());
  }, []);

  const recordChoice = useCallback((questionId: string, answer: string): ChoiceMetrics => {
    const startTime = questionStartTimeRef.current.get(questionId);
    const latencyMs = startTime ? Date.now() - startTime : 0;
    
    const metric: ChoiceMetrics = {
      questionId,
      latencyMs,
      answer,
    };

    setMetrics(prev => [...prev.filter(m => m.questionId !== questionId), metric]);
    return metric;
  }, []);

  const getMetrics = useCallback(() => metrics, [metrics]);

  const reset = useCallback(() => {
    setMetrics([]);
    questionStartTimeRef.current.clear();
  }, []);

  return {
    metrics,
    startQuestion,
    recordChoice,
    getMetrics,
    reset,
  };
}
