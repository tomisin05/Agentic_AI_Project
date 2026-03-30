import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Target, CheckCircle2 } from "lucide-react";
import { getGoalsFromStorage, Goal, Task } from "../lib/goalSystem";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: (data: { 
    focusRating: number; 
    reflection: string; 
    mood: string; 
    taskCompleted?: boolean;
    goalId?: string;
    taskId?: string;
    madeProgress?: boolean;
  }) => void;
  sessionNumber: number;
  focusLevel: number;
  hasTask?: boolean;
}

export function CheckInModal({ isOpen, onClose, sessionNumber, focusLevel, hasTask }: CheckInModalProps) {
  const [selectedRating, setSelectedRating] = useState(focusLevel);
  const [reflection, setReflection] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [madeProgress, setMadeProgress] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const loadedGoals = getGoalsFromStorage();
      const activeGoals = loadedGoals.filter(g => !g.isArchived && !g.completedAt);
      setGoals(activeGoals);
    }
  }, [isOpen]);

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
      taskCompleted: hasTask ? taskCompleted : undefined,
      goalId: selectedGoalId,
      taskId: selectedTaskId,
      madeProgress: madeProgress
    });
    // Reset form
    setReflection('');
    setSelectedMood('');
    setSelectedRating(focusLevel);
    setTaskCompleted(false);
    setMadeProgress(false);
    setSelectedGoalId('');
    setSelectedTaskId('');
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Session {sessionNumber} Complete! 🎉</DialogTitle>
          <DialogDescription>
            How was your focus during this study session?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Task Completion */}
          {hasTask && (
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="task-completed"
                  checked={taskCompleted}
                  onCheckedChange={(checked) => setTaskCompleted(checked as boolean)}
                />
                <label
                  htmlFor="task-completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  ✅ I completed my task this session
                </label>
              </div>
            </Card>
          )}

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

          {/* Goal Selection */}
          {goals.length > 0 && (
            <Card className="p-4">
              <h4 className="mb-3">Select a Goal</h4>
              <Select
                value={selectedGoalId}
                onValueChange={(value) => {
                  setSelectedGoalId(value);
                  setSelectedTaskId('');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a goal">
                    {selectedGoalId ? goals.find(g => g.id === selectedGoalId)?.title : 'Select a goal'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {goals.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>
          )}

          {/* Task Selection */}
          {selectedGoalId && goals.find(g => g.id === selectedGoalId)?.tasks.length > 0 && (
            <Card className="p-4">
              <h4 className="mb-3">Select a Task</h4>
              <Select
                value={selectedTaskId}
                onValueChange={(value) => setSelectedTaskId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a task">
                    {selectedTaskId ? goals.find(g => g.id === selectedGoalId)?.tasks.find(t => t.id === selectedTaskId)?.title : 'Select a task'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {goals.find(g => g.id === selectedGoalId)?.tasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>
          )}

          {/* Made Progress */}
          {selectedTaskId && (
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="made-progress"
                  checked={madeProgress}
                  onCheckedChange={(checked) => setMadeProgress(checked as boolean)}
                />
                <label
                  htmlFor="made-progress"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  ✅ I made progress on this task
                </label>
              </div>
            </Card>
          )}

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