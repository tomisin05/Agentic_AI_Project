import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit2, Download, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { notificationSystem } from '../lib/notifications';

export interface ScheduledSession {
  id: string;
  title: string;
  subject: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  pomodoros: number;
  type: 'study' | 'review' | 'project' | 'exam-prep' | 'break';
  priority: 'low' | 'medium' | 'high';
  recurring: 'none' | 'daily' | 'weekly';
  reminder: number; // minutes before
  completed: boolean;
  createdAt: number;
}

const SESSION_TYPES = [
  { value: 'study', label: 'Study', color: 'bg-blue-100 text-blue-700', icon: '📚' },
  { value: 'review', label: 'Review', color: 'bg-purple-100 text-purple-700', icon: '🔍' },
  { value: 'project', label: 'Project', color: 'bg-green-100 text-green-700', icon: '🎯' },
  { value: 'exam-prep', label: 'Exam Prep', color: 'bg-red-100 text-red-700', icon: '📝' },
  { value: 'break', label: 'Break', color: 'bg-yellow-100 text-yellow-700', icon: '☕' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-gray-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-red-600' }
];

export function Scheduler() {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderTimeouts, setReminderTimeouts] = useState<Map<string, number>>(new Map());

  const [newSession, setNewSession] = useState<Partial<ScheduledSession>>({
    title: '',
    subject: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 25,
    pomodoros: 1,
    type: 'study',
    priority: 'medium',
    recurring: 'none',
    reminder: 10,
    completed: false
  });

  // Load sessions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('scheduled-sessions');
    if (stored) {
      try {
        const loadedSessions = JSON.parse(stored);
        setSessions(loadedSessions);
        setupReminders(loadedSessions);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length >= 0) {
      localStorage.setItem('scheduled-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const setupReminders = (sessionsToSetup: ScheduledSession[]) => {
    // Clear existing timeouts
    reminderTimeouts.forEach(timeout => clearTimeout(timeout));
    const newTimeouts = new Map<string, number>();

    sessionsToSetup.forEach(session => {
      if (session.completed || session.reminder === 0) return;

      const sessionDateTime = new Date(`${session.date}T${session.time}`);
      const reminderTime = new Date(sessionDateTime.getTime() - session.reminder * 60 * 1000);
      const now = new Date();

      if (reminderTime > now) {
        const timeout = window.setTimeout(() => {
          notificationSystem.showStudyReminder(session.title, session.reminder);
        }, reminderTime.getTime() - now.getTime());

        newTimeouts.set(session.id, timeout);
      }
    });

    setReminderTimeouts(newTimeouts);
  };

  const createSession = () => {
    if (!newSession.title?.trim()) return;

    const session: ScheduledSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newSession.title!,
      subject: newSession.subject || '',
      description: newSession.description || '',
      date: newSession.date!,
      time: newSession.time!,
      duration: newSession.duration!,
      pomodoros: newSession.pomodoros!,
      type: newSession.type as any,
      priority: newSession.priority as any,
      recurring: newSession.recurring as any,
      reminder: newSession.reminder!,
      completed: false,
      createdAt: Date.now()
    };

    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    setupReminders(updatedSessions);
    resetForm();
  };

  const updateSession = () => {
    if (!editingSession) return;

    const updatedSessions = sessions.map(s =>
      s.id === editingSession.id ? editingSession : s
    );
    setSessions(updatedSessions);
    setupReminders(updatedSessions);
    setEditingSession(null);
  };

  const deleteSession = (id: string) => {
    const timeout = reminderTimeouts.get(id);
    if (timeout) clearTimeout(timeout);
    
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);
    
    const newTimeouts = new Map(reminderTimeouts);
    newTimeouts.delete(id);
    setReminderTimeouts(newTimeouts);
  };

  const toggleComplete = (id: string) => {
    const updatedSessions = sessions.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    setSessions(updatedSessions);
  };

  const resetForm = () => {
    setNewSession({
      title: '',
      subject: '',
      description: '',
      date: selectedDate,
      time: '09:00',
      duration: 25,
      pomodoros: 1,
      type: 'study',
      priority: 'medium',
      recurring: 'none',
      reminder: 10,
      completed: false
    });
    setIsCreating(false);
  };

  const exportToCalendar = (session: ScheduledSession) => {
    const startDateTime = new Date(`${session.date}T${session.time}`);
    const endDateTime = new Date(startDateTime.getTime() + session.duration * 60 * 1000);

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//StoryStudy//Study Session//EN
BEGIN:VEVENT
UID:${session.id}@storystudy.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDateTime)}
DTEND:${formatICSDate(endDateTime)}
SUMMARY:${session.title}
DESCRIPTION:${session.description}\\n\\nSubject: ${session.subject}\\nDuration: ${session.duration} min\\nPomodoros: ${session.pomodoros}
LOCATION:StoryStudy App
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT${session.reminder}M
ACTION:DISPLAY
DESCRIPTION:Reminder: ${session.title} starts in ${session.reminder} minutes
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSessionsForDate = (date: string) => {
    return sessions
      .filter(s => s.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Helper to format date string to local date without timezone issues
  const formatDateString = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString();
  };

  const upcomingSessions = sessions
    .filter(s => !s.completed)
    .filter(s => {
      const sessionDate = new Date(`${s.date}T${s.time}`);
      return sessionDate >= new Date();
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const todaySessions = getSessionsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📅 Study Scheduler
            </h1>
            <p className="text-gray-600">
              Plan your study sessions and sync with your calendar
            </p>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Schedule Session
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar and Today's Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Select Date</h2>
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Today's Sessions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Sessions for {formatDateString(selectedDate)}
              </h2>
              
              {todaySessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No sessions scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map((session) => {
                    const sessionType = SESSION_TYPES.find(t => t.value === session.type);
                    const priority = PRIORITY_LEVELS.find(p => p.value === session.priority);
                    
                    return (
                      <motion.div
                        key={session.id}
                        layout
                        className={`p-4 border-l-4 ${session.completed ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-white'} rounded-r-xl shadow hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{sessionType?.icon}</span>
                              <span className="font-bold text-gray-900">{session.title}</span>
                              {session.priority === 'high' && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                  HIGH PRIORITY
                                </span>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>⏰ {session.time} • {session.duration} min • {session.pomodoros} pomodoros</div>
                              {session.subject && <div>📚 {session.subject}</div>}
                              {session.description && <div className="text-xs">{session.description}</div>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleComplete(session.id)}
                              className={`p-2 rounded-lg transition-colors ${session.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              {session.completed ? '✓' : '○'}
                            </button>
                            <button
                              onClick={() => exportToCalendar(session)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingSession(session)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSession(session.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📌 Upcoming Sessions
              </h2>
              
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No upcoming sessions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => {
                    const sessionType = SESSION_TYPES.find(t => t.value === session.type);
                    
                    return (
                      <div
                        key={session.id}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{sessionType?.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate text-sm">
                              {session.title}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatDateString(session.date)} • {session.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Total Sessions</span>
                  <span className="text-2xl font-bold">{sessions.filter(s => {
                    const sessionDate = new Date(s.date);
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    return sessionDate >= weekStart;
                  }).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed</span>
                  <span className="text-2xl font-bold">{sessions.filter(s => {
                    const sessionDate = new Date(s.date);
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    return sessionDate >= weekStart && s.completed;
                  }).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Session Modal */}
        {(isCreating || editingSession) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingSession ? 'Edit Session' : 'Schedule New Session'}
              </h2>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Title *
                    </label>
                    <input
                      type="text"
                      value={editingSession?.title || newSession.title}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, title: e.target.value })
                        : setNewSession({ ...newSession, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Study Calculus Chapter 5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={editingSession?.subject || newSession.subject}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, subject: e.target.value })
                        : setNewSession({ ...newSession, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mathematics"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Type
                    </label>
                    <select
                      value={editingSession?.type || newSession.type}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, type: e.target.value as any })
                        : setNewSession({ ...newSession, type: e.target.value as any })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {SESSION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingSession?.date || newSession.date}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, date: e.target.value })
                        : setNewSession({ ...newSession, date: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={editingSession?.time || newSession.time}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, time: e.target.value })
                        : setNewSession({ ...newSession, time: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={editingSession?.duration || newSession.duration}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, duration: parseInt(e.target.value) })
                        : setNewSession({ ...newSession, duration: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pomodoros
                    </label>
                    <input
                      type="number"
                      value={editingSession?.pomodoros || newSession.pomodoros}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, pomodoros: parseInt(e.target.value) })
                        : setNewSession({ ...newSession, pomodoros: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={editingSession?.priority || newSession.priority}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, priority: e.target.value as any })
                        : setNewSession({ ...newSession, priority: e.target.value as any })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {PRIORITY_LEVELS.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder (minutes before)
                    </label>
                    <select
                      value={editingSession?.reminder || newSession.reminder}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, reminder: parseInt(e.target.value) })
                        : setNewSession({ ...newSession, reminder: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">No reminder</option>
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingSession?.description || newSession.description}
                      onChange={(e) => editingSession
                        ? setEditingSession({ ...editingSession, description: e.target.value })
                        : setNewSession({ ...newSession, description: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Additional notes about this session..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button
                  onClick={editingSession ? updateSession : createSession}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  {editingSession ? 'Update Session' : 'Schedule Session'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingSession(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}