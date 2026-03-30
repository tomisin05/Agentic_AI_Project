import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MainStudyApp } from './components/MainStudyApp';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding) {
    return (
      <OnboardingScreen onStart={() => setShowOnboarding(false)} />
    );
  }

  return <MainStudyApp />;
}