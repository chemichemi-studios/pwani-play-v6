import { useState } from 'react'
import type { VerificationStatus } from './data'

type Props = { onBack: () => void; onVerified: () => void }

type Step = 'choose-doc' | 'upload-doc' | 'selfie' | 'email' | 'phone' | 'review' | 'done'

const DOC_TYPES = [
  { key: 'national-id', icon: '🪪', label: 'National ID', desc: 'Kenyan National Identity Card or equivalent' },
  { key: 'passport', icon: '📕', label: 'Passport', desc: 'International travel passport' },
  { key: 'driving', icon: '🚗', label: 'Driving Licence', desc: 'Valid driving licence with photo' },
]

const STATUS_CONFIGS: Record<VerificationStatus, { icon: string; label: string; color: string; bg: string }> = {
  'not-started': { icon: '⭕', label: 'Not Started', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)' },
  pending: { icon: '⏳', label: 'Under Review', color: '#f8c471', bg: 'rgba(243,156,18,0.12)' },
  approved: { icon: '✅', label: 'Verified', color: '#1abc9c', bg: 'rgba(26,188,156,0.12)' },
  'needs-info': { icon: '⚠️', label: 'More Info Needed', color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
  rejected: { icon: '❌', label: 'Rejected', color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
}

export default function IdentityVerification({ onBack, onVerified }: Props) {
  const [step, setStep] = useState<Step>('choose-doc')
  const [docType, setDocType] = useState('')
  const [docUploaded, setDocUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)
  const [emailVerified] = useState(true)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const checks = [
    { label: 'Document ID', done: docUploaded },
    { label: 'Selfie Match', done: selfieUploaded },
    { label: 'Email', done: emailVerified },
    { label: 'Phone', done: phoneVerified },
  ]
  const completedChecks = checks.filter(c => c.done).length

  const submit = () => {
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setStep('done') }, 2200)
  }

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(243,156,18,0.15)', border: '2px solid rgba(243,156,18,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20, animation: 'pulse-glow 2s infinite' }}>⏳</div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'white', margin: '0 0 12px' }}>Verification Submitted</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, margin: '0 0 8px', lineHeight: 1.5 }}>Your identity documents are under review.</p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '0 0 28px', fontFamily: 'DM Mono, monospace' }}>Typical review time: 24–48 hours</p>
        <button className="btn-primary" onClick={onVerified} style={{ maxWidth: 240, margin: '0 auto' }}>Back to Passport</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Identity Verification</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Build trust across the Pwani ecosystem</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* Progress */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>Verification Progress</p>
            <span style={{ color: '#2980b9', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{completedChecks}/4</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 12 }}>
            <div style={{ width: `${(completedChecks / 4) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#1e6091,#1abc9c)', borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {checks.map(c => (
              <div key={c.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: c.done ? 'rgba(26,188,156,0.2)' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${c.done ? '#1abc9c' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: 11 }}>
                  {c.done ? '✓' : ''}
                </div>
                <span style={{ fontSize: 9, color: c.done ? '#1abc9c' : 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step: Choose document */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>1. Government ID</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DOC_TYPES.map(d => (
              <button key={d.key} onClick={() => { setDocType(d.key); setStep('upload-doc') }} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${docType === d.key ? '#2980b9' : 'rgba(255,255,255,0.08)'}`, background: docType === d.key ? 'rgba(41,128,185,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 28 }}>{d.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: docType === d.key ? '#5dade2' : 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{d.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{d.desc}</p>
                </div>
                {docUploaded && docType === d.key ? <span style={{ color: '#1abc9c', fontSize: 16 }}>✓</span> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>}
              </button>
            ))}
          </div>

          {/* Upload simulator */}
          {docType && !docUploaded && (
            <div style={{ marginTop: 12, padding: '16px', background: 'rgba(41,128,185,0.08)', border: '1px dashed rgba(41,128,185,0.3)', borderRadius: 14 }}>
              <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>Upload {DOC_TYPES.find(d => d.key === docType)?.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 14px', textAlign: 'center' }}>Accepted: JPG, PNG, PDF — max 10 MB</p>
              <button onClick={() => { setDocUploaded(true); setStep('selfie') }} className="btn-primary" style={{ width: '100%' }}>📁 Select File</button>
            </div>
          )}
        </div>

        {/* Selfie verification */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>2. Selfie Verification</p>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${selfieUploaded ? 'rgba(26,188,156,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 42 }}>{selfieUploaded ? '✅' : '🤳'}</div>
            <p style={{ color: selfieUploaded ? '#1abc9c' : 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{selfieUploaded ? 'Selfie Uploaded' : 'Take a Selfie'}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, textAlign: 'center' }}>Hold your ID next to your face in good lighting.</p>
            {!selfieUploaded && <button onClick={() => setSelfieUploaded(true)} style={{ padding: '9px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>📸 Open Camera</button>}
          </div>
        </div>

        {/* Email verification */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>3. Email Verification</p>
          <div style={{ background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>✉️</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>Email Verified</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>amara@chemichemi.ke</p>
            </div>
            <span style={{ color: '#1abc9c', fontSize: 18 }}>✓</span>
          </div>
        </div>

        {/* Phone verification */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>4. Phone Verification</p>
          {!phoneVerified ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px' }}>
              <input className="input-field" placeholder="+254 700 000 000" style={{ marginBottom: 8 }} />
              <button onClick={() => setPhoneVerified(true)} style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#1e6091', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Send OTP</button>
            </div>
          ) : (
            <div style={{ background: 'rgba(26,188,156,0.08)', border: '1px solid rgba(26,188,156,0.2)', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>📱</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#1abc9c', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>Phone Verified</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>+254 7xx xxx xxx</p>
              </div>
              <span style={{ color: '#1abc9c', fontSize: 18 }}>✓</span>
            </div>
          )}
        </div>

        {/* Security info */}
        <div style={{ background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ color: '#bb8fce', fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>🔒 Your Data is Secure</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>Documents are encrypted end-to-end and reviewed by certified identity verifiers. They are never stored after verification.</p>
        </div>
      </div>

      {/* Submit */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,22,40,0.95)' }}>
        <button className="btn-primary" onClick={submit} disabled={submitting || completedChecks < 2} style={{ width: '100%' }}>
          {submitting ? '🔐 Submitting…' : `Submit Verification (${completedChecks}/4 checks done)`}
        </button>
      </div>
    </div>
  )
}
