import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Play, Pause, RotateCcw, Coffee, BookOpen, FastForward, Zap, Eye, Bell, Shield, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { FocusTracker } from '../lib/focusTracker';
import { NotificationManager } from '../lib/notifications';
import { toast } from 'sonner@2.0.3';

interface SessionPreset {
  id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  longBreakDuration?: number;
  sessionsBeforeLongBreak?: number;
  color: string;
  isDefault?: boolean;
}

interface TimerComponentProps {
  onSessionComplete: (focusLevel: number) => void;
  onBreakComplete: () => void;
  onFocusChange: (level: number) => void;
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
  preset: SessionPreset;
  sessionCount: number;
}

interface DistractionSite {
  url: string;
  name: string;
  blocked: boolean;
}

export function TimerComponent({ 
  onSessionComplete, 
  onBreakComplete, 
  onFocusChange, 
  isActive, 
  onActiveChange,
  preset,
  sessionCount: parentSessionCount
}: TimerComponentProps) {
  const [isBreak, setIsBreak] = useState(false);
  const [focusLevel, setFocusLevel] = useState(5);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Focus blocking features
  const [focusBlockingEnabled, setFocusBlockingEnabled] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [distractionDetected, setDistractionDetected] = useState(false);
  const [lastVisibilityChange, setLastVisibilityChange] = useState<Date>(new Date());

  // Calculate session and break durations based on preset and session count
  const sessionDuration = preset.workDuration * 60;
  const isLongBreak = preset.longBreakDuration && preset.sessionsBeforeLongBreak && 
    (parentSessionCount + 1) % preset.sessionsBeforeLongBreak === 0;
  const breakDuration = isLongBreak ? (preset.longBreakDuration! * 60) : (preset.breakDuration * 60);
  
  const [timeLeft, setTimeLeft] = useState(sessionDuration);

  // Page Visibility API for focus blocking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && focusBlockingEnabled && isActive && !isBreak) {
        const now = new Date();
        const timeSinceLastChange = now.getTime() - lastVisibilityChange.getTime();
        
        // Only count as distraction if away for at least 3 seconds
        if (timeSinceLastChange > 3000) {
          setTabSwitchCount(prev => prev + 1);
          setDistractionDetected(true);
          
          // Reduce focus level for excessive tab switching
          if (tabSwitchCount >= 3) {
            const newLevel = Math.max(1, focusLevel - 1);
            setFocusLevel(newLevel);
            onFocusChange(newLevel);
            toast.warning(`Focus decreased due to distractions (${tabSwitchCount + 1} tab switches)`);
          } else {
            toast.warning(`Distraction detected! Stay focused (${tabSwitchCount + 1}/5)`);
          }
        }
        setLastVisibilityChange(now);
      } else if (!document.hidden && distractionDetected) {
        // User returned to the tab
        setTimeout(() => setDistractionDetected(false), 2000);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (focusBlockingEnabled && isActive && !isBreak) {
        e.preventDefault();
        e.returnValue = 'You have an active study session. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    if (focusBlockingEnabled) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [focusBlockingEnabled, isActive, isBreak, tabSwitchCount, focusLevel, lastVisibilityChange, distractionDetected, onFocusChange]);

  // Reset distraction tracking when starting new session
  useEffect(() => {
    if (isActive && !isBreak) {
      setTabSwitchCount(0);
      setDistractionDetected(false);
      setLastVisibilityChange(new Date());
    }
  }, [isActive, isBreak]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            if (isBreak) {
              // Break completed
              setIsBreak(false);
              setTimeLeft(sessionDuration);
              onActiveChange(false);
              onBreakComplete();
            } else {
              // Work session completed
              setIsBreak(true);
              const newBreakDuration = isLongBreak ? (preset.longBreakDuration! * 60) : (preset.breakDuration * 60);
              setTimeLeft(newBreakDuration);
              onSessionComplete(focusLevel);
            }
            return time - 1;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, focusLevel, onSessionComplete, onBreakComplete, onActiveChange, sessionDuration, breakDuration, preset, isLongBreak]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalDuration = isBreak ? breakDuration : sessionDuration;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const handleReset = () => {
    onActiveChange(false);
    setTimeLeft(isBreak ? breakDuration : sessionDuration);
  };

  const adjustFocus = (change: number) => {
    const newLevel = Math.max(1, Math.min(5, focusLevel + change));
    setFocusLevel(newLevel);
    onFocusChange(newLevel);
  };

  const handleDemoSkip = () => {
    if (isBreak) {
      // Skip break - go to next work session
      setIsBreak(false);
      setTimeLeft(sessionDuration);
      onActiveChange(false);
      onBreakComplete();
    } else {
      // Skip work session - go to break
      setIsBreak(true);
      const newBreakDuration = isLongBreak ? (preset.longBreakDuration! * 60) : (preset.breakDuration * 60);
      setTimeLeft(newBreakDuration);
      onSessionComplete(focusLevel);
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const toggleFocusBlocking = () => {
    setFocusBlockingEnabled(!focusBlockingEnabled);
    if (!focusBlockingEnabled) {
      toast.success('Focus blocking enabled! Tab switching will be tracked.');
    } else {
      toast.info('Focus blocking disabled.');
    }
  };

  const getDistractionLevel = () => {
    if (tabSwitchCount === 0) return { level: 'excellent', color: 'text-green-600', emoji: '🎯' };
    if (tabSwitchCount <= 2) return { level: 'good', color: 'text-blue-600', emoji: '👍' };
    if (tabSwitchCount <= 4) return { level: 'fair', color: 'text-yellow-600', emoji: '⚠️' };
    return { level: 'poor', color: 'text-red-600', emoji: '😰' };
  };

  const distractionLevel = getDistractionLevel();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full">
        <CardHeader className="text-center relative">
          {/* Demo Mode Toggle */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDemoMode}
              className={`${isDemoMode ? 'bg-purple-100 text-purple-700' : 'text-muted-foreground'} hover:bg-purple-50`}
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>

          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 left-2"
            >
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Demo Mode
              </Badge>
            </motion.div>
          )}

          <CardTitle className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: isBreak ? 0 : 360 }}
              transition={{ duration: 0.5 }}
            >
              {isBreak ? (
                <Coffee className="w-5 h-5 text-orange-500" />
              ) : (
                <BookOpen className="w-5 h-5 text-blue-500" />
              )}
            </motion.div>
            {isBreak ? (isLongBreak ? 'Long Break' : 'Break Time') : `Study Session ${parentSessionCount + 1}`}
          </CardTitle>
          
          {/* Preset indicator */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`w-3 h-3 rounded-full ${preset.color}`} />
            <span className="text-sm text-muted-foreground">{preset.name}</span>
          </div>
        </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <motion.div 
          className="text-center"
          animate={{ scale: timeLeft <= 10 && isActive ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: timeLeft <= 10 && isActive ? Infinity : 0, duration: 1 }}
        >
          <motion.div 
            className="text-6xl font-mono mb-2 text-primary"
            animate={{ 
              color: timeLeft <= 60 && isActive ? ['#ef4444', '#3b82f6', '#ef4444'] : '#3b82f6'
            }}
            transition={{ 
              repeat: timeLeft <= 60 && isActive ? Infinity : 0, 
              duration: 1 
            }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          <Progress value={getProgress()} className="w-full h-2" />
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-2 flex-wrap">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onActiveChange(!isActive)}
              size="lg"
              className="flex items-center gap-2"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {isBreak ? 'Continue Break' : 'Start Session'}
                </>
              )}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Demo Skip Button */}
          {isDemoMode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleDemoSkip}
                variant="secondary"
                size="lg"
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-2"
              >
                <FastForward className="w-4 h-4" />
                Skip {isBreak ? 'Break' : 'Session'}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Focus Blocking Controls */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <Label htmlFor="focus-blocking">Focus Blocking</Label>
            </div>
            <Switch
              id="focus-blocking"
              checked={focusBlockingEnabled}
              onCheckedChange={toggleFocusBlocking}
            />
          </div>
          
          {focusBlockingEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tab switches:</span>
                <span className={`font-medium ${distractionLevel.color}`}>
                  {tabSwitchCount} {distractionLevel.emoji}
                </span>
              </div>
              
              {distractionDetected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Welcome back! Stay focused on your studies.</span>
                </motion.div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Focus blocking tracks tab switches to help maintain concentration.
              </div>
            </motion.div>
          )}
        </div>

        {/* Focus Level Tracker (only during work sessions) */}
        {!isBreak && (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">How focused are you?</p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustFocus(-1)}
                  disabled={focusLevel <= 1}
                >
                  -
                </Button>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-6 h-6 rounded-full ${
                        level <= focusLevel 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustFocus(1)}
                  disabled={focusLevel >= 5}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {focusLevel <= 2 && '😰 Struggling to focus'}
                {focusLevel === 3 && '📚 Decent focus'}
                {focusLevel === 4 && '🎯 Good focus'}
                {focusLevel === 5 && '🌟 Excellent focus'}
              </p>
            </div>
          </div>
        )}

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Sessions</p>
            <p className="font-medium">{parentSessionCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Focus Level</p>
            <p className="font-medium">{focusLevel}/5</p>
          </div>
          <div>
            <p className="text-muted-foreground">Distractions</p>
            <p className={`font-medium ${distractionLevel.color}`}>{tabSwitchCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}