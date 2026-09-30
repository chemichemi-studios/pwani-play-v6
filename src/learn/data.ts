import type { Course } from '../platform/store'

export const COURSES: Course[] = [
  {
    id: 'course-mobile-film',
    title: 'Mobile Filmmaking for African Stories',
    provider: 'Pwani Learn',
    level: 'Beginner',
    duration: '2h 40m',
    skill: 'Visual Storytelling',
    description: 'Plan, shoot, and edit a short story with the tools already in your pocket.',
    lessons: [
      { id: 'mobile-1', title: 'Finding the story around you', duration: '18 min', kind: 'lesson' },
      { id: 'mobile-2', title: 'Light, sound, and stable shots', duration: '24 min', kind: 'lesson' },
      { id: 'mobile-3', title: 'Build a three-shot sequence', duration: '20 min', kind: 'lesson' },
      { id: 'mobile-quiz', title: 'Storytelling check-in', duration: '8 min', kind: 'quiz' },
    ],
  },
  {
    id: 'course-creative-business',
    title: 'Creative Business Basics',
    provider: 'Pwani Learn',
    level: 'Beginner',
    duration: '1h 50m',
    skill: 'Creative Business',
    description: 'Turn your creative practice into a clear offer, price, and professional profile.',
    lessons: [
      { id: 'business-1', title: 'Define your creative offer', duration: '16 min', kind: 'lesson' },
      { id: 'business-2', title: 'Pricing work in KES', duration: '22 min', kind: 'lesson' },
      { id: 'business-3', title: 'Build trust with a Passport', duration: '18 min', kind: 'lesson' },
      { id: 'business-quiz', title: 'Business readiness quiz', duration: '10 min', kind: 'quiz' },
    ],
  },
  {
    id: 'course-production-ready',
    title: 'Production Ready: From Idea to Pitch',
    provider: 'Pwani Learn',
    level: 'Intermediate',
    duration: '3h 15m',
    skill: 'Producing',
    description: 'Shape an idea into a practical pitch with a team, budget, and delivery plan.',
    lessons: [
      { id: 'production-1', title: 'The one-page project brief', duration: '25 min', kind: 'lesson' },
      { id: 'production-2', title: 'Build the right production team', duration: '28 min', kind: 'lesson' },
      { id: 'production-3', title: 'Budget, schedule, and deliverables', duration: '32 min', kind: 'lesson' },
      { id: 'production-quiz', title: 'Pitch readiness quiz', duration: '12 min', kind: 'quiz' },
    ],
  },
]