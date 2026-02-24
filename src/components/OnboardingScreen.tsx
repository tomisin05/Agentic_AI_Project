import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Clock, Trophy, Users } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingScreenProps {
  onStart: () => void;
}

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Study with a Story
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your study sessions into an engaging adventure. Focus on your work while following an interactive story that evolves based on your concentration and progress.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Interactive Storytelling</CardTitle>
              <CardDescription>
                Follow your character's journey as they work alongside you. Your focus and dedication directly influence the story's direction and outcomes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Pomodoro Technique</CardTitle>
              <CardDescription>
                Study in focused 25-minute sessions with 5-minute breaks. The story progresses during breaks, rewarding your concentration.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Your character's success depends on your focus. Stay concentrated to help them overcome challenges and achieve their goals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle>Personal Journey</CardTitle>
              <CardDescription>
                Keep a study journal and watch how your story evolves over time. Each session builds on your previous progress.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="mb-4">How it works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</div>
                  <p>Start a study session and meet your character</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</div>
                  <p>Focus on your work for 25 minutes while the story unfolds</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</div>
                  <p>During breaks, see how your character progresses based on your focus</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">4</div>
                  <p>Build your study journal and watch your story grow</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1641444473327-ea736547d7bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHN0dWR5aW5nJTIwYm9va3N8ZW58MXx8fHwxNzU5MTc1MTcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Character studying"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3"
          >
            Begin Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}