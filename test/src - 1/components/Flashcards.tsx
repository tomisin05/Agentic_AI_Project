import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { 
  Brain, 
  Plus, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  RotateCcw,
  Eye,
  EyeOff,
  Shuffle,
  Download,
  Upload,
  Star
} from 'lucide-react';
import { 
  FlashcardData, 
  SpacedRepetitionScheduler, 
  FlashcardStorage, 
  ReviewResult 
} from '../lib/spacedRepetition';

interface FlashcardsProps {
  onClose?: () => void;
}

export function Flashcards({ onClose }: FlashcardsProps) {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState<'due' | 'new' | 'all'>('due');
  const [studyCards, setStudyCards] = useState<FlashcardData[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', tags: '' });

  useEffect(() => {
    loadFlashcards();
  }, []);

  useEffect(() => {
    updateStudyCards();
  }, [cards, reviewMode]);

  const loadFlashcards = () => {
    const loadedCards = FlashcardStorage.loadCards();
    setCards(loadedCards);
  };

  const saveFlashcards = (updatedCards: FlashcardData[]) => {
    setCards(updatedCards);
    FlashcardStorage.saveCards(updatedCards);
  };

  const updateStudyCards = () => {
    let filteredCards: FlashcardData[] = [];
    
    switch (reviewMode) {
      case 'due':
        filteredCards = SpacedRepetitionScheduler.getDueCards(cards);
        break;
      case 'new':
        filteredCards = SpacedRepetitionScheduler.getNewCards(cards);
        break;
      case 'all':
        filteredCards = [...cards];
        break;
    }
    
    setStudyCards(filteredCards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const handleReview = (quality: number) => {
    if (studyCards.length === 0) return;

    const currentCard = studyCards[currentCardIndex];
    const reviewResult: ReviewResult = { quality };
    const updatedCard = SpacedRepetitionScheduler.reviewCard(currentCard, reviewResult);
    
    const updatedCards = cards.map(card => 
      card.id === currentCard.id ? updatedCard : card
    );
    
    saveFlashcards(updatedCards);

    // Move to next card or finish session
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      toast.success('Review session completed! 🎉');
      updateStudyCards(); // Refresh the deck
    }
  };

  const createFlashcard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      toast.error('Please fill in both front and back of the card');
      return;
    }

    const tags = newCard.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const flashcard = SpacedRepetitionScheduler.createFlashcard(
      newCard.front.trim(),
      newCard.back.trim(),
      tags
    );

    const updatedCards = [...cards, flashcard];
    saveFlashcards(updatedCards);
    
    setNewCard({ front: '', back: '', tags: '' });
    setIsCreating(false);
    toast.success('Flashcard created!');
  };

  const deleteCard = (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    saveFlashcards(updatedCards);
    toast.success('Flashcard deleted');
  };

  const exportCards = () => {
    const dataStr = FlashcardStorage.exportCards(cards);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flashcards-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Flashcards exported!');
  };

  const importCards = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCards = FlashcardStorage.importCards(e.target?.result as string);
        const updatedCards = [...cards, ...importedCards];
        saveFlashcards(updatedCards);
        toast.success(`Imported ${importedCards.length} flashcards!`);
      } catch (error) {
        toast.error('Failed to import flashcards. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const stats = SpacedRepetitionScheduler.getCardStats(cards);
  const currentCard = studyCards[currentCardIndex];

  const difficultyButtons = [
    { quality: 0, label: 'Again', color: 'bg-red-500 hover:bg-red-600', description: 'Complete blackout' },
    { quality: 1, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', description: 'Incorrect but familiar' },
    { quality: 2, label: 'Good', color: 'bg-yellow-500 hover:bg-yellow-600', description: 'Incorrect, easy to recall' },
    { quality: 3, label: 'Easy', color: 'bg-green-500 hover:bg-green-600', description: 'Correct but difficult' },
    { quality: 4, label: 'Perfect', color: 'bg-blue-500 hover:bg-blue-600', description: 'Correct after hesitation' },
    { quality: 5, label: 'Trivial', color: 'bg-purple-500 hover:bg-purple-600', description: 'Perfect recall' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground">Spaced repetition learning system</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.due}</div>
            <div className="text-sm text-muted-foreground">Due Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-sm text-muted-foreground">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.learning}</div>
            <div className="text-sm text-muted-foreground">Learning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.mature}</div>
            <div className="text-sm text-muted-foreground">Mature</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="study" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="browse">Browse Cards</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        {/* Study Tab */}
        <TabsContent value="study" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={reviewMode} onValueChange={(value: any) => setReviewMode(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">Due Cards ({stats.due})</SelectItem>
                <SelectItem value="new">New Cards ({stats.new})</SelectItem>
                <SelectItem value="all">All Cards ({stats.total})</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={updateStudyCards}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {studyCards.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Card {currentCardIndex + 1} of {studyCards.length}
                </div>
                <Progress value={((currentCardIndex + 1) / studyCards.length) * 100} className="w-32" />
              </div>

              <Card className="min-h-96">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {showAnswer ? 'Answer' : 'Question'}
                    </CardTitle>
                    <div className="flex gap-2">
                      {currentCard?.tags?.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-lg leading-relaxed min-h-32 flex items-center">
                    {showAnswer ? currentCard?.back : currentCard?.front}
                  </div>
                  
                  {!showAnswer ? (
                    <Button onClick={() => setShowAnswer(true)} className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Show Answer
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground text-center">
                        How well did you remember this?
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {difficultyButtons.map(({ quality, label, color, description }) => (
                          <Button
                            key={quality}
                            onClick={() => handleReview(quality)}
                            className={`${color} text-white flex flex-col h-auto py-3`}
                            title={description}
                          >
                            <span className="font-medium">{label}</span>
                            <span className="text-xs opacity-90">{quality}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No cards to review</h3>
                <p className="text-muted-foreground mb-4">
                  {reviewMode === 'due' 
                    ? "Great job! No cards are due for review right now."
                    : reviewMode === 'new'
                    ? "No new cards available. Create some cards to start learning!"
                    : "No flashcards found. Create your first card to get started."
                  }
                </p>
                <Button onClick={() => setReviewMode('all')}>Browse All Cards</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Browse Cards Tab */}
        <TabsContent value="browse" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">All Flashcards</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCards}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Label htmlFor="import-cards" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input 
                  id="import-cards"
                  type="file" 
                  accept=".json" 
                  onChange={importCards}
                  className="hidden" 
                />
              </Label>
            </div>
          </div>

          <div className="grid gap-4">
            {cards.map((card) => (
              <Card key={card.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      {card.tags?.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                      {card.source && (
                        <Badge variant="secondary">{card.source}</Badge>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteCard(card.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Front:</div>
                      <div>{card.front}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Back:</div>
                      <div>{card.back}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                    <div>
                      Next review: {card.nextReview.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Interval: {card.interval}d</span>
                      <span>Reps: {card.repetitions}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {card.easeFactor.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {cards.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
                <p className="text-muted-foreground">Create your first flashcard to start learning!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Flashcard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="front">Front (Question)</Label>
                <Textarea
                  id="front"
                  placeholder="Enter the question or prompt..."
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  className="min-h-24"
                />
              </div>
              <div>
                <Label htmlFor="back">Back (Answer)</Label>
                <Textarea
                  id="back"
                  placeholder="Enter the answer or explanation..."
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  className="min-h-24"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., math, algebra, equations"
                  value={newCard.tags}
                  onChange={(e) => setNewCard({ ...newCard, tags: e.target.value })}
                />
              </div>
              <Button onClick={createFlashcard} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Flashcard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Creating Effective Flashcards</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Keep questions and answers concise and focused</li>
                <li>• Use your own words to ensure understanding</li>
                <li>• Add context when needed to avoid ambiguity</li>
                <li>• Use tags to organize cards by topic or difficulty</li>
                <li>• Include examples or mnemonics for better recall</li>
                <li>• Break complex concepts into multiple simple cards</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}