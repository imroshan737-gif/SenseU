// Demo data for the NeuroAura platform
export const demoUser = {
  id: "demo",
  name: "Demo Student",
  email: "demo@neuroaura.ai",
  demo: true,
  avatar: null,
  createdAt: "2025-09-01T08:00:00Z",
};

export const demoSummary = {
  stress_score: 28,
  mood: "neutral" as const,
  last_assessment: "2025-12-07T12:00:00Z",
  devices_connected: 2,
  sessions_completed: 12,
  streak_days: 7,
};

export const demoLive = {
  hr: 64,
  hrv: 42,
  stress_score: 28,
  focus_level: 85,
  energy_level: 68,
  sleep_quality: 7.5,
};

export const demoSessions = [
  {
    id: "s1",
    title: "Morning Focus Session",
    type: "focus",
    start: "2025-12-07T08:00:00Z",
    end: "2025-12-07T08:25:00Z",
    duration: 25,
    summary: "Completed 25-minute deep focus with 2 micro-breaks",
    stress_peak: 35,
    interventions: ["micro_breath_30"],
  },
  {
    id: "s2",
    title: "Stress Recovery",
    type: "recovery",
    start: "2025-12-06T14:00:00Z",
    end: "2025-12-06T14:15:00Z",
    duration: 15,
    summary: "Guided relaxation after exam preparation",
    stress_peak: 62,
    interventions: ["recovery_guided_10"],
  },
  {
    id: "s3",
    title: "Evening Wind Down",
    type: "recovery",
    start: "2025-12-05T20:00:00Z",
    end: "2025-12-05T20:10:00Z",
    duration: 10,
    summary: "Pre-sleep relaxation routine",
    stress_peak: 25,
    interventions: [],
  },
];

export const demoInterventions = [
  {
    id: "micro_breath_30",
    title: "30s Quick Breathe",
    description: "30-second calming breath exercise",
    duration: 30,
    type: "micro",
  },
  {
    id: "micro_breath_60",
    title: "60s Guided Breath",
    description: "One-minute breathing with visual guide",
    duration: 60,
    type: "micro",
  },
  {
    id: "focus_pomodoro_25",
    title: "Deep Focus",
    description: "25-minute Pomodoro with distraction blocking",
    duration: 1500,
    type: "focus",
  },
  {
    id: "recovery_guided_10",
    title: "Recovery Break",
    description: "10-minute guided relaxation session",
    duration: 600,
    type: "recovery",
  },
];

export const demoTimelineData = [
  { time: "6AM", value: 20, event: "Morning routine" },
  { time: "8AM", value: 25 },
  { time: "10AM", value: 45, event: "Study session" },
  { time: "12PM", value: 35 },
  { time: "2PM", value: 55, event: "Exam prep" },
  { time: "4PM", value: 40 },
  { time: "6PM", value: 30, event: "Break time" },
  { time: "8PM", value: 35 },
];

// Simulate real-time data streaming
export function createDemoStream(callback: (data: typeof demoLive) => void, interval = 2000) {
  let currentData = { ...demoLive };
  
  const streamInterval = setInterval(() => {
    // Simulate natural variations
    currentData = {
      hr: Math.max(55, Math.min(85, currentData.hr + (Math.random() - 0.5) * 4)),
      hrv: Math.max(30, Math.min(60, currentData.hrv + (Math.random() - 0.5) * 3)),
      stress_score: Math.max(15, Math.min(75, currentData.stress_score + (Math.random() - 0.5) * 5)),
      focus_level: Math.max(60, Math.min(100, currentData.focus_level + (Math.random() - 0.5) * 4)),
      energy_level: Math.max(50, Math.min(90, currentData.energy_level + (Math.random() - 0.5) * 3)),
      sleep_quality: currentData.sleep_quality,
    };
    callback(currentData);
  }, interval);

  return () => clearInterval(streamInterval);
}
