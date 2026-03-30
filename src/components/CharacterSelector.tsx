import { motion } from 'motion/react';
import { Card } from './ui/card';
import { CHARACTER_OPTIONS, CharacterOption } from './CharacterOptions';
import { Check, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CharacterSelectorProps {
  selectedCharacter: string;
  onSelectCharacter: (characterId: string) => void;
}

export function CharacterSelector({ selectedCharacter, onSelectCharacter }: CharacterSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Study Companion
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Pick a companion who will guide you, celebrate your wins, and help you achieve your goals throughout your study journey!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {CHARACTER_OPTIONS.map((character, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`p-3 cursor-pointer transition-all relative overflow-hidden ${
                selectedCharacter === character.id
                  ? 'ring-4 ring-offset-2 shadow-2xl'
                  : 'hover:shadow-xl hover:ring-2 hover:ring-offset-1'
              }`}
              style={{
                ringColor: selectedCharacter === character.id ? `var(--gradient-${character.theme})` : undefined
              }}
              onClick={() => onSelectCharacter(character.id)}
            >
              {/* Animated background gradient */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${character.theme} opacity-10`}
                animate={{
                  opacity: selectedCharacter === character.id ? [0.1, 0.2, 0.1] : 0.1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Selected checkmark */}
              {selectedCharacter === character.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${character.theme} flex items-center justify-center shadow-lg z-10`}
                >
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </motion.div>
              )}

              {/* Character Avatar */}
              <div className="relative z-10 mb-2">
                <motion.div 
                  className={`w-full aspect-square rounded-xl overflow-hidden border-3 transition-all ${
                    selectedCharacter === character.id ? 'border-transparent' : 'border-gray-200'
                  }`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <ImageWithFallback 
                    src={character.avatar}
                    alt={character.description}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Emoji badge */}
                <motion.div
                  className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${character.theme} flex items-center justify-center text-xl shadow-lg border-2 border-white`}
                  animate={{
                    rotate: selectedCharacter === character.id ? [0, 10, -10, 0] : 0
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: selectedCharacter === character.id ? Infinity : 0,
                    repeatDelay: 2
                  }}
                >
                  {character.emoji}
                </motion.div>
              </div>

              {/* Description */}
              <div className="relative z-10 text-center">
                <p className={`text-xs font-medium mb-1 bg-gradient-to-r ${character.theme} bg-clip-text text-transparent`}>
                  {character.description}
                </p>
                <p className="text-[10px] text-muted-foreground line-clamp-2">
                  {character.personality}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Character Preview */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className={`p-6 max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 border-2 relative overflow-hidden`}>
            {(() => {
              const char = CHARACTER_OPTIONS.find(c => c.id === selectedCharacter);
              if (!char) return null;
              
              return (
                <>
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${char.theme} opacity-5 rounded-full blur-3xl`} />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <motion.div 
                      className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white shadow-2xl"
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ImageWithFallback 
                        src={char.avatar}
                        alt={char.description}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{char.emoji}</span>
                        <h3 className={`bg-gradient-to-r ${char.theme} bg-clip-text text-transparent`}>
                          {char.description}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {char.personality}
                      </p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${char.theme} text-white text-xs`}>
                        <Sparkles className="w-3 h-3" />
                        <span>Your study companion is ready!</span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
