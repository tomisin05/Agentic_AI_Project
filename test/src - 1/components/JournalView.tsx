import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeft, Calendar, Clock, TrendingUp } from "lucide-react";

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

interface JournalViewProps {
  entries: JournalEntry[];
  onBack: () => void;
}

export function JournalView({ entries, onBack }: JournalViewProps) {
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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1>Study Journal</h1>
          <p className="text-muted-foreground">Track your progress and story evolution</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Today's Entries */}
      {todayEntries.length > 0 && (
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
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Session {entry.sessionNumber}</Badge>
                        <Badge variant="outline">
                          {getMoodEmoji(entry.mood)} {entry.mood}
                        </Badge>
                        <Badge variant="outline">Focus {entry.focusRating}/5</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{entry.storyChapter}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Previous Entries */}
      {previousEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Sessions</CardTitle>
            <CardDescription>Your study journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60">
              <div className="space-y-4">
                {previousEntries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <div key={entry.id} className="border-l-4 border-primary/20 pl-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Session {entry.sessionNumber}</Badge>
                          <Badge variant="outline">Focus {entry.focusRating}/5</Badge>
                          <span className="text-sm text-muted-foreground">
                            {getMoodEmoji(entry.mood)}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-sm font-medium text-primary">{entry.storyChapter}</p>
                        <p className="text-sm text-muted-foreground">{entry.storyOutcome}</p>
                      </div>
                      
                      {entry.reflection && (
                        <div className="bg-muted/30 rounded p-2 text-sm">
                          <span className="font-medium">Reflection: </span>
                          {entry.reflection}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
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
    </div>
  );
}