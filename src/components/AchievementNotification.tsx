import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Trophy, X } from 'lucide-react';
import { Achievement } from './AchievementSystem';
import { Button } from './ui/button';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-amber-500 to-orange-600'
};

const rarityGlow = {
  common: 'shadow-gray-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-amber-500/50'
};

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className={`max-w-md w-full p-6 text-center relative overflow-hidden shadow-2xl ${rarityGlow[achievement.rarity]}`}>
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]}`}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Trophy icon */}
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.5,
                delay: 0.2
              }}
              className="mb-4 relative z-10"
            >
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${rarityColors[achievement.rarity]} flex items-center justify-center shadow-lg`}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Achievement icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-6xl mb-4 relative z-10"
            >
              {achievement.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-2xl mb-2 bg-gradient-to-r ${rarityColors[achievement.rarity]} bg-clip-text text-transparent relative z-10`}
            >
              {achievement.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground mb-4 relative z-10"
            >
              {achievement.description}
            </motion.p>

            {/* Rarity badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-4 relative z-10"
            >
              <span className={`inline-block px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${rarityColors[achievement.rarity]} shadow-md capitalize`}>
                {achievement.rarity}
              </span>
            </motion.div>

            {/* Reward */}
            {achievement.reward && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-muted/50 rounded-lg p-3 relative z-10"
              >
                <p className="text-sm">
                  <span className="opacity-70">Reward:</span> <span className="font-medium">{achievement.reward}</span>
                </p>
              </motion.div>
            )}

            {/* Confetti effect */}
            {achievement.rarity === 'epic' || achievement.rarity === 'legendary' ? (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                      left: '50%',
                      top: '50%'
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: (Math.random() - 0.5) * 300,
                      y: (Math.random() - 0.5) * 300,
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5 + Math.random() * 0.3
                    }}
                  />
                ))}
              </div>
            ) : null}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
