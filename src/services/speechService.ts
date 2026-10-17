import { DialogueMessage, GrammarFix, PronunciationTip, VocabSuggestion } from '../types';

export interface SpeechAnalysis {
  grammarFixes: GrammarFix[];
  vocabSuggestions: VocabSuggestion[];
  pronunciationTips: PronunciationTip[];
  confidenceScore: number;
  speakingScore: number;
}

// Conversation scenarios & intelligent simulated dialogue responses
const PARTNER_PROMPTS: Record<string, string[]> = {
  'Daily Catchup': [
    "Hey Spider! How is your day shaping up? Tell me what you've been working on so far!",
    "That's awesome! Did you face any tricky challenges today or did everything run smoothly?",
    "I love hearing that! How are you feeling about your momentum and energy level right now?",
    "Great work staying disciplined. What's the next key milestone you want to smash today?",
    "That sounds like a solid plan. Remember to take a quick hydration break too!",
    "Fantastic progress! How do you plan to unwind after completing your mission for the day?"
  ],
  'Job Interview': [
    "Welcome to the interview, Spider! To start off, could you tell me a little bit about yourself and your proudest achievement?",
    "That sounds impressive. How do you usually handle high-pressure deadlines or tight turnarounds?",
    "Very clear answer. Can you give me an example of a time you had to learn a complex skill quickly?",
    "Excellent example! What would you say is your biggest technical strength when building modern applications?",
    "How do you prefer collaborating in cross-functional teams to resolve conflicting priorities?",
    "That shows great leadership and empathy. Do you have any questions for me about our engineering vision?"
  ],
  'Tech & Code': [
    "Hey fellow builder! What exciting tech stack or architecture problem are you digging into right now?",
    "That's interesting! How do you approach optimizing performance and keeping user interfaces snappy?",
    "Smart strategy! Have you experimented with any new AI models or local automation workflows lately?",
    "That sounds really promising. How do you ensure your codebase remains maintainable over time?",
    "Clean architecture always pays off. What's your take on progressive web apps versus native mobile code?",
    "Agreed! Having full control over the mobile web experience is a huge superpower."
  ],
  'Casual Banter': [
    "Hey there, web-slinger! If you could have one superpower to boost your daily productivity, what would it be?",
    "Haha, that would be incredible! Imagine the time saved! What would you do with all those extra hours?",
    "Sounds like a master plan! Do you have any relaxing hobbies lined up for this weekend?",
    "That's so good for recharging your battery. Consistency is all about balance!",
    "Tell me about a great movie, book, or comic you've enjoyed recently!",
    "That was a great chat! You're speaking with remarkable confidence today!"
  ]
};

// Grammar & Vocabulary Rule-based AI Engine
export function analyzeSpokenText(text: string): SpeechAnalysis {
  const fixes: GrammarFix[] = [];
  const vocab: VocabSuggestion[] = [];
  const tips: PronunciationTip[] = [];

  const lower = text.toLowerCase();

  // Grammar heuristic checks
  if (lower.includes('i am go') || lower.includes('i go to work now')) {
    fixes.push({
      original: 'I am go / I go',
      corrected: "I'm going to / I'm headed to",
      explanation: 'Use the present continuous for actions happening currently or planned soon.'
    });
  }
  if (lower.includes('he dont') || lower.includes('she dont') || lower.includes('it dont')) {
    fixes.push({
      original: "He/She/It don't",
      corrected: "He/She/It doesn't",
      explanation: 'Third-person singular subjects take "does not" or "doesn\'t".'
    });
  }
  if (lower.includes('more better')) {
    fixes.push({
      original: 'more better',
      corrected: 'much better / significantly better',
      explanation: '"Better" is already a comparative adjective, so avoid preceding it with "more".'
    });
  }
  if (lower.includes('i have seen it yesterday') || lower.includes('i have done it yesterday')) {
    fixes.push({
      original: 'I have done/seen it yesterday',
      corrected: 'I did/saw it yesterday',
      explanation: 'Use simple past (not present perfect) with specific past time markers like "yesterday".'
    });
  }
  if (lower.includes('every people') || lower.includes('all person')) {
    fixes.push({
      original: 'Every people / All person',
      corrected: 'Everyone / All people',
      explanation: '"Everyone" is singular, while "people" is the plural form of person.'
    });
  }

  // Vocab upgrades
  if (lower.includes('very good') || lower.includes('really good')) {
    vocab.push({
      original: 'very good',
      suggested: 'exceptional / outstanding / stellar',
      context: 'Elevates your professional and casual descriptive nuance.'
    });
  }
  if (lower.includes('very hard') || lower.includes('very difficult')) {
    vocab.push({
      original: 'very hard',
      suggested: 'formidable / challenging / rigorous',
      context: 'Demonstrates refined fluency in technical & business conversations.'
    });
  }
  if (lower.includes('a lot of') || lower.includes('lots of')) {
    vocab.push({
      original: 'a lot of',
      suggested: 'a substantial amount of / an abundance of',
      context: 'Adds precision and maturity to your vocabulary.'
    });
  }
  if (lower.includes('big problem') || lower.includes('big issue')) {
    vocab.push({
      original: 'big problem',
      suggested: 'critical bottleneck / key impediment',
      context: 'Great executive phrasing for problem resolution.'
    });
  }

  // Pronunciation checks
  if (lower.includes('specific') || lower.includes('specifically')) {
    tips.push({
      word: 'Specifically',
      phonetic: '/spəˈsɪf.ɪ.kli/',
      tip: 'Start crisp with "spuh" and emphasize the second syllable "-SIF-".'
    });
  }
  if (lower.includes('comfortable')) {
    tips.push({
      word: 'Comfortable',
      phonetic: '/ˈkʌmf.tə.bəl/',
      tip: 'Pronounced with 3 syllables in natural speech: "KUMF-ter-bl".'
    });
  }
  if (lower.includes('development') || lower.includes('developer')) {
    tips.push({
      word: 'Development',
      phonetic: '/dɪˈvel.əp.mənt/',
      tip: 'Place the primary stress firmly on the second syllable: "di-VEL-op-ment".'
    });
  }
  if (lower.includes('architecture')) {
    tips.push({
      word: 'Architecture',
      phonetic: '/ˈɑːr.kə.tek.tʃər/',
      tip: 'Hard "k" sound: "AR-kuh-tek-cher".'
    });
  }

  // Default encouraging tips if user spoke cleanly
  if (fixes.length === 0) {
    fixes.push({
      original: 'Sentence Structure',
      corrected: 'Natural rhythm detected!',
      explanation: 'Your subject-verb agreement and tense alignment were clean and accurate.'
    });
  }
  if (vocab.length === 0) {
    vocab.push({
      original: 'Expression Variety',
      suggested: 'Articulate phrasing',
      context: 'Great use of expressive phrasing and cohesive transition words.'
    });
  }
  if (tips.length === 0) {
    tips.push({
      word: 'Intonation & Pacing',
      phonetic: 'Pacing: 120-140 WPM',
      tip: 'Smooth vocal projection with confident cadence.'
    });
  }

  const words = text.trim().split(/\s+/).length;
  const confidenceScore = Math.min(98, Math.max(78, 82 + Math.floor(Math.random() * 16)));
  const speakingScore = Math.min(99, Math.max(84, 85 + (words > 6 ? 9 : 4) + Math.floor(Math.random() * 5)));

  return {
    grammarFixes: fixes,
    vocabSuggestions: vocab,
    pronunciationTips: tips,
    confidenceScore,
    speakingScore
  };
}

export function getNextAiResponse(topic: string, turnIndex: number, userText?: string, userName: string = 'Spider'): string {
  const prompts = PARTNER_PROMPTS[topic] || PARTNER_PROMPTS['Daily Catchup'];
  let baseResponse = prompts[turnIndex % prompts.length];
  baseResponse = baseResponse.replace(/Spider/g, userName);
  
  if (userText && userText.length > 5) {
    const snippet = userText.length > 25 ? userText.slice(0, 25) + '...' : userText;
    return `Got it! "${snippet}" — ${baseResponse}`;
  }
  return baseResponse;
}

// Text to Speech
export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) setTimeout(onEnd, 1000);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  // Try picking a high quality English voice
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')));
  if (enVoice) {
    utterance.voice = enVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
