import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, TrendingUp, Calendar, Clock, Target, Flame, BarChart3, Award } from 'lucide-react';
import { motion } from "motion/react";

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

interface StatsDashboardProps {
  entries: JournalEntry[];
  onBack: () => void;
}

export function StatsDashboard({ entries, onBack }: StatsDashboardProps) {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('week');

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let filteredEntries = entries;
    
    switch (timeframe) {
      case 'today':
        filteredEntries = entries.filter(entry => new Date(entry.date) >= today);
        break;
      case 'week':
        filteredEntries = entries.filter(entry => new Date(entry.date) >= weekAgo);
        break;
      case 'month':
        filteredEntries = entries.filter(entry => new Date(entry.date) >= monthAgo);
        break;
    }

    const totalSessions = filteredEntries.length;
    const averageFocus = totalSessions > 0 
      ? Math.round((filteredEntries.reduce((sum, entry) => sum + entry.focusRating, 0) / totalSessions) * 10) / 10
      : 0;
    
    const highFocusSessions = filteredEntries.filter(entry => entry.focusRating >= 4).length;
    const successRate = totalSessions > 0 ? Math.round((highFocusSessions / totalSessions) * 100) : 0;
    
    // Calculate streak
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];
      const entryDate = new Date(entry.date);
      
      if (i === 0) {
        // Check if today has a session
        const diffToToday = (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffToToday <= 1 && entry.focusRating >= 4) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const prevEntry = sortedEntries[i - 1];
        const prevDate = new Date(prevEntry.date);
        const diffDays = (prevDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diffDays <= 1 && entry.focusRating >= 4) {
          tempStreak++;
          if (i === 1 || currentStreak > 0) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = entry.focusRating >= 4 ? 1 : 0;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Calculate study time (assuming 25 min sessions)
    const studyMinutes = totalSessions * 25;
    const studyHours = Math.floor(studyMinutes / 60);
    const remainingMinutes = studyMinutes % 60;

    // Focus trend (last 7 entries)
    const recentEntries = filteredEntries.slice(-7);
    const focusTrend = recentEntries.map(entry => entry.focusRating);

    return {
      totalSessions,
      averageFocus,
      successRate,
      currentStreak,
      longestStreak,
      studyTime: { hours: studyHours, minutes: remainingMinutes },
      focusTrend,
      highFocusSessions
    };
  }, [entries, timeframe]);

  const achievements = useMemo(() => {
    const achievements = [];
    
    if (stats.currentStreak >= 7) {
      achievements.push({ icon: '🔥', title: 'Week Warrior', description: '7 day focus streak' });
    }
    if (stats.currentStreak >= 3) {
      achievements.push({ icon: '⚡', title: 'Consistency King', description: '3 day streak' });
    }
    if (stats.totalSessions >= 50) {
      achievements.push({ icon: '🏆', title: 'Century Club', description: '50+ sessions completed' });
    }
    if (stats.averageFocus >= 4.5) {
      achievements.push({ icon: '🎯', title: 'Focus Master', description: 'Average 4.5+ focus' });
    }
    if (stats.successRate >= 80) {
      achievements.push({ icon: '⭐', title: 'Excellence Award', description: '80%+ success rate' });
    }

    return achievements;
  }, [stats]);

  const getFocusTrendDirection = () => {
    if (stats.focusTrend.length < 2) return 'neutral';
    const recent = stats.focusTrend.slice(-3);
    const earlier = stats.focusTrend.slice(-6, -3);
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const earlierAvg = earlier.length > 0 ? earlier.reduce((sum, val) => sum + val, 0) / earlier.length : recentAvg;
    
    if (recentAvg > earlierAvg + 0.3) return 'up';
    if (recentAvg < earlierAvg - 0.3) return 'down';
    return 'neutral';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onBack} className="bg-white/50">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl">Study Statistics</h1>
              <p className="text-sm text-muted-foreground">Your learning journey analytics</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['today', 'week', 'month', 'all'] as const).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(period)}
                className={timeframe !== period ? 'bg-white/50' : ''}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <motion.p 
                    className="text-2xl font-medium"
                    key={stats.totalSessions}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stats.totalSessions}
                  </motion.p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Focus</p>
                  <motion.p 
                    className="text-2xl font-medium"
                    key={stats.averageFocus}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stats.averageFocus}/5
                  </motion.p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                  <motion.p 
                    className="text-2xl font-medium"
                    key={`${stats.studyTime.hours}:${stats.studyTime.minutes}`}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stats.studyTime.hours}h {stats.studyTime.minutes}m
                  </motion.p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <motion.p 
                    className="text-2xl font-medium"
                    key={stats.currentStreak}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stats.currentStreak} days
                  </motion.p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium">{stats.successRate}%</span>
                  </div>
                  <Progress value={stats.successRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">High Focus Sessions</span>
                    <span className="text-sm font-medium">{stats.highFocusSessions}/{stats.totalSessions}</span>
                  </div>
                  <Progress 
                    value={stats.totalSessions > 0 ? (stats.highFocusSessions / stats.totalSessions) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-lg font-medium text-blue-600">{stats.longestStreak} days</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Focus Trend</p>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp 
                        className={`w-4 h-4 ${
                          getFocusTrendDirection() === 'up' ? 'text-green-500' : 
                          getFocusTrendDirection() === 'down' ? 'text-red-500 rotate-180' : 'text-gray-400'
                        }`} 
                      />
                      <span className={`text-sm font-medium ${
                        getFocusTrendDirection() === 'up' ? 'text-green-600' : 
                        getFocusTrendDirection() === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {getFocusTrendDirection() === 'up' ? 'Improving' : 
                         getFocusTrendDirection() === 'down' ? 'Declining' : 'Stable'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium text-yellow-800">{achievement.title}</p>
                          <p className="text-sm text-yellow-600">{achievement.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Complete more sessions to unlock achievements!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Focus Trend */}
        {stats.focusTrend.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Focus Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-32">
                  {stats.focusTrend.map((focus, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${(focus / 5) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className={`flex-1 rounded-t ${
                        focus >= 4 ? 'bg-green-400' : 
                        focus >= 3 ? 'bg-yellow-400' : 'bg-red-400'
                      } min-h-2`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Recent Sessions</span>
                  <span>Latest</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}