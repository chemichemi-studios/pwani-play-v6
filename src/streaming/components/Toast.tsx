import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'coin'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => void
  showCoin: (coins: number) => void
}

const ToastContext = createContext<ToastContextValue>({ show: () => {}, showCoin: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '⚠️',
  info: 'ℹ️',
  warning: '⚡',
  coin: '🪙',
}

const COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: 'rgba(26,188,156,0.15)', border: 'rgba(26,188,156,0.35)', text: '#1abc9c' },
  error:   { bg: 'rgba(231,76,60,0.15)',  border: 'rgba(231,76,60,0.35)',  text: '#ec7063' },
  info:    { bg: 'rgba(41,128,185,0.15)', border: 'rgba(41,128,185,0.35)', text: '#5dade2' },
  warning: { bg: 'rgba(243,156,18,0.15)', border: 'rgba(243,156,18,0.35)', text: '#f8c471' },
  coin:    { bg: 'rgba(202,111,30,0.2)',  border: 'rgba(243,156,18,0.4)',  text: '#f8c471' },
}

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const c = COLORS[item.type]
  useEffect(() => {
    const t = setTimeout(onDismiss, item.duration ?? 3000)
    return () => clearTimeout(t)
  }, [item.duration, onDismiss])

  return (
    <div
      onClick={onDismiss}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: c.bg,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: '12px 16px',
        marginBottom: 10,
        cursor: 'pointer',
        animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1) both',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[item.type]}</span>
      <span style={{ fontSize: 14, color: 'white', fontFamily: 'Outfit, sans-serif', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>
        {item.message}
      </span>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-3), { id, message, type, duration }])
  }, [])

  const showCoin = useCallback((coins: number) => {
    show(`+${coins} Reward Coins earned! 🎉`, 'coin', 2500)
  }, [show])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show, showCoin }}>
      {children}
      <div style={{
        position: 'fixed',
        top: 52,
        left: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: 398,
        margin: '0 auto',
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'all' }}>
          {toasts.map(t => (
            <ToastItem key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
