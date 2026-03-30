export interface CharacterOption {
  id: string;
  avatar: string;
  description: string;
  personality: string;
  defaultMood: 'focused' | 'struggling' | 'successful' | 'determined';
  theme: string; // For styling
  emoji: string; // Fun emoji representation
}

export const CHARACTER_OPTIONS: CharacterOption[] = [
  {
    id: 'character-1',
    avatar: 'https://images.unsplash.com/photo-1752479909519-0727c021efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwY2hhcmFjdGVyJTIwYXZhdGFyJTIwYmx1ZXxlbnwxfHx8fDE3NjA0NzAzMzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Brave Scholar',
    personality: 'Bold and fearless, tackles challenges head-on',
    defaultMood: 'determined',
    theme: 'from-blue-500 to-indigo-600',
    emoji: '🦸'
  },
  {
    id: 'character-2',
    avatar: 'https://images.unsplash.com/photo-1733765601550-0d79dc6566e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjaGFyYWN0ZXIlMjBwaW5rfGVufDF8fHx8MTc2MDQ3MDMzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Cheerful Explorer',
    personality: 'Optimistic and curious, finds joy in learning',
    defaultMood: 'successful',
    theme: 'from-pink-500 to-rose-500',
    emoji: '🌸'
  },
  {
    id: 'character-3',
    avatar: 'https://images.unsplash.com/photo-1759863489255-f4a960247d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBjaGFyYWN0ZXIlMjBncmVlbnxlbnwxfHx8fDE3NjA0NzAzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Focused Achiever',
    personality: 'Calm and collected, stays on track no matter what',
    defaultMood: 'focused',
    theme: 'from-green-500 to-emerald-600',
    emoji: '🎯'
  },
  {
    id: 'character-4',
    avatar: 'https://images.unsplash.com/photo-1652795385761-7ac287d0cd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwYXZhdGFyJTIwb3JhbmdlfGVufDF8fHx8MTc2MDQ3MDMzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Energetic Spirit',
    personality: 'Full of energy and enthusiasm, loves challenges',
    defaultMood: 'determined',
    theme: 'from-orange-500 to-amber-600',
    emoji: '⚡'
  },
  {
    id: 'character-5',
    avatar: 'https://images.unsplash.com/photo-1759663174515-9057d83c8b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA0MzczMTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Retro Gamer',
    personality: 'Strategic thinker, levels up through persistence',
    defaultMood: 'focused',
    theme: 'from-purple-500 to-violet-600',
    emoji: '🎮'
  },
  {
    id: 'character-6',
    avatar: 'https://images.unsplash.com/photo-1723118460411-1ad27b8827be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwbWFzY290JTIwY2hhcmFjdGVyfGVufDF8fHx8MTc2MDQwOTE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Wise Mentor',
    personality: 'Patient and thoughtful, guides with wisdom',
    defaultMood: 'focused',
    theme: 'from-teal-500 to-cyan-600',
    emoji: '🦉'
  },
  {
    id: 'character-7',
    avatar: 'https://images.unsplash.com/photo-1606978802549-3276d4199859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGliaSUyMGNoYXJhY3RlciUyMHB1cnBsZXxlbnwxfHx8fDE3NjA0NzAzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Creative Dreamer',
    personality: 'Imaginative and artistic, thinks outside the box',
    defaultMood: 'successful',
    theme: 'from-fuchsia-500 to-purple-600',
    emoji: '✨'
  },
  {
    id: 'character-8',
    avatar: 'https://images.unsplash.com/photo-1758919294444-88fa264c124e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3klMjBjaGFyYWN0ZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA0NzAzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The Resilient Fighter',
    personality: 'Never gives up, grows stronger with every challenge',
    defaultMood: 'determined',
    theme: 'from-red-500 to-orange-600',
    emoji: '🔥'
  }
];

export function getCharacterById(id: string): CharacterOption | undefined {
  return CHARACTER_OPTIONS.find(char => char.id === id);
}
