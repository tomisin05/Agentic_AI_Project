import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Flame, Target, Trophy, TrendingUp, Calendar, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { UserStats } from './AchievementSystem';
import { motion } from 'motion/react';

interface AnalyticsDashboardProps {
  stats: UserStats;
  entries: any[];
}

export function AnalyticsDashboard({ stats, entries }: AnalyticsDashboardProps) {
  // Prepare chart data
  const last7Sessions = entries.slice(-7).map((entry, index) => ({
    session: `S${entry.sessionNumber}`,
    focus: entry.focusRating,
    index
  }));

  // Calculate streak calendar data (last 30 days)
  const getStreakCalendar = () => {
    const calendar: { date: Date; hasSession: boolean; count: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const sessionsOnDay = entries.filter(e => {
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      }).length;
      
      calendar.push({
        date,
        hasSession: sessionsOnDay > 0,
        count: sessionsOnDay
      });
    }
    
    return calendar;
  };

  const streakCalendar = getStreakCalendar();

  // Calculate peak hours
  const getPeakHours = () => {
    const hourCounts: { [key: number]: number } = {};
    
    entries.forEach(entry => {
      const hour = new Date(entry.date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const sortedHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    return sortedHours.map(([hour]) => {
      const h = parseInt(hour);
      if (h === 0) return '12 AM';
      if (h < 12) return `${h} AM`;
      if (h === 12) return '12 PM';
      return `${h - 12} PM`;
    });
  };

  const peakHours = entries.length >= 5 ? getPeakHours() : [];

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground">Streak</p>
            </div>
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Avg Focus</p>
            </div>
            <p className="text-2xl font-bold">{stats.averageFocus.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">out of 5.0</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </div>
            <p className="text-2xl font-bold">{Math.floor(stats.totalFocusTime / 60)}h</p>
            <p className="text-xs text-muted-foreground">{stats.totalFocusTime % 60}m studied</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground">Perfect</p>
            </div>
            <p className="text-2xl font-bold">{stats.perfectSessions}</p>
            <p className="text-xs text-muted-foreground">5/5 focus sessions</p>
          </Card>
        </motion.div>
      </div>

      {/* Streak Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3>30-Day Activity</h3>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {streakCalendar.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded transition-colors ${
                  day.hasSession
                    ? day.count >= 3
                      ? 'bg-green-600'
                      : day.count === 2
                      ? 'bg-green-400'
                      : 'bg-green-200'
                    : 'bg-gray-100'
                }`}
                title={`${day.date.toLocaleDateString()}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded" />
              <span>No sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-200 rounded" />
              <span>1 session</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded" />
              <span>2 sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded" />
              <span>3+ sessions</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Focus Trend Chart */}
      {last7Sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3>Focus Trend (Last 7 Sessions)</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={last7Sessions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="session" stroke="#6b7280" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="focus" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {/* Peak Productivity Hours */}
      {peakHours.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3>Peak Productivity Hours</h3>
            </div>
            <div className="flex gap-3">
              {peakHours.map((hour, index) => (
                <Badge key={index} variant="outline" className="text-base px-4 py-2">
                  {hour}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              You're most productive during these times. Schedule important tasks accordingly!
            </p>
          </Card>
        </motion.div>
      )}

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="mb-3">Study Milestones</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <Badge variant="outline">{stats.totalSessions}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tasks Completed</span>
                <Badge variant="outline">{stats.tasksCompleted}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Themes Explored</span>
                <Badge variant="outline">{stats.themesExplored}/6</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Longest Streak</span>
                <Badge variant="outline">{stats.longestStreak} days</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="mb-3">Today's Progress</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sessions Today</span>
                <Badge variant="outline">{stats.sessionsToday}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time Studied Today</span>
                <Badge variant="outline">{stats.sessionsToday * 25}m</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <Badge variant="outline" className="bg-orange-100">
                  🔥 {stats.currentStreak} days
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}