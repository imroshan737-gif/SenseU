// Simple client-side sentiment analysis
// Uses keyword-based approach for real-time analysis

const positiveWords = new Set([
  "happy", "good", "great", "excellent", "wonderful", "amazing", "love", "excited",
  "hopeful", "confident", "calm", "peaceful", "relaxed", "motivated", "energetic",
  "optimistic", "grateful", "thankful", "proud", "accomplished", "successful",
  "better", "improved", "progress", "healthy", "strong", "capable", "focused"
]);

const negativeWords = new Set([
  "sad", "bad", "terrible", "awful", "horrible", "hate", "worried", "anxious",
  "stressed", "overwhelmed", "exhausted", "tired", "frustrated", "angry", "upset",
  "depressed", "hopeless", "scared", "afraid", "nervous", "panic", "pressure",
  "difficult", "hard", "struggling", "failing", "behind", "lost", "confused",
  "lonely", "isolated", "worthless", "useless", "burden", "burnout", "burned"
]);

const negationWords = new Set([
  "not", "no", "never", "neither", "nobody", "nothing", "nowhere", "hardly",
  "barely", "scarcely", "don't", "doesn't", "didn't", "won't", "wouldn't",
  "couldn't", "shouldn't", "can't", "cannot", "isn't", "aren't", "wasn't"
]);

const intensifiers = new Set([
  "very", "really", "extremely", "incredibly", "absolutely", "totally",
  "completely", "utterly", "highly", "so", "too", "super"
]);

export interface SentimentResult {
  score: number; // -1 to 1
  positiveCount: number;
  negativeCount: number;
  negationCount: number;
  emotionWords: string[];
}

export function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  let negationCount = 0;
  const emotionWords: string[] = [];
  let isNegated = false;
  let intensifierMultiplier = 1;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    if (negationWords.has(word)) {
      isNegated = true;
      negationCount++;
      continue;
    }

    if (intensifiers.has(word)) {
      intensifierMultiplier = 1.5;
      continue;
    }

    if (positiveWords.has(word)) {
      if (isNegated) {
        negativeCount += intensifierMultiplier;
        emotionWords.push(`not ${word}`);
      } else {
        positiveCount += intensifierMultiplier;
        emotionWords.push(word);
      }
      isNegated = false;
      intensifierMultiplier = 1;
    } else if (negativeWords.has(word)) {
      if (isNegated) {
        positiveCount += intensifierMultiplier * 0.5; // Negated negative is weak positive
        emotionWords.push(`not ${word}`);
      } else {
        negativeCount += intensifierMultiplier;
        emotionWords.push(word);
      }
      isNegated = false;
      intensifierMultiplier = 1;
    } else {
      // Reset negation after non-emotion word
      if (i > 0 && !negationWords.has(words[i - 1])) {
        isNegated = false;
      }
      intensifierMultiplier = 1;
    }
  }

  const total = positiveCount + negativeCount;
  const score = total > 0 ? (positiveCount - negativeCount) / total : 0;

  return {
    score: Math.round(score * 100) / 100,
    positiveCount,
    negativeCount,
    negationCount,
    emotionWords: emotionWords.slice(0, 10), // Limit to 10 words
  };
}

export function getSentimentLabel(score: number): string {
  if (score >= 0.3) return "positive";
  if (score <= -0.3) return "negative";
  return "neutral";
}
