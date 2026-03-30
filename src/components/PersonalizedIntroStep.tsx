import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { ArrowRight, BookOpen, Timer, MessageCircle, TrendingUp, Sparkles, Flame, Zap } from 'lucide-react';
import { getCharacterById } from './CharacterOptions';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface PersonalizedIntroStepProps {
  selectedCharacter: string;
  userName: string;
}

export function PersonalizedIntroStep({ selectedCharacter, userName }: PersonalizedIntroStepProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const character = getCharacterById(selectedCharacter);

  if (!character) return null;

  const workflowSteps = [
    {
      icon: "📚",
      title: "Focus",
      description: "Study 25 minutes",
      hoverContent: {
        line1: "Deep work session = story progress",
        line2: "Your concentration fuels the adventure",
        line3: "Better focus → Better outcomes"
      },
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: character.emoji,
      title: "Adventure",
      description: `${character.description} progresses`,
      hoverContent: {
        line1: "While you study, I face challenges",
        line2: "Your focus powers my journey forward",
        line3: "Real-time progress during your session"
      },
      color: character.theme
    },
    {
      icon: "✨",
      title: "Discover",
      description: "Break & see what happened",
      hoverContent: {
        line1: "5-minute break reveals the story",
        line2: "Did I win? Find treasure? Discover!",
        line3: "Relax and enjoy what you unlocked"
      },
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <>
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Character Introduction */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 border-2 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${character.theme} opacity-10 rounded-full blur-3xl`} />
            
            <div className="flex items-center justify-center gap-6 mb-4 relative z-10">
              <motion.div 
                className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl"
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ImageWithFallback 
                  src={character.avatar}
                  alt={character.description}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className={`bg-gradient-to-r ${character.theme} bg-clip-text text-transparent text-2xl`}>
                Hi {userName}, I'm {character.description}!
              </h2>
              <p className="text-muted-foreground">
                {character.personality}
              </p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-3"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm text-indigo-700">Your focus fuels my journey</span>
        </motion.div>
      </motion.div>

      {/* Simplified Workflow */}
      <motion.div
        className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-100/40 to-transparent rounded-full blur-3xl" />

        <div className="text-center mb-6 relative z-10">
          <h2 className="mb-1 text-xl">How It Works</h2>
          <p className="text-sm text-muted-foreground">
            Hover to learn more ✨
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto relative z-10">
          {workflowSteps.map((workflowStep, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onHoverStart={() => setHoveredStep(index)}
              onHoverEnd={() => setHoveredStep(null)}
              className="relative"
            >
              <motion.div
                className={`relative bg-gradient-to-br ${workflowStep.color} rounded-xl p-5 cursor-pointer shadow-lg overflow-hidden`}
                animate={{
                  scale: hoveredStep === index ? 1.05 : 1,
                  y: hoveredStep === index ? -8 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Shimmer Effect on Hover */}
                {hoveredStep === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                )}

                {/* Step Number Badge */}
                <motion.div 
                  className="absolute -top-2 -left-2 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center"
                  animate={{ rotate: hoveredStep === index ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-xs font-semibold">{index + 1}</span>
                </motion.div>

                {/* Icon */}
                <motion.div 
                  className="text-4xl mb-2 text-center"
                  animate={{ scale: hoveredStep === index ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {workflowStep.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-center text-white mb-1 text-base font-semibold">
                  {workflowStep.title}
                </h3>
                <p className="text-center text-white/90 text-sm">
                  {workflowStep.description}
                </p>

                {/* Action Text - shows on hover */}
                <AnimatePresence>
                  {hoveredStep === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-center text-white/95 text-xs mt-2 pt-2 border-t border-white/20"
                    >
                      {workflowStep.hoverContent.line1}
                      <br />
                      {workflowStep.hoverContent.line2}
                      <br />
                      {workflowStep.hoverContent.line3}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Arrow connecting to next step */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-white z-10">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Simplified Secret Note */}
      <motion.div
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Flame className="w-5 h-5" />
          <p className="text-sm">
            <span className="font-semibold">Pro tip:</span> Better focus = epic story outcomes! 🏆
          </p>
        </div>
      </motion.div>
    </>
  );
}