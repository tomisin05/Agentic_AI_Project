import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface NarrativePanelProps {
  character: {
    name: string;
    avatar: string;
    mood: 'focused' | 'struggling' | 'successful' | 'determined';
  };
  story: {
    text: string;
    background: string;
    chapter: string;
  };
  isBreak: boolean;
}

export function NarrativePanel({ character, story, isBreak }: NarrativePanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'focused': return 'bg-blue-100 text-blue-800';
      case 'struggling': return 'bg-red-100 text-red-800';
      case 'successful': return 'bg-green-100 text-green-800';
      case 'determined': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'focused': return '🎯';
      case 'struggling': return '😰';
      case 'successful': return '🌟';
      case 'determined': return '💪';
      default: return '📚';
    }
  };

  const getMoodAnimation = (mood: string) => {
    switch (mood) {
      case 'focused': return { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } };
      case 'struggling': return { x: [-2, 2, -2, 0], transition: { repeat: Infinity, duration: 1.5 } };
      case 'successful': return { y: [0, -5, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.8 } };
      case 'determined': return { rotate: [-1, 1, -1, 0], transition: { repeat: Infinity, duration: 2.5 } };
      default: return {};
    }
  };

  // Typewriter effect for story text
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    
    const text = story.text;
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30); // Adjust speed here

    return () => clearInterval(typeInterval);
  }, [story.text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full overflow-hidden">
        {/* Animated Dragon Fighting Scene */}
        <div className="relative h-48 bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Floating particles/magic */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                initial={{ 
                  x: Math.random() * 384, 
                  y: Math.random() * 192,
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, Math.random() * 192],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
            
            {/* Mountain silhouettes */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent">
              <svg className="w-full h-full" viewBox="0 0 400 64" fill="none">
                <path d="M0 64L50 32L100 48L150 16L200 40L250 8L300 32L350 20L400 44V64H0Z" fill="rgba(0,0,0,0.3)"/>
              </svg>
            </div>
          </div>

          {/* Dragon */}
          <motion.div
            className="absolute right-8 top-8"
            animate={
              character.mood === 'struggling' 
                ? { 
                    x: [0, -10, 0], 
                    y: [0, -5, 0],
                    rotate: [0, -5, 0],
                    scale: [1, 1.1, 1]
                  }
                : character.mood === 'successful'
                ? {
                    x: [0, 15, 0],
                    y: [0, 10, 0],
                    rotate: [0, 15, 0],
                    opacity: [1, 0.7, 1]
                  }
                : {
                    y: [0, -8, 0],
                    rotate: [0, -3, 0]
                  }
            }
            transition={{ 
              duration: character.mood === 'struggling' ? 1.5 : 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              {/* Dragon body */}
              <motion.div 
                className="w-16 h-12 bg-gradient-to-br from-red-600 to-orange-700 rounded-full relative"
                animate={{ 
                  boxShadow: character.mood === 'struggling' 
                    ? ['0 0 10px rgba(239, 68, 68, 0.5)', '0 0 20px rgba(239, 68, 68, 0.8)', '0 0 10px rgba(239, 68, 68, 0.5)']
                    : ['0 0 5px rgba(239, 68, 68, 0.3)', '0 0 10px rgba(239, 68, 68, 0.5)', '0 0 5px rgba(239, 68, 68, 0.3)']
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {/* Dragon wings */}
                <motion.div 
                  className="absolute -left-2 -top-1 w-6 h-6 bg-red-800 rounded-full transform -rotate-45"
                  animate={{ rotate: [-45, -35, -45] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -right-2 -top-1 w-6 h-6 bg-red-800 rounded-full transform rotate-45"
                  animate={{ rotate: [45, 35, 45] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                
                {/* Dragon eyes */}
                <div className="absolute top-2 left-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <div className="absolute top-2 right-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                
                {/* Fire breath when struggling */}
                <AnimatePresence>
                  {character.mood === 'struggling' && (
                    <motion.div
                      className="absolute -left-8 top-3 w-6 h-3"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 0.8, 1],
                        opacity: [0, 1, 0.8, 0],
                        x: [0, -10, -15, -20]
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          {/* Player Character */}
          <motion.div
            className="absolute left-8 bottom-8"
            animate={
              character.mood === 'focused' || character.mood === 'determined'
                ? { 
                    y: [0, -5, 0],
                    rotate: [0, 2, 0]
                  }
                : character.mood === 'successful'
                ? {
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 0]
                  }
                : {
                    x: [0, -3, 0],
                    rotate: [0, -2, 0]
                  }
            }
            transition={{ 
              duration: character.mood === 'successful' ? 1.2 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              {/* Player character body */}
              <motion.div 
                className="w-12 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg relative"
                animate={{
                  background: character.mood === 'successful' 
                    ? ['linear-gradient(to bottom, #2563eb, #1d4ed8)', 'linear-gradient(to bottom, #3b82f6, #2563eb)', 'linear-gradient(to bottom, #2563eb, #1d4ed8)']
                    : undefined
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {/* Character head */}
                <div className="absolute -top-2 left-2 w-8 h-8 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full">
                  <div className="absolute top-2 left-1.5 w-1 h-1 bg-black rounded-full" />
                  <div className="absolute top-2 right-1.5 w-1 h-1 bg-black rounded-full" />
                  <div className="absolute top-3 left-3 w-2 h-1 bg-pink-400 rounded-full" />
                </div>
                
                {/* Sword */}
                <motion.div 
                  className="absolute -right-3 top-2 w-1 h-8 bg-gradient-to-t from-gray-600 to-gray-300 rounded"
                  animate={
                    character.mood === 'focused' || character.mood === 'determined'
                      ? { rotate: [0, -10, 0] }
                      : character.mood === 'successful'
                      ? { rotate: [0, 25, 0], y: [0, -3, 0] }
                      : {}
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="absolute -top-1 -left-1 w-3 h-2 bg-yellow-400 rounded" />
                </motion.div>
                
                {/* Shield */}
                <motion.div 
                  className="absolute -left-3 top-4 w-4 h-6 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg"
                  animate={
                    character.mood === 'struggling'
                      ? { 
                          x: [0, 2, 0],
                          boxShadow: ['0 0 5px rgba(251, 191, 36, 0.5)', '0 0 15px rgba(251, 191, 36, 0.8)', '0 0 5px rgba(251, 191, 36, 0.5)']
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="absolute inset-1 border border-yellow-300 rounded" />
                </motion.div>

                {/* Magic sparkles around successful character */}
                <AnimatePresence>
                  {character.mood === 'successful' && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                          initial={{ 
                            x: 6, 
                            y: 8,
                            scale: 0,
                            opacity: 0
                          }}
                          animate={{ 
                            x: 6 + (Math.cos(i * Math.PI / 3) * 15),
                            y: 8 + (Math.sin(i * Math.PI / 3) * 15),
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          {/* Battle Effects */}
          <AnimatePresence>
            {(character.mood === 'focused' || character.mood === 'determined') && (
              <motion.div
                className="absolute left-20 bottom-16 w-8 h-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, 40, 80]
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <div className="w-full h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full shadow-lg" />
                <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-50" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <motion.div 
            className="absolute top-4 left-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="secondary" className="bg-white/90 text-black">
              {story.chapter}
            </Badge>
          </motion.div>
          <AnimatePresence>
            {isBreak && (
              <motion.div 
                className="absolute top-4 right-4"
                initial={{ x: 50, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 50, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <Badge className="bg-green-500 text-white animate-pulse">
                  Story Time
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Story Content */}
        <motion.div 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Character Info */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={getMoodAnimation(character.mood)}
              className="relative"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={character.avatar} alt={character.name} />
                <AvatarFallback>{character.name[0]}</AvatarFallback>
              </Avatar>
              {/* Mood indicator pulse effect */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-current rounded-full opacity-20"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ color: character.mood === 'focused' ? '#3b82f6' : 
                              character.mood === 'successful' ? '#10b981' :
                              character.mood === 'struggling' ? '#ef4444' : '#8b5cf6' }}
              />
            </motion.div>
            <div>
              <motion.h3 
                className="font-medium"
                key={character.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {character.name}
              </motion.h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={character.mood}
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge 
                    variant="outline" 
                    className={`${getMoodColor(character.mood)} border-0`}
                  >
                    {getMoodEmoji(character.mood)} {character.mood}
                  </Badge>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Story Text */}
          <motion.div 
            className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="leading-relaxed min-h-[3rem]">
              {displayedText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-0.5 h-5 bg-current ml-1"
                />
              )}
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div 
            className="mt-4 flex items-center justify-between text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {isBreak ? '📖 Story continues...' : '⏰ Working together...'}
            </motion.span>
            <span className="text-primary">
              {isBreak ? '🎭 Interactive mode' : '🎯 Focus mode'}
            </span>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}