import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Calendar,
  Brain,
  Sparkles,
  Target,
  Activity,
  BarChart3,
  LineChart as LineChartIcon
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { getThemeById, STORY_THEMES } from './StoryThemes';

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

interface ProgressVisualizationPageProps {
  entries: JournalEntry[];
  onBack: () => void;
}

type TimeGranularity = 'session' | 'day' | 'week' | 'month';
type ViewMode = 'learning' | 'story' | 'combined';

export function ProgressVisualizationPage({ entries, onBack }: ProgressVisualizationPageProps) {
  const [granularity, setGranularity] = useState<TimeGranularity>('day');
  const [viewMode, setViewMode] = useState<ViewMode>('combined');

  // Process data based on granularity
  const processDataByGranularity = () => {
    if (entries.length === 0) return [];

    switch (granularity) {
      case 'session':
        return entries.slice(-20).map((entry, index) => ({
          label: `S${entry.sessionNumber}`,
          key: `session-${entry.id}-${index}`,
          fullDate: new Date(entry.date).toLocaleDateString(),
          time: new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          concentration: entry.focusRating,
          productivity: entry.taskCompleted ? 100 : entry.focusRating * 20,
          engagement: entry.focusRating >= 4 ? 90 : entry.focusRating >= 3 ? 70 : 50,
          storyProgress: calculateStoryProgress(entry),
          mood: entry.mood,
          chapter: entry.storyChapter,
          index
        }));

      case 'day':
        const dayGroups = groupByDay(entries);
        return Object.entries(dayGroups).slice(-14).map(([date, dayEntries], index) => ({
          label: new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          key: `day-${date}-${index}`,
          fullDate: new Date(date).toLocaleDateString(),
          concentration: averageFocus(dayEntries),
          productivity: calculateDailyProductivity(dayEntries),
          engagement: calculateEngagement(dayEntries),
          storyProgress: averageStoryProgress(dayEntries),
          sessions: dayEntries.length,
          totalTime: dayEntries.length * 25,
          peakFocus: Math.max(...dayEntries.map(e => e.focusRating))
        }));

      case 'week':
        const weekGroups = groupByWeek(entries);
        return Object.entries(weekGroups).slice(-8).map(([week, weekEntries], index) => ({
          label: `Week ${week}`,
          key: `week-${week}-${index}`,
          fullDate: `Week ${week}`,
          concentration: averageFocus(weekEntries),
          productivity: calculateDailyProductivity(weekEntries),
          engagement: calculateEngagement(weekEntries),
          storyProgress: averageStoryProgress(weekEntries),
          sessions: weekEntries.length,
          totalTime: weekEntries.length * 25,
          peakFocus: Math.max(...weekEntries.map(e => e.focusRating))
        }));

      case 'month':
        const monthGroups = groupByMonth(entries);
        return Object.entries(monthGroups).map(([month, monthEntries], index) => ({
          label: month,
          key: `month-${month}-${index}`,
          fullDate: month,
          concentration: averageFocus(monthEntries),
          productivity: calculateDailyProductivity(monthEntries),
          engagement: calculateEngagement(monthEntries),
          storyProgress: averageStoryProgress(monthEntries),
          sessions: monthEntries.length,
          totalTime: monthEntries.length * 25,
          peakFocus: Math.max(...monthEntries.map(e => e.focusRating))
        }));

      default:
        return [];
    }
  };

  // Helper functions
  const groupByDay = (entries: JournalEntry[]) => {
    return entries.reduce((groups, entry) => {
      const date = new Date(entry.date).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
      return groups;
    }, {} as Record<string, JournalEntry[]>);
  };

  const groupByWeek = (entries: JournalEntry[]) => {
    return entries.reduce((groups, entry) => {
      const date = new Date(entry.date);
      const week = getWeekNumber(date);
      if (!groups[week]) groups[week] = [];
      groups[week].push(entry);
      return groups;
    }, {} as Record<string, JournalEntry[]>);
  };

  const groupByMonth = (entries: JournalEntry[]) => {
    return entries.reduce((groups, entry) => {
      const date = new Date(entry.date);
      const month = date.toLocaleDateString([], { month: 'short', year: 'numeric' });
      if (!groups[month]) groups[month] = [];
      groups[month].push(entry);
      return groups;
    }, {} as Record<string, JournalEntry[]>);
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const averageFocus = (entries: JournalEntry[]) => {
    if (entries.length === 0) return 0;
    return entries.reduce((sum, e) => sum + e.focusRating, 0) / entries.length;
  };

  const calculateDailyProductivity = (entries: JournalEntry[]) => {
    if (entries.length === 0) return 0;
    const completed = entries.filter(e => e.taskCompleted).length;
    const avgFocus = averageFocus(entries);
    return (completed / entries.length) * 50 + avgFocus * 10;
  };

  const calculateEngagement = (entries: JournalEntry[]) => {
    if (entries.length === 0) return 0;
    const highFocus = entries.filter(e => e.focusRating >= 4).length;
    return (highFocus / entries.length) * 100;
  };

  const calculateStoryProgress = (entry: JournalEntry) => {
    // Story progress based on focus level and chapter
    const baseProgress = entry.focusRating * 20;
    const chapterBonus = entry.storyChapter.includes('Chapter 3') ? 20 : 
                        entry.storyChapter.includes('Chapter 2') ? 10 : 0;
    return Math.min(100, baseProgress + chapterBonus);
  };

  const averageStoryProgress = (entries: JournalEntry[]) => {
    if (entries.length === 0) return 0;
    return entries.reduce((sum, e) => sum + calculateStoryProgress(e), 0) / entries.length;
  };

  // Get story progression milestones
  const getStoryMilestones = () => {
    const milestones: { chapter: string; date: string; focus: number; theme: string; icon: string }[] = [];
    const seenChapters = new Set<string>();

    entries.forEach(entry => {
      const chapterKey = `${entry.theme || 'default'}-${entry.storyChapter}`;
      if (!seenChapters.has(chapterKey)) {
        seenChapters.add(chapterKey);
        const theme = entry.theme ? getThemeById(entry.theme) : null;
        milestones.push({
          chapter: entry.storyChapter,
          date: new Date(entry.date).toLocaleDateString(),
          focus: entry.focusRating,
          theme: entry.theme || 'dragon-warrior',
          icon: theme?.icon || '🐉'
        });
      }
    });

    return milestones;
  };

  // Calculate emotion-driven story metrics
  const getEmotionalStoryMetrics = () => {
    const moodCounts: Record<string, number> = {};
    const moodStoryProgress: Record<string, number[]> = {};

    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      if (!moodStoryProgress[entry.mood]) moodStoryProgress[entry.mood] = [];
      moodStoryProgress[entry.mood].push(calculateStoryProgress(entry));
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      sessions: count,
      avgProgress: moodStoryProgress[mood].reduce((a, b) => a + b, 0) / count,
      emoji: getMoodEmoji(mood)
    }));
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
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

  // Get theme exploration data
  const getThemeExploration = () => {
    const themeCounts: Record<string, number> = {};
    const themeFocus: Record<string, number[]> = {};

    entries.forEach(entry => {
      const theme = entry.theme || 'dragon-warrior';
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      if (!themeFocus[theme]) themeFocus[theme] = [];
      themeFocus[theme].push(entry.focusRating);
    });

    return STORY_THEMES.map(theme => ({
      theme: theme.name,
      icon: theme.icon,
      sessions: themeCounts[theme.id] || 0,
      avgFocus: themeFocus[theme.id] 
        ? themeFocus[theme.id].reduce((a, b) => a + b, 0) / themeFocus[theme.id].length 
        : 0
    })).filter(t => t.sessions > 0);
  };

  const processedData = processDataByGranularity();
  const storyMilestones = getStoryMilestones();
  const emotionalMetrics = getEmotionalStoryMetrics();
  const themeData = getThemeExploration();

  // Calculate overall stats
  const totalSessions = entries.length;
  const avgConcentration = averageFocus(entries);
  const peakConcentration = entries.length > 0 ? Math.max(...entries.map(e => e.focusRating)) : 0;
  const totalStudyTime = totalSessions * 25;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between flex-wrap gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Progress Visualization
            </h1>
            <p className="text-muted-foreground">Learning analytics and story progression</p>
          </div>
        </div>

        {/* Granularity Controls */}
        <div className="flex gap-2">
          {(['session', 'day', 'week', 'month'] as TimeGranularity[]).map((g) => (
            <Button
              key={g}
              variant={granularity === g ? 'default' : 'outline'}
              onClick={() => setGranularity(g)}
              size="sm"
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <p className="text-sm">Total Sessions</p>
            </div>
            <p className="text-3xl">{totalSessions}</p>
            <p className="text-xs text-muted-foreground">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <p className="text-sm">Avg Concentration</p>
            </div>
            <p className="text-3xl">{avgConcentration.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">out of 5.0</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <p className="text-sm">Peak Focus</p>
            </div>
            <p className="text-3xl">{peakConcentration.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">highest rating</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <p className="text-sm">Story Chapters</p>
            </div>
            <p className="text-3xl">{storyMilestones.length}</p>
            <p className="text-xs text-muted-foreground">unlocked</p>
          </Card>
        </motion.div>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learning">
            <BarChart3 className="w-4 h-4 mr-2" />
            Learning View
          </TabsTrigger>
          <TabsTrigger value="story">
            <BookOpen className="w-4 h-4 mr-2" />
            Story View
          </TabsTrigger>
          <TabsTrigger value="combined">
            <LineChartIcon className="w-4 h-4 mr-2" />
            Combined View
          </TabsTrigger>
        </TabsList>

        {/* Learning View */}
        <TabsContent value="learning" className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Concentration Trend */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Concentration Evolution
                  </CardTitle>
                  <CardDescription>
                    Track how your focus levels change over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {processedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={processedData}>
                        <defs>
                          <linearGradient id="concentrationGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="label" 
                          stroke="#6b7280" 
                          fontSize={12}
                        />
                        <YAxis 
                          domain={[0, 5]} 
                          stroke="#6b7280" 
                          fontSize={12}
                          label={{ value: 'Focus Level', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="concentration" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          fill="url(#concentrationGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-300 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Productivity & Engagement */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Productivity & Engagement
                  </CardTitle>
                  <CardDescription>
                    Compare your task completion rate and engagement levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {processedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="productivity" fill="#10b981" name="Productivity %" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="engagement" fill="#3b82f6" name="Engagement %" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-300 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emotional Intelligence */}
              {emotionalMetrics.length > 0 && (
                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Mood-Based Performance
                    </CardTitle>
                    <CardDescription>
                      How different moods affect your learning progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      {emotionalMetrics.map((metric, index) => (
                        <motion.div
                          key={metric.mood}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{metric.emoji}</span>
                              <span className="capitalize">{metric.mood}</span>
                            </div>
                            <Badge variant="outline">{metric.sessions} sessions</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Avg Progress</span>
                              <span>{metric.avgProgress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${metric.avgProgress}%` }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Story View */}
        <TabsContent value="story" className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Story Timeline */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Narrative Journey Timeline
                  </CardTitle>
                  <CardDescription>
                    Your story unfolds based on focus and emotional engagement
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {storyMilestones.length > 0 ? (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-primary/10" />
                      
                      <div className="space-y-6">
                        {storyMilestones.map((milestone, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-start gap-4"
                          >
                            {/* Timeline dot */}
                            <div className={`
                              w-16 h-16 rounded-full flex items-center justify-center text-3xl
                              ${milestone.focus >= 4 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                                milestone.focus >= 3 ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                                'bg-gradient-to-br from-gray-400 to-gray-500'}
                              shadow-lg z-10
                            `}>
                              {milestone.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-gradient-to-r from-muted/50 to-transparent p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4>{milestone.chapter}</h4>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {milestone.date}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Focus Level:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                      key={level}
                                      className={`w-3 h-3 rounded-full ${
                                        level <= milestone.focus ? 'bg-primary' : 'bg-gray-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No story milestones yet. Complete sessions to unlock your narrative!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Theme Exploration */}
              {themeData.length > 0 && (
                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Story Worlds Explored
                    </CardTitle>
                    <CardDescription>
                      Different themes you've experienced in your learning journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {themeData.map((theme, index) => (
                        <motion.div
                          key={theme.theme}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                            <div className="text-4xl mb-2 text-center">{theme.icon}</div>
                            <h4 className="text-center mb-2">{theme.theme}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Sessions</span>
                                <Badge variant="outline">{theme.sessions}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Avg Focus</span>
                                <span>{theme.avgFocus.toFixed(1)}/5</span>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Story Progress Chart */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Story Advancement Rate
                  </CardTitle>
                  <CardDescription>
                    How your story progresses based on performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {processedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={processedData}>
                        <defs>
                          <linearGradient id="storyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                        <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="storyProgress" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          dot={{ fill: '#f59e0b', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-300 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Combined View */}
        <TabsContent value="combined" className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="combined"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Dual Chart */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Learning Progress & Story Sync
                  </CardTitle>
                  <CardDescription>
                    See how your concentration directly influences story advancement
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {processedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                        <YAxis 
                          yAxisId="left"
                          domain={[0, 5]} 
                          stroke="#6b7280" 
                          fontSize={12}
                          label={{ value: 'Focus (1-5)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 100]} 
                          stroke="#6b7280" 
                          fontSize={12}
                          label={{ value: 'Story %', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="concentration" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          name="Concentration"
                          dot={{ fill: '#8b5cf6', r: 4 }}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="storyProgress" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          name="Story Progress"
                          dot={{ fill: '#f59e0b', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-400 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Correlation Insights */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      Focus Impact
                    </CardTitle>
                    <CardDescription>
                      How concentration levels unlock story events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>High Focus (4-5)</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-5">
                        Unlocks triumphant story outcomes and major plot advances
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Medium Focus (3)</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-5">
                        Steady story progression with balanced narrative
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-gray-500" />
                        <span>Lower Focus (1-2)</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-5">
                        Story shows struggles and challenges, opportunity for growth
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Emotional Resonance
                    </CardTitle>
                    <CardDescription>
                      Story adapts to your emotional state
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎯</span>
                          <span className="text-sm">Focused mood</span>
                        </div>
                        <Badge variant="outline">+20% story speed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌟</span>
                          <span className="text-sm">Motivated mood</span>
                        </div>
                        <Badge variant="outline">Bonus chapters</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">😴</span>
                          <span className="text-sm">Tired mood</span>
                        </div>
                        <Badge variant="outline">Supportive narrative</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Radar */}
              {processedData.length > 0 && (
                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Multi-Dimensional Progress
                    </CardTitle>
                    <CardDescription>
                      Holistic view of your learning and story journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={[
                        {
                          metric: 'Concentration',
                          value: (avgConcentration / 5) * 100,
                        },
                        {
                          metric: 'Engagement',
                          value: calculateEngagement(entries),
                        },
                        {
                          metric: 'Productivity',
                          value: calculateDailyProductivity(entries),
                        },
                        {
                          metric: 'Story Progress',
                          value: averageStoryProgress(entries),
                        },
                        {
                          metric: 'Consistency',
                          value: (entries.length / Math.max(entries.length, 30)) * 100,
                        }
                      ]}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis 
                          dataKey="metric" 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          domain={[0, 100]} 
                          tick={{ fill: '#6b7280', fontSize: 10 }}
                        />
                        <Radar 
                          name="Your Progress" 
                          dataKey="value" 
                          stroke="#8b5cf6" 
                          fill="#8b5cf6" 
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {entries.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📊</div>
            <h3 className="mb-2">No Progress Data Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete study sessions to see your learning analytics and story progression visualized here.
            </p>
            <Button onClick={onBack}>Start Your First Session</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}