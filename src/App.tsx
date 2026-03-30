import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MainStudyApp } from './components/MainStudyApp';
import { AIChatWidget } from './components/AIChatWidget';
import { SettingsProvider } from './lib/settingsContext';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('dragon-warrior');
  const [selectedCharacter, setSelectedCharacter] = useState('character-1');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userGoals, setUserGoals] = useState<string[]>([]);

  const handleStart = (themeId: string, characterId: string, name: string, email: string, goals: string[]) => {
    setSelectedTheme(themeId);
    setSelectedCharacter(characterId);
    setUserName(name);
    setUserEmail(email);
    setUserGoals(goals);
    setShowOnboarding(false);
  };

  return (
    <SettingsProvider>
      <div>
        {showOnboarding ? (
          <OnboardingScreen onStart={handleStart} />
        ) : (
          <MainStudyApp 
            selectedTheme={selectedTheme} 
            selectedCharacter={selectedCharacter}
            userGoals={userGoals.join(', ')}
            onGoalsUpdate={(goals) => setUserGoals([goals])}
          />
        )}
        <AIChatWidget />
      </div>
    </SettingsProvider>
  );
}