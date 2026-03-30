import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Sparkles, Zap, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import dotenv from "dotenv";

dotenv.config();

// ⚠️ SECURITY WARNING: In production, NEVER store API keys in frontend code!
// This should be stored in a secure backend environment.
// For demo purposes only - replace with your own key
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || "sk-REPLACE_WITH_YOUR_OWN_KEY";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number; type: 'user' | 'ai'; text: string; timestamp: Date}>>([
    {
      id: 1,
      type: 'ai' as const,
      text: "Hi there! 👋 I'm your AI study companion. Ask me anything about studying, staying focused, managing time, or how to use this app!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useLocalAI, setUseLocalAI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const coolAILines = [
    "💡 Need study tips? Ask me!",
    "🎯 Struggling to focus? I can help!",
    "📚 Let's boost your productivity!",
    "⏰ Questions about time management?",
    "🧠 Want better study techniques?",
    "✨ AI study help available!",
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fallback: Smart local AI responses (keyword-based)
  const getLocalAIResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase();

    // Focus & Concentration
    if (question.includes('focus') || question.includes('concentrate') || question.includes('distract')) {
      const focusResponses = [
        "🎯 **Staying Focused Tips:**\n\n1. Remove distractions - Put your phone in another room\n2. Use the Pomodoro timer - 25 min work, 5 min break\n3. One task at a time - Don't multitask\n4. Clean, quiet environment with good lighting\n\nTry these during your next session! 💪",
        "**Beat Distractions:**\n\n✅ Turn off ALL notifications\n✅ Tell others you're in focus mode\n✅ Use noise-canceling headphones\n✅ Set clear goals before starting\n\nYour brain needs 15-20 minutes to enter deep focus! 🧠",
      ];
      return focusResponses[Math.floor(Math.random() * focusResponses.length)];
    }

    // Pomodoro & Timer
    if (question.includes('pomodoro') || question.includes('timer') || question.includes('session') || question.includes('how long')) {
      return "⏱️ **How Pomodoro Works:**\n\n🔹 Work: 25 minutes focused study\n🔹 Short Break: 5 minutes to recharge\n🔹 After 4 sessions: Take 15-30 min break\n\n**Why it works:** Keeps your brain fresh and prevents burnout. Start a session now! 📚✨";
    }

    // Motivation
    if (question.includes('motivat') || question.includes('lazy') || question.includes('tired') || question.includes('give up')) {
      const motivationResponses = [
        "💪 **Motivation Boost:**\n\nYou don't need motivation to START. Start anyway, and motivation follows action!\n\n🌟 Quick wins:\n• Set a tiny goal (just 10 minutes)\n• Reward yourself after\n• Visualize your success\n\nYou've got this! 🚀",
        "**Feeling Unmotivated?**\n\n1. Future You will thank Present You\n2. Start ugly - doesn't have to be perfect\n3. Just 1 Pomodoro - commit to 25 minutes only\n\nThe hardest part is starting! 💎",
      ];
      return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
    }

    // Study techniques & methods
    if (question.includes('study') || question.includes('learn') || question.includes('remember') || question.includes('technique')) {
      return "📚 **Effective Study Techniques:**\n\n1. **Active Recall** - Test yourself\n2. **Spaced Repetition** - Review over time\n3. **Feynman Technique** - Explain simply\n4. **Practice Problems** - Apply knowledge\n5. **Teach Someone** - Best way to master\n\nQuality > Quantity! 🧠✨";
    }

    // Time management
    if (question.includes('time') || question.includes('schedule') || question.includes('plan') || question.includes('organiz')) {
      return "⏰ **Time Management Mastery:**\n\n✅ Prioritize: Urgent + Important first\n✅ Time block: Schedule study times\n✅ Break it down: Big tasks → small chunks\n✅ Use this app: Track focused hours\n✅ Buffer time: Add extra for unexpected\n\n**Pro tip:** Study hardest subjects when most alert! 🌅";
    }

    // Breaks & rest
    if (question.includes('break') || question.includes('rest') || question.includes('relax')) {
      return "🌿 **Smart Break Ideas (5 min):**\n\n• Stretch or walk around\n• Drink water & healthy snack\n• Close eyes and breathe deeply\n• Look outside (rest your eyes)\n• Listen to a favorite song\n\n**Don't:** Scroll social media!\n**Do:** Move and refresh! 💚";
    }

    // Exams & tests
    if (question.includes('exam') || question.includes('test') || question.includes('quiz') || question.includes('grade')) {
      return "📝 **Ace Your Exams:**\n\n**Before:**\n✅ Start studying 2 weeks early\n✅ Practice past papers\n✅ Create summary sheets\n✅ Sleep 7-8 hours night before\n\n**During:**\n• Read all questions first\n• Start with easy ones\n• Manage your time\n\nYou've got this! 🏆";
    }

    // Goals
    if (question.includes('goal') || question.includes('target') || question.includes('achieve')) {
      return "🎯 **Setting SMART Goals:**\n\n• **S**pecific - Clear and detailed\n• **M**easurable - Track progress\n• **A**chievable - Realistic\n• **R**elevant - Matters to you\n• **T**ime-bound - Set deadlines\n\nExample: \"Study math 1 hour daily for 30 days\" instead of \"study more\" 🌟";
    }

    // App usage
    if (question.includes('how to') || question.includes('use this') || question.includes('app') || question.includes('feature')) {
      return "📱 **How to Use This App:**\n\n1. Set your goal\n2. Start a session (Pomodoro timer)\n3. Stay focused for 25 minutes\n4. Check in after each session\n5. Watch your story progress!\n6. View journal to see history\n\n**Tip:** Skip timers in demo mode! 🎮";
    }

    // Homework
    if (question.includes('homework') || question.includes('assignment') || question.includes('project')) {
      return "📋 **Homework Strategy:**\n\n1. List all assignments\n2. Prioritize by due date + difficulty\n3. Estimate time needed\n4. Break into 25-min Pomodoro chunks\n5. Start with hardest when energy is high\n6. Track progress & check off\n\nDon't procrastinate! ✅";
    }

    // Memory
    if (question.includes('memory') || question.includes('forget') || question.includes('retain')) {
      return "🧠 **Remember Better:**\n\n**During Study:**\n• Create mental connections\n• Use mnemonics & acronyms\n• Draw diagrams & mind maps\n• Say it out loud\n• Write by hand\n\n**After:**\n• Review within 24 hours\n• Space out reviews\n• Sleep is crucial! 😴✨";
    }

    // Procrastination
    if (question.includes('procrastinat') || question.includes('delay') || question.includes('avoid')) {
      return "⚡ **Beat Procrastination:**\n\n**Solutions:**\n1. 2-minute rule - Just start for 2 min\n2. Make it tiny - Smallest possible step\n3. Remove friction - Set up study space\n4. Accountability - Tell someone\n5. Reward yourself\n\nAction creates motivation! Start now 🚀";
    }

    // Stress & anxiety
    if (question.includes('stress') || question.includes('anxious') || question.includes('overwhelm') || question.includes('pressure')) {
      return "🌸 **Managing Study Stress:**\n\n**Immediate:**\n• 4-7-8 breathing (in 4, hold 7, out 8)\n• Take a short walk\n• Talk to someone\n• Write down worries\n\n**Long-term:**\n• Break tasks smaller\n• Start early\n• Exercise regularly\n• Sleep 7-9 hours\n\nYou're doing great! 💙";
    }

    // Default response
    return "I can help you with:\n\n📚 Study techniques & learning\n⏱️ Time management & planning\n🎯 Focus & concentration\n💪 Motivation & procrastination\n📝 Exam preparation\n🧠 Memory techniques\n📱 Using this app\n\nWhat would you like to know?";
  };

  // Try OpenAI API, fallback to local AI
  const getAIResponse = async (userQuestion: string): Promise<string> => {
    // If we've already determined to use local AI, skip API call
    if (useLocalAI) {
      return getLocalAIResponse(userQuestion);
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful AI study companion for students. Provide friendly, encouraging advice about study techniques, time management, focus, exam prep, motivation, and stress. Keep responses concise (2-4 sentences or bullets), practical, and student-friendly. Use emojis occasionally.`
            },
            {
              role: "user",
              content: userQuestion
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // If quota exceeded, switch to local AI permanently
        if (errorData.error?.message?.includes('quota')) {
          console.log('OpenAI quota exceeded, switching to local AI mode');
          setUseLocalAI(true);
          return getLocalAIResponse(userQuestion);
        }
        
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || getLocalAIResponse(userQuestion);
    } catch (error) {
      console.log('Using local AI due to API error:', error);
      // Fallback to local AI on any error
      return getLocalAIResponse(userQuestion);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessageText = inputValue.trim();
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      text: userMessageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Small delay for natural feel
    setTimeout(async () => {
      try {
        const aiResponse = await getAIResponse(userMessageText);
        
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai' as const,
          text: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error:', error);
        // Even on error, try local response
        const fallbackResponse = getLocalAIResponse(userMessageText);
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai' as const,
          text: fallbackResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-80 h-96 flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 border-2 border-purple-200 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium">AI Study Sage</h3>
                    <p className="text-xs text-purple-100">Your digital mentor</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-white border border-purple-200 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start"
                  >
                    <div
                      className="max-w-[80%] p-3 rounded-lg text-sm bg-white border border-purple-200 rounded-bl-sm shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask your AI study companion..."
                    className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-3"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button - Smaller and subtle */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="sm"
          className="relative bg-gradient-to-r from-slate-600 to-purple-600 hover:from-slate-700 hover:to-purple-700 text-white rounded-full w-12 h-12 p-0 shadow-md hover:shadow-lg transition-all"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          </motion.div>
          
          {/* Pulsing dot indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Button>
      </motion.div>

      {/* Cool tagline tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 1 }}
            className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-lg text-xs shadow-lg">
              {coolAILines[Math.floor(Math.random() * coolAILines.length)]}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-l-4 border-l-purple-600 border-y-4 border-y-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}