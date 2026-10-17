const fs = require('fs');
const path = 'src/components/common/FloatingAssistant.tsx';
let content = fs.readFileSync(path, 'utf8');

const importReplacement = `import { GoogleGenerativeAI } from '@google/generative-ai';\nimport { Bot, Send, X, Sparkles, Volume2, ArrowRight } from 'lucide-react';`;
content = content.replace(/import \{ Bot, Send, X, Sparkles, Volume2, ArrowRight \} from 'lucide-react';/, importReplacement);

const genAI = `const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'dummy_key');`;
content = content.replace(/export const FloatingAssistant: React.FC = \(\) => \{/, genAI + '\nexport const FloatingAssistant: React.FC = () => {');

// Inject full user app state for context
const appHookOld = /const \{ isAiAssistantOpen, setIsAiAssistantOpen, setActiveTab, addWater, addFoodLog \} = useApp\(\);/;
const appHookNew = `const { isAiAssistantOpen, setIsAiAssistantOpen, setActiveTab, addWater, addFoodLog, user, todayNutrition, nutritionGoal, currentStreak, currentDayNumber } = useApp();`;
content = content.replace(appHookOld, appHookNew);

// Make handleSend async
const handleSendOld = /const handleSend = \(textToSend\?: string\) => \{[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 600\);\s*\};/;
const handleSendNew = `const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    soundFx.playClick();
    const userMsg: ChatMessage = {
      id: \`msg-\${Date.now()}\`,
      sender: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is missing. Please add it to your .env.local file.");
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const weeklyPlan = localStorage.getItem('spider_tracker_weekly_text') || 'No weekly plan';
      
      const systemPrompt = \`You are Spider AI, an elite productivity and nutrition wingman for the user \${user.name}. Keep responses concise, energetic, and professional. 
      Context: Day \${user.currentDayNumber}, Level \${user.level}, XP: \${user.xp}, Streak: \${user.currentStreak}. 
      Today's Macros: \${Math.round(todayNutrition.calories)}/\${nutritionGoal.calories} kcal, Protein: \${Math.round(todayNutrition.protein)}/\${nutritionGoal.protein}g.
      Weekly Plan: \${weeklyPlan}.
      The user asked: "\${text}"\`;

      const result = await model.generateContent(systemPrompt);
      const responseText = result.response.text();

      const aiMsg: ChatMessage = {
        id: \`ai-\${Date.now()}\`,
        sender: 'ai',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
      soundFx.playMicChime();
    } catch (error: any) {
      const fallbackMsg: ChatMessage = {
        id: \`ai-\${Date.now()}\`,
        sender: 'ai',
        text: "System Error: " + (error.message || "Failed to reach AI network.")
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };`;

content = content.replace(handleSendOld, handleSendNew);

fs.writeFileSync(path, content, 'utf8');
