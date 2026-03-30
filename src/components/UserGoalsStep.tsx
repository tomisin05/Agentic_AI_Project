import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Target, Clock, GraduationCap, Brain, Award, CheckCircle2, Sparkles, Edit3 } from 'lucide-react';
import { Button } from './ui/button';

interface UserGoalsStepProps {
  goals: string[];
  onGoalsChange: (goals: string[]) => void;
}

// Simplified preset goals - 3 per category, focused on academic success + time management
const PRESET_GOALS = [
  {
    category: "Daily Focus",
    icon: <Clock className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
    goals: [
      "Study 2 focused hours every day",
      "Complete homework 30 minutes before deadline",
      "Review today's lessons for 20 minutes each evening",
    ]
  },
  {
    category: "Exam Success",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    goals: [
      "Master one chapter completely each week",
      "Practice past papers every weekend",
      "Create summary notes for all subjects",
    ]
  },
  {
    category: "Smart Learning",
    icon: <Brain className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
    goals: [
      "Learn one new concept deeply each day",
      "Teach what I learned to someone else weekly",
      "Build a consistent study routine I can maintain",
    ]
  },
];

// Default goal that's student-friendly and motivating
const DEFAULT_GOAL = "Study 2 focused hours every day and complete all homework on time";

export function UserGoalsStep({ goals, onGoalsChange }: UserGoalsStepProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGoalText, setCustomGoalText] = useState('');

  // Set default goal on mount if goals are empty
  useEffect(() => {
    if (goals.length === 0) {
      onGoalsChange([DEFAULT_GOAL]);
    }
  }, [goals, onGoalsChange]);

  const handlePresetToggle = (goal: string) => {
    if (goals.includes(goal)) {
      // Remove the goal if already selected
      onGoalsChange(goals.filter(g => g !== goal));
    } else {
      // Add the goal
      onGoalsChange([...goals, goal]);
    }
    setShowCustomInput(false);
  };

  const handleAddCustomGoal = () => {
    if (customGoalText.trim() && !goals.includes(customGoalText.trim())) {
      onGoalsChange([...goals, customGoalText.trim()]);
      setCustomGoalText('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    onGoalsChange(goals.filter(g => g !== goal));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
          <Target className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-900">Your Study Goals</span>
        </div>
        <h2 className="mb-2">What do you want to achieve?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Select multiple goals that keep you motivated!
        </p>
      </motion.div>

      {/* Current Goals Display - Big and Beautiful */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 opacity-90" />
            <div className="relative p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest mb-3 text-white/90 font-medium">
                    Your Selected Goals ({goals.length})
                  </p>
                  <div className="space-y-2">
                    {goals.map((goal, index) => (
                      <motion.div
                        key={goal}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="flex items-start justify-between gap-3 group"
                      >
                        <p className="text-white text-base md:text-lg leading-relaxed font-medium flex-1">
                          • {goal}
                        </p>
                        <button
                          onClick={() => handleRemoveGoal(goal)}
                          className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
                          aria-label="Remove goal"
                        >
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Custom Goal Writing - Prominent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/50 overflow-hidden">
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Write Your Own Goal</h3>
                  <p className="text-sm text-muted-foreground">Personalize it your way</p>
                </div>
              </div>
              <Button
                variant={showCustomInput ? "outline" : "default"}
                size="sm"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={showCustomInput ? "" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}
              >
                {showCustomInput ? "Hide" : "Customize"}
              </Button>
            </div>

            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2"
              >
                <Textarea
                  placeholder="Example: Study 3 hours daily and finish my assignments 2 days early"
                  value={customGoalText}
                  onChange={(e) => setCustomGoalText(e.target.value)}
                  className="min-h-[120px] text-base border-2 border-purple-300 focus:border-purple-500 resize-none bg-white"
                />
                <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>Tip: Be specific about time and what you want to achieve</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleAddCustomGoal}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Add Custom Goal
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Preset Goals - Clean and Spacious */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h3 className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Or choose from these popular goals
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRESET_GOALS.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + categoryIndex * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-gray-50">
                <div className="p-6 space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                      {category.icon}
                      <span className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{category.category}</h4>
                  </div>

                  {/* Goals List */}
                  <div className="space-y-2">
                    {category.goals.map((goal, goalIndex) => (
                      <motion.button
                        key={goal}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + categoryIndex * 0.1 + goalIndex * 0.05 }}
                        onClick={() => handlePresetToggle(goal)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                          goals.includes(goal)
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-relaxed ${
                            goals.includes(goal) ? 'text-purple-900 font-medium' : 'text-gray-700'
                          }`}>
                            {goal}
                          </p>
                          {goals.includes(goal) ? (
                            <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5 group-hover:border-purple-400 transition-colors" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
          <span className="text-2xl">🎯</span>
          <p className="text-sm text-green-800">
            <strong>Don't worry!</strong> You can update your goal anytime during your journey
          </p>
        </div>
      </motion.div>
    </div>
  );
}