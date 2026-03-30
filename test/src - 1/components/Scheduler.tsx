import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Download, 
  Repeat,
  BookOpen,
  Target,
  Bell,
  ExternalLink,
  Trash2,
  Edit
} from 'lucide-react';

interface StudySession {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  duration: number; // minutes
  type: 'study' | 'review' | 'project' | 'exam-prep' | 'break';
  subject?: string;
  pomodoroCount?: number;
  priority: 'low' | 'medium' | 'high';
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  reminders?: number[]; // minutes before session
  completed?: boolean;
  created: Date;
}

interface SchedulerProps {
  onClose?: () => void;
  onScheduleSession?: (session: StudySession) => void;
}

export function Scheduler({ onClose, onScheduleSession }: SchedulerProps) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreating, setIsCreating] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    title: '',
    description: '',
    startTime: new Date(),
    duration: 25,
    type: 'study',
    subject: '',
    pomodoroCount: 1,
    priority: 'medium',
    reminders: [10, 5]
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    try {
      const stored = localStorage.getItem('pomodoro-scheduled-sessions');
      if (stored) {
        const parsed = JSON.parse(stored);
        const sessions = parsed.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          created: new Date(session.created),
          recurring: session.recurring ? {
            ...session.recurring,
            endDate: session.recurring.endDate ? new Date(session.recurring.endDate) : undefined
          } : undefined
        }));
        setSessions(sessions);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const saveSessions = (updatedSessions: StudySession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem('pomodoro-scheduled-sessions', JSON.stringify(updatedSessions));
  };

  const createSession = () => {
    if (!newSession.title?.trim()) {
      toast.error('Please enter a session title');
      return;
    }

    const session: StudySession = {
      id: crypto.randomUUID(),
      title: newSession.title.trim(),
      description: newSession.description?.trim() || '',
      startTime: newSession.startTime || new Date(),
      duration: newSession.duration || 25,
      type: newSession.type || 'study',
      subject: newSession.subject?.trim() || '',
      pomodoroCount: newSession.pomodoroCount || 1,
      priority: newSession.priority || 'medium',
      recurring: newSession.recurring,
      reminders: newSession.reminders || [10, 5],
      completed: false,
      created: new Date()
    };

    const updatedSessions = [...sessions, session];
    saveSessions(updatedSessions);
    
    // Schedule notifications
    scheduleNotifications(session);
    
    setNewSession({
      title: '',
      description: '',
      startTime: new Date(),
      duration: 25,
      type: 'study',
      subject: '',
      pomodoroCount: 1,
      priority: 'medium',
      reminders: [10, 5]
    });
    setIsCreating(false);
    toast.success('Study session scheduled!');
    
    if (onScheduleSession) {
      onScheduleSession(session);
    }
  };

  const updateSession = () => {
    if (!editingSession) return;
    
    const updatedSessions = sessions.map(session => 
      session.id === editingSession.id ? editingSession : session
    );
    saveSessions(updatedSessions);
    setEditingSession(null);
    toast.success('Session updated!');
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    saveSessions(updatedSessions);
    toast.success('Session deleted');
  };

  const completeSession = (sessionId: string) => {
    const updatedSessions = sessions.map(session => 
      session.id === sessionId ? { ...session, completed: true } : session
    );
    saveSessions(updatedSessions);
    toast.success('Session marked as completed!');
  };

  const scheduleNotifications = (session: StudySession) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    session.reminders?.forEach(minutes => {
      const notificationTime = session.startTime.getTime() - (minutes * 60 * 1000);
      const now = Date.now();
      
      if (notificationTime > now) {
        setTimeout(() => {
          new Notification(`Study Session Reminder`, {
            body: `"${session.title}" starts in ${minutes} minutes`,
            icon: '/favicon.ico'
          });
        }, notificationTime - now);
      }
    });
  };

  const exportToCalendar = (session: StudySession) => {
    const startTime = session.startTime;
    const endTime = new Date(startTime.getTime() + session.duration * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pomodoro Study App//EN
BEGIN:VEVENT
UID:${session.id}@pomodoro-app.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startTime)}
DTEND:${formatDate(endTime)}
SUMMARY:${session.title}
DESCRIPTION:${session.description || 'Study session'}\\nSubject: ${session.subject || 'General'}\\nPomodoros: ${session.pomodoroCount}\\nPriority: ${session.priority}
PRIORITY:${session.priority === 'high' ? '1' : session.priority === 'medium' ? '5' : '9'}
BEGIN:VALARM
TRIGGER:-PT10M
ACTION:DISPLAY
DESCRIPTION:Study session starts in 10 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Calendar event exported!');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      }
    }
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === date.toDateString();
    }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return sessions
      .filter(session => session.startTime > now && !session.completed)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500'; 
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'review': return <Repeat className="w-4 h-4" />;
      case 'project': return <Target className="w-4 h-4" />;
      case 'exam-prep': return <BookOpen className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const todaySessions = getSessionsForDate(selectedDate);
  const upcomingSessions = getUpcomingSessions();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Study Scheduler</h1>
            <p className="text-muted-foreground">Plan and organize your study sessions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={requestNotificationPermission}>
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <Button 
              onClick={() => setIsCreating(true)} 
              className="w-full mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </CardContent>
        </Card>

        {/* Daily Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
              <Badge variant="outline">
                {todaySessions.length} sessions
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySessions.length > 0 ? (
                todaySessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(session.priority)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(session.type)}
                          <span className="font-medium">{session.title}</span>
                          {session.subject && (
                            <Badge variant="secondary">{session.subject}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                          {session.duration} min • 
                          {session.pomodoroCount} pomodoro{session.pomodoroCount !== 1 ? 's' : ''}
                        </div>
                        {session.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {session.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!session.completed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => completeSession(session.id)}
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportToCalendar(session)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSession(session)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSession(session.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No sessions scheduled for this date</p>
                  <Button 
                    variant="link" 
                    onClick={() => setIsCreating(true)}
                    className="mt-2"
                  >
                    Schedule your first session
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(session.type)}
                    <div>
                      <span className="font-medium">{session.title}</span>
                      {session.subject && (
                        <Badge variant="outline" className="ml-2">{session.subject}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.startTime.toLocaleDateString()} at {' '}
                    {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Session Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Study Session</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={newSession.title || ''}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                className="col-span-3"
                placeholder="Study session title..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">Subject</Label>
              <Input
                id="subject"
                value={newSession.subject || ''}
                onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                className="col-span-3"
                placeholder="Mathematics, Biology, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newSession.description || ''}
                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                className="col-span-3"
                placeholder="Optional description..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="datetime" className="text-right">Date & Time</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={newSession.startTime ? newSession.startTime.toISOString().slice(0, 16) : ''}
                onChange={(e) => setNewSession({ ...newSession, startTime: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={newSession.duration || 25}
                onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                className="col-span-1"
                min="5"
                max="240"
              />
              <Label htmlFor="pomodoros" className="text-right">Pomodoros</Label>
              <Input
                id="pomodoros"
                type="number"
                value={newSession.pomodoroCount || 1}
                onChange={(e) => setNewSession({ ...newSession, pomodoroCount: parseInt(e.target.value) })}
                className="col-span-1"
                min="1"
                max="10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={newSession.type} onValueChange={(value: any) => setNewSession({ ...newSession, type: value })}>
                <SelectTrigger className="col-span-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="exam-prep">Exam Prep</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <Select value={newSession.priority} onValueChange={(value: any) => setNewSession({ ...newSession, priority: value })}>
                <SelectTrigger className="col-span-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={createSession}>
              Schedule Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Session Dialog */}
      <Dialog open={!!editingSession} onOpenChange={() => setEditingSession(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Study Session</DialogTitle>
          </DialogHeader>
          {editingSession && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Title</Label>
                <Input
                  id="edit-title"
                  value={editingSession.title}
                  onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-subject" className="text-right">Subject</Label>
                <Input
                  id="edit-subject"
                  value={editingSession.subject || ''}
                  onChange={(e) => setEditingSession({ ...editingSession, subject: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-datetime" className="text-right">Date & Time</Label>
                <Input
                  id="edit-datetime"
                  type="datetime-local"
                  value={editingSession.startTime.toISOString().slice(0, 16)}
                  onChange={(e) => setEditingSession({ ...editingSession, startTime: new Date(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">Duration (min)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={editingSession.duration}
                  onChange={(e) => setEditingSession({ ...editingSession, duration: parseInt(e.target.value) })}
                  className="col-span-1"
                />
                <Label htmlFor="edit-priority" className="text-right">Priority</Label>
                <Select value={editingSession.priority} onValueChange={(value: any) => setEditingSession({ ...editingSession, priority: value })}>
                  <SelectTrigger className="col-span-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingSession(null)}>
              Cancel
            </Button>
            <Button onClick={updateSession}>
              Update Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}