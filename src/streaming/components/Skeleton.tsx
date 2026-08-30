import { type CSSProperties } from 'react'

const shimmer: CSSProperties = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
  borderRadius: 8,
}

// Add shimmer keyframe once
const STYLE_ID = 'pwani-skeleton-style'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style')
  s.id = STYLE_ID
  s.textContent = `@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`
  document.head.appendChild(s)
}

export function SkeletonBox({ w, h, radius = 8, style }: { w: number | string; h: number | string; radius?: number; style?: CSSProperties }) {
  return <div style={{ ...shimmer, width: w, height: h, borderRadius: radius, flexShrink: 0, ...style }} />
}

export function SkeletonText({ w = '100%', h = 14, style }: { w?: number | string; h?: number; style?: CSSProperties }) {
  return <div style={{ ...shimmer, width: w, height: h, borderRadius: 6, ...style }} />
}

export function SkeletonCard({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? { w: 240, h: 148 } : size === 'sm' ? { w: 130, h: 84 } : { w: 180, h: 110 }
  return (
    <div style={{ flexShrink: 0, width: dims.w }}>
      <SkeletonBox w={dims.w} h={dims.h} radius={12} />
      <SkeletonText w={dims.w * 0.75} h={13} style={{ marginTop: 8 }} />
      <SkeletonText w={dims.w * 0.5} h={11} style={{ marginTop: 5 }} />
    </div>
  )
}

export function SkeletonRow({ title = true, size = 'md', count = 4 }: { title?: boolean; size?: 'sm' | 'md' | 'lg'; count?: number }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {title && (
        <div style={{ padding: '0 20px', marginBottom: 14 }}>
          <SkeletonText w={140} h={16} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, paddingLeft: 20, paddingRight: 20, overflowX: 'hidden' }}>
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} size={size} />)}
      </div>
    </div>
  )
}

export function SkeletonHero() {
  return (
    <div style={{ position: 'relative', height: 340 }}>
      <SkeletonBox w="100%" h={340} radius={0} />
      <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
        <SkeletonText w="40%" h={12} style={{ marginBottom: 8 }} />
        <SkeletonText w="70%" h={28} style={{ marginBottom: 8 }} />
        <SkeletonText w="90%" h={13} style={{ marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <SkeletonBox w={120} h={44} radius={10} />
          <SkeletonBox w={100} h={44} radius={10} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div style={{ paddingBottom: 40 }}>
      <SkeletonBox w="100%" h={260} radius={0} />
      <div style={{ padding: '16px 20px' }}>
        <SkeletonText w="60%" h={28} style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[80, 70, 100, 60].map(w => <SkeletonText key={w} w={w} h={12} />)}
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <SkeletonBox w="60%" h={50} radius={12} />
          <SkeletonBox w={50} h={50} radius={12} />
          <SkeletonBox w={50} h={50} radius={12} />
        </div>
        {[100, 90, 85, 70, 55].map(w => <SkeletonText key={w} w={`${w}%`} h={13} style={{ marginBottom: 8 }} />)}
      </div>
    </div>
  )
}

export function SkeletonHomeScreen() {
  return (
    <div>
      <SkeletonHero />
      <div style={{ padding: '16px 20px' }}>
        <SkeletonText w={160} h={18} style={{ marginBottom: 4 }} />
        <SkeletonText w={100} h={13} />
      </div>
      <SkeletonRow size="md" count={3} />
      <SkeletonRow size="lg" count={2} />
      <SkeletonRow size="sm" count={5} />
      <SkeletonRow size="md" count={3} />
    </div>
  )
}

export function SkeletonEpisodeList() {
  return (
    <div style={{ padding: '0 20px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
          <SkeletonBox w={90} h={58} radius={10} />
          <div style={{ flex: 1 }}>
            <SkeletonText w="30%" h={10} style={{ marginBottom: 6 }} />
            <SkeletonText w="70%" h={14} style={{ marginBottom: 6 }} />
            <SkeletonText w="25%" h={11} />
          </div>
          <SkeletonBox w={32} h={32} radius={8} />
        </div>
      ))}
    </div>
  )
}
