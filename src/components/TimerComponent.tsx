import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Play, Pause, RotateCcw, Coffee, BookOpen, FastForward, Zap, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from '../lib/notifications';
import { PomodoroPreset } from './SessionPresets';

interface TimerComponentProps {
  onSessionComplete: (focusLevel: number) => void;
  onBreakComplete: () => void;
  onFocusChange: (level: number) => void;
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
  preset?: PomodoroPreset | null;
}

export function TimerComponent({ 
  onSessionComplete, 
  onBreakComplete, 
  onFocusChange, 
  isActive, 
  onActiveChange,
  preset
}: TimerComponentProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [focusLevel, setFocusLevel] = useState(5);
  const [sessionCount, setSessionCount] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Focus blocking features
  const [focusBlockingEnabled, setFocusBlockingEnabled] = useState(true);
  const [distractionCount, setDistractionCount] = useState(0);
  const [showDistractionWarning, setShowDistractionWarning] = useState(false);
  const [lastTabSwitchTime, setLastTabSwitchTime] = useState<number | null>(null);
  
  // Use ref to avoid calling parent setState during render
  const prevFocusLevelRef = useRef(focusLevel);

  // Get durations from preset or use defaults
  const sessionDuration = preset?.workDuration ? preset.workDuration * 60 : 25 * 60;
  const shortBreakDuration = preset?.shortBreakDuration ? preset.shortBreakDuration * 60 : 5 * 60;
  const longBreakDuration = preset?.longBreakDuration ? preset.longBreakDuration * 60 : 15 * 60;
  const sessionsBeforeLongBreak = preset?.sessionsBeforeLongBreak || 4;
  
  // Determine if this should be a long break
  const shouldBeLongBreak = sessionCount > 0 && sessionCount % sessionsBeforeLongBreak === 0;
  const breakDuration = shouldBeLongBreak ? longBreakDuration : shortBreakDuration;

  // Update timer when preset changes
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(isBreak ? breakDuration : sessionDuration);
    }
  }, [preset, isBreak, breakDuration, sessionDuration, isActive]);

  // Notify parent of focus changes (separate effect)
  useEffect(() => {
    if (prevFocusLevelRef.current !== focusLevel) {
      prevFocusLevelRef.current = focusLevel;
      onFocusChange(focusLevel);
    }
  }, [focusLevel, onFocusChange]);

  // Page Visibility API for focus tracking
  useEffect(() => {
    if (!focusBlockingEnabled || isBreak || !isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from tab
        setLastTabSwitchTime(Date.now());
      } else {
        // User returned to tab
        if (lastTabSwitchTime) {
          const newDistractionCount = distractionCount + 1;
          setDistractionCount(newDistractionCount);
          
          // Show warning
          setShowDistractionWarning(true);
          setTimeout(() => setShowDistractionWarning(false), 3000);
          
          // Auto-reduce focus level if too many distractions
          if (newDistractionCount >= 5 && focusLevel > 1) {
            const newFocus = Math.max(1, focusLevel - 1);
            setFocusLevel(newFocus);
            toast.warning(`Focus level reduced to ${newFocus}/5 due to distractions`);
          } else if (newDistractionCount >= 3) {
            toast.warning(`${newDistractionCount} distractions detected. Stay focused!`);
          }
          
          setLastTabSwitchTime(null);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [focusBlockingEnabled, isBreak, isActive, distractionCount, focusLevel, lastTabSwitchTime]);

  // Warn before leaving during active session
  useEffect(() => {
    if (!focusBlockingEnabled || !isActive || isBreak) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You have an active study session. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [focusBlockingEnabled, isActive, isBreak]);

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
              setTimeLeft(breakDuration);
              setSessionCount(prev => prev + 1);
              onSessionComplete(focusLevel);
            }
            return time - 1;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, focusLevel, onSessionComplete, onBreakComplete, onActiveChange]);

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
      setTimeLeft(breakDuration);
      setSessionCount(prev => prev + 1);
      onSessionComplete(focusLevel);
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

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
            {isBreak ? 'Break Time' : `Study Session ${sessionCount + 1}`}
          </CardTitle>
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

        {/* Focus Level Tracker (only during work sessions) */}
        {!isBreak && (
          <div className="space-y-3">
            {/* Distraction Warning */}
            <AnimatePresence>
              {showDistractionWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800 font-medium">
                    Tab switch detected! Stay focused on your study session.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

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

            {/* Focus Blocking Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">Focus Blocking</span>
              </div>
              <button
                onClick={() => setFocusBlockingEnabled(!focusBlockingEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  focusBlockingEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                  animate={{ x: focusBlockingEnabled ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Distraction Counter */}
            {distractionCount > 0 && (
              <div className="text-center text-xs text-gray-600">
                {distractionCount} distraction{distractionCount !== 1 ? 's' : ''} detected this session
              </div>
            )}
          </div>
        )}

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Sessions Today</p>
            <p className="font-medium">{sessionCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Focus</p>
            <p className="font-medium">{focusLevel}/5</p>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}