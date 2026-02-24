import { useState, useEffect, useCallback } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { NarrativePanel } from './NarrativePanel';
import { TimerComponent } from './TimerComponent';
import { CheckInModal } from './CheckInModal';
import { JournalView } from './JournalView';
import { StatsDashboard } from './StatsDashboard';
import { SessionPresets, SessionPreset } from './SessionPresets';
import { DataExportImport } from './DataExportImport';
import { Flashcards } from './Flashcards';
import { Scheduler } from './Scheduler';
import { AccessibilitySettings } from './AccessibilitySettings';
import { LanguageSettings } from './LanguageSettings';
import { GoalSetup } from './GoalSetup';
import { GoalDashboard } from './GoalDashboard';
import { BookOpen, Menu, BarChart3, Settings, Database, Brain, Calendar, Accessibility, Globe, Target, Home } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { initializeAccessibility } from '../lib/accessibility';
import { useTranslation } from '../lib/i18n';
import { GoalManager, SessionGoalLink } from '../lib/goalSystem';
import { StoryGoalEngine } from '../lib/storyGoalIntegration';
import { AdaptiveInsightsEngine } from '../lib/adaptiveInsights';

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
}

interface MainStudyAppProps {
  onShowJournal?: () => void;
}

export function MainStudyApp({ onShowJournal }: MainStudyAppProps) {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<'study' | 'journal' | 'stats' | 'settings' | 'data' | 'flashcards' | 'scheduler' | 'accessibility' | 'language' | 'goals'>('study');
  const [character, setCharacter] = useState<Character>({
    name: 'Alex',
    avatar: 'https://images.unsplash.com/photo-1641444473327-ea736547d7bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHN0dWR5aW5nJTIwYm9va3N8ZW58MXx8fHwxNzU5MTc1MTcwfDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
    mood: 'determined'
  });

  const [story, setStory] = useState<StoryContent>({
    text: "Welcome, brave scholar-warrior! I'm Alex, your companion in this epic quest for knowledge. A fearsome Dragon of Distraction guards the ancient wisdom we seek. Only through focused study and unwavering determination can we defeat this beast and claim the treasures of learning. Ready your mind and prepare for battle!",
    background: 'https://images.unsplash.com/photo-1637255499922-f15bc6c4153f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMHJvb20lMjBsaWJyYXJ5JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTkxNzUxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    chapter: 'Chapter 1: The Dragon Awakens'
  });

  const [sessionCount, setSessionCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [currentFocusLevel, setCurrentFocusLevel] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // Session presets state
  const [customPresets, setCustomPresets] = useState<SessionPreset[]>([]);
  const [currentPreset, setCurrentPreset] = useState<SessionPreset>({
    id: 'classic',
    name: 'Classic Pomodoro',
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    color: 'bg-red-500',
    isDefault: true
  });

  // Story content based on progress and focus
  const storyProgression = {
    chapters: [
      {
        title: 'Chapter 1: The Dragon Awakens',
        focused: {
          work: "Excellent! My sword of concentration cuts through the dragon's first wave of distractions. With shield raised and mind sharp, I advance steadily toward the beast. Each focused moment weakens its power over me. The dragon roars in frustration as my disciplined approach proves effective!",
          break: "Victory in the first skirmish! The Dragon of Distraction retreats, wounded by my focused assault. I've earned a moment's respite to tend my weapons and review battle tactics. The ancient knowledge grows closer with each successful engagement."
        },
        struggling: {
          work: "The dragon's flames of distraction are overwhelming me! My sword wavers, my shield feels heavy, and the beast advances with each moment my mind wanders. I must find my inner strength and remember why I fight - for the treasure of wisdom that lies beyond!",
          break: "The dragon has gained ground in this battle. Its fiery breath of scattered thoughts has left me singed and weary. But a true warrior learns from defeat. I'll use this respite to strengthen my resolve and plan a better strategy for the next encounter."
        }
      },
      {
        title: 'Chapter 2: The Battle Intensifies',
        focused: {
          work: "My battle prowess grows stronger! The dragon's attacks seem slower now as my focus-forged blade strikes with precision. I've learned its patterns of distraction and counter each with disciplined study. The beast begins to show real fear of my unwavering determination!",
          break: "Incredible progress! I've wounded the great dragon significantly with my concentrated efforts. The path to the treasure chamber is becoming clearer. My weapons shine brighter with each victory, and I can almost taste the sweet knowledge that awaits!"
        },
        struggling: {
          work: "The dragon adapts to my tactics, breathing new forms of confusion and doubt. My concentration falters under its relentless mental assault. Perhaps I'm trying to strike too hard, too fast. I need to remember that even the greatest warriors must sometimes retreat to regroup.",
          break: "This battle grows more challenging than expected. The dragon's experience shows as it exploits every moment of weakness in my focus. But legends aren't made from easy victories. I'll rest, recover, and return with renewed purpose."
        }
      },
      {
        title: 'Chapter 3: The Final Confrontation',
        focused: {
          work: "This is it - the final battle! My blade blazes with the light of pure concentration, and my shield bears the insignia of unwavering determination. The dragon unleashes its most powerful attacks, but I stand firm. Each focused moment brings me closer to claiming the ultimate prize!",
          break: "VICTORY! The mighty Dragon of Distraction lies defeated at my feet! The treasure chamber opens, revealing infinite scrolls of wisdom and knowledge. All my focused effort, every moment of disciplined study, has led to this triumphant moment. The knowledge is mine!"
        },
        struggling: {
          work: "In the final hour, when victory seemed within reach, the dragon musters its last desperate strength. My focus wavers at this crucial moment, and I can see the beast preparing for a final, devastating attack. I must dig deeper than ever before to find the strength to prevail!",
          break: "So close to victory, yet the dragon still draws breath. My scattered attention in these final moments has given it time to recover. But this is not the end - even the greatest heroes face setbacks before their ultimate triumph. The treasure still awaits the truly persistent."
        }
      }
    ]
  };

  const getStoryContent = useCallback((sessionNum: number, focusLevel: number, isBreakTime: boolean): StoryContent => {
    const chapterIndex = Math.min(Math.floor(sessionNum / 2), storyProgression.chapters.length - 1);
    const chapter = storyProgression.chapters[chapterIndex];
    const isFocused = focusLevel >= 4;
    const content = isFocused ? chapter.focused : chapter.struggling;
    
    return {
      text: isBreakTime ? content.break : content.work,
      background: story.background, // Keep same background for consistency
      chapter: chapter.title
    };
  }, [story.background]);

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

  const handleCheckInComplete = (data: { focusRating: number; reflection: string; mood: string }) => {
    // Add entry to journal
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sessionNumber: sessionCount,
      focusRating: data.focusRating,
      mood: data.mood,
      reflection: data.reflection,
      storyOutcome: story.text,
      storyChapter: story.chapter
    };
    
    setJournalEntries(prev => [...prev, newEntry]);
    setShowCheckIn(false);
  };

  // Handle preset management
  const handlePresetCreate = (presetData: Omit<SessionPreset, 'id'>) => {
    const newPreset: SessionPreset = {
      ...presetData,
      id: `custom-${Date.now()}`
    };
    setCustomPresets(prev => [...prev, newPreset]);
  };

  const handlePresetUpdate = (updatedPreset: SessionPreset) => {
    setCustomPresets(prev => 
      prev.map(preset => preset.id === updatedPreset.id ? updatedPreset : preset)
    );
    if (currentPreset.id === updatedPreset.id) {
      setCurrentPreset(updatedPreset);
    }
  };

  const handlePresetDelete = (presetId: string) => {
    setCustomPresets(prev => prev.filter(preset => preset.id !== presetId));
    if (currentPreset.id === presetId) {
      // Reset to default preset
      setCurrentPreset({
        id: 'classic',
        name: 'Classic Pomodoro',
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        color: 'bg-red-500',
        isDefault: true
      });
    }
  };

  const handleDataImport = (importedEntries: JournalEntry[]) => {
    setJournalEntries(prev => [...prev, ...importedEntries]);
  };

  // Initialize accessibility features
  useEffect(() => {
    initializeAccessibility();
  }, []);

  // Render different views
  if (currentView === 'flashcards') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <Flashcards onClose={() => setCurrentView('study')} />
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
        <Scheduler onClose={() => setCurrentView('study')} />
      </motion.div>
    );
  }

  if (currentView === 'accessibility') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <AccessibilitySettings onClose={() => setCurrentView('study')} />
      </motion.div>
    );
  }

  if (currentView === 'language') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <LanguageSettings onClose={() => setCurrentView('study')} />
      </motion.div>
    );
  }

  if (currentView === 'stats') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <StatsDashboard 
          entries={journalEntries}
          onBack={() => setCurrentView('study')}
        />
      </motion.div>
    );
  }

  if (currentView === 'settings') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setCurrentView('study')} className="bg-white/50">
                <BookOpen className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl">Session Settings</h1>
                <p className="text-sm text-muted-foreground">Customize your study experience</p>
              </div>
            </div>
          </motion.div>
          
          <SessionPresets
            presets={customPresets}
            currentPreset={currentPreset}
            onPresetSelect={setCurrentPreset}
            onPresetCreate={handlePresetCreate}
            onPresetUpdate={handlePresetUpdate}
            onPresetDelete={handlePresetDelete}
          />
        </div>
      </motion.div>
    );
  }

  if (currentView === 'data') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setCurrentView('study')} className="bg-white/50">
                <BookOpen className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl">Data Management</h1>
                <p className="text-sm text-muted-foreground">Export, import, and backup your data</p>
              </div>
            </div>
          </motion.div>
          
          <DataExportImport
            entries={journalEntries}
            onImport={handleDataImport}
          />
        </div>
      </motion.div>
    );
  }

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
        />
      </motion.div>
    );
  }

  if (currentView === 'goals') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <GoalSetup onClose={() => setCurrentView('study')} />
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
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl">StoryStudy</h1>
              <p className="text-sm text-muted-foreground">Study with a story</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.div
              key={sessionCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="outline" className="bg-white/50">
                Session {sessionCount + 1}
              </Badge>
            </motion.div>
            <div className="flex gap-1 flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('flashcards')}
                  className="bg-white/50"
                  title="Flashcards"
                >
                  <Brain className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('scheduler')}
                  className="bg-white/50"
                  title="Scheduler"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('stats')}
                  className="bg-white/50"
                  title="Statistics"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('settings')}
                  className="bg-white/50"
                  title="Session Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('accessibility')}
                  className="bg-white/50"
                  title="Accessibility"
                >
                  <Accessibility className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('language')}
                  className="bg-white/50"
                  title="Language"
                >
                  <Globe className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('data')}
                  className="bg-white/50"
                  title="Data Management"
                >
                  <Database className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('journal')}
                  className="bg-white/50"
                  title="Journal"
                >
                  <Menu className="w-4 h-4 mr-1" />
                  Journal
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('goals')}
                  className="bg-white/50"
                  title="Goals"
                >
                  <Target className="w-4 h-4 mr-1" />
                  Goals
                </Button>
              </motion.div>
            </div>
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
                      animate={{ scale: 1, color: 'inherit' }}
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
              sessionCount={sessionCount}
            />
          </motion.div>
        </motion.div>

        {/* Check-in Modal */}
        <CheckInModal
          isOpen={showCheckIn}
          onClose={handleCheckInComplete}
          sessionNumber={sessionCount}
          focusLevel={currentFocusLevel}
        />
      </div>
    </motion.div>
  );
}