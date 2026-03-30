// AI-Powered Goal Description Generator

import { GoalType } from './goalSystem';

interface DescriptionSuggestion {
  text: string;
  tip: string;
}

// Subject-specific enhancements
const subjectKeywords: Record<string, string[]> = {
  mathematics: ['formulas', 'problem-solving', 'theorems', 'proofs', 'calculations'],
  physics: ['experiments', 'laws', 'theories', 'calculations', 'principles'],
  programming: ['code', 'algorithms', 'debugging', 'projects', 'syntax'],
  chemistry: ['reactions', 'elements', 'compounds', 'experiments', 'formulas'],
  biology: ['systems', 'processes', 'organisms', 'concepts', 'experiments'],
  history: ['events', 'timelines', 'analysis', 'context', 'sources'],
  literature: ['texts', 'analysis', 'themes', 'interpretation', 'writing'],
  language: ['vocabulary', 'grammar', 'practice', 'conversation', 'comprehension'],
  business: ['concepts', 'case studies', 'strategies', 'analysis', 'applications'],
  psychology: ['theories', 'studies', 'concepts', 'research', 'applications']
};

function getSubjectContext(subject: string): string[] {
  const subjectLower = subject.toLowerCase();
  
  for (const [key, keywords] of Object.entries(subjectKeywords)) {
    if (subjectLower.includes(key)) {
      return keywords;
    }
  }
  
  return ['concepts', 'material', 'topics', 'assignments', 'understanding'];
}

export function generateDescriptionSuggestions(
  title: string,
  subject: string,
  type: GoalType
): DescriptionSuggestion[] {
  const subjectContext = getSubjectContext(subject);
  const suggestions: DescriptionSuggestion[] = [];

  switch (type) {
    case 'exam':
      suggestions.push(
        {
          text: `Master ${subject} ${subjectContext[0]} and ${subjectContext[1]} to excel in "${title}". Focus on understanding core principles, practicing problems, and reviewing difficult areas. Build confidence through consistent study and mock tests.`,
          tip: 'Emphasizes mastery and practice'
        },
        {
          text: `Comprehensive preparation for "${title}" covering all key ${subject} ${subjectContext[2]}. Strategy includes regular review sessions, practice problems, flashcard memorization, and timed mock exams to ensure readiness.`,
          tip: 'Structured and methodical approach'
        },
        {
          text: `Achieve top performance in "${title}" by systematically covering ${subject} ${subjectContext[3]} and ${subjectContext[4]}. Focus on weak areas, strengthen fundamentals, and develop efficient problem-solving techniques.`,
          tip: 'Performance-oriented with targeted improvement'
        }
      );
      break;

    case 'project':
      suggestions.push(
        {
          text: `Complete "${title}" by applying ${subject} ${subjectContext[0]} to create a high-quality deliverable. Break down into manageable phases, conduct thorough research, and iterate based on feedback. Aim for both functionality and polish.`,
          tip: 'Phased approach with quality focus'
        },
        {
          text: `Develop and execute "${title}" using ${subject} principles and best practices. Plan timeline, allocate resources effectively, document progress, and ensure all requirements are met with attention to detail.`,
          tip: 'Professional project management style'
        },
        {
          text: `Create an impressive "${title}" that demonstrates mastery of ${subject} ${subjectContext[1]} and ${subjectContext[2]}. Focus on innovation, practical application, and presentation quality to showcase skills effectively.`,
          tip: 'Showcase and portfolio-focused'
        }
      );
      break;

    case 'skill':
      suggestions.push(
        {
          text: `Develop proficiency in "${title}" within ${subject} through consistent practice and hands-on application. Build from fundamentals to advanced ${subjectContext[0]}, track progress, and apply learning to real-world scenarios.`,
          tip: 'Progressive skill building'
        },
        {
          text: `Master "${title}" by dedicating focused time to ${subject} ${subjectContext[1]} and ${subjectContext[2]}. Use deliberate practice, seek feedback, and continuously challenge yourself with increasingly difficult exercises.`,
          tip: 'Deliberate practice methodology'
        },
        {
          text: `Achieve competence in "${title}" through systematic study of ${subject} fundamentals and regular practice. Set measurable milestones, celebrate small wins, and maintain consistency to see steady improvement.`,
          tip: 'Milestone-based with motivation'
        }
      );
      break;

    case 'course':
      suggestions.push(
        {
          text: `Successfully complete "${title}" by engaging with all ${subject} ${subjectContext[0]} and ${subjectContext[1]}, submitting quality assignments on time, and actively participating in discussions. Maintain strong grades through consistent effort.`,
          tip: 'Comprehensive course engagement'
        },
        {
          text: `Excel in "${title}" through regular attendance, thorough note-taking, timely completion of ${subject} assignments, and active review of ${subjectContext[2]} before exams. Build strong understanding from week one.`,
          tip: 'Student success focused'
        },
        {
          text: `Navigate "${title}" successfully by staying organized with ${subject} readings, participating in study groups, seeking help when needed, and applying ${subjectContext[3]} through practice problems and projects.`,
          tip: 'Collaborative and resource-aware'
        }
      );
      break;

    case 'certification':
      suggestions.push(
        {
          text: `Prepare systematically for "${title}" certification by mastering ${subject} ${subjectContext[0]}, ${subjectContext[1]}, and ${subjectContext[2]}. Follow official study guide, take practice tests, and join study communities for support and insights.`,
          tip: 'Official exam preparation approach'
        },
        {
          text: `Achieve "${title}" certification through structured study of ${subject} domains, hands-on practice with real-world scenarios, and regular self-assessment using mock exams. Allocate time to strengthen weak areas identified.`,
          tip: 'Practical and assessment-driven'
        },
        {
          text: `Pass "${title}" certification exam by thoroughly covering all ${subject} ${subjectContext[3]} and ${subjectContext[4]}, leveraging official resources, practicing with exam simulators, and maintaining consistent daily study routine until test day.`,
          tip: 'Exam-focused with routine emphasis'
        }
      );
      break;

    case 'personal':
      suggestions.push(
        {
          text: `Pursue "${title}" to expand knowledge in ${subject} and achieve personal growth. Learn at your own pace, explore ${subjectContext[0]} that spark curiosity, and apply insights to daily life for practical benefit.`,
          tip: 'Self-paced personal development'
        },
        {
          text: `Embark on "${title}" journey to deepen understanding of ${subject} ${subjectContext[1]} and ${subjectContext[2]}. Enjoy the learning process, stay curious, and integrate new knowledge into personal interests and goals.`,
          tip: 'Curiosity-driven exploration'
        },
        {
          text: `Dedicate time to "${title}" for personal enrichment in ${subject}. Set flexible milestones, enjoy discovering ${subjectContext[3]}, and celebrate progress without pressure. Learning for the joy of growth.`,
          tip: 'Low-pressure, joy-focused learning'
        }
      );
      break;

    default:
      suggestions.push(
        {
          text: `Work towards "${title}" in ${subject} through consistent effort and focused study. Break down objectives into manageable steps and track progress systematically.`,
          tip: 'General structured approach'
        },
        {
          text: `Accomplish "${title}" by dedicating regular time to ${subject} learning. Stay motivated, seek resources, and apply knowledge practically.`,
          tip: 'Balanced and practical'
        },
        {
          text: `Achieve "${title}" in ${subject} through disciplined practice and continuous improvement. Set clear milestones and celebrate achievements along the way.`,
          tip: 'Milestone and celebration focused'
        }
      );
  }

  return suggestions;
}

export function getContextualTips(type: GoalType): string[] {
  const tips: Record<GoalType, string[]> = {
    exam: [
      'Break down by topics/chapters',
      'Schedule mock tests before the actual date',
      'Focus on high-weight topics first',
      'Create flashcards for key concepts'
    ],
    project: [
      'Define clear deliverables and milestones',
      'Set internal deadlines before the final due date',
      'Document your progress regularly',
      'Build in time for review and revisions'
    ],
    skill: [
      'Practice daily, even if for short periods',
      'Track measurable improvements',
      'Find a mentor or join a community',
      'Apply the skill in real projects'
    ],
    course: [
      'Stay ahead of the syllabus',
      'Take comprehensive notes in each session',
      'Review material within 24 hours',
      'Form study groups with classmates'
    ],
    certification: [
      'Follow the official exam blueprint',
      'Take multiple practice tests',
      'Join certification communities',
      'Schedule exam date to create urgency'
    ],
    personal: [
      'Set flexible, enjoyable milestones',
      'Connect learning to personal interests',
      'Share progress with friends for accountability',
      'Focus on intrinsic motivation'
    ]
  };

  return tips[type] || [];
}
