import { createContext, createElement, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'

export type Course = {
  id: string
  title: string
  provider: string
  level: string
  duration: string
  skill: string
  description: string
  lessons: { id: string; title: string; duration: string; kind: 'lesson' | 'quiz' }[]
}

export type Application = {
  id: string
  opportunityId: string
  title: string
  organization: string
  status: 'draft' | 'submitted' | 'review' | 'shortlisted' | 'accepted' | 'rejected'
  createdAt: string
}

export type PlatformNotification = {
  id: string
  title: string
  body: string
  module: 'play' | 'learn' | 'hub' | 'wallet' | 'connect' | 'passport' | 'studio'
  read: boolean
  target: PlatformTarget
}

export type PlatformTarget =
  | { type: 'learn'; courseId: string }
  | { type: 'hub'; opportunityId: string }
  | { type: 'wallet'; screen: string }
  | { type: 'connect'; conversationId: string }
  | { type: 'play'; contentId: string }

export type PlatformState = {
  profile: { name: string; username: string; bio: string; skills: string[] }
  following: string[]
  watchlist: string[]
  likedContent: string[]
  watchHistory: { contentId: string; progress: number; updatedAt: string }[]
  applications: Application[]
  courseProgress: Record<string, { completedLessonIds: string[]; completed: boolean }>
  notifications: PlatformNotification[]
  transactions: { id: string; label: string; amount: number; type: 'credit' | 'debit'; status: 'demo-confirmed' | 'pending'; createdAt: string }[]
}

const STORAGE_KEY = 'pwani-play-platform-v1'
const listeners = new Set<() => void>()

const initialState: PlatformState = {
  profile: { name: 'Amina Hassan', username: '@aminahassan', bio: 'Filmmaker and visual storyteller from Mombasa.', skills: ['Directing', 'Editing'] },
  following: [],
  watchlist: [],
  likedContent: [],
  watchHistory: [],
  applications: [],
  courseProgress: {},
  notifications: [],
  transactions: [],
}

let state = loadState()

function loadState(): PlatformState {
  if (typeof window === 'undefined') return initialState
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
  } catch {
    return initialState
  }
}

function notify() {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach(listener => listener())
}

function update(mutator: (current: PlatformState) => PlatformState) {
  state = mutator(state)
  notify()
}

export const platformStore = {
  getSnapshot: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setProfile: (profile: Partial<PlatformState['profile']>) => update(current => ({ ...current, profile: { ...current.profile, ...profile } })),
  toggleFollowing: (creatorId: string) => update(current => ({ ...current, following: current.following.includes(creatorId) ? current.following.filter(id => id !== creatorId) : [...current.following, creatorId] })),
  toggleWatchlist: (contentId: string) => update(current => ({ ...current, watchlist: current.watchlist.includes(contentId) ? current.watchlist.filter(id => id !== contentId) : [...current.watchlist, contentId] })),
  toggleLike: (contentId: string) => update(current => ({ ...current, likedContent: current.likedContent.includes(contentId) ? current.likedContent.filter(id => id !== contentId) : [...current.likedContent, contentId] })),
  recordWatch: (contentId: string, progress: number) => update(current => ({ ...current, watchHistory: [{ contentId, progress, updatedAt: new Date().toISOString() }, ...current.watchHistory.filter(item => item.contentId !== contentId)] })),
  submitApplication: (application: Omit<Application, 'id' | 'createdAt' | 'status'>) => update(current => current.applications.some(item => item.opportunityId === application.opportunityId) ? current : ({ ...current, applications: [{ ...application, id: `app-${Date.now()}`, status: 'submitted', createdAt: new Date().toISOString() }, ...current.applications], notifications: [{ id: `notif-${Date.now()}`, title: 'Application submitted', body: `Your application for ${application.title} is now being reviewed.`, module: 'hub', read: false, target: { type: 'hub', opportunityId: application.opportunityId } }, ...current.notifications] })),
  completeLesson: (course: Course, lessonId: string) => update(current => {
    const previous = current.courseProgress[course.id] || { completedLessonIds: [], completed: false }
    if (previous.completedLessonIds.includes(lessonId)) return current
    const completedLessonIds = [...previous.completedLessonIds, lessonId]
    const completed = completedLessonIds.length >= course.lessons.length
    return { ...current, courseProgress: { ...current.courseProgress, [course.id]: { completedLessonIds, completed } }, notifications: completed ? [{ id: `notif-${Date.now()}`, title: 'Course completed', body: `${course.title} has been added to your learning record.`, module: 'learn', read: false, target: { type: 'learn', courseId: course.id } }, ...current.notifications] : current.notifications }
  }),
  addTransaction: (transaction: Omit<PlatformState['transactions'][number], 'id' | 'createdAt'>) => update(current => ({ ...current, transactions: [{ ...transaction, id: `tx-${Date.now()}`, createdAt: new Date().toISOString() }, ...current.transactions] })),
  markNotificationRead: (id: string) => update(current => ({ ...current, notifications: current.notifications.map(item => item.id === id ? { ...item, read: true } : item) })),
}

const PlatformContext = createContext(platformStore)

export function PlatformProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handleStorage = () => { state = loadState(); listeners.forEach(listener => listener()) }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])
  const value = useMemo(() => platformStore, [])
  return createElement(PlatformContext.Provider, { value }, children)
}

export function usePlatform() {
  const store = useContext(PlatformContext)
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  return { state: snapshot, actions: store }
}