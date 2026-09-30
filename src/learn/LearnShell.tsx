import { useState } from 'react'
import { COURSES } from './data'
import { usePlatform, type Course } from '../platform/store'

type Props = { onExit: () => void }

export default function LearnShell({ onExit }: Props) {
  const { state, actions } = usePlatform()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [query, setQuery] = useState('')
  const filteredCourses = COURSES.filter(course => `${course.title} ${course.skill}`.toLowerCase().includes(query.toLowerCase()))

  if (selectedCourse) {
    const progress = state.courseProgress[selectedCourse.id] || { completedLessonIds: [], completed: false }
    const completeNext = (lessonId: string) => actions.completeLesson(selectedCourse, lessonId)
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', color: 'white' }}>
        <header style={{ padding: '20px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <button onClick={() => setSelectedCourse(null)} aria-label="Back to courses" style={iconButton}>←</button>
          <div style={{ flex: 1 }}>
            <p style={eyebrow}>Pwani Learn</p>
            <h1 style={title}>{selectedCourse.title}</h1>
          </div>
        </header>
        <main style={{ padding: '20px 20px 36px' }}>
          <div style={hero}>
            <span style={{ fontSize: 38 }}>🎓</span>
            <p style={{ color: '#5dade2', fontSize: 12, fontWeight: 700, margin: '12px 0 4px' }}>{selectedCourse.level} · {selectedCourse.duration}</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, margin: 0 }}>{selectedCourse.description}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '22px 0 8px' }}>
            <span style={eyebrow}>Your progress</span>
            <span style={{ color: '#1abc9c', fontWeight: 700 }}>{Math.round(progress.completedLessonIds.length / selectedCourse.lessons.length * 100)}%</span>
          </div>
          <div style={progressTrack}><div style={{ ...progressFill, width: `${progress.completedLessonIds.length / selectedCourse.lessons.length * 100}%` }} /></div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedCourse.lessons.map((lesson, index) => {
              const complete = progress.completedLessonIds.includes(lesson.id)
              return (
                <button key={lesson.id} onClick={() => completeNext(lesson.id)} style={{ ...lessonCard, opacity: complete ? 0.72 : 1 }}>
                  <span style={{ ...lessonIcon, background: complete ? 'rgba(26,188,156,0.18)' : 'rgba(41,128,185,0.16)' }}>{complete ? '✓' : index + 1}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}><strong style={{ display: 'block', color: 'white', fontSize: 14 }}>{lesson.title}</strong><small style={{ color: 'rgba(255,255,255,0.4)' }}>{lesson.kind === 'quiz' ? 'Quiz' : 'Lesson'} · {lesson.duration}</small></span>
                  <span style={{ color: complete ? '#1abc9c' : '#5dade2', fontSize: 12 }}>{complete ? 'Done' : 'Start'}</span>
                </button>
              )
            })}
          </div>
          {progress.completed && <div style={{ ...success, marginTop: 18 }}><strong>Certificate earned</strong><span> This course is now part of your Passport learning record.</span></div>}
        </main>
      </div>
    )
  }

  const completed = COURSES.filter(course => state.courseProgress[course.id]?.completed).length
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', color: 'white' }}>
      <header style={{ padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onExit} aria-label="Back to Pwani Play" style={iconButton}>←</button>
        <div style={{ flex: 1 }}><p style={eyebrow}>One ecosystem</p><h1 style={title}>Pwani Learn</h1></div>
        <span style={{ fontSize: 22 }}>🎓</span>
      </header>
      <main style={{ padding: '20px 20px 36px' }}>
        <div style={hero}><p style={eyebrow}>Build your creative career</p><h2 style={{ ...title, fontSize: 25, margin: '8px 0' }}>Learn skills. Earn proof. Find better work.</h2><p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>Complete a course and the result is recorded in your Pwani Passport.</p></div>
        <div style={{ display: 'flex', gap: 10, margin: '16px 0 22px' }}><div style={stat}><strong>{completed}</strong><span>Completed</span></div><div style={stat}><strong>{COURSES.length}</strong><span>Courses</span></div><div style={stat}><strong>{state.profile.skills.length}</strong><span>Passport skills</span></div></div>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search courses or skills" aria-label="Search courses" style={input} />
        <p style={{ ...eyebrow, marginTop: 24 }}>Recommended for you</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredCourses.map(course => { const progress = state.courseProgress[course.id]; return <button key={course.id} onClick={() => setSelectedCourse(course)} style={courseCard}><span style={{ fontSize: 32 }}>📚</span><span style={{ flex: 1, textAlign: 'left' }}><strong style={{ display: 'block', color: 'white', fontSize: 15, marginBottom: 4 }}>{course.title}</strong><small style={{ color: 'rgba(255,255,255,0.45)' }}>{course.skill} · {course.level} · {course.duration}</small>{progress && <span style={{ display: 'block', color: '#1abc9c', fontSize: 11, marginTop: 8 }}>{progress.completed ? 'Certificate earned' : `${progress.completedLessonIds.length}/${course.lessons.length} lessons complete`}</span>}</span><span style={{ color: '#5dade2', fontSize: 20 }}>›</span></button> })}
          {filteredCourses.length === 0 && <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', padding: 28 }}>No courses match that search.</p>}
        </div>
      </main>
    </div>
  )
}

const iconButton = { width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', fontSize: 18 }
const eyebrow = { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: 0 }
const title = { fontFamily: 'DM Serif Display, serif', fontSize: 21, fontWeight: 400, margin: 0 }
const hero = { padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, rgba(41,128,185,0.2), rgba(26,188,156,0.08))', border: '1px solid rgba(93,173,226,0.2)' }
const progressTrack = { height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' as const }
const progressFill = { height: '100%', background: 'linear-gradient(90deg, #2980b9, #1abc9c)', borderRadius: 6, transition: 'width 0.2s ease' }
const lessonCard = { display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 14, borderRadius: 15, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', color: 'white' }
const lessonIcon = { width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5dade2', fontWeight: 700, flexShrink: 0 }
const success = { padding: 14, borderRadius: 14, background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)', color: '#1abc9c', fontSize: 13 }
const stat = { flex: 1, padding: '12px 8px', textAlign: 'center' as const, borderRadius: 13, background: 'rgba(255,255,255,0.04)' }
const input = { width: '100%', boxSizing: 'border-box' as const, padding: '13px 15px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 15, outline: 'none' }
const courseCard = { display: 'flex', alignItems: 'center', gap: 13, width: '100%', padding: 15, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', color: 'white' }