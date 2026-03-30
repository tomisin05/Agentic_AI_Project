/**
 * Spaced Repetition System using SM-2 Algorithm
 * Optimizes flashcard review intervals for long-term retention
 */

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  createdAt: number;
  
  // SM-2 Algorithm fields
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  easeFactor: number; // Difficulty multiplier (1.3 - 2.5)
  nextReviewDate: number; // Timestamp
  lastReviewDate: number; // Timestamp
  
  // Card state
  state: 'new' | 'learning' | 'mature';
  
  // Statistics
  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
}

export type ReviewDifficulty = 0 | 1 | 2 | 3 | 4 | 5;
// 0: Again (complete blackout)
// 1: Hard (incorrect but familiar)
// 2: Good (incorrect, easy to recall)
// 3: Easy (correct but difficult)
// 4: Perfect (correct after hesitation)
// 5: Trivial (perfect recall)

export class SpacedRepetitionSystem {
  /**
   * Creates a new flashcard with default SM-2 values
   */
  static createCard(front: string, back: string, tags: string[] = []): Flashcard {
    const now = Date.now();
    return {
      id: `card_${now}_${Math.random().toString(36).substr(2, 9)}`,
      front,
      back,
      tags,
      createdAt: now,
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewDate: now,
      lastReviewDate: 0,
      state: 'new',
      totalReviews: 0,
      correctCount: 0,
      incorrectCount: 0
    };
  }

  /**
   * Updates card based on review difficulty using SM-2 algorithm
   */
  static reviewCard(card: Flashcard, difficulty: ReviewDifficulty): Flashcard {
    const now = Date.now();
    const updated = { ...card };
    
    updated.totalReviews++;
    updated.lastReviewDate = now;

    // Map difficulty to quality (0-5 scale for SM-2)
    const quality = difficulty;

    // Update statistics
    if (quality >= 3) {
      updated.correctCount++;
    } else {
      updated.incorrectCount++;
    }

    // SM-2 Algorithm
    if (quality < 3) {
      // Failed - reset to beginning
      updated.repetitions = 0;
      updated.interval = 1;
      updated.state = 'learning';
    } else {
      // Successful recall
      if (updated.repetitions === 0) {
        updated.interval = 1;
        updated.state = 'learning';
      } else if (updated.repetitions === 1) {
        updated.interval = 6;
        updated.state = 'learning';
      } else {
        updated.interval = Math.round(updated.interval * updated.easeFactor);
        updated.state = 'mature';
      }
      
      updated.repetitions++;
    }

    // Update ease factor
    updated.easeFactor = Math.max(
      1.3,
      updated.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    // Calculate next review date
    updated.nextReviewDate = now + updated.interval * 24 * 60 * 60 * 1000;

    return updated;
  }

  /**
   * Gets cards that are due for review
   */
  static getDueCards(cards: Flashcard[]): Flashcard[] {
    const now = Date.now();
    return cards
      .filter(card => card.nextReviewDate <= now)
      .sort((a, b) => a.nextReviewDate - b.nextReviewDate);
  }

  /**
   * Gets new cards that haven't been reviewed yet
   */
  static getNewCards(cards: Flashcard[]): Flashcard[] {
    return cards.filter(card => card.state === 'new');
  }

  /**
   * Gets learning cards (in progress)
   */
  static getLearningCards(cards: Flashcard[]): Flashcard[] {
    return cards.filter(card => card.state === 'learning');
  }

  /**
   * Gets mature cards (well-learned)
   */
  static getMatureCards(cards: Flashcard[]): Flashcard[] {
    return cards.filter(card => card.state === 'mature');
  }

  /**
   * Gets cards by tags
   */
  static getCardsByTags(cards: Flashcard[], tags: string[]): Flashcard[] {
    if (tags.length === 0) return cards;
    return cards.filter(card => 
      card.tags.some(tag => tags.includes(tag))
    );
  }

  /**
   * Calculate retention rate for a card
   */
  static getRetentionRate(card: Flashcard): number {
    if (card.totalReviews === 0) return 0;
    return (card.correctCount / card.totalReviews) * 100;
  }

  /**
   * Get overall statistics for a deck
   */
  static getDeckStatistics(cards: Flashcard[]) {
    const now = Date.now();
    const due = this.getDueCards(cards).length;
    const newCards = this.getNewCards(cards).length;
    const learning = this.getLearningCards(cards).length;
    const mature = this.getMatureCards(cards).length;
    
    const totalReviews = cards.reduce((sum, card) => sum + card.totalReviews, 0);
    const totalCorrect = cards.reduce((sum, card) => sum + card.correctCount, 0);
    const avgRetention = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

    return {
      total: cards.length,
      due,
      new: newCards,
      learning,
      mature,
      avgRetention: Math.round(avgRetention),
      totalReviews
    };
  }

  /**
   * Export cards to JSON
   */
  static exportDeck(cards: Flashcard[]): string {
    return JSON.stringify(cards, null, 2);
  }

  /**
   * Import cards from JSON
   */
  static importDeck(json: string): Flashcard[] {
    try {
      const cards = JSON.parse(json);
      if (!Array.isArray(cards)) {
        throw new Error('Invalid deck format');
      }
      // Validate card structure
      return cards.filter(card => 
        card.id && card.front && card.back
      );
    } catch (error) {
      console.error('Failed to import deck:', error);
      return [];
    }
  }
}
