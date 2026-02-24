// Spaced Repetition Algorithm (SM2-like) for optimal learning retention
// Based on SuperMemo SM2 algorithm with simplifications

export interface FlashcardData {
  id: string;
  front: string;
  back: string;
  created: Date;
  lastReviewed?: Date;
  nextReview: Date;
  interval: number; // days
  easeFactor: number; // 1.3 - 2.5+
  repetitions: number;
  quality?: number; // 0-5 (last response quality)
  tags?: string[];
  source?: 'session-reflection' | 'manual' | 'imported';
  sessionId?: string;
}

export interface ReviewResult {
  quality: number; // 0: total blackout, 1: incorrect but familiar, 2: incorrect easy to recall, 3: correct but difficult, 4: correct after hesitation, 5: perfect
}

export class SpacedRepetitionScheduler {
  private static readonly MIN_EASE_FACTOR = 1.3;
  private static readonly INITIAL_EASE_FACTOR = 2.5;
  private static readonly INITIAL_INTERVAL = 1;

  static createFlashcard(
    front: string, 
    back: string, 
    tags?: string[], 
    source?: FlashcardData['source'],
    sessionId?: string
  ): FlashcardData {
    const now = new Date();
    return {
      id: crypto.randomUUID(),
      front,
      back,
      created: now,
      nextReview: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Review tomorrow
      interval: this.INITIAL_INTERVAL,
      easeFactor: this.INITIAL_EASE_FACTOR,
      repetitions: 0,
      tags: tags || [],
      source: source || 'manual',
      sessionId
    };
  }

  static reviewCard(card: FlashcardData, result: ReviewResult): FlashcardData {
    const now = new Date();
    const quality = Math.max(0, Math.min(5, result.quality));
    
    let { interval, easeFactor, repetitions } = card;

    // Update ease factor based on response quality
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor);

    // Calculate new interval
    if (quality < 3) {
      // Poor response - restart the sequence
      repetitions = 0;
      interval = this.INITIAL_INTERVAL;
    } else {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    // Calculate next review date
    const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

    return {
      ...card,
      lastReviewed: now,
      nextReview,
      interval,
      easeFactor,
      repetitions,
      quality
    };
  }

  static getDueCards(cards: FlashcardData[]): FlashcardData[] {
    const now = new Date();
    return cards
      .filter(card => card.nextReview <= now)
      .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());
  }

  static getNewCards(cards: FlashcardData[], limit = 20): FlashcardData[] {
    return cards
      .filter(card => card.repetitions === 0)
      .sort((a, b) => a.created.getTime() - b.created.getTime())
      .slice(0, limit);
  }

  static getCardStats(cards: FlashcardData[]) {
    const now = new Date();
    const due = cards.filter(card => card.nextReview <= now).length;
    const newCards = cards.filter(card => card.repetitions === 0).length;
    const learning = cards.filter(card => card.repetitions > 0 && card.repetitions < 3).length;
    const mature = cards.filter(card => card.repetitions >= 3).length;

    return {
      total: cards.length,
      due,
      new: newCards,
      learning,
      mature,
      retention: cards.length > 0 ? ((mature + learning) / cards.length) * 100 : 0
    };
  }

  static extractFlashcardFromReflection(
    reflection: string, 
    topic?: string,
    sessionId?: string
  ): FlashcardData | null {
    // Simple heuristic to extract potential flashcards from reflections
    // Look for patterns like "What is X? Y" or "X means Y" or key insights
    
    const patterns = [
      /(.+)\?(.+)/g, // Question and answer pattern
      /(.+)(?:means?|is|are)(.+)/gi, // Definition pattern
      /(?:key insight|important|remember):?(.+)/gi, // Key insight pattern
    ];

    for (const pattern of patterns) {
      const match = reflection.match(pattern);
      if (match) {
        const front = match[1]?.trim();
        const back = match[2]?.trim();
        
        if (front && back && front.length > 3 && back.length > 3) {
          return this.createFlashcard(
            front,
            back,
            topic ? [topic] : ['reflection'],
            'session-reflection',
            sessionId
          );
        }
      }
    }

    // If no clear pattern, create a general reflection card
    if (reflection.length > 20) {
      return this.createFlashcard(
        topic ? `What did you learn about ${topic}?` : 'What was your key insight from this session?',
        reflection,
        topic ? [topic, 'reflection'] : ['reflection'],
        'session-reflection',
        sessionId
      );
    }

    return null;
  }

  static generateStudyPlan(cards: FlashcardData[], timeAvailable: number): {
    dueCards: FlashcardData[];
    newCards: FlashcardData[];
    reviewTime: number;
    newTime: number;
  } {
    const dueCards = this.getDueCards(cards);
    const timePerDueCard = 45; // seconds
    const timePerNewCard = 60; // seconds
    
    const dueTime = dueCards.length * timePerDueCard;
    const remainingTime = Math.max(0, timeAvailable - dueTime);
    const newCardsCount = Math.floor(remainingTime / timePerNewCard);
    
    const newCards = this.getNewCards(cards, newCardsCount);

    return {
      dueCards,
      newCards,
      reviewTime: dueTime,
      newTime: newCards.length * timePerNewCard
    };
  }
}

// Storage utilities
export class FlashcardStorage {
  private static readonly STORAGE_KEY = 'pomodoro-flashcards';

  static saveCards(cards: FlashcardData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Failed to save flashcards:', error);
    }
  }

  static loadCards(): FlashcardData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const cards = JSON.parse(stored);
      return cards.map((card: any) => ({
        ...card,
        created: new Date(card.created),
        lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
        nextReview: new Date(card.nextReview)
      }));
    } catch (error) {
      console.error('Failed to load flashcards:', error);
      return [];
    }
  }

  static exportCards(cards: FlashcardData[]): string {
    return JSON.stringify(cards, null, 2);
  }

  static importCards(jsonData: string): FlashcardData[] {
    try {
      const cards = JSON.parse(jsonData);
      return cards.map((card: any) => ({
        ...card,
        created: new Date(card.created),
        lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
        nextReview: new Date(card.nextReview)
      }));
    } catch (error) {
      console.error('Failed to import flashcards:', error);
      throw new Error('Invalid flashcard data format');
    }
  }
}