import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  Target, 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Trash2, 
  Edit,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Flag,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  StudyGoal, 
  GoalTask, 
  GoalManager, 
  GoalType, 
  GoalPriority,
  TaskStatus 
} from '../lib/goalSystem';
import { 
  generateDescriptionSuggestions, 
  generateBestDescription,
  getDescriptionTips 
} from '../lib/goalDescriptionAI';

interface GoalSetupProps {
  onClose?: () => void;
  onGoalCreated?: (goal: StudyGoal) => void;
}

export function GoalSetup({ onClose, onGoalCreated }: GoalSetupProps) {
  const [goals, setGoals] = useState<StudyGoal[]>(GoalManager.getGoals());
  const [isCreating, setIsCreating] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedGoalForTask, setSelectedGoalForTask] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    title: '',
    subject: '',
    description: '',
    type: 'exam',
    priority: 'medium',
    targetHours: 20,
    dailyCommitment: 30,
    tasks: []
  });

  const [newTask, setNewTask] = useState<Partial<GoalTask>>({
    title: '',
    description: '',
    estimatedMinutes: 30,
    tags: []
  });

  const loadGoals = () => {
    setGoals(GoalManager.getGoals());
  };

  const createGoal = () => {
    if (!newGoal.title?.trim() || !newGoal.subject?.trim()) {
      toast.error('Please enter a title and subject');
      return;
    }

    const goal = GoalManager.createGoal({
      title: newGoal.title.trim(),
      subject: newGoal.subject.trim(),
      description: newGoal.description || '',
      type: newGoal.type || 'exam',
      priority: newGoal.priority || 'medium',
      deadline: newGoal.deadline,
      targetHours: newGoal.targetHours,
      dailyCommitment: newGoal.dailyCommitment,
      weeklyCommitment: newGoal.weeklyCommitment,
      preferredStudyTimes: newGoal.preferredStudyTimes,
      tasks: newGoal.tasks || []
    });

    loadGoals();
    setIsCreating(false);
    setNewGoal({
      title: '',
      subject: '',
      description: '',
      type: 'exam',
      priority: 'medium',
      targetHours: 20,
      dailyCommitment: 30,
      tasks: []
    });
    setShowSuggestions(false);
    setSuggestions([]);
    
    toast.success(`Goal \"${goal.title}\" created!`);
    onGoalCreated?.(goal);
  };

  const updateGoal = (goalId: string, updates: Partial<StudyGoal>) => {
    GoalManager.updateGoal(goalId, updates);
    loadGoals();
    toast.success('Goal updated!');
  };

  const deleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      GoalManager.deleteGoal(goalId);
      loadGoals();
      toast.success('Goal deleted');
    }
  };

  const addTask = () => {
    if (!selectedGoalForTask || !newTask.title?.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    GoalManager.addTask(selectedGoalForTask, {
      title: newTask.title.trim(),
      description: newTask.description,
      estimatedMinutes: newTask.estimatedMinutes,
      dueDate: newTask.dueDate,
      tags: newTask.tags || []
    });

    loadGoals();
    setIsAddingTask(false);
    setSelectedGoalForTask(null);
    setNewTask({
      title: '',
      description: '',
      estimatedMinutes: 30,
      tags: []
    });
    
    toast.success('Task added!');
  };

  const updateTask = (goalId: string, taskId: string, updates: Partial<GoalTask>) => {
    GoalManager.updateTask(goalId, taskId, updates);
    loadGoals();
  };

  const deleteTask = (goalId: string, taskId: string) => {
    GoalManager.deleteTask(goalId, taskId);
    loadGoals();
    toast.success('Task deleted');
  };

  // AI Description Suggestion Handler
  const handleGenerateSuggestions = () => {
    if (!newGoal.title?.trim() || !newGoal.subject?.trim()) {
      toast.error('Please enter a title and subject first');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing delay for better UX
    setTimeout(() => {
      const generatedSuggestions = generateDescriptionSuggestions({
        title: newGoal.title!,
        subject: newGoal.subject!,
        type: newGoal.type || 'exam'
      }, 3);
      
      setSuggestions(generatedSuggestions);
      setShowSuggestions(true);
      setIsGenerating(false);
      
      if (generatedSuggestions.length > 0) {
        toast.success('AI suggestions generated!');
      }
    }, 500);
  };

  const applySuggestion = (suggestion: string) => {
    setNewGoal({ ...newGoal, description: suggestion });
    setShowSuggestions(false);
    toast.success('Description applied!');
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Circle className="w-4 h-4 text-blue-600 fill-blue-600" />;
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: GoalPriority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getTypeIcon = (type: GoalType) => {
    switch (type) {
      case 'exam': return '📝';
      case 'project': return '🎯';
      case 'skill': return '🎓';
      case 'course': return '📚';
      case 'certification': return '🏆';
      case 'personal': return '⭐';
    }
  };

  const activeGoals = goals.filter(g => g.isActive && !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Study Goals</h1>
            <p className="text-muted-foreground">Define your objectives and track progress</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Goals ({activeGoals.length})</h2>
        
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No active goals</h3>
              <p className="text-muted-foreground mb-4">
                Create your first study goal to get started
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeGoals.map((goal) => {
              const progress = GoalManager.calculateProgress(goal.id);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{getTypeIcon(goal.type)}</span>
                            <CardTitle>{goal.title}</CardTitle>
                            <Badge variant="outline">{goal.subject}</Badge>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(goal.priority)}`} />
                          </div>
                          {goal.description && (
                            <CardDescription>{goal.description}</CardDescription>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingGoal(goal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium">Progress</span>
                          <span className="text-muted-foreground">
                            {Math.round(progress.progressPercentage)}%
                          </span>
                        </div>
                        <Progress value={progress.progressPercentage} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm text-muted-foreground">Tasks</div>
                          <div className="text-lg font-medium">
                            {progress.tasksCompleted}/{progress.totalTasks}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm text-muted-foreground">Hours</div>
                          <div className="text-lg font-medium">
                            {Math.round(progress.hoursCompleted * 10) / 10}/{progress.targetHours}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm text-muted-foreground">Sessions</div>
                          <div className="text-lg font-medium">{goal.sessionsCompleted}</div>
                        </div>
                        {progress.daysUntilDeadline !== undefined && (
                          <div className={`text-center p-3 rounded-lg ${
                            progress.daysUntilDeadline <= 3 ? 'bg-red-50' :
                            progress.daysUntilDeadline <= 7 ? 'bg-orange-50' :
                            'bg-muted/50'
                          }`}>
                            <div className="text-sm text-muted-foreground">Days Left</div>
                            <div className={`text-lg font-medium ${
                              progress.daysUntilDeadline <= 3 ? 'text-red-600' :
                              progress.daysUntilDeadline <= 7 ? 'text-orange-600' :
                              ''
                            }`}>
                              {progress.daysUntilDeadline}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* On Track Status */}
                      {progress.daysUntilDeadline !== undefined && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${
                          progress.onTrack ? 'bg-green-50' : 'bg-orange-50'
                        }`}>
                          <TrendingUp className={`w-4 h-4 ${
                            progress.onTrack ? 'text-green-600' : 'text-orange-600'
                          }`} />
                          <span className={`text-sm ${
                            progress.onTrack ? 'text-green-800' : 'text-orange-800'
                          }`}>
                            {progress.onTrack 
                              ? 'On track to meet deadline' 
                              : `Need ${progress.recommendedDailyMinutes} min/day to stay on track`
                            }
                          </span>
                        </div>
                      )}

                      {/* Tasks */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Tasks ({goal.tasks.length})</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedGoalForTask(goal.id);
                              setIsAddingTask(true);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Task
                          </Button>
                        </div>
                        
                        {goal.tasks.length === 0 ? (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            No tasks yet. Add tasks to break down your goal.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {goal.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                              >
                                <button
                                  onClick={() => {
                                    const newStatus: TaskStatus = 
                                      task.status === 'completed' ? 'not-started' :
                                      task.status === 'not-started' ? 'in-progress' :
                                      'completed';
                                    updateTask(goal.id, task.id, { status: newStatus });
                                  }}
                                >
                                  {getStatusIcon(task.status)}
                                </button>
                                <div className="flex-1">
                                  <div className={`text-sm ${
                                    task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                                  }`}>
                                    {task.title}
                                  </div>
                                  {task.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {task.description}
                                    </div>
                                  )}
                                </div>
                                {task.estimatedMinutes && (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.estimatedMinutes}m
                                  </Badge>
                                )}
                                {task.dueDate && (
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTask(goal.id, task.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Completed Goals ({completedGoals.length})</h2>
          <div className="grid gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <CardTitle className="line-through">{goal.title}</CardTitle>
                    <Badge variant="outline">{goal.subject}</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Goal Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Study Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Pass Linear Algebra Exam"
                  value={newGoal.title || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics"
                  value={newGoal.subject || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, subject: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newGoal.type} 
                  onValueChange={(value: GoalType) => setNewGoal({ ...newGoal, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">📝 Exam</SelectItem>
                    <SelectItem value="project">🎯 Project</SelectItem>
                    <SelectItem value="skill">🎓 Skill</SelectItem>
                    <SelectItem value="course">📚 Course</SelectItem>
                    <SelectItem value="certification">🏆 Certification</SelectItem>
                    <SelectItem value="personal">⭐ Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What do you want to achieve?"
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows={3}
                />
                <div className="mt-2 space-y-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating || !newGoal.title?.trim() || !newGoal.subject?.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating AI Suggestions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Description Suggestions
                      </>
                    )}
                  </Button>
                  
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Click a suggestion to use it:
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowSuggestions(false)}
                          >
                            Hide
                          </Button>
                        </div>
                        {suggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg cursor-pointer hover:shadow-md transition-all group"
                            onClick={() => applySuggestion(suggestion)}
                          >
                            <Sparkles className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0 group-hover:animate-pulse" />
                            <p className="text-sm flex-1">{suggestion}</p>
                            <CheckCircle2 className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!showSuggestions && newGoal.type && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        💡 Tip: {getDescriptionTips(newGoal.type)[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newGoal.priority} 
                  onValueChange={(value: GoalPriority) => setNewGoal({ ...newGoal, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deadline">Deadline (optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline ? newGoal.deadline.toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewGoal({ 
                    ...newGoal, 
                    deadline: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>

              <div>
                <Label htmlFor="targetHours">Target Hours</Label>
                <Input
                  id="targetHours"
                  type="number"
                  min="1"
                  placeholder="20"
                  value={newGoal.targetHours || ''}
                  onChange={(e) => setNewGoal({ 
                    ...newGoal, 
                    targetHours: parseInt(e.target.value) || undefined 
                  })}
                />
              </div>

              <div>
                <Label htmlFor="dailyCommitment">Daily Commitment (minutes)</Label>
                <Input
                  id="dailyCommitment"
                  type="number"
                  min="5"
                  placeholder="30"
                  value={newGoal.dailyCommitment || ''}
                  onChange={(e) => setNewGoal({ 
                    ...newGoal, 
                    dailyCommitment: parseInt(e.target.value) || undefined 
                  })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={createGoal}>
              <Flag className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="task-title">Task Title *</Label>
              <Input
                id="task-title"
                placeholder="e.g., Review Chapter 3"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Additional details..."
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-minutes">Estimated Minutes</Label>
                <Input
                  id="task-minutes"
                  type="number"
                  min="5"
                  value={newTask.estimatedMinutes || 30}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    estimatedMinutes: parseInt(e.target.value) || 30 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="task-due">Due Date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={newTask.dueDate ? newTask.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    dueDate: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>
              Cancel
            </Button>
            <Button onClick={addTask}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}