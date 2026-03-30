import { useState } from 'react';
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, FastForward } from "lucide-react";
import { ThemeSelector } from './ThemeSelector';
import { CharacterSelector } from './CharacterSelector';
import { UserInfoStep } from './UserInfoStep';
import { UserGoalsStep } from './UserGoalsStep';
import { PersonalizedIntroStep } from './PersonalizedIntroStep';
import { AIStoryRecommendation } from './AIStoryRecommendation';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingScreenProps {
  onStart: (selectedTheme: string, selectedCharacter: string, userName: string, userEmail: string, userGoals: string[]) => void;
}

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  const [step, setStep] = useState<'userInfo' | 'character' | 'intro' | 'goals' | 'story'>('userInfo');
  const [selectedTheme, setSelectedTheme] = useState('dragon-warrior');
  const [selectedCharacter, setSelectedCharacter] = useState('character-1');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userGoals, setUserGoals] = useState<string[]>([]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canContinue = () => {
    if (step === 'userInfo') {
      return userName.trim().length >= 2 && userEmail && validateEmail(userEmail);
    }
    return true;
  };

  const handleContinue = () => {
    if (step === 'userInfo') {
      setStep('character');
    } else if (step === 'character') {
      // Always go to intro page when clicking "Let's Get Started"
      setStep('intro');
    } else if (step === 'intro') {
      setStep('goals');
    } else if (step === 'goals') {
      setStep('story');
    } else {
      onStart(selectedTheme, selectedCharacter, userName, userEmail, userGoals);
    }
  };

  const handleSkipIntro = () => {
    // Remember that the user has skipped the intro
    localStorage.setItem('hasSkippedIntro', 'true');
    setStep('goals');
  };

  const handleBack = () => {
    if (step === 'story') {
      setStep('goals');
    } else if (step === 'goals') {
      setStep('intro');
    } else if (step === 'intro') {
      setStep('character');
    } else if (step === 'character') {
      setStep('userInfo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Progress Indicator - Now shows for character and story steps */}
        {(step === 'character' || step === 'story') && (
          <motion.div 
            className="flex justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {['Character', 'Story'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  (index === 0 && step === 'character') || (index === 1 && step === 'story') || (step === 'story')
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/50 text-muted-foreground'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    (index === 0 && step === 'character') || (index === 1 && step === 'story') || (step === 'story')
                      ? 'bg-primary-foreground text-primary' 
                      : 'bg-muted'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                {index < 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step === 'story' ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Study with a Story Content - Show ONLY on intro step */}
        {step === 'intro' && (
          <PersonalizedIntroStep 
            selectedCharacter={selectedCharacter}
            userName={userName}
          />
        )}

        <AnimatePresence mode="wait">
          {step === 'userInfo' ? (
            <motion.div
              key="userInfo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <UserInfoStep 
                name={userName}
                email={userEmail}
                onNameChange={setUserName}
                onEmailChange={setUserEmail}
              />
              
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleContinue}
                  size="lg"
                  disabled={!canContinue()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Choose Your Companion
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : step === 'character' ? (
            <motion.div
              key="character"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <CharacterSelector 
                selectedCharacter={selectedCharacter}
                onSelectCharacter={setSelectedCharacter}
              />
              
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleBack}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleContinue}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8"
                  >
                    Let's Get Started!
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                {/* Skip Intro Button - Subtle and Secondary */}
                <Button 
                  onClick={handleSkipIntro}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FastForward className="w-3 h-3 mr-2" />
                  Skip intro, go straight to setup
                </Button>
              </div>
            </motion.div>
          ) : step === 'intro' ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 shadow-lg"
                >
                  Set Your Study Goals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : step === 'goals' ? (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <UserGoalsStep 
                goals={userGoals}
                onGoalsChange={setUserGoals}
              />
              
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  size="lg"
                  disabled={userGoals.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className="text-center mb-6">
                <h2 className="mb-2">Choose Your Story</h2>
                <p className="text-muted-foreground">Select the adventure that will accompany your study journey</p>
              </div>
              
              <ThemeSelector 
                selectedTheme={selectedTheme}
                onSelectTheme={setSelectedTheme}
              />
              
              {/* AI Story Recommendation Section */}
              <AIStoryRecommendation 
                selectedTheme={selectedTheme}
                selectedCharacter={selectedCharacter}
                userGoals={userGoals}
                onSwitchTheme={setSelectedTheme}
              />
              
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8"
                >
                  Begin Your Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}