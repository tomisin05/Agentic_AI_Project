// Story-Goal Integration System
// Ties narrative progression to actual goal achievement, not just focus ratings

import { StudyGoal, GoalManager, GoalProgress } from './goalSystem';

export interface StoryMilestone {
  id: string;
  goalId: string;
  triggerType: 'progress' | 'streak' | 'completion' | 'task-count' | 'deadline-proximity';
  triggerValue: number; // e.g., 25% progress, 3 day streak, etc.
  storyContent: {
    title: string;
    text: string;
    characterMood: 'focused' | 'struggling' | 'successful' | 'determined';
    backgroundUrl?: string;
    unlocked: boolean;
    unlockedAt?: Date;
  };
}

export interface AdaptiveStoryContent {
  text: string;
  characterMood: 'focused' | 'struggling' | 'successful' | 'determined';
  chapter: string;
  milestone?: StoryMilestone;
}

export class StoryGoalEngine {
  private static readonly STORAGE_KEY = 'pomodoro-story-milestones';

  // Generate story content based on goal progress AND focus
  static getStoryForSession(
    goalId: string | undefined,
    focusLevel: number,
    isBreak: boolean,
    sessionCount: number
  ): AdaptiveStoryContent {
    // If no goal selected, fall back to focus-based story
    if (!goalId) {
      return this.getFocusBasedStory(focusLevel, isBreak, sessionCount);
    }

    const progress = GoalManager.calculateProgress(goalId);
    const goal = GoalManager.getGoals().find(g => g.id === goalId);
    
    if (!goal) {
      return this.getFocusBasedStory(focusLevel, isBreak, sessionCount);
    }

    // Check for unlockable milestones
    const milestone = this.checkForMilestone(goal, progress, focusLevel);
    if (milestone && !milestone.storyContent.unlocked) {
      this.unlockMilestone(milestone.id);
      return {
        text: milestone.storyContent.text,
        characterMood: milestone.storyContent.characterMood,
        chapter: milestone.storyContent.title,
        milestone
      };
    }

    // Generate adaptive story based on goal progress + focus
    return this.getAdaptiveStory(goal, progress, focusLevel, isBreak);
  }

  private static getAdaptiveStory(
    goal: StudyGoal,
    progress: GoalProgress,
    focusLevel: number,
    isBreak: boolean
  ): AdaptiveStoryContent {
    const isFocused = focusLevel >= 4;
    const isOnTrack = progress.onTrack;
    const progressPercent = progress.progressPercentage;

    // Determine narrative arc based on progress
    let chapter = '';
    let text = '';
    let mood: 'focused' | 'struggling' | 'successful' | 'determined' = 'determined';

    // Chapter progression based on actual goal progress
    if (progressPercent < 25) {
      chapter = 'Chapter 1: The Quest Begins';
      if (isFocused && isOnTrack) {
        text = isBreak 
          ? `Excellent start, warrior! You've made solid progress on ${goal.title}. ${Math.round(progressPercent)}% complete - your focused effort is building momentum. The dragon senses your determination and grows wary.`
          : `Your journey toward ${goal.title} has begun well! With ${progress.daysUntilDeadline || '?'} days remaining, you're building a strong foundation. Each focused session weakens the Dragon of Distraction's hold over the knowledge you seek.`;
        mood = 'focused';
      } else if (!isFocused && isOnTrack) {
        text = isBreak
          ? `You're maintaining pace on ${goal.title}, but the path grows harder when focus wavers. ${Math.round(progressPercent)}% complete - stay vigilant to keep your advantage over the dragon.`
          : `The dragon tests you early in your quest for ${goal.title}. Though you're on schedule, scattered attention gives it openings to strike. Sharpen your focus, brave scholar!`;
        mood = 'determined';
      } else if (isFocused && !isOnTrack) {
        text = isBreak
          ? `Your focus burns bright on ${goal.title}, but time grows short! With ${progress.daysUntilDeadline || '?'} days left, you need ${progress.recommendedDailyMinutes} minutes daily to overcome the dragon. This focused effort is your greatest weapon!`
          : `The dragon has gained ground, but you fight back with fierce concentration! ${goal.title} demands ${progress.recommendedDailyMinutes} minutes of daily focus. You're ${Math.round(progressPercent)}% there - each focused session is a blow against the beast!`;
        mood = 'determined';
      } else {
        text = isBreak
          ? `The dragon gains strength as your attention falters on ${goal.title}. Only ${Math.round(progressPercent)}% complete with ${progress.daysUntilDeadline || '?'} days remaining. Rally your focus - the quest can still be won!`
          : `The Dragon of Distraction roars triumphantly as you struggle with ${goal.title}! Behind schedule and losing focus - but remember, even the mightiest heroes face dark moments. Find your inner strength!`;
        mood = 'struggling';
      }
    } else if (progressPercent < 50) {
      chapter = 'Chapter 2: The Dragon Weakens';
      if (isFocused && isOnTrack) {
        text = isBreak
          ? `Magnificent! You've reached ${Math.round(progressPercent)}% on ${goal.title} - the dragon reels from your sustained assault! ${progress.tasksCompleted}/${progress.totalTasks} tasks conquered. Your disciplined approach is paying off brilliantly!`
          : `The dragon's defenses crumble before your focused determination on ${goal.title}! Nearly halfway through your quest, with ${progress.daysUntilDeadline || '?'} days to victory. The beast fears your unwavering concentration!`;
        mood = 'successful';
      } else if (!isFocused && isOnTrack) {
        text = isBreak
          ? `${Math.round(progressPercent)}% progress on ${goal.title} - you're maintaining the pace, but the dragon adapts to your wavering focus. Stay sharp to keep your advantage!`
          : `Halfway through the battle for ${goal.title}, the dragon exploits every moment of distraction. You're still on schedule, but victory requires sharper focus. Raise your shield of concentration!`;
        mood = 'determined';
      } else if (isFocused && !isOnTrack) {
        text = isBreak
          ? `Your blade of focus cuts deep into the dragon protecting ${goal.title}! ${Math.round(progressPercent)}% complete, but time is your enemy now. Need ${progress.recommendedDailyMinutes} min/day to catch up. Your renewed concentration is powerful!`
          : `Though behind schedule on ${goal.title}, your focus blazes bright! ${progress.tasksCompleted} tasks down, more to go. With ${progress.daysUntilDeadline || '?'} days left and ${progress.recommendedDailyMinutes} minutes needed daily, your concentrated effort is the key!`;
        mood = 'focused';
      } else {
        text = isBreak
          ? `The dragon strengthens as focus falters on ${goal.title}. ${Math.round(progressPercent)}% complete but falling behind schedule. The treasure still awaits those who persevere - but action is needed now!`
          : `Danger! The dragon's flames overwhelm you as ${goal.title} slips further behind! Only ${progress.daysUntilDeadline || '?'} days remain. Desperate times call for desperate measures - rally every ounce of focus!`;
        mood = 'struggling';
      }
    } else if (progressPercent < 75) {
      chapter = 'Chapter 3: Victory in Sight';
      if (isFocused && isOnTrack) {
        text = isBreak
          ? `INCREDIBLE! ${Math.round(progressPercent)}% of ${goal.title} conquered! The dragon limps away, defeated by your relentless focus. ${progress.tasksCompleted}/${progress.totalTasks} tasks completed. The treasure chamber is nearly yours!`
          : `The dragon's final roar echoes as you approach ${Math.round(progressPercent)}% completion on ${goal.title}! Only ${progress.daysUntilDeadline || '?'} days until total victory. Your focused assault has been masterful!`;
        mood = 'successful';
      } else if (!isFocused && isOnTrack) {
        text = isBreak
          ? `You're ${Math.round(progressPercent)}% through ${goal.title} - victory approaches, but complacency is dangerous. The dragon still has claws. Maintain your focus for the final push!`
          : `So close to defeating the dragon on ${goal.title}, yet its dying strength targets your wandering attention. ${progress.tasksCompleted} tasks done - stay focused for the final battle!`;
        mood = 'determined';
      } else if (isFocused && !isOnTrack) {
        text = isBreak
          ? `${Math.round(progressPercent)}% complete on ${goal.title} - your focused rally is working! Still need ${progress.recommendedDailyMinutes} min/day, but the finish line appears. Don't let up now!`
          : `With fierce focus, you're clawing back ground on ${goal.title}! ${progress.daysUntilDeadline || '?'} days to go. The dragon weakens under your assault - ${progress.recommendedDailyMinutes} minutes daily will seal your victory!`;
        mood = 'focused';
      } else {
        text = isBreak
          ? `So close yet so far on ${goal.title}. ${Math.round(progressPercent)}% done but focus wavers when you need it most. The dragon senses weakness. Summon your final reserves!`
          : `The dragon makes a desperate stand as ${goal.title} nears completion! You're behind with only ${progress.daysUntilDeadline || '?'} days left. This is the moment that defines heroes - focus now or lose everything!`;
        mood = 'struggling';
      }
    } else {
      chapter = 'Chapter 4: The Final Strike';
      if (isFocused && isOnTrack) {
        text = isBreak
          ? `GLORIOUS TRIUMPH! ${Math.round(progressPercent)}% of ${goal.title} achieved! The mighty dragon lies defeated at your feet! The treasure chamber opens before you, revealing the wisdom you sought. Your focused discipline has won the day!`
          : `THE FINAL BATTLE! ${Math.round(progressPercent)}% complete on ${goal.title}! The dragon's last breath grows weak. Your unwavering focus has brought you to the edge of total victory. Strike true!`;
        mood = 'successful';
      } else if (!isFocused && isOnTrack) {
        text = isBreak
          ? `Nearly there on ${goal.title} - ${Math.round(progressPercent)}% complete! But wavering focus in the final hour risks everything. The treasure is within reach - one last push!`
          : `The end of ${goal.title} approaches - ${Math.round(progressPercent)}% done! The dragon's dying convulsions are most dangerous. Lock in your focus for the final push to victory!`;
        mood = 'determined';
      } else if (isFocused && !isOnTrack) {
        text = isBreak
          ? `${Math.round(progressPercent)}% of ${goal.title} conquered through sheer will! Still behind but your focused surge gives hope. ${progress.daysUntilDeadline || '?'} days - push harder than ever!`
          : `A heroic comeback on ${goal.title}! ${Math.round(progressPercent)}% complete with intense focus. The dragon staggers! ${progress.recommendedDailyMinutes} minutes daily - you can still seize victory!`;
        mood = 'focused';
      } else {
        text = isBreak
          ? `So close to ${goal.title}'s completion at ${Math.round(progressPercent)}%, yet the dragon rallies as your focus fails. ${progress.daysUntilDeadline || '?'} days left. Heroes are forged in moments like these!`
          : `The final battle for ${goal.title} rages! ${Math.round(progressPercent)}% done but time and focus slip away. The dragon senses victory. Only supreme concentration can save you now!`;
        mood = 'struggling';
      }
    }

    return { text, characterMood: mood, chapter };
  }

  private static checkForMilestone(
    goal: StudyGoal,
    progress: GoalProgress,
    focusLevel: number
  ): StoryMilestone | null {
    const milestones = this.getMilestones(goal.id);
    
    // Check each milestone type
    for (const milestone of milestones) {
      if (milestone.storyContent.unlocked) continue;

      let shouldUnlock = false;

      switch (milestone.triggerType) {
        case 'progress':
          shouldUnlock = progress.progressPercentage >= milestone.triggerValue;
          break;
        case 'streak':
          shouldUnlock = goal.currentStreak >= milestone.triggerValue;
          break;
        case 'completion':
          shouldUnlock = progress.progressPercentage >= 100;
          break;
        case 'task-count':
          shouldUnlock = progress.tasksCompleted >= milestone.triggerValue;
          break;
        case 'deadline-proximity':
          if (progress.daysUntilDeadline !== undefined) {
            shouldUnlock = progress.daysUntilDeadline <= milestone.triggerValue && progress.onTrack;
          }
          break;
      }

      if (shouldUnlock) {
        return milestone;
      }
    }

    return null;
  }

  private static getMilestones(goalId: string): StoryMilestone[] {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}-${goalId}`);
      if (!stored) {
        // Generate default milestones for this goal
        return this.generateDefaultMilestones(goalId);
      }
      
      const parsed = JSON.parse(stored);
      return parsed.map((m: any) => ({
        ...m,
        storyContent: {
          ...m.storyContent,
          unlockedAt: m.storyContent.unlockedAt ? new Date(m.storyContent.unlockedAt) : undefined
        }
      }));
    } catch (error) {
      return this.generateDefaultMilestones(goalId);
    }
  }

  private static generateDefaultMilestones(goalId: string): StoryMilestone[] {
    const goal = GoalManager.getGoals().find(g => g.id === goalId);
    if (!goal) return [];

    const milestones: StoryMilestone[] = [
      {
        id: `${goalId}-first-session`,
        goalId,
        triggerType: 'progress',
        triggerValue: 5,
        storyContent: {
          title: '🎯 First Steps',
          text: `Your journey toward ${goal.title} begins! The ancient tome speaks of a powerful dragon guarding this knowledge. Many have tried, but only those with true dedication succeed. You've taken the first step - 5% complete. The dragon has noticed you.`,
          characterMood: 'determined',
          unlocked: false
        }
      },
      {
        id: `${goalId}-quarter`,
        goalId,
        triggerType: 'progress',
        triggerValue: 25,
        storyContent: {
          title: '⚔️ First Blood',
          text: `MILESTONE ACHIEVED! You've reached 25% completion on ${goal.title}! The Dragon of Distraction has felt your blade for the first time. It roars in pain and surprise - you're no ordinary challenger. Your focused effort has drawn first blood in this epic battle!`,
          characterMood: 'successful',
          unlocked: false
        }
      },
      {
        id: `${goalId}-halfway`,
        goalId,
        triggerType: 'progress',
        triggerValue: 50,
        storyContent: {
          title: '🔥 The Turning Point',
          text: `EPIC MILESTONE! Halfway through ${goal.title}! The dragon's strength wanes as yours grows. What started as an impossible quest now feels achievable. The treasure chamber's glow is visible in the distance. Your persistence is legendary!`,
          characterMood: 'successful',
          unlocked: false
        }
      },
      {
        id: `${goalId}-three-quarters`,
        goalId,
        triggerType: 'progress',
        triggerValue: 75,
        storyContent: {
          title: '🌟 Victory Approaches',
          text: `TREMENDOUS ACHIEVEMENT! 75% of ${goal.title} conquered! The dragon lies wounded, its defenses shattered by your unwavering focus. The gates to the treasure chamber stand before you. One final push and ultimate victory will be yours!`,
          characterMood: 'successful',
          unlocked: false
        }
      },
      {
        id: `${goalId}-completion`,
        goalId,
        triggerType: 'completion',
        triggerValue: 100,
        storyContent: {
          title: '🏆 ULTIMATE VICTORY',
          text: `🎉🎉🎉 LEGENDARY TRIUMPH! ${goal.title} COMPLETE! The mighty Dragon of Distraction lies defeated! The treasure chamber bursts open, showering you with the wisdom and knowledge you sought. Songs will be sung of your focused determination and unwavering spirit. You are a true scholar-warrior! 🏆✨`,
          characterMood: 'successful',
          unlocked: false
        }
      },
      {
        id: `${goalId}-streak-3`,
        goalId,
        triggerType: 'streak',
        triggerValue: 3,
        storyContent: {
          title: '🔥 Building Momentum',
          text: `STREAK BONUS! Three days of focused work on ${goal.title}! Your consistency forges a blade sharper than any steel. The dragon cannot heal between your daily assaults. This is how legends are made!`,
          characterMood: 'focused',
          unlocked: false
        }
      },
      {
        id: `${goalId}-streak-7`,
        goalId,
        triggerType: 'streak',
        triggerValue: 7,
        storyContent: {
          title: '⚡ Week Warrior',
          text: `INCREDIBLE STREAK! Seven consecutive days on ${goal.title}! Your discipline is unbreakable. The dragon trembles before your relentless advance. This kind of dedication separates champions from dreamers!`,
          characterMood: 'successful',
          unlocked: false
        }
      }
    ];

    this.saveMilestones(goalId, milestones);
    return milestones;
  }

  private static saveMilestones(goalId: string, milestones: StoryMilestone[]): void {
    try {
      localStorage.setItem(`${this.STORAGE_KEY}-${goalId}`, JSON.stringify(milestones));
    } catch (error) {
      console.error('Failed to save milestones:', error);
    }
  }

  private static unlockMilestone(milestoneId: string): void {
    const goalId = milestoneId.split('-')[0];
    const milestones = this.getMilestones(goalId);
    
    const milestone = milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.storyContent.unlocked = true;
      milestone.storyContent.unlockedAt = new Date();
      this.saveMilestones(goalId, milestones);
    }
  }

  // Fallback to original focus-based story when no goal
  private static getFocusBasedStory(
    focusLevel: number,
    isBreak: boolean,
    sessionCount: number
  ): AdaptiveStoryContent {
    const isFocused = focusLevel >= 4;
    
    const chapters = [
      { title: 'Chapter 1: The Dragon Awakens', range: [0, 2] },
      { title: 'Chapter 2: The Battle Intensifies', range: [2, 4] },
      { title: 'Chapter 3: The Final Confrontation', range: [4, 999] }
    ];

    const chapter = chapters.find(c => sessionCount >= c.range[0] && sessionCount < c.range[1])?.title || chapters[0].title;

    const content = {
      focused: {
        work: "Excellent! Your sword of concentration cuts through the dragon's defenses. Each focused moment weakens its power over you!",
        break: "Victory in this skirmish! The Dragon of Distraction retreats, wounded by your focused assault. Rest well, warrior!"
      },
      struggling: {
        work: "The dragon's flames of distraction overwhelm you! Rally your focus and remember why you fight!",
        break: "The dragon gained ground this time. But true warriors learn from every battle. Strengthen your resolve!"
      }
    };

    const text = isFocused 
      ? (isBreak ? content.focused.break : content.focused.work)
      : (isBreak ? content.struggling.break : content.struggling.work);

    const mood = isBreak 
      ? (isFocused ? 'successful' : 'struggling')
      : (isFocused ? 'focused' : 'struggling');

    return { text, characterMood: mood, chapter };
  }

  // Get all unlocked milestones for display
  static getUnlockedMilestones(goalId: string): StoryMilestone[] {
    return this.getMilestones(goalId).filter(m => m.storyContent.unlocked);
  }
}
