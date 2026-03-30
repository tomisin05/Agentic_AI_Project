import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Download, Upload, Play, ArrowLeft } from 'lucide-react';
import { SpacedRepetitionSystem, Flashcard, ReviewDifficulty } from '../lib/spacedRepetition';
import { motion, AnimatePresence } from 'motion/react';

export function Flashcards({ onBack }: { onBack?: () => void }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [studyMode, setStudyMode] = useState<'due' | 'new' | 'all'>('due');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', tags: '' });

  // Load cards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('flashcards');
    if (stored) {
      try {
        setCards(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load flashcards:', error);
      }
    }
  }, []);

  // Save cards to localStorage
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem('flashcards', JSON.stringify(cards));
    }
  }, [cards]);

  const createCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card = SpacedRepetitionSystem.createCard(
      newCard.front,
      newCard.back,
      newCard.tags.split(',').map(t => t.trim()).filter(Boolean)
    );

    setCards([...cards, card]);
    setNewCard({ front: '', back: '', tags: '' });
    setIsCreating(false);
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const startStudySession = (mode: 'due' | 'new' | 'all') => {
    setStudyMode(mode);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setIsStudying(true);
  };

  const reviewCard = (difficulty: ReviewDifficulty) => {
    const studyCards = getStudyCards();
    if (currentCardIndex >= studyCards.length) return;

    const currentCard = studyCards[currentCardIndex];
    const updatedCard = SpacedRepetitionSystem.reviewCard(currentCard, difficulty);
    
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
    
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setIsStudying(false);
      setCurrentCardIndex(0);
    }
  };

  const getStudyCards = (): Flashcard[] => {
    switch (studyMode) {
      case 'due':
        return SpacedRepetitionSystem.getDueCards(cards);
      case 'new':
        return SpacedRepetitionSystem.getNewCards(cards);
      case 'all':
        return cards;
      default:
        return [];
    }
  };

  const exportDeck = () => {
    const json = SpacedRepetitionSystem.exportDeck(cards);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDeck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const importedCards = SpacedRepetitionSystem.importDeck(json);
        setCards([...cards, ...importedCards]);
      } catch (error) {
        console.error('Failed to import deck:', error);
      }
    };
    reader.readAsText(file);
  };

  const stats = SpacedRepetitionSystem.getDeckStatistics(cards);
  const studyCards = getStudyCards();
  const currentCard = studyCards[currentCardIndex];

  if (isStudying && currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setIsStudying(false)}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              ← Back to Deck
            </button>
            <div className="text-lg font-medium text-gray-700">
              Card {currentCardIndex + 1} of {studyCards.length}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex flex-col"
            >
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-6 text-gray-800">
                    {currentCard.front}
                  </div>
                  
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 pt-8 border-t-2 border-gray-200"
                    >
                      <div className="text-xl text-gray-700">
                        {currentCard.back}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Show Answer
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    How well did you know this?
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => reviewCard(0)}
                      className="py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      Again
                    </button>
                    <button
                      onClick={() => reviewCard(1)}
                      className="py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => reviewCard(2)}
                      className="py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
                    >
                      Good
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => reviewCard(3)}
                      className="py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => reviewCard(4)}
                      className="py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      Perfect
                    </button>
                    <button
                      onClick={() => reviewCard(5)}
                      className="py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                    >
                      Trivial
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2 text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Study
            </button>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📚 Flashcards
              </h1>
              <p className="text-gray-600">
                Spaced repetition for long-term retention
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreating(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Card
              </button>
              <button
                onClick={exportDeck}
                className="px-4 py-3 bg-white rounded-xl shadow hover:shadow-md transition-shadow"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
              <label className="px-4 py-3 bg-white rounded-xl shadow hover:shadow-md transition-shadow cursor-pointer">
                <Upload className="w-5 h-5 text-gray-700" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importDeck}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-red-600">{stats.due}</div>
            <div className="text-sm text-gray-600">Due for Review</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-sm text-gray-600">New Cards</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-green-600">{stats.avgRetention}%</div>
            <div className="text-sm text-gray-600">Avg Retention</div>
          </div>
        </div>

        {/* Study Modes */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => startStudySession('due')}
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow text-left"
          >
            <Play className="w-8 h-8 text-red-600 mb-3" />
            <div className="text-xl font-bold text-gray-900">Study Due Cards</div>
            <div className="text-gray-600">{stats.due} cards ready for review</div>
          </button>
          
          <button
            onClick={() => startStudySession('new')}
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow text-left"
          >
            <Play className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-xl font-bold text-gray-900">Learn New Cards</div>
            <div className="text-gray-600">{stats.new} new cards to learn</div>
          </button>
          
          <button
            onClick={() => startStudySession('all')}
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow text-left"
          >
            <Play className="w-8 h-8 text-purple-600 mb-3" />
            <div className="text-xl font-bold text-gray-900">Practice All</div>
            <div className="text-gray-600">{stats.total} cards in deck</div>
          </button>
        </div>

        {/* Card Creation Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Card</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Front (Question)
                  </label>
                  <textarea
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="What is the capital of France?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Back (Answer)
                  </label>
                  <textarea
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Paris"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newCard.tags}
                    onChange={(e) => setNewCard({ ...newCard, tags: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="geography, capitals, europe"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button
                  onClick={createCard}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Create Card
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewCard({ front: '', back: '', tags: '' });
                  }}
                  className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Card List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Cards</h2>
          {cards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No flashcards yet. Create your first card to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{card.front}</div>
                      <div className="text-sm text-gray-600">{card.back}</div>
                      <div className="mt-2 flex items-center gap-2">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500">
                          {card.state} • {card.totalReviews} reviews • {SpacedRepetitionSystem.getRetentionRate(card).toFixed(0)}% retention
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}