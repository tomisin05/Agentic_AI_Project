/**
 * AI Description Suggestion System
 * Generates smart, contextual goal descriptions based on title, subject, and type
 */

import { GoalType } from './goalSystem';

interface DescriptionContext {
  title: string;
  subject: string;
  type: GoalType;
}

// Common action words and patterns for different goal types
const goalTypePatterns = {
  exam: {
    verbs: ['pass', 'ace', 'prepare for', 'study for', 'master'],
    contexts: ['exam', 'test', 'final', 'midterm', 'assessment', 'quiz'],
    templates: [
      'Comprehensive preparation for the {title}, focusing on core concepts in {subject}.',
      'Master all key topics and practice problems to excel in the {title}.',
      'Systematic review and practice to achieve top marks in {subject}.',
      'Build strong fundamentals and problem-solving skills for the {title}.',
      'Strategic preparation covering all chapters and practice materials in {subject}.'
    ]
  },
  project: {
    verbs: ['build', 'create', 'develop', 'complete', 'finish', 'implement'],
    contexts: ['project', 'assignment', 'work', 'portfolio', 'deliverable'],
    templates: [
      'Complete the {title} with high-quality deliverables, applying {subject} concepts.',
      'Plan, execute, and deliver the {title} project on schedule.',
      'Build a comprehensive solution for the {title}, demonstrating mastery of {subject}.',
      'Develop all components of the {title} with attention to detail and best practices.',
      'Create an outstanding {title} that showcases strong understanding of {subject}.'
    ]
  },
  skill: {
    verbs: ['learn', 'master', 'improve', 'develop', 'enhance'],
    contexts: ['skill', 'ability', 'technique', 'proficiency'],
    templates: [
      'Develop proficiency in {title} through consistent practice and application.',
      'Master {subject} fundamentals and advanced techniques step by step.',
      'Build strong competency in {title} with focused, deliberate practice.',
      'Progress from basics to mastery in {subject}, tracking skill improvements.',
      'Systematically improve {title} abilities through structured learning and practice.'
    ]
  },
  course: {
    verbs: ['complete', 'finish', 'study', 'learn'],
    contexts: ['course', 'class', 'module', 'curriculum'],
    templates: [
      'Successfully complete all modules and assignments for {title}.',
      'Engage with all course materials and achieve strong understanding of {subject}.',
      'Master the curriculum of {title} through active learning and participation.',
      'Complete {title} with thorough understanding of all key concepts in {subject}.',
      'Finish the course with excellent performance across all assessments and projects.'
    ]
  },
  certification: {
    verbs: ['earn', 'obtain', 'achieve', 'pass', 'get certified in'],
    contexts: ['certification', 'certificate', 'credential', 'qualification'],
    templates: [
      'Prepare thoroughly and earn the {title} certification.',
      'Study all required materials and pass the {subject} certification exam.',
      'Achieve professional certification in {title} to advance career goals.',
      'Master all competencies required for {title} certification.',
      'Complete comprehensive preparation to successfully obtain {subject} certification.'
    ]
  },
  personal: {
    verbs: ['achieve', 'accomplish', 'reach', 'attain'],
    contexts: ['goal', 'objective', 'milestone', 'target'],
    templates: [
      'Work consistently toward achieving {title} in {subject}.',
      'Make steady progress on the personal goal of {title}.',
      'Develop discipline and consistency to accomplish {title}.',
      'Set a clear path and milestones to achieve {title} in {subject}.',
      'Commit to personal growth and achievement in {title}.'
    ]
  }
};

// Subject-specific enhancement phrases
const subjectEnhancements: { [key: string]: string[] } = {
  mathematics: [
    'with emphasis on problem-solving and theoretical understanding',
    'covering both theoretical concepts and practical applications',
    'building strong analytical and computational skills',
    'mastering proofs, formulas, and problem-solving techniques'
  ],
  physics: [
    'understanding both theory and experimental applications',
    'mastering equations, principles, and real-world applications',
    'developing strong problem-solving and analytical abilities'
  ],
  chemistry: [
    'understanding molecular structures, reactions, and applications',
    'mastering lab techniques and theoretical concepts',
    'building strong analytical and experimental skills'
  ],
  biology: [
    'understanding biological systems and processes',
    'mastering key concepts from cellular to ecosystem levels',
    'developing strong scientific reasoning skills'
  ],
  programming: [
    'building practical coding skills and best practices',
    'mastering syntax, algorithms, and software development',
    'developing problem-solving through hands-on projects'
  ],
  language: [
    'improving reading, writing, speaking, and listening skills',
    'building vocabulary, grammar, and conversational fluency',
    'developing comprehensive language proficiency'
  ],
  history: [
    'understanding key events, contexts, and their significance',
    'analyzing historical patterns and their modern implications',
    'developing critical thinking about past and present'
  ],
  literature: [
    'analyzing texts with critical thinking and deep understanding',
    'exploring themes, literary techniques, and contexts',
    'developing strong analytical and interpretive skills'
  ]
};

/**
 * Extract key information from the goal title
 */
function analyzeTitle(title: string, type: GoalType): {
  action: string | null;
  subject: string | null;
} {
  const lowerTitle = title.toLowerCase();
  const patterns = goalTypePatterns[type];
  
  // Find matching action verb
  const action = patterns.verbs.find(verb => lowerTitle.includes(verb)) || null;
  
  // Find context words
  const subject = patterns.contexts.find(ctx => lowerTitle.includes(ctx)) || null;
  
  return { action, subject };
}

/**
 * Get subject-specific enhancement
 */
function getSubjectEnhancement(subject: string): string {
  const lowerSubject = subject.toLowerCase();
  
  // Check for exact matches or partial matches
  for (const [key, enhancements] of Object.entries(subjectEnhancements)) {
    if (lowerSubject.includes(key) || key.includes(lowerSubject)) {
      return enhancements[Math.floor(Math.random() * enhancements.length)];
    }
  }
  
  // Default enhancement
  return 'developing deep understanding and practical skills';
}

/**
 * Generate multiple AI-suggested descriptions
 */
export function generateDescriptionSuggestions(
  context: DescriptionContext,
  count: number = 3
): string[] {
  const { title, subject, type } = context;
  
  // Return empty if insufficient context
  if (!title.trim() || !subject.trim()) {
    return [];
  }
  
  const patterns = goalTypePatterns[type];
  const analysis = analyzeTitle(title, type);
  const subjectEnhancement = getSubjectEnhancement(subject);
  
  const suggestions: string[] = [];
  
  // Generate suggestions based on templates
  for (let i = 0; i < Math.min(count, patterns.templates.length); i++) {
    let suggestion = patterns.templates[i]
      .replace('{title}', title)
      .replace('{subject}', subject);
    
    suggestions.push(suggestion);
  }
  
  // Generate a custom suggestion with enhancement
  if (count > patterns.templates.length) {
    const customSuggestion = `${patterns.templates[0]
      .replace('{title}', title)
      .replace('{subject}', subject)
      .split('.')[0]}, ${subjectEnhancement}.`;
    suggestions.push(customSuggestion);
  }
  
  return suggestions;
}

/**
 * Generate a single "best" description suggestion
 */
export function generateBestDescription(context: DescriptionContext): string {
  const suggestions = generateDescriptionSuggestions(context, 1);
  return suggestions[0] || '';
}

/**
 * Enhance an existing description with AI suggestions
 */
export function enhanceDescription(
  currentDescription: string,
  context: DescriptionContext
): string[] {
  const suggestions = generateDescriptionSuggestions(context, 3);
  
  // If there's already a description, include it as the first option
  if (currentDescription.trim()) {
    return [currentDescription, ...suggestions.slice(0, 2)];
  }
  
  return suggestions;
}

/**
 * Get contextual tips for goal description
 */
export function getDescriptionTips(type: GoalType): string[] {
  const tips: { [key in GoalType]: string[] } = {
    exam: [
      'Specify which topics or chapters you need to cover',
      'Mention your target grade or score',
      'Include any specific challenges you want to address'
    ],
    project: [
      'Describe the main deliverables or outcomes',
      'Mention key technologies or methods you\'ll use',
      'Include any specific requirements or constraints'
    ],
    skill: [
      'Define what "mastery" looks like for this skill',
      'Mention how you\'ll practice and apply the skill',
      'Include measurable improvement indicators'
    ],
    course: [
      'Specify the course duration and format',
      'Mention key learning objectives',
      'Include any certifications or credits earned'
    ],
    certification: [
      'Specify the certification name and issuing body',
      'Mention exam format and passing requirements',
      'Include preparation materials you\'ll use'
    ],
    personal: [
      'Define what success looks like for this goal',
      'Mention why this goal is important to you',
      'Include specific milestones or checkpoints'
    ]
  };
  
  return tips[type];
}
