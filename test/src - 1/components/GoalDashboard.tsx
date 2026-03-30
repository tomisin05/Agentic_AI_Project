import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Play, 
  Brain, 
  Calendar, 
  TrendingUp, 
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  Settings,
  ArrowRight,
  Flag,
  Trophy
} from 'lucide-react';
import { 
  StudyGoal, 
  GoalManager, 
  DailyRecommendation,
  GoalTask
} from '../lib/goalSystem';

interface GoalDashboardProps {
  onStartSession?: (goalId: string, taskId?: string, presetId?: string) => void;
  onOpenFlashcards?: () => void;
  onOpenScheduler?: () => void;
  onOpenGoals?: () => void;
  onViewJournal?: () => void;
}

export function GoalDashboard({ 
  onStartSession,
  onOpenFlashcards,
  onOpenScheduler,
  onOpenGoals,
  onViewJournal
}: GoalDashboardProps) {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<StudyGoal | null>(null);
  const [recommendations, setRecommendations] = useState<DailyRecommendation[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<GoalTask[]>([]);
  const [nextTask, setNextTask] = useState<{ goal: StudyGoal; task: GoalTask } | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    const activeGoals = GoalManager.getActiveGoals();
    setGoals(activeGoals);
    
    const primary = GoalManager.getPrimaryGoal();
    setPrimaryGoal(primary);
    
    const recs = GoalManager.getDailyRecommendations();
    setRecommendations(recs);
    
    const tasks = GoalManager.getTodaysTasks();
    setTodaysTasks(tasks);
    
    const next = GoalManager.getNextTask();
    setNextTask(next);
  };

  const getUrgencyColor = (urgency: DailyRecommendation['urgency']) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
    }
  };

  const getActionIcon = (action: DailyRecommendation['recommendedAction']) => {
    switch (action) {
      case 'deep-work': return <Zap className="w-5 h-5" />;
      case 'review': return <BookOpen className="w-5 h-5" />;
      case 'flashcards': return <Brain className="w-5 h-5" />;
      case 'light-study': return <Clock className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
    }
  };

  const getActionColor = (action: DailyRecommendation['recommendedAction']) => {
    switch (action) {
      case 'deep-work': return 'text-purple-600';
      case 'review': return 'text-blue-600';
      case 'flashcards': return 'text-green-600';
      case 'light-study': return 'text-yellow-600';
      case 'break': return 'text-gray-600';
    }
  };

  if (goals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Target className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-3">Let's Set Your Study Goals</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by defining what you want to achieve. Your goals will guide your study sessions,
              flashcards, and schedule - turning scattered effort into focused progress.
            </p>
            <Button size="lg" onClick={onOpenGoals}>
              <Flag className="w-5 h-5 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const topRecommendation = recommendations[0];
  const progress = primaryGoal ? GoalManager.calculateProgress(primaryGoal.id) : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Your Study Command Center</h1>
          <p className="text-muted-foreground">What should you focus on today?</p>
        </div>
        <Button variant="outline" onClick={onOpenGoals}>
          <Settings className="w-4 h-4 mr-2" />
          Manage Goals
        </Button>
      </motion.div>

      {/* Primary Goal Overview */}
      {primaryGoal && progress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-primary bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-6 h-6 text-blue-600" />
                    <CardTitle className="text-2xl">{primaryGoal.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {primaryGoal.subject}
                    {primaryGoal.deadline && (
                      <> • Deadline: {primaryGoal.deadline.toLocaleDateString()}</>
                    )}
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-lg px-3 py-1 ${
                    progress.onTrack ? 'bg-green-100 border-green-500 text-green-800' : 
                    'bg-orange-100 border-orange-500 text-orange-800'
                  }`}
                >
                  {Math.round(progress.progressPercentage)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress.progressPercentage} className="h-3" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-xl font-bold">
                    {progress.tasksCompleted}/{progress.totalTasks}
                  </div>
                  <div className="text-xs text-muted-foreground">tasks done</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="text-sm text-muted-foreground">Study Time</div>
                  <div className="text-xl font-bold">
                    {Math.round(progress.hoursCompleted)}h
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of {progress.targetHours}h goal
                  </div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="text-sm text-muted-foreground">Sessions</div>
                  <div className="text-xl font-bold">{primaryGoal.sessionsCompleted}</div>
                  <div className="text-xs text-muted-foreground">completed</div>
                </div>
                {progress.daysUntilDeadline !== undefined && (
                  <div className={`text-center p-3 rounded-lg ${
                    progress.daysUntilDeadline <= 3 ? 'bg-red-100' :
                    progress.daysUntilDeadline <= 7 ? 'bg-orange-100' :
                    'bg-white/60'
                  }`}>
                    <div className="text-sm text-muted-foreground">Days Left</div>
                    <div className={`text-xl font-bold ${
                      progress.daysUntilDeadline <= 3 ? 'text-red-600' :
                      progress.daysUntilDeadline <= 7 ? 'text-orange-600' :
                      ''
                    }`}>
                      {progress.daysUntilDeadline}
                    </div>
                    <div className="text-xs text-muted-foreground">days</div>
                  </div>
                )}
              </div>

              {/* Status Message */}
              {progress.daysUntilDeadline !== undefined && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  progress.onTrack ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {progress.onTrack ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Great! You're on track to meet your deadline
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        Need {progress.recommendedDailyMinutes} min/day to stay on schedule
                      </span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommended Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Start Next Session */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`border-2 ${topRecommendation ? getUrgencyColor(topRecommendation.urgency) : ''}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full bg-white ${topRecommendation ? getActionColor(topRecommendation.recommendedAction) : ''}`}>
                  {topRecommendation ? getActionIcon(topRecommendation.recommendedAction) : <Play className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <CardTitle>Recommended: Start Session</CardTitle>
                  <CardDescription>
                    {topRecommendation?.reasoning || 'Begin your next study session'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextTask ? (
                <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                  <div className="font-medium mb-1">Next Task: {nextTask.task.title}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    From: {nextTask.goal.title}
                  </div>
                  {nextTask.task.estimatedMinutes && (
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      ~{nextTask.task.estimatedMinutes} minutes
                    </Badge>
                  )}
                </div>
              ) : topRecommendation && (
                <div className="p-4 bg-white rounded-lg">
                  <div className="font-medium mb-2">{topRecommendation.goalTitle}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Suggested: {topRecommendation.suggestedDuration} minute session
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {topRecommendation.recommendedAction.replace('-', ' ')}
                  </Badge>
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full"
                onClick={() => {
                  if (nextTask) {
                    onStartSession?.(nextTask.goal.id, nextTask.task.id, topRecommendation?.suggestedPreset);
                  } else if (topRecommendation) {
                    onStartSession?.(topRecommendation.goalId, undefined, topRecommendation.suggestedPreset);
                  }
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Session Now
              </Button>

              {topRecommendation && topRecommendation.urgency === 'critical' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <Flame className="w-4 h-4" />
                  <span className="font-medium">Urgent - deadline approaching!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Flashcards Due */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onOpenFlashcards}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <Brain className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Review Flashcards</div>
                    <div className="text-sm text-muted-foreground">
                      Quick review session
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onOpenScheduler}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">View Schedule</div>
                    <div className="text-sm text-muted-foreground">
                      {todaysTasks.length} tasks due today
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Journal */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onViewJournal}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Continue Story</div>
                    <div className="text-sm text-muted-foreground">
                      See your progress unfold
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* All Active Goals */}
      {goals.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Active Goals ({goals.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goals.map((goal) => {
                  const goalProgress = GoalManager.calculateProgress(goal.id);
                  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date();
                  
                  return (
                    <div
                      key={goal.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{goal.title}</span>
                          <Badge variant="outline" className="text-xs">{goal.subject}</Badge>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <Progress value={goalProgress.progressPercentage} className="h-1.5 mb-2" />
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{Math.round(goalProgress.progressPercentage)}% complete</span>
                          <span>•</span>
                          <span>{goalProgress.tasksCompleted}/{goalProgress.totalTasks} tasks</span>
                          {goalProgress.daysUntilDeadline !== undefined && (
                            <>
                              <span>•</span>
                              <span>{goalProgress.daysUntilDeadline} days left</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStartSession?.(goal.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Today's Tasks */}
      {todaysTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tasks Due Today ({todaysTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-muted-foreground">{task.description}</div>
                      )}
                    </div>
                    {task.estimatedMinutes && (
                      <Badge variant="outline" className="text-xs">
                        {task.estimatedMinutes}m
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
