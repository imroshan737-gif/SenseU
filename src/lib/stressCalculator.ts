// Stress Score Calculator for NeuroAura
// Implements the deterministic, explainable scoring formula

export interface QuestionAnswer {
  id: string;
  type: "mcq" | "text" | "slider";
  answer: string | number;
  latencyMs: number;
  // For text questions
  chars?: number;
  timeMs?: number;
  wpm?: number;
  backspaces?: number;
  pauses?: number;
  sentiment?: number;
  keystrokeVariance?: number;
}

export interface TypingMetricsSummary {
  avgWpm: number;
  avgCps: number;
  backspaceTotal: number;
  idleTotalMs: number;
}

export interface DeviceContext {
  platform: string;
  agent: string;
  screen: string;
  timezone?: string;
  localTime?: string;
}

export interface AssessmentPayload {
  userId: string;
  questions: QuestionAnswer[];
  typingMetrics: TypingMetricsSummary;
  deviceContext: DeviceContext;
}

export interface StressResult {
  stressScore: number;
  confidence: number;
  mood: "calm" | "neutral" | "anxious" | "fatigued" | "overwhelmed" | "motivated";
  explanations: string[];
  recommendedIntervention: {
    id: string;
    title: string;
    priority: "low" | "medium" | "high";
  };
}

// MCQ answer mappings (0 = best, 1 = worst)
const sleepScoreMap: Record<string, number> = {
  "Excellent": 0,
  "Good": 0.25,
  "Fair": 0.5,
  "Poor": 0.75,
  "Very poor": 1,
};

const overwhelmedScoreMap: Record<string, number> = {
  "Never": 0,
  "Rarely": 0.25,
  "Sometimes": 0.5,
  "Often": 0.75,
  "Always": 1,
};

const workloadScoreMap: Record<string, number> = {
  "Light": 0,
  "Manageable": 0.25,
  "Busy": 0.5,
  "Overloaded": 0.75,
  "Unmanageable": 1,
};

const connectionScoreMap: Record<string, number> = {
  "Very connected": 0,
  "Somewhat": 0.25,
  "Neutral": 0.5,
  "Isolated": 0.75,
  "Very isolated": 1,
};

// Baseline values for normalization
const BASELINE_WPM = 40; // Average typing speed
const MAX_BACKSPACE_RATIO = 0.3; // Max expected backspace ratio
const MAX_IDLE_MS = 30000; // 30 seconds max expected idle
const MAX_CHOICE_LATENCY_MS = 15000; // 15 seconds max for MCQ

export function calculateStressScore(payload: AssessmentPayload): StressResult {
  const explanations: string[] = [];
  let missingSignals = 0;

  // Extract answers
  const sleepAnswer = payload.questions.find(q => q.id === "q1")?.answer as string;
  const overwhelmedAnswer = payload.questions.find(q => q.id === "q2")?.answer as string;
  const workloadAnswer = payload.questions.find(q => q.id === "q3")?.answer as string;
  const textQuestion = payload.questions.find(q => q.id === "q4");
  const connectionAnswer = payload.questions.find(q => q.id === "q5")?.answer as string;
  const stressSlider = payload.questions.find(q => q.id === "q6")?.answer as number;

  // Calculate individual normalized scores
  const sleepScore = sleepScoreMap[sleepAnswer] ?? 0.5;
  if (sleepScore >= 0.75) {
    explanations.push("Poor sleep quality reported");
  }

  const overwhelmedScore = overwhelmedScoreMap[overwhelmedAnswer] ?? 0.5;
  if (overwhelmedScore >= 0.75) {
    explanations.push("Frequently feeling overwhelmed");
  }

  const workloadScore = workloadScoreMap[workloadAnswer] ?? 0.5;
  if (workloadScore >= 0.75) {
    explanations.push("High workload indicated");
  }

  const connectionScore = connectionScoreMap[connectionAnswer] ?? 0.5;
  if (connectionScore >= 0.75) {
    explanations.push("Feeling isolated from peers");
  }

  // Typing metrics
  let wpmNorm = 0.5;
  let backspaceNorm = 0.5;
  let pauseNorm = 0.5;
  let sentimentNorm = 0.5;

  if (textQuestion && textQuestion.wpm !== undefined) {
    wpmNorm = Math.max(0, Math.min(1, 1 - (textQuestion.wpm / BASELINE_WPM)));
    if (wpmNorm >= 0.6) {
      explanations.push("Slower typing speed detected");
    }
  } else {
    missingSignals++;
  }

  if (textQuestion && textQuestion.backspaces !== undefined && textQuestion.chars) {
    const backspaceRatio = textQuestion.backspaces / Math.max(textQuestion.chars, 1);
    backspaceNorm = Math.min(1, backspaceRatio / MAX_BACKSPACE_RATIO);
    if (backspaceNorm >= 0.6) {
      explanations.push("High correction rate while typing");
    }
  } else {
    missingSignals++;
  }

  if (payload.typingMetrics.idleTotalMs > 0) {
    pauseNorm = Math.min(1, payload.typingMetrics.idleTotalMs / MAX_IDLE_MS);
    if (pauseNorm >= 0.5) {
      explanations.push("Extended pauses during responses");
    }
  }

  if (textQuestion && textQuestion.sentiment !== undefined) {
    // Sentiment: -1 (negative) to 1 (positive), map to 0-1 where 1 = more stress
    sentimentNorm = Math.max(0, Math.min(1, (1 - textQuestion.sentiment) / 2));
    if (sentimentNorm >= 0.6) {
      explanations.push("Negative sentiment in written response");
    }
  }

  // Choice latency (average across MCQs)
  const mcqQuestions = payload.questions.filter(q => q.type === "mcq");
  const avgLatency = mcqQuestions.length > 0
    ? mcqQuestions.reduce((sum, q) => sum + q.latencyMs, 0) / mcqQuestions.length
    : 5000;
  const choiceLatencyNorm = Math.min(1, avgLatency / MAX_CHOICE_LATENCY_MS);

  // Self-reported stress (if provided)
  const selfReportNorm = stressSlider !== undefined ? stressSlider / 10 : null;
  if (selfReportNorm !== null && selfReportNorm >= 0.7) {
    explanations.push("High self-reported stress level");
  }

  // Weighted sum (initial weights)
  let stressRaw = 
    0.15 * sleepScore +
    0.15 * overwhelmedScore +
    0.15 * workloadScore +
    0.10 * connectionScore +
    0.12 * wpmNorm +
    0.10 * backspaceNorm +
    0.08 * pauseNorm +
    0.08 * sentimentNorm +
    0.07 * choiceLatencyNorm;

  // Add self-reported if available
  if (selfReportNorm !== null) {
    stressRaw = stressRaw * 0.7 + selfReportNorm * 0.3;
  }

  const stressScore = Math.round(stressRaw * 100);

  // Calculate confidence
  const signalCoverage = 1 - (missingSignals / 6);
  const answerConsistency = calculateConsistency(payload.questions);
  const confidence = Math.round((signalCoverage * 0.6 + answerConsistency * 0.4) * 100) / 100;

  // Determine mood
  let mood: StressResult["mood"];
  if (stressScore < 25) {
    mood = "calm";
  } else if (stressScore < 45) {
    mood = "neutral";
  } else if (stressScore < 65) {
    mood = "anxious";
  } else if (stressScore < 80) {
    mood = "fatigued";
  } else {
    mood = "overwhelmed";
  }

  // Check for motivated state (low stress + high self-report energy indicators)
  if (stressScore < 30 && workloadScore <= 0.5 && sleepScore <= 0.25) {
    mood = "motivated";
  }

  // Recommend intervention
  let recommendedIntervention: StressResult["recommendedIntervention"];
  if (stressScore >= 70) {
    recommendedIntervention = {
      id: "recovery_guided_10",
      title: "10min Guided Recovery",
      priority: "high",
    };
  } else if (stressScore >= 45) {
    recommendedIntervention = {
      id: "micro_breath_60",
      title: "60s Breathing Exercise",
      priority: "medium",
    };
  } else {
    recommendedIntervention = {
      id: "micro_breath_30",
      title: "30s Quick Breath",
      priority: "low",
    };
  }

  // Limit explanations to top 3
  const topExplanations = explanations.slice(0, 3);
  if (topExplanations.length === 0) {
    topExplanations.push("Overall indicators within normal range");
  }

  return {
    stressScore,
    confidence,
    mood,
    explanations: topExplanations,
    recommendedIntervention,
  };
}

function calculateConsistency(questions: QuestionAnswer[]): number {
  // Simple consistency check: see if related answers align
  // For now, return a baseline consistency
  const latencies = questions.map(q => q.latencyMs).filter(l => l > 0);
  if (latencies.length < 2) return 0.8;

  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const variance = latencies.reduce((a, b) => a + Math.pow(b - avgLatency, 2), 0) / latencies.length;
  const cv = Math.sqrt(variance) / avgLatency;

  // Lower CV = more consistent = higher confidence
  return Math.max(0.5, 1 - Math.min(cv, 0.5));
}

export function getMoodEmoji(mood: StressResult["mood"]): string {
  const emojiMap: Record<StressResult["mood"], string> = {
    calm: "😌",
    neutral: "😐",
    anxious: "😰",
    fatigued: "😫",
    overwhelmed: "🥵",
    motivated: "💪",
  };
  return emojiMap[mood];
}

export function getStressColor(score: number): string {
  if (score < 25) return "hsl(var(--stress-calm))";
  if (score < 45) return "hsl(var(--stress-balanced))";
  if (score < 65) return "hsl(var(--stress-rising))";
  if (score < 80) return "hsl(var(--stress-high))";
  return "hsl(var(--stress-critical))";
}
