import { MOCK_CERTIFICATES } from './data'
import type { Certificate } from './data'

type Props = { onBack: () => void }

const SOURCE_LABELS = {
  'pwani-learn': { label: 'Pwani Learn', color: '#2980b9', icon: '🎓' },
  external: { label: 'External', color: '#9b59b6', icon: '🌍' },
  manual: { label: 'Manual Upload', color: 'rgba(255,255,255,0.4)', icon: '📄' },
}

export default function Certificates({ onBack }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'white', flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: 'white', margin: 0 }}>Certificates &amp; Learning</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{MOCK_CERTIFICATES.length} certificates · {MOCK_CERTIFICATES.filter(c => c.verified).length} verified</p>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>+ Import</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
        {/* Pwani Learn sync banner */}
        <div style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.15)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🎓</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#5dade2', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>Pwani Learn Connected</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>New certificates import automatically from your Pwani Learn account.</p>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#2980b9', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Sync ↺</button>
        </div>

        {MOCK_CERTIFICATES.map(cert => (
          <CertCard key={cert.id} cert={cert} />
        ))}

        {/* Upload manual certificate */}
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, textAlign: 'center', cursor: 'pointer', marginTop: 8 }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>📎</span>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>Upload External Certificate</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, margin: 0 }}>JPG, PNG, or PDF</p>
        </div>
      </div>
    </div>
  )
}

function CertCard({ cert }: { cert: Certificate }) {
  const src = SOURCE_LABELS[cert.source]
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${cert.verified ? 'rgba(26,188,156,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
      {cert.imageUrl && (
        <div style={{ position: 'relative', height: 110 }}>
          <img src={cert.imageUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#103058' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, transparent 60%)' }} />
          {cert.verified && (
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(26,188,156,0.2)', border: '1px solid rgba(26,188,156,0.4)', borderRadius: 100, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#1abc9c', fontSize: 11, fontWeight: 700 }}>✓ Verified</span>
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{cert.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 3px' }}>{cert.issuer}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0, fontFamily: 'DM Mono, monospace' }}>{cert.issuedDate} · {cert.credentialId}</p>
          </div>
          {!cert.imageUrl && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: cert.verified ? 'rgba(26,188,156,0.12)' : 'rgba(255,255,255,0.06)', color: cert.verified ? '#1abc9c' : 'rgba(255,255,255,0.35)', border: `1px solid ${cert.verified ? 'rgba(26,188,156,0.25)' : 'rgba(255,255,255,0.1)'}` }}>{cert.verified ? '✓ Verified' : 'Unverified'}</span>
          )}
        </div>

        {/* Source badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 12 }}>{src.icon}</span>
          <span style={{ fontSize: 11, color: src.color, fontWeight: 600 }}>{src.label}</span>
        </div>

        {/* Skills */}
        {cert.skills.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            {cert.skills.map(s => <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(155,89,182,0.1)', color: '#bb8fce', border: '1px solid rgba(155,89,182,0.15)' }}>{s}</span>)}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>📥 Download</button>
          <button style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>🔗 Share</button>
          {!cert.verified && <button style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.2)', color: '#1abc9c', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Verify</button>}
        </div>
      </div>
    </div>
  )
}
