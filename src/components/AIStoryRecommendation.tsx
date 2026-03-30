import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { getThemeById, StoryTheme } from './StoryThemes';
import { getCharacterById } from './CharacterOptions';

interface AIStoryRecommendationProps {
  selectedTheme: string;
  selectedCharacter: string;
  userGoals: string[];
  onSwitchTheme: (themeId: string) => void;
}

interface StoryFitAnalysis {
  fitLevel: 'great' | 'good' | 'not-ideal';
  explanation: string;
  suggestedAlternatives?: {
    themeId: string;
    reason: string;
  }[];
}

function analyzeStoryFit(
  theme: StoryTheme | undefined,
  characterPersonality: string,
  userGoals: string[]
): StoryFitAnalysis {
  if (!theme) {
    return {
      fitLevel: 'not-ideal',
      explanation: 'No theme selected.',
      suggestedAlternatives: []
    };
  }

  const goalKeywords = userGoals.join(' ').toLowerCase();
  const hasActionGoals = goalKeywords.includes('challenge') || 
                         goalKeywords.includes('overcome') || 
                         goalKeywords.includes('achieve') ||
                         goalKeywords.includes('master');
  const hasExplorationGoals = goalKeywords.includes('discover') || 
                              goalKeywords.includes('learn') || 
                              goalKeywords.includes('explore') ||
                              goalKeywords.includes('understand');
  const hasCalmGoals = goalKeywords.includes('peace') || 
                       goalKeywords.includes('calm') || 
                       goalKeywords.includes('mindful') ||
                       goalKeywords.includes('balance');

  const isBoldCharacter = characterPersonality.includes('fearless') || 
                          characterPersonality.includes('never gives up');
  const isCalmCharacter = characterPersonality.includes('calm') || 
                          characterPersonality.includes('patient');
  const isCuriousCharacter = characterPersonality.includes('curious') || 
                             characterPersonality.includes('imaginative');

  // Dragon Warrior analysis
  if (theme.id === 'dragon-warrior') {
    if ((hasActionGoals || isBoldCharacter) && !hasCalmGoals) {
      return {
        fitLevel: 'great',
        explanation: `Your ${characterPersonality.toLowerCase()} companion thrives in battle scenarios. The Dragon Warrior theme aligns perfectly with your action-oriented goals, creating an epic narrative that fuels your determination and transforms every study session into a heroic quest.`
      };
    } else if (hasCalmGoals || isCalmCharacter) {
      return {
        fitLevel: 'not-ideal',
        explanation: `While Dragon Warrior offers exciting battles, your calm-focused goals and ${characterPersonality.toLowerCase()} companion might benefit from a more peaceful narrative that emphasizes growth and discovery over combat.`,
        suggestedAlternatives: [
          {
            themeId: 'garden-sage',
            reason: 'Peaceful growth narrative that matches your mindful study approach'
          },
          {
            themeId: 'space-explorer',
            reason: 'Discovery-focused journey without combat pressure'
          }
        ]
      };
    } else {
      return {
        fitLevel: 'good',
        explanation: `Dragon Warrior provides strong motivation through its heroic narrative. Your ${characterPersonality.toLowerCase()} companion can adapt to the battle theme, though other stories might align more naturally with your goals.`
      };
    }
  }

  // Space Explorer analysis
  if (theme.id === 'space-explorer') {
    if ((hasExplorationGoals || isCuriousCharacter) && !hasActionGoals) {
      return {
        fitLevel: 'great',
        explanation: `Perfect match! Your ${characterPersonality.toLowerCase()} companion excels at exploration and discovery. Space Explorer's journey through the cosmos mirrors your learning goals, creating a narrative where every study session reveals new knowledge frontiers.`
      };
    } else if (hasActionGoals && !hasExplorationGoals) {
      return {
        fitLevel: 'not-ideal',
        explanation: `Space Explorer focuses on discovery and navigation. Your action-oriented goals and ${characterPersonality.toLowerCase()} companion might prefer a more direct challenge-based narrative.`,
        suggestedAlternatives: [
          {
            themeId: 'dragon-warrior',
            reason: 'Direct combat challenges that match your achievement-focused mindset'
          },
          {
            themeId: 'detective-mystery',
            reason: 'Problem-solving challenges with immediate tactical wins'
          }
        ]
      };
    } else {
      return {
        fitLevel: 'good',
        explanation: `Space Explorer offers a balanced journey of discovery and problem-solving. Your ${characterPersonality.toLowerCase()} companion can navigate this cosmic adventure effectively, though the pacing may vary with your specific goals.`
      };
    }
  }

  // Garden Sage analysis
  if (theme.id === 'garden-sage' || theme.id === 'garden-grower') {
    if (hasCalmGoals || isCalmCharacter) {
      return {
        fitLevel: 'great',
        explanation: `Excellent alignment! Your ${characterPersonality.toLowerCase()} companion brings the perfect energy for this peaceful cultivation journey. Garden Sage's gradual growth narrative matches your mindful approach, creating a meditative study experience that builds wisdom naturally.`
      };
    } else if (hasActionGoals || isBoldCharacter) {
      return {
        fitLevel: 'not-ideal',
        explanation: `Garden Sage emphasizes slow, meditative growth. Your action-driven goals and ${characterPersonality.toLowerCase()} companion might find the pacing too gradual compared to more dynamic narratives.`,
        suggestedAlternatives: [
          {
            themeId: 'dragon-warrior',
            reason: 'Fast-paced battles that match your energetic study style'
          },
          {
            themeId: 'detective-mystery',
            reason: 'Engaging problem-solving with immediate tactical wins'
          }
        ]
      };
    } else {
      return {
        fitLevel: 'good',
        explanation: `Garden Sage provides a calming backdrop for focused study. Your ${characterPersonality.toLowerCase()} companion can appreciate the peaceful progression, though you may occasionally crave more excitement.`
      };
    }
  }

  // Detective Mystery analysis
  if (theme.id === 'detective-mystery') {
    const hasProblemSolvingGoals = goalKeywords.includes('problem') || 
                                    goalKeywords.includes('solve') || 
                                    goalKeywords.includes('analyze') ||
                                    goalKeywords.includes('understand');
    
    if (hasProblemSolvingGoals || (hasExplorationGoals && characterPersonality.includes('strategic'))) {
      return {
        fitLevel: 'great',
        explanation: `Perfect detective pairing! Your ${characterPersonality.toLowerCase()} companion excels at analytical thinking. The Detective Mystery theme matches your problem-solving goals, transforming each study session into an investigation where focus reveals hidden connections and breakthroughs.`
      };
    } else if (hasCalmGoals) {
      return {
        fitLevel: 'not-ideal',
        explanation: `Detective Mystery involves high-stakes investigation and pressure. Your preference for calm, mindful study and your ${characterPersonality.toLowerCase()} companion might benefit from a less intense narrative environment.`,
        suggestedAlternatives: [
          {
            themeId: 'garden-grower',
            reason: 'Peaceful cultivation that reduces study pressure'
          },
          {
            themeId: 'space-explorer',
            reason: 'Low-pressure discovery at your own cosmic pace'
          }
        ]
      };
    } else {
      return {
        fitLevel: 'good',
        explanation: `Detective Mystery offers engaging puzzle-solving momentum. Your ${characterPersonality.toLowerCase()} companion can follow the investigative trail effectively, creating a focused study atmosphere with clear milestones.`
      };
    }
  }

  // Mountain Climber analysis
  if (theme.id === 'mountain-climber') {
    const hasProgressionGoals = goalKeywords.includes('progress') || 
                                 goalKeywords.includes('improve') || 
                                 goalKeywords.includes('grow') ||
                                 goalKeywords.includes('advance');
    
    if (hasProgressionGoals || characterPersonality.includes('persistent')) {
      return {
        fitLevel: 'great',
        explanation: `Outstanding match! Your ${characterPersonality.toLowerCase()} companion thrives on steady progression. Peak Ascent's mountain climbing narrative perfectly mirrors your growth-focused goals, where each study session is a step higher toward mastery's summit.`
      };
    } else if (hasExplorationGoals && !hasActionGoals) {
      return {
        fitLevel: 'not-ideal',
        explanation: `Mountain climbing emphasizes vertical progression and endurance. Your exploration-focused goals and ${characterPersonality.toLowerCase()} companion might prefer a narrative with more lateral discovery opportunities.`,
        suggestedAlternatives: [
          {
            themeId: 'space-explorer',
            reason: 'Horizontal exploration across vast cosmic landscapes'
          },
          {
            themeId: 'detective-mystery',
            reason: 'Multi-directional investigation following various leads'
          }
        ]
      };
    } else {
      return {
        fitLevel: 'good',
        explanation: `Peak Ascent provides clear progression markers. Your ${characterPersonality.toLowerCase()} companion can tackle the climb steadily, creating a study journey with tangible upward momentum.`
      };
    }
  }

  // Default analysis
  return {
    fitLevel: 'good',
    explanation: `This story theme offers solid motivation for your study journey. Your ${characterPersonality.toLowerCase()} companion adapts well to various narratives, creating a flexible learning experience.`
  };
}

export function AIStoryRecommendation({ 
  selectedTheme, 
  selectedCharacter, 
  userGoals,
  onSwitchTheme
}: AIStoryRecommendationProps) {
  const theme = getThemeById(selectedTheme);
  const character = getCharacterById(selectedCharacter);
  
  const analysis = analyzeStoryFit(
    theme,
    character?.personality || '',
    userGoals
  );

  const getFitColor = () => {
    switch (analysis.fitLevel) {
      case 'great': return 'from-green-500 to-emerald-600';
      case 'good': return 'from-blue-500 to-indigo-600';
      case 'not-ideal': return 'from-amber-500 to-orange-600';
    }
  };

  const getFitLabel = () => {
    switch (analysis.fitLevel) {
      case 'great': return 'Great Match';
      case 'good': return 'Good Fit';
      case 'not-ideal': return 'Not Ideal';
    }
  };

  const getMeterPosition = () => {
    switch (analysis.fitLevel) {
      case 'great': return '80%';
      case 'good': return '50%';
      case 'not-ideal': return '20%';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6"
    >
      <Card className="p-5 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200/50">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <h3 className="font-semibold text-base">AI Story Fit Analysis</h3>
        </div>

        {/* Story Fit Indicator */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Fit</span>
            <Badge className={`bg-gradient-to-r ${getFitColor()} text-white border-0 px-3 py-1`}>
              {getFitLabel()}
            </Badge>
          </div>

          {/* Horizontal Meter */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: getMeterPosition() }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${getFitColor()}`}
              />
            </div>
            <div className="flex justify-between mt-1 px-1">
              <span className="text-xs text-muted-foreground">Low</span>
              <span className="text-xs text-muted-foreground">Medium</span>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="bg-white/70 rounded-lg p-3 mb-4 border border-purple-100">
          <p className="text-sm leading-relaxed text-gray-700">
            {analysis.explanation}
          </p>
        </div>

        {/* Conditional Content */}
        {analysis.fitLevel === 'great' ? (
          // Great Fit Confirmation
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3"
          >
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-green-800">
              This story aligns well with your current goals and study style.
            </p>
          </motion.div>
        ) : (
          // Suggested Alternatives
          analysis.suggestedAlternatives && analysis.suggestedAlternatives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-medium text-gray-800">Suggested Alternatives</h4>
              </div>

              <div className="grid gap-2 mb-3">
                {analysis.suggestedAlternatives.map((suggestion, index) => {
                  const suggestedTheme = getThemeById(suggestion.themeId);
                  if (!suggestedTheme) return null;

                  return (
                    <motion.div
                      key={suggestion.themeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card 
                        className="p-3 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all cursor-pointer border border-gray-200 hover:border-indigo-300"
                        onClick={() => onSwitchTheme(suggestion.themeId)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${suggestedTheme.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                            {suggestedTheme.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm mb-1">{suggestedTheme.name}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {suggestion.reason}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full border-2 border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-medium"
                onClick={() => {
                  if (analysis.suggestedAlternatives && analysis.suggestedAlternatives[0]) {
                    onSwitchTheme(analysis.suggestedAlternatives[0].themeId);
                  }
                }}
              >
                <TrendingUp className="w-3.5 h-3.5 mr-2" />
                Switch to Recommended Story
              </Button>
            </motion.div>
          )
        )}
      </Card>
    </motion.div>
  );
}