import { motion } from 'motion/react';
import { Card } from './ui/card';
import { STORY_THEMES, StoryTheme } from './StoryThemes';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeSelector({ selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {STORY_THEMES.map((theme, index) => (
        <motion.div
          key={theme.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`p-6 cursor-pointer transition-all relative overflow-hidden ${
              selectedTheme === theme.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelectTheme(theme.id)}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`} />
            
            {/* Selected indicator */}
            {selectedTheme === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}

            {/* Icon */}
            <div className="text-4xl mb-3 relative z-10">
              {theme.icon}
            </div>

            {/* Name */}
            <h3 className={`mb-2 relative z-10 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
              {theme.name}
            </h3>

            {/* Tagline */}
            <p className="text-sm text-muted-foreground relative z-10">
              {theme.tagline}
            </p>

            {/* Preview badge */}
            <div className="mt-3 relative z-10">
              <span className={`inline-block px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${theme.gradient}`}>
                {theme.chapters.length} Chapters
              </span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
