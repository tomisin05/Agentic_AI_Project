import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Lock, Sparkles, Brain, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface AISessionReflectionCardProps {
  sessionNumber: number;
  isLocked?: boolean;
  focusRating?: number;
  reflection?: string;
  mood?: string;
  task?: string;
  taskCompleted?: boolean;
}

export function AISessionReflectionCard({ 
  sessionNumber, 
  isLocked = false,
  focusRating,
  reflection,
  mood,
  task,
  taskCompleted
}: AISessionReflectionCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Generate AI insights based on session data (mock for now)
  const generateAIInsights = () => {
    if (!focusRating) return null;

    const insights = {
      focusAnalysis: focusRating >= 4 
        ? "Excellent concentration! You're in your peak performance zone."
        : focusRating >= 3
        ? "Good focus with room for improvement. Try eliminating one distraction next time."
        : "Challenging session. Consider shorter sessions or adjusting your environment.",
      
      strategy: focusRating >= 4
        ? "Maintain this momentum by studying at the same time tomorrow."
        : focusRating >= 3
        ? "Try the Pomodoro technique: 25 min work, 5 min break."
        : "Start with just 15 minutes next session to build confidence.",
      
      pattern: sessionNumber > 3
        ? "You're building consistency! 3+ sessions show commitment."
        : "Great start! Consistency is key—aim for 3 sessions this week.",
      
      moodInsight: mood === 'stressed'
        ? "Stress detected. Remember: breaks are productive too."
        : mood === 'motivated'
        ? "High motivation! Channel this energy into your toughest subjects."
        : mood === 'tired'
        ? "Low energy noticed. Consider adjusting your study schedule."
        : "Steady mood. You're maintaining good emotional balance."
    };

    return insights;
  };

  const insights = !isLocked ? generateAIInsights() : null;

  if (isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        className="relative"
      >
        <Card className="border-2 border-dashed border-muted-foreground/30 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Subtle locked overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-100/80 backdrop-blur-[2px] z-10" />
          
          <CardHeader className="relative z-20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center opacity-60">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                    AI Session Insights
                    <Lock className="w-4 h-4" />
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Unlock after completing your first study session
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-20 space-y-3">
            {/* Preview of locked content */}
            <div className="space-y-2 opacity-50">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Focus Analysis</p>
                  <div className="h-2 bg-gray-300 rounded mt-1 w-3/4"></div>
                  <div className="h-2 bg-gray-300 rounded mt-1 w-1/2"></div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Study Strategy</p>
                  <div className="h-2 bg-gray-300 rounded mt-1 w-2/3"></div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Progress Pattern</p>
                  <div className="h-2 bg-gray-300 rounded mt-1 w-3/5"></div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Hover Tooltip */}
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 right-2 z-30 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 text-yellow-300" />
                <p>Complete at least 1 session to unlock personalized AI insights and strategy.</p>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  }

  // Unlocked state with AI-generated content
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md"
                animate={{ 
                  boxShadow: [
                    "0 4px 6px rgba(168, 85, 247, 0.4)",
                    "0 6px 12px rgba(236, 72, 153, 0.4)",
                    "0 4px 6px rgba(168, 85, 247, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Session Insights
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </motion.div>
                </CardTitle>
                <CardDescription>Personalized analysis & strategies</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {insights && (
            <>
              {/* Focus Analysis */}
              <motion.div 
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-purple-900 mb-1">Focus Analysis</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.focusAnalysis}</p>
                </div>
              </motion.div>

              {/* Study Strategy */}
              <motion.div 
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Recommended Strategy</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.strategy}</p>
                </div>
              </motion.div>

              {/* Progress Pattern */}
              <motion.div 
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-green-900 mb-1">Progress Pattern</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.pattern}</p>
                </div>
              </motion.div>

              {/* Mood Insight */}
              {mood && (
                <motion.div 
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-pink-200 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-orange-900 mb-1">Mood & Energy</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{insights.moodInsight}</p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
