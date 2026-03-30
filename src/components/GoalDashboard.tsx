import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Target, 
  Play, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  Goal,
  getGoalsFromStorage,
  calculateGoalProgress,
  getDailyRecommendation
} from '../lib/goalSystem';

interface GoalDashboardProps {
  onStartSession?: () => void;
  onOpenGoalSetup?: () => void;
  onOpenScheduler?: () => void;
  onOpenFlashcards?: () => void;
  onOpenJournal?: () => void;
}

export function GoalDashboard({
  onStartSession,
  onOpenGoalSetup,
  onOpenScheduler,
  onOpenFlashcards,
  onOpenJournal
}: GoalDashboardProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recommendation, setRecommendation] = useState<ReturnType<typeof getDailyRecommendation>>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const loadedGoals = getGoalsFromStorage();
    setGoals(loadedGoals);
    
    if (loadedGoals.length > 0) {
      const rec = getDailyRecommendation(loadedGoals);
      setRecommendation(rec);
    }
  };

  const activeGoals = goals.filter(g => !g.isArchived && !g.completedAt);
  
  if (activeGoals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Let's Set Your Study Goals</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Transform scattered study sessions into a focused journey. Define your goals, and we'll guide you toward achievement with personalized recommendations and story-driven motivation.
            </p>
            <Button
              size="lg"
              onClick={onOpenGoalSetup}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6"
            >
              <Target className="w-5 h-5 mr-2" />
              Create Your First Goal
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const primaryGoal = activeGoals[0];
  const primaryProgress = calculateGoalProgress(primaryGoal);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'from-red-500 to-orange-600';
      case 'high': return 'from-orange-500 to-amber-600';
      case 'medium': return 'from-blue-500 to-indigo-600';
      default: return 'from-green-500 to-emerald-600';
    }
  };

  const getUrgencyBadgeColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Study Command Center
            </h1>
            <Button
              onClick={onOpenGoalSetup}
              variant="outline"
              className="border-2 border-indigo-300"
            >
              <Target className="w-4 h-4 mr-2" />
              Manage Goals
            </Button>
          </div>
          <p className="text-muted-foreground">
            Focus on what matters. Let's tackle your goals together.
          </p>
        </motion.div>

        {/* Main Recommendation Card */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className={`p-6 bg-gradient-to-r ${getUrgencyColor(recommendation.urgency)} text-white border-0 shadow-lg`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium opacity-90">RECOMMENDED ACTION</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {recommendation.urgency === 'critical' && '🚨 '}
                    {recommendation.goalTitle}
                  </h2>
                  <p className="text-white/90 text-lg mb-3">{recommendation.reason}</p>
                  
                  {recommendation.nextTask && (
                    <div className="bg-white/20 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium mb-1">Next Task:</p>
                      <p className="text-lg">{recommendation.nextTask.title}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recommendation.recommendedDuration} minutes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="capitalize">{recommendation.recommendedAction.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
                
                <Badge className={`${getUrgencyBadgeColor(recommendation.urgency)} text-white border-0 text-xs uppercase`}>
                  {recommendation.urgency}
                </Badge>
              </div>
              
              <Button
                size="lg"
                onClick={onStartSession}
                className="w-full bg-white text-indigo-700 hover:bg-gray-50 font-bold text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Session Now
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <Button
            onClick={onOpenFlashcards}
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-purple-200 hover:bg-purple-50"
          >
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>Flashcards</span>
          </Button>
          
          <Button
            onClick={onOpenScheduler}
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-blue-200 hover:bg-blue-50"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Scheduler</span>
          </Button>
          
          <Button
            onClick={onOpenJournal}
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-emerald-200 hover:bg-emerald-50"
          >
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Journal</span>
          </Button>
          
          <Button
            onClick={onOpenGoalSetup}
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-indigo-200 hover:bg-indigo-50"
          >
            <Target className="w-5 h-5 text-indigo-600" />
            <span>All Goals</span>
          </Button>
        </motion.div>

        {/* Active Goals Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map((goal, index) => {
              const progress = calculateGoalProgress(goal);
              const isOnTrack = progress.isOnTrack;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.subject}</p>
                      </div>
                      {isOnTrack ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(progress.progressPercentage)}%</span>
                      </div>
                      <Progress value={progress.progressPercentage} className="h-2" />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <span>{progress.tasksCompleted} / {progress.totalTasks} tasks</span>
                        {progress.daysRemaining !== undefined && (
                          <span className={progress.daysRemaining <= 3 ? 'text-red-600 font-medium' : ''}>
                            {progress.daysRemaining}d left
                          </span>
                        )}
                      </div>
                      
                      {!isOnTrack && progress.recommendedDailyMinutes > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
                          <p className="text-xs text-amber-800">
                            Need {progress.recommendedDailyMinutes} min/day to stay on track
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
