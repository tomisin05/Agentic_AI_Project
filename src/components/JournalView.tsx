import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Calendar, Clock, TrendingUp, Trophy, BookOpen, Target, Award, Sparkles, BarChart3 } from "lucide-react";
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { UserStats } from './AchievementSystem';
import { ACHIEVEMENTS } from './AchievementSystem';
import { AISessionReflectionCard } from './AISessionReflectionCard';
import { motion } from 'motion/react';

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
}

interface JournalViewProps {
  entries: JournalEntry[];
  onBack: () => void;
  unlockedAchievements: string[];
  stats: UserStats;
  onNavigateToProgress?: () => void;
}

export function JournalView({ entries, onBack, unlockedAchievements, stats, onNavigateToProgress }: JournalViewProps) {
  const [activeTab, setActiveTab] = useState('journal');
  
  const today = new Date().toDateString();
  const todayEntries = entries.filter(entry => new Date(entry.date).toDateString() === today);
  const previousEntries = entries.filter(entry => new Date(entry.date).toDateString() !== today);

  const getAverageFocus = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.focusRating, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      happy: '😊',
      focused: '🎯',
      tired: '😴',
      stressed: '😰',
      motivated: '🌟',
      confused: '🤔',
      neutral: '😐'
    };
    return moodMap[mood] || '📚';
  };

  const formatTime = (sessionNumber: number) => {
    const hours = Math.floor(sessionNumber * 25 / 60);
    const minutes = (sessionNumber * 25) % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const unlockedAchievementObjects = ACHIEVEMENTS.filter(a => 
    unlockedAchievements.includes(a.id)
  );

  const rarityColors = {
    common: 'bg-gray-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-amber-500'
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1>Study Journal</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journal">
            <BookOpen className="w-4 h-4 mr-2" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Journal Tab */}
        <TabsContent value="journal" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entries.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(entries.length)} studied
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Average Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getAverageFocus()}/5</div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= getAverageFocus() ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayEntries.length}</div>
                  <p className="text-xs text-muted-foreground">
                    sessions completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Today's Entries */}
          {todayEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sessions</CardTitle>
                  <CardDescription>Your progress from today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-40">
                    <div className="space-y-3">
                      {todayEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">Session {entry.sessionNumber}</Badge>
                              <Badge variant="outline">
                                {getMoodEmoji(entry.mood)} {entry.mood}
                              </Badge>
                              <Badge variant="outline">Focus {entry.focusRating}/5</Badge>
                              {entry.task && (
                                <Badge variant="outline" className="bg-blue-50">
                                  <Target className="w-3 h-3 mr-1" />
                                  {entry.taskCompleted ? '✓' : '○'} Task
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{entry.storyChapter}</p>
                            {entry.task && (
                              <p className="text-xs text-muted-foreground mt-1">📝 {entry.task}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Previous Entries */}
          {previousEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Previous Sessions</CardTitle>
                  <CardDescription>Your study journey over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-6">
                      {previousEntries
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((entry) => (
                          <div key={entry.id} className="space-y-3">
                            <div className="border-l-4 border-primary/20 pl-4 pb-4">
                              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline">Session {entry.sessionNumber}</Badge>
                                  <Badge variant="outline">Focus {entry.focusRating}/5</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {getMoodEmoji(entry.mood)}
                                  </span>
                                  {entry.task && entry.taskCompleted && (
                                    <Badge variant="outline" className="bg-green-50">
                                      ✓ Task Complete
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.date).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <div className="mb-2">
                                <p className="text-sm font-medium text-primary">{entry.storyChapter}</p>
                                <p className="text-sm text-muted-foreground">{entry.storyOutcome}</p>
                              </div>
                              
                              {entry.task && (
                                <div className="bg-blue-50 rounded p-2 text-sm mb-2">
                                  <span className="font-medium">Task: </span>
                                  {entry.task}
                                </div>
                              )}
                              
                              {entry.reflection && (
                                <div className="bg-muted/30 rounded p-2 text-sm">
                                  <span className="font-medium">Reflection: </span>
                                  {entry.reflection}
                                </div>
                              )}
                            </div>
                            
                            {/* AI Session Reflection Card - Locked for Session 1, Unlocked for Session 2+ */}
                            <div className="pl-4">
                              <AISessionReflectionCard 
                                sessionNumber={entry.sessionNumber}
                                isLocked={entry.sessionNumber === 1}
                                focusRating={entry.sessionNumber > 1 ? entry.focusRating : undefined}
                                reflection={entry.sessionNumber > 1 ? entry.reflection : undefined}
                                mood={entry.sessionNumber > 1 ? entry.mood : undefined}
                                task={entry.sessionNumber > 1 ? entry.task : undefined}
                                taskCompleted={entry.sessionNumber > 1 ? entry.taskCompleted : undefined}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {entries.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-4xl mb-4">📚</div>
                <h3 className="mb-2">No journal entries yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your first study session to start building your story journal.
                </p>
                <Button onClick={onBack}>Start Your First Session</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Link to Advanced Progress Visualization */}
          {onNavigateToProgress && entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 cursor-pointer hover:shadow-lg transition-all"
                onClick={onNavigateToProgress}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2">
                        Advanced Progress Visualization
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Explore detailed learning analytics and story progression with interactive charts
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    View Now
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          <AnalyticsDashboard stats={stats} entries={entries} />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2>Achievements Unlocked</h2>
                  <p className="text-muted-foreground">
                    {unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements earned
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Unlocked Achievements */}
          {unlockedAchievementObjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Unlocked Achievements
                  </CardTitle>
                  <CardDescription>Your hard-earned rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {unlockedAchievementObjects.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-4 border-2 border-primary/20">
                          <div className="flex items-start gap-3">
                            <div className="text-4xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4>{achievement.title}</h4>
                                <Badge className={`${rarityColors[achievement.rarity]} text-white capitalize text-xs`}>
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {achievement.description}
                              </p>
                              {achievement.reward && (
                                <p className="text-xs bg-muted/50 rounded p-2">
                                  🎁 {achievement.reward}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Locked Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Locked Achievements</CardTitle>
                <CardDescription>Goals to work towards</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid md:grid-cols-2 gap-4">
                    {ACHIEVEMENTS.filter(a => !unlockedAchievements.includes(a.id)).map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card className="p-4 opacity-60 hover:opacity-80 transition-opacity">
                          <div className="flex items-start gap-3">
                            <div className="text-4xl grayscale">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm">???</h4>
                                <Badge variant="outline" className="capitalize text-xs">
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}