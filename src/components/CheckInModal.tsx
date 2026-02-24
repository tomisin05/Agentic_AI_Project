import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { GoalManager, StudyGoal, GoalTask } from '../lib/goalSystem';
import { Target, CheckCircle2 } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: (data: { 
    focusRating: number; 
    reflection: string; 
    mood: string;
    goalId?: string;
    taskId?: string;
    progressMade: boolean;
    taskCompleted: boolean;
  }) => void;
  sessionNumber: number;
  focusLevel: number;
  sessionDuration?: number; // minutes
}

export function CheckInModal({ isOpen, onClose, sessionNumber, focusLevel, sessionDuration = 25 }: CheckInModalProps) {
  const [selectedRating, setSelectedRating] = useState(focusLevel);
  const [reflection, setReflection] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [progressMade, setProgressMade] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const activeGoals = GoalManager.getActiveGoals();
  const selectedGoal = activeGoals.find(g => g.id === selectedGoalId);
  const availableTasks = selectedGoal?.tasks.filter(t => t.status !== 'completed') || [];

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '🎯', label: 'Focused', value: 'focused' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😰', label: 'Stressed', value: 'stressed' },
    { emoji: '🌟', label: 'Motivated', value: 'motivated' },
    { emoji: '🤔', label: 'Confused', value: 'confused' },
  ];

  const handleSubmit = () => {
    onClose({
      focusRating: selectedRating,
      reflection,
      mood: selectedMood || 'neutral',
      goalId: selectedGoalId || undefined,
      taskId: selectedTaskId || undefined,
      progressMade,
      taskCompleted
    });
    // Reset form
    setReflection('');
    setSelectedMood('');
    setSelectedRating(focusLevel);
    setSelectedGoalId('');
    setSelectedTaskId('');
    setProgressMade(false);
    setTaskCompleted(false);
  };

  const getFocusDescription = (rating: number) => {
    switch (rating) {
      case 1: return '😰 Very distracted';
      case 2: return '😕 Somewhat distracted';
      case 3: return '😐 Average focus';
      case 4: return '😊 Good focus';
      case 5: return '🌟 Excellent focus';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Session {sessionNumber} Complete! 🎉</DialogTitle>
          <DialogDescription>
            How was your focus during this study session?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Goal & Task Selection */}
          {activeGoals.length > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium">Link to Goal</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="goal-select">Which goal were you working on?</Label>
                  <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                    <SelectTrigger id="goal-select">
                      <SelectValue placeholder="Select a goal (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeGoals.map(goal => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedGoal && availableTasks.length > 0 && (
                  <div>
                    <Label htmlFor="task-select">Specific task?</Label>
                    <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                      <SelectTrigger id="task-select">
                        <SelectValue placeholder="Select a task (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTasks.map(task => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedGoalId && (
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={progressMade}
                        onChange={(e) => setProgressMade(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">Made progress</span>
                    </label>
                    
                    {selectedTaskId && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={taskCompleted}
                          onChange={(e) => setTaskCompleted(e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed task
                        </span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Focus Rating */}
          <Card className="p-4">
            <h4 className="mb-3">Focus Level</h4>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    rating <= selectedRating
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {getFocusDescription(selectedRating)}
            </p>
          </Card>

          {/* Mood Selection */}
          <Card className="p-4">
            <h4 className="mb-3">How are you feeling?</h4>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedMood === mood.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs">{mood.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Reflection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Quick reflection (optional)
            </label>
            <Textarea
              placeholder="What went well? What was challenging? Any insights?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          <Card className="p-3 bg-muted/30">
            <div className="flex items-center justify-between text-sm">
              <span>Session Summary:</span>
              <div className="flex gap-2">
                <Badge variant="outline">Focus {selectedRating}/5</Badge>
                {selectedMood && (
                  <Badge variant="outline">
                    {moods.find(m => m.value === selectedMood)?.emoji} {selectedMood}
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          <Button onClick={handleSubmit} className="w-full">
            Continue Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}