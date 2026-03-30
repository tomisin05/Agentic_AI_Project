import { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Lightbulb, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateAdaptiveInsights, 
  getTopInsight,
  AdaptiveInsight,
  StudyPattern 
} from '../lib/adaptiveInsights';

interface AdaptiveInsightsDisplayProps {
  journalEntries?: Array<{
    date: string;
    focusRating: number;
    duration?: number;
  }>;
}

export function AdaptiveInsightsDisplay({ journalEntries = [] }: AdaptiveInsightsDisplayProps) {
  const [insights, setInsights] = useState<AdaptiveInsight[]>([]);
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Stabilize journalEntries to prevent infinite loops
  const entriesKey = useMemo(() => 
    JSON.stringify(journalEntries), 
    [journalEntries]
  );

  useEffect(() => {
    if (journalEntries.length === 0) {
      setInsights([]);
      return;
    }

    // Convert journal entries to study pattern
    const pattern: StudyPattern = {
      sessions: journalEntries.map(entry => {
        const date = new Date(entry.date);
        return {
          date: entry.date,
          startTime: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
          duration: entry.duration || 25,
          focusLevel: entry.focusRating,
          completed: true
        };
      }),
      lastAnalyzed: new Date().toISOString()
    };

    const generatedInsights = generateAdaptiveInsights(pattern);
    setInsights(generatedInsights);
  }, [entriesKey]); // Use entriesKey instead of journalEntries

  const handleDismiss = (insightTitle: string) => {
    setDismissedInsights(prev => new Set(prev).add(insightTitle));
  };

  const visibleInsights = showAll 
    ? insights.filter(i => !dismissedInsights.has(i.title))
    : insights.slice(0, 1).filter(i => !dismissedInsights.has(i.title));

  const topInsight = getTopInsight(insights.filter(i => !dismissedInsights.has(i.title)));

  if (visibleInsights.length === 0 && !topInsight) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'focus-pattern':
      case 'session-length':
        return <Lightbulb className="w-5 h-5" />;
      case 'timing':
      case 'consistency':
        return <TrendingUp className="w-5 h-5" />;
      case 'workload':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'from-amber-500 to-orange-600';
      case 'tip': return 'from-blue-500 to-indigo-600';
      case 'info': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'warning': return 'bg-amber-500';
      case 'tip': return 'bg-blue-500';
      case 'info': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visibleInsights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 bg-gradient-to-r ${getSeverityColor(insight.severity)} text-white border-0 shadow-lg`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{insight.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <Badge className={`${getSeverityBadge(insight.severity)} text-white border-0 text-xs uppercase`}>
                        {insight.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/90 mb-2">{insight.message}</p>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        {getIconForType(insight.type)}
                        <div>
                          <p className="text-xs font-medium mb-1">Recommended Action:</p>
                          <p className="text-sm">{insight.actionable}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(insight.title)}
                  className="text-white hover:bg-white/20 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {insights.length > 1 && !showAll && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(true)}
          className="w-full"
        >
          Show {insights.length - 1} more insight{insights.length - 1 !== 1 ? 's' : ''}
        </Button>
      )}

      {showAll && insights.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(false)}
          className="w-full"
        >
          Show less
        </Button>
      )}
    </div>
  );
}