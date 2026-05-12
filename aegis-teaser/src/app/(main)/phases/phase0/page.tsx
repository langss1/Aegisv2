'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase0.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function Phase0Page() {
  const [sourceType, setSourceType] = useState<'github' | 'public' | null>(null)
  const [url, setUrl] = useState('')
  const [step, setStep] = useState<'selection' | 'config' | 'analyzing' | 'stack_confirm'>('selection')
  const [detectedStack, setDetectedStack] = useState(['Next.js', 'TypeScript', 'TailwindCSS', 'Node.js'])
  const [newTech, setNewTech] = useState('')
  const router = useRouter()

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('analyzing')
    setTimeout(() => {
      setStep('stack_confirm')
    }, 3000)
  }

  const addTech = () => {
    if (newTech && !detectedStack.includes(newTech)) {
      setDetectedStack([...detectedStack, newTech])
      setNewTech('')
    }
  }

  const removeTech = (tech: string) => {
    setDetectedStack(detectedStack.filter(t => t !== tech))
  }

  const startFinalScan = () => {
    router.push('/phases/phase1')
  }

  return (
    <div className={styles.content}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.modal}
      >
        <AnimatePresence mode="wait">
          {step === 'selection' && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1>Initialize New Scan</h1>
              <p>Select your target source to start AEGIS autonomous analysis.</p>

              <div className={styles.cardGrid}>
                <div className={styles.selectionCard} onClick={() => { setSourceType('github'); setStep('config'); }}>
                  <div className={styles.iconBox}>📦</div>
                  <h2>GitHub Repository</h2>
                  <span>Connect your private or public repository for full SAST analysis.</span>
                </div>
                <div className={styles.selectionCard} onClick={() => { setSourceType('public'); setStep('config'); }}>
                  <div className={styles.iconBox}>🌐</div>
                  <h2>Public Website</h2>
                  <span>Scan a live production URL for DAST and surface vulnerabilities.</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'config' && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.inputFlow}
            >
              <h1 style={{ marginBottom: '40px' }}>{sourceType === 'github' ? 'GitHub Config' : 'Website Config'}</h1>
              
              <form onSubmit={handleLaunch}>
                <div className={styles.inputGroup}>
                  <label>{sourceType === 'github' ? 'REPOSITORY_URL' : 'TARGET_ENDPOINT'}</label>
                  <input 
                    className={styles.inputBox}
                    type="text" 
                    placeholder={sourceType === 'github' ? "https://github.com/username/repo" : "https://example.com"}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button type="button" onClick={() => setStep('selection')} className={styles.tab} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '16px', cursor: 'pointer' }}>Back</button>
                  <button type="submit" className={styles.launchBtn} style={{ flex: 2 }}>
                    Launch Analysis
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '60px 0', textAlign: 'center' }}
            >
              <div style={{ 
                width: '100%', 
                maxWidth: '600px', 
                height: '240px', 
                background: '#050505', 
                border: '1px solid rgba(220,38,38,0.2)', 
                borderRadius: '24px', 
                margin: '0 auto 48px',
                padding: '32px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                textAlign: 'left',
                boxShadow: 'inset 0 0 40px rgba(220,38,38,0.05), 0 20px 50px rgba(0,0,0,0.5)'
              }}>
                {/* Scanline Effect */}
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
                  backgroundSize: '100% 4px, 3px 100%',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />
                
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: [0, 1, 1, 0.2], x: 0 }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    style={{ 
                      fontFamily: 'JetBrains Mono, monospace', 
                      fontSize: '11px', 
                      color: i === 7 ? '#dc2626' : 'rgba(255,255,255,0.4)',
                      marginBottom: '8px',
                      textShadow: i === 7 ? '0 0 10px rgba(220,38,38,0.5)' : 'none'
                    }}
                  >
                    <span style={{ color: '#dc2626', marginRight: '10px' }}>▶</span>
                    {`[SYSTEM_LOG] >> ${[
                      'Initializing autonomous architecture mapping...',
                      'Parsing repository directory structure...',
                      'Detecting Next.js fingerprints & signatures...',
                      'Mapping middleware and routing patterns...',
                      'Analyzing dependency graph (package.json)...',
                      'Identifying database drivers & ORM patterns...',
                      'Verifying authentication & security headers...',
                      'Architecture mapping complete. Ready for review.'
                    ][i % 8]}`}
                  </motion.div>
                ))}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 0%, #050505 100%)', pointerEvents: 'none', zIndex: 1 }} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Analyzing_Architecture</h2>
              <p style={{ color: 'rgba(255,255,255,0.3)' }}>Identifying frameworks, languages, and dependencies...</p>
            </motion.div>
          )}

          {step === 'stack_confirm' && (
            <motion.div 
              key="stack_confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.inputFlow}
            >
              <h1 style={{ marginBottom: '12px' }}>Confirm Tech Stack</h1>
              <p style={{ marginBottom: '40px' }}>Our agent identified these technologies. Adjust them for better scan accuracy.</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
                {detectedStack.map((tech, i) => (
                  <div key={i} style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {tech}
                    <button onClick={() => removeTech(tech)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '16px', fontWeight: 900 }}>×</button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
                <input 
                  className={styles.inputBox} 
                  style={{ flex: 1, padding: '14px 20px', fontSize: '14px' }}
                  placeholder="Add custom tech (e.g. PostgreSQL)" 
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTech()}
                />
                <button onClick={addTech} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800 }}>Add</button>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setStep('config')} className={styles.tab} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '16px', cursor: 'pointer', padding: '18px' }}>Back</button>
                <button onClick={startFinalScan} className={styles.launchBtn} style={{ flex: 2 }}>
                  Initialize Full Scan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
