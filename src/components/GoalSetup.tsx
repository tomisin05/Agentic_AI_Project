import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Target,
  Plus,
  Trash2,
  Save,
  X,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  Clock,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Goal,
  Task,
  GoalType,
  GoalPriority,
  TaskStatus,
  getGoalsFromStorage,
  saveGoalsToStorage,
  createGoal,
  updateGoal,
  deleteGoal,
  addTaskToGoal,
  updateTask,
  deleteTask,
  calculateGoalProgress
} from '../lib/goalSystem';
import { generateDescriptionSuggestions, getContextualTips } from '../lib/goalDescriptionAI';

interface GoalSetupProps {
  onClose?: () => void;
}

export function GoalSetup({ onClose }: GoalSetupProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    description: '',
    type: 'exam',
    priority: 'medium',
    subject: '',
    deadline: '',
    targetHours: 20,
    dailyCommitmentMinutes: 60,
    tasks: []
  });

  const [aiSuggestions, setAiSuggestions] = useState<Array<{text: string; tip: string}>>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const loadedGoals = getGoalsFromStorage();
    setGoals(loadedGoals);
  };

  const handleGenerateDescriptions = () => {
    if (formData.title && formData.subject && formData.type) {
      const suggestions = generateDescriptionSuggestions(
        formData.title,
        formData.subject,
        formData.type as GoalType
      );
      setAiSuggestions(suggestions);
      setShowAiSuggestions(true);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setFormData({ ...formData, description: text });
    setShowAiSuggestions(false);
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      type: 'exam',
      priority: 'medium',
      subject: '',
      deadline: '',
      targetHours: 20,
      dailyCommitmentMinutes: 60,
      tasks: []
    });
    setShowAiSuggestions(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsCreatingNew(false);
    setFormData(goal);
    setShowAiSuggestions(false);
  };

  const handleSaveGoal = () => {
    if (!formData.title || !formData.subject) {
      alert('Please fill in title and subject');
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, formData as Partial<Goal>);
    } else {
      createGoal(formData as any);
    }

    setIsCreatingNew(false);
    setEditingGoal(null);
    loadGoals();
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
      loadGoals();
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    if (editingGoal) {
      addTaskToGoal(editingGoal.id, {
        title: newTaskTitle,
        status: 'not-started'
      });
      loadGoals();
      setNewTaskTitle('');
      // Reload form data
      const updated = getGoalsFromStorage().find(g => g.id === editingGoal.id);
      if (updated) {
        setFormData(updated);
        setEditingGoal(updated);
      }
    } else {
      // Add to form data for new goal
      setFormData({
        ...formData,
        tasks: [
          ...(formData.tasks || []),
          {
            id: `temp-${Date.now()}`,
            title: newTaskTitle,
            status: 'not-started'
          } as Task
        ]
      });
      setNewTaskTitle('');
    }
  };

  const handleToggleTaskStatus = (taskId: string) => {
    if (editingGoal) {
      const task = editingGoal.tasks.find(t => t.id === taskId);
      if (task) {
        const newStatus: TaskStatus = task.status === 'completed' ? 'not-started' : 'completed';
        updateTask(editingGoal.id, taskId, { status: newStatus });
        loadGoals();
        const updated = getGoalsFromStorage().find(g => g.id === editingGoal.id);
        if (updated) {
          setFormData(updated);
          setEditingGoal(updated);
        }
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (editingGoal) {
      deleteTask(editingGoal.id, taskId);
      loadGoals();
      const updated = getGoalsFromStorage().find(g => g.id === editingGoal.id);
      if (updated) {
        setFormData(updated);
        setEditingGoal(updated);
      }
    } else {
      setFormData({
        ...formData,
        tasks: (formData.tasks || []).filter(t => t.id !== taskId)
      });
    }
  };

  const activeGoals = goals.filter(g => !g.isArchived && !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);

  if (isCreatingNew || editingGoal) {
    const contextualTips = getContextualTips(formData.type as GoalType);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingGoal(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Pass Linear Algebra Final"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Goal Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as GoalType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="skill">Skill</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as GoalPriority })}
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
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, Programming, Biology"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              {/* Description with AI */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Description</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateDescriptions}
                    disabled={!formData.title || !formData.subject}
                    className="text-xs border-purple-300 hover:bg-purple-50"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Suggestions
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to achieve..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* AI Suggestions */}
              <AnimatePresence>
                {showAiSuggestions && aiSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-sm font-medium text-purple-700">AI Description Suggestions:</p>
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className="p-3 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all border-purple-200"
                          onClick={() => handleSelectSuggestion(suggestion.text)}
                        >
                          <p className="text-sm mb-2">{suggestion.text}</p>
                          <div className="flex items-center gap-1 text-xs text-purple-600">
                            <Lightbulb className="w-3 h-3" />
                            <span>{suggestion.tip}</span>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Deadline & Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="targetHours">Target Hours</Label>
                  <Input
                    id="targetHours"
                    type="number"
                    min="1"
                    value={formData.targetHours}
                    onChange={(e) => setFormData({ ...formData, targetHours: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Daily Commitment */}
              <div>
                <Label htmlFor="dailyCommit">Daily Commitment (minutes)</Label>
                <Input
                  id="dailyCommit"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.dailyCommitmentMinutes}
                  onChange={(e) => setFormData({ ...formData, dailyCommitmentMinutes: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: {formData.dailyCommitmentMinutes} min/day = {(formData.dailyCommitmentMinutes! / 60).toFixed(1)} hours/day
                </p>
              </div>

              {/* Tasks */}
              <div>
                <Label>Tasks / Sub-goals</Label>
                <div className="space-y-2 mt-2">
                  {(formData.tasks || []).map((task) => (
                    <div key={task.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="flex-shrink-0"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <span className={`flex-1 text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a task..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <Button onClick={handleAddTask} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contextual Tips */}
              {contextualTips.length > 0 && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-2">Tips for {formData.type} goals:</p>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {contextualTips.map((tip, index) => (
                          <li key={index}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveGoal} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingGoal(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Study Goals</h1>
            <p className="text-muted-foreground">Manage your learning objectives</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateNew} className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Goals ({activeGoals.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map((goal) => {
                const progress = calculateGoalProgress(goal);
                
                return (
                  <Card key={goal.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{goal.subject}</p>
                        <Badge variant="outline" className="text-xs">
                          {goal.type}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(progress.progressPercentage)}%</span>
                      </div>
                      <Progress value={progress.progressPercentage} className="h-2" />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>{progress.tasksCompleted} / {progress.totalTasks} tasks</span>
                          <span>{progress.hoursCompleted.toFixed(1)} / {progress.targetHours}h</span>
                        </div>
                        {progress.daysRemaining !== undefined && (
                          <span className={progress.daysRemaining <= 3 ? 'text-red-600 font-medium' : ''}>
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {progress.daysRemaining}d left
                          </span>
                        )}
                      </div>

                      {!progress.isOnTrack && (
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded p-2 mt-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <p className="text-xs text-amber-800">
                            Behind schedule • Need {progress.recommendedDailyMinutes} min/day
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              <CheckCircle2 className="w-5 h-5 inline mr-2" />
              Completed Goals ({completedGoals.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedGoals.map((goal) => (
                <Card key={goal.id} className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.subject}</p>
                      <p className="text-xs text-green-700 mt-2">
                        ✓ Completed on {new Date(goal.completedAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeGoals.length === 0 && completedGoals.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-6">Create your first goal to get started</p>
            <Button onClick={handleCreateNew} className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Create First Goal
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
