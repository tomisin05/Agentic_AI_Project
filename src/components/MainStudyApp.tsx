import { useState, useCallback } from 'react';
import { BookOpen, Menu, Trophy, Target, TrendingUp, Edit2, Save, X, Home, GraduationCap, Calendar, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { NarrativePanel } from './NarrativePanel';
import { TimerComponent } from './TimerComponent';
import { CheckInModal } from './CheckInModal';
import { JournalView } from './JournalView';
import { ProgressVisualizationPage } from './ProgressVisualizationPage';
import { getThemeById } from './StoryThemes';
import { getCharacterById } from './CharacterOptions';
import { calculateUserStats, checkNewAchievements, type Achievement } from './AchievementSystem';
import { AchievementNotification } from './AchievementNotification';
import { AISessionReflectionCard } from './AISessionReflectionCard';
import { motion, AnimatePresence } from 'motion/react';
import { Flashcards } from './Flashcards';
import { SessionPresets, PomodoroPreset } from './SessionPresets';
import { SchedulerSettings } from './SchedulerSettings';
import { useSettings } from '../lib/settingsContext';

interface Character {
  name: string;
  avatar: string;
  mood: 'focused' | 'struggling' | 'successful' | 'determined';
}

interface StoryContent {
  text: string;
  background: string;
  chapter: string;
}

interface JournalEntry {
  id: string;
  date: string;
  sessionNumber: number;
  focusRating: number;
  mood: string;
  reflection: string;
  storyOutcome: string;
  storyChapter: string;
  task?: string;
  taskCompleted?: boolean;
  theme?: string;
}

interface MainStudyAppProps {
  selectedTheme: string;
  selectedCharacter: string;
  userGoals?: string;
  onGoalsUpdate?: (goals: string) => void;
  onShowJournal?: () => void;
}

export function MainStudyApp({ selectedTheme, selectedCharacter, userGoals = '', onGoalsUpdate, onShowJournal }: MainStudyAppProps) {
  // Get theme and character configuration
  const theme = getThemeById(selectedTheme) || getThemeById('dragon-warrior')!;
  const characterOption = getCharacterById(selectedCharacter) || getCharacterById('character-1')!;
  
  const [currentView, setCurrentView] = useState<'study' | 'journal' | 'progress' | 'flashcards' | 'presets' | 'scheduler'>('study');
  const [character, setCharacter] = useState<Character>({
    name: characterOption.description,
    avatar: characterOption.avatar,
    mood: characterOption.defaultMood
  });

  const [story, setStory] = useState<StoryContent>({
    text: `Welcome, ${characterOption.description}! ${theme.tagline}. ${characterOption.personality}. Together, we'll conquer challenges through focused study and unwavering determination. Ready to begin?`,
    background: theme.backgroundImage,
    chapter: theme.chapters[0].title
  });

  const [sessionCount, setSessionCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [currentFocusLevel, setCurrentFocusLevel] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editedGoals, setEditedGoals] = useState(userGoals);
  
  // Achievement system
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [themesUsed, setThemesUsed] = useState<Set<string>>(new Set([selectedTheme]));
  
  // Get current preset from settings context
  const { currentPreset } = useSettings();

  const getStoryContent = useCallback((sessionNum: number, focusLevel: number, isBreakTime: boolean): StoryContent => {
    const chapterIndex = Math.min(Math.floor(sessionNum / 2), theme.chapters.length - 1);
    const chapter = theme.chapters[chapterIndex];
    const isFocused = focusLevel >= 4;
    const content = isFocused ? chapter.focused : chapter.struggling;
    
    return {
      text: isBreakTime ? content.break : content.work,
      background: theme.backgroundImage,
      chapter: chapter.title
    };
  }, [theme]);

  const updateCharacterMood = useCallback((focusLevel: number, isBreakTime: boolean) => {
    let newMood: Character['mood'];
    
    if (isBreakTime) {
      newMood = focusLevel >= 4 ? 'successful' : 'struggling';
    } else {
      if (focusLevel >= 4) newMood = 'focused';
      else if (focusLevel >= 3) newMood = 'determined';
      else newMood = 'struggling';
    }
    
    setCharacter(prev => ({ ...prev, mood: newMood }));
  }, []);

  const checkAchievements = useCallback(() => {
    const stats = calculateUserStats(journalEntries, tasksCompleted, themesUsed);
    const newAchievements = checkNewAchievements(stats, unlockedAchievements);
    
    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements.map(a => a.id)]);
      setCurrentAchievement(newAchievements[0]); // Show first new achievement
    }
  }, [journalEntries, tasksCompleted, themesUsed, unlockedAchievements]);

  const handleSessionComplete = useCallback((focusLevel: number) => {
    const newSessionCount = sessionCount + 1;
    setSessionCount(newSessionCount);
    setCurrentFocusLevel(focusLevel);
    setIsBreak(true);
    
    // Update story and character for break time
    const newStory = getStoryContent(newSessionCount, focusLevel, true);
    setStory(newStory);
    updateCharacterMood(focusLevel, true);
    
    setShowCheckIn(true);
  }, [sessionCount, getStoryContent, updateCharacterMood]);

  const handleBreakComplete = useCallback(() => {
    setIsBreak(false);
    setCurrentTask(''); // Clear current task
    // Update story for next work session
    const newStory = getStoryContent(sessionCount + 1, currentFocusLevel, false);
    setStory(newStory);
    updateCharacterMood(currentFocusLevel, false);
  }, [sessionCount, currentFocusLevel, getStoryContent, updateCharacterMood]);

  const handleFocusChange = useCallback((level: number) => {
    setCurrentFocusLevel(level);
    if (!isBreak) {
      // Update story based on current focus during work session
      const newStory = getStoryContent(sessionCount, level, false);
      setStory(newStory);
      updateCharacterMood(level, false);
    }
  }, [isBreak, sessionCount, getStoryContent, updateCharacterMood]);

  const handleCheckInComplete = (data: { focusRating: number; reflection: string; mood: string; taskCompleted?: boolean }) => {
    // Add entry to journal
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sessionNumber: sessionCount,
      focusRating: data.focusRating,
      mood: data.mood,
      reflection: data.reflection,
      storyOutcome: story.text,
      storyChapter: story.chapter,
      task: currentTask || undefined,
      taskCompleted: data.taskCompleted,
      theme: selectedTheme
    };
    
    setJournalEntries(prev => [...prev, newEntry]);
    
    // Update task count if completed
    if (data.taskCompleted && currentTask) {
      setTasksCompleted(prev => prev + 1);
    }
    
    setShowCheckIn(false);
    
    // Check for new achievements
    setTimeout(() => checkAchievements(), 500);
  };

  const handleTaskChange = (task: string) => {
    setCurrentTask(task);
  };

  if (currentView === 'journal') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <JournalView 
          entries={journalEntries}
          onBack={() => setCurrentView('study')}
          unlockedAchievements={unlockedAchievements}
          stats={calculateUserStats(journalEntries, tasksCompleted, themesUsed)}
          onNavigateToProgress={() => setCurrentView('progress')}
        />
      </motion.div>
    );
  }

  if (currentView === 'progress') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <ProgressVisualizationPage 
          entries={journalEntries}
          onBack={() => setCurrentView('study')}
        />
      </motion.div>
    );
  }

  if (currentView === 'flashcards') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <Flashcards 
          onBack={() => setCurrentView('study')}
        />
      </motion.div>
    );
  }

  if (currentView === 'presets') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <SessionPresets 
          onBack={() => setCurrentView('study')}
        />
      </motion.div>
    );
  }

  if (currentView === 'scheduler') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <SchedulerSettings 
          onBack={() => setCurrentView('study')}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center text-2xl`}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {theme.icon}
            </motion.div>
            <div>
              <h1 className="text-xl">StoryStudy</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{theme.name}</p>
                <span className="text-xs text-muted-foreground">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{characterOption.emoji}</span>
                  <p className="text-xs text-muted-foreground">{characterOption.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <motion.div
              key={sessionCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="outline" className="bg-white/50 px-3 py-1">
                <Target className="w-3 h-3 mr-1" />
                Session {sessionCount + 1}
              </Badge>
            </motion.div>
            
            {unlockedAchievements.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1">
                  <Trophy className="w-3 h-3 mr-1" />
                  {unlockedAchievements.length} Achievements
                </Badge>
              </motion.div>
            )}

            {journalEntries.length > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('progress')}
                  className="gap-1.5 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Progress</span>
                </Button>
              </motion.div>
            )}
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('flashcards')}
                className="gap-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flashcards</span>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('presets')}
                className="gap-1.5 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Presets</span>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('scheduler')}
                className="gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scheduler</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Left Column - Narrative Panel */}
          <div className="space-y-4">
            <NarrativePanel 
              character={character}
              story={story}
              isBreak={isBreak}
            />
            
            {/* AI Session Reflection Card */}
            <AISessionReflectionCard 
              sessionNumber={sessionCount + 1}
              isLocked={sessionCount === 0}
              focusRating={sessionCount > 0 ? currentFocusLevel : undefined}
              reflection={journalEntries.length > 0 ? journalEntries[journalEntries.length - 1].reflection : undefined}
              mood={journalEntries.length > 0 ? journalEntries[journalEntries.length - 1].mood : undefined}
              task={currentTask}
              taskCompleted={false}
            />
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                    <motion.p 
                      className="font-medium"
                      key={sessionCount}
                      initial={{ scale: 1.2, color: '#10b981' }}
                      animate={{ scale: 1, color: '#000000' }}
                      transition={{ duration: 0.3 }}
                    >
                      {sessionCount}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Focus</p>
                    <motion.p 
                      className="font-medium"
                      animate={{ 
                        color: currentFocusLevel >= 4 ? '#10b981' : 
                               currentFocusLevel >= 3 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {currentFocusLevel}/5
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mode</p>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={isBreak ? 'break' : 'study'}
                        className="font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isBreak ? '☕ Break' : '📚 Study'}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Goals & Task Tracker */}
            {!isBreak && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                {/* User Goals Display */}
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Your Goals</p>
                        <p className="text-xs text-muted-foreground">
                          {userGoals ? 'Stay focused on what matters' : 'Set your study goals'}
                        </p>
                      </div>
                    </div>
                    {(userGoals || isEditingGoals) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (isEditingGoals && onGoalsUpdate) {
                            if (editedGoals.trim()) {
                              onGoalsUpdate(editedGoals);
                              setIsEditingGoals(false);
                            }
                          } else {
                            setIsEditingGoals(true);
                          }
                        }}
                        className="text-xs h-7 px-3 gap-1"
                      >
                        {isEditingGoals ? (
                          <>
                            <Save className="w-3 h-3" />
                            Save
                          </>
                        ) : (
                          <>
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {isEditingGoals ? (
                      <motion.div
                        key="editing"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <textarea
                          value={editedGoals}
                          onChange={(e) => setEditedGoals(e.target.value)}
                          className="w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm resize-none"
                          rows={4}
                          placeholder="What are your study goals?&#10;• Finish my research paper&#10;• Study for certification exam&#10;• Complete all assignments..."
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditedGoals(userGoals);
                              setIsEditingGoals(false);
                            }}
                            className="text-xs h-7 gap-1"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : userGoals ? (
                      <motion.div
                        key="display"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white/70 rounded-lg p-3 text-sm whitespace-pre-wrap"
                      >
                        {userGoals}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingGoals(true)}
                          className="w-full border-2 border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-100/50 text-purple-700 gap-2"
                        >
                          <Target className="w-4 h-4" />
                          Add your study goals
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Current Task */}
                <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">This Session</p>
                      <p className="text-xs text-muted-foreground">What will you work on now?</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={currentTask}
                    onChange={(e) => handleTaskChange(e.target.value)}
                    placeholder="e.g., Complete Chapter 3, Practice equations..."
                    className="w-full px-4 py-3 text-sm border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                    disabled={isTimerActive}
                  />
                  {currentTask && !isTimerActive && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-indigo-600 mt-2 flex items-center gap-1"
                    >
                      <span>✨</span> Great! Ready to start your focused session?
                    </motion.p>
                  )}
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Timer Component */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TimerComponent
              onSessionComplete={handleSessionComplete}
              onBreakComplete={handleBreakComplete}
              onFocusChange={handleFocusChange}
              isActive={isTimerActive}
              onActiveChange={setIsTimerActive}
              preset={currentPreset}
            />
          </motion.div>
        </motion.div>

        {/* Check-in Modal */}
        <CheckInModal
          isOpen={showCheckIn}
          onClose={handleCheckInComplete}
          sessionNumber={sessionCount}
          focusLevel={currentFocusLevel}
          hasTask={!!currentTask}
        />

        {/* Achievement Notification */}
        <AchievementNotification
          achievement={currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />

        {/* Floating Journal Button - Prominent & Attractive */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative"
          >
            <Button
              size="lg"
              onClick={() => setCurrentView('journal')}
              className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 relative overflow-hidden group"
            >
              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-200%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Icon */}
              <BookOpen className="w-7 h-7 text-white relative z-10" />
              
              {/* New entries badge */}
              {journalEntries.length > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  {journalEntries.length}
                </motion.div>
              )}
            </Button>
          </motion.div>
          
          {/* Tooltip - fades after showing */}
          {journalEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                x: [20, 0, 0, 20]
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.1, 0.7, 1],
                delay: 2
              }}
              className="absolute right-20 top-1/2 -translate-y-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-xl"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>View your journal & progress!</span>
              </span>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}