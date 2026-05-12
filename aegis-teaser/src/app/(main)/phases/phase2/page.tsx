'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase2.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function Phase2Page() {
  const [log, setLog] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const attackSteps = [
    '[INFO] Initializing AEGIS Dynamic Attack Agent...',
    '[SCAN] Discovering attack surface on target endpoint...',
    '[ATTACK] Payload Delivery: <script>alert(1)</script> to /search?q=',
    '[RESULT] XSS VULNERABILITY CONFIRMED: Payload executed in sandbox.',
    '[ATTACK] Testing SQLi: admin\' OR \'1\'=\'1\' on /api/login',
    '[RESULT] SQLi FAILED: Request blocked by SAST remediation layer.',
    '[ATTACK] CSRF Simulation on /settings/update...',
    '[RESULT] CSRF VULNERABLE: No token validation detected.',
    '[SCAN] Header analysis: Missing HSTS, X-Frame-Options headers.',
    '[INFO] Simulations complete. Finalizing pentest report...'
  ]

  useEffect(() => {
    let step = 0
    const interval = setInterval(() => {
      if (step < attackSteps.length) {
        setLog(prev => [...prev, attackSteps[step]])
        setProgress(Math.min(100, (step + 1) * (100 / attackSteps.length)))
        step++
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      } else {
        clearInterval(interval)
        setTimeout(() => setShowResults(true), 1500)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.content}>
      <div className={styles.pentestGrid}>
        {/* Element 1: Terminal */}
        <div className={styles.terminalArea}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.dots}><span/><span/><span/></div>
              <span className={styles.termTitle}>dast_agent@aegis:~# tail -f /var/log/attack.log</span>
              <div style={{ width: '20px' }}></div>
            </div>
            <div className={styles.terminalBody} ref={terminalRef}>
              {log.map((line, i) => (
                <div key={i} className={styles.logLine}>
                  <span className={styles.timestamp}>[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span> {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Element 2: Animation / Results */}
        <div className={styles.animationArea}>
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div 
                key="probing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className={styles.animationCard}
              >
                <div className={styles.combatContainer}>
                  <div className={styles.shieldArea}>
                    <div className={progress >= 100 ? styles.shieldShattered : styles.shield}>🛡️</div>
                    {progress < 100 && (
                      <>
                        <div className={styles.sword}>⚔️</div>
                        <div className={styles.impact}></div>
                      </>
                    )}
                  </div>
                  
                  <div className={styles.progressFooter}>
                    <h3>Probing Vectors</h3>
                    
                    <div className={styles.progressBarWrapper}>
                      <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span className={styles.percentageLabel}>{Math.round(progress)}%</span>
                    </div>

                    <p style={{ margin: '20px auto 0' }}>Aegis is testing SQLi, XSS, and Broken Access Control patterns autonomously.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.animationCard}
              >
                <div className={styles.resultsCard}>
                  <div className={styles.fTag}>Vulnerabilities Found</div>
                  <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '16px 0 8px' }}>Simulation Complete</h2>
                  <p style={{ opacity: 0.4, fontSize: '13px' }}>Autonomous pentest results for target application.</p>

                  <div className={styles.findingList}>
                    <div className={styles.findingItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 900, fontSize: '11px', color: '#ef4444' }}>CRITICAL</span>
                        <span style={{ fontSize: '11px', opacity: 0.4 }}>/search?q=</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>Reflected Cross-Site Scripting (XSS)</div>
                      <button className={styles.healingBtn}>Auto-Fix with AI</button>
                    </div>

                    <div className={styles.findingItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 900, fontSize: '11px', color: '#f97316' }}>MEDIUM</span>
                        <span style={{ fontSize: '11px', opacity: 0.4 }}>/settings/update</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>CSRF Token Missing</div>
                      <button className={styles.healingBtn}>Auto-Fix with AI</button>
                    </div>

                    <div className={styles.findingItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 900, fontSize: '11px', color: '#f97316' }}>MEDIUM</span>
                        <span style={{ fontSize: '11px', opacity: 0.4 }}>HTTP Headers</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>Missing HSTS Policy</div>
                      <button className={styles.healingBtn}>Auto-Fix with AI</button>
                    </div>
                  </div>

                  <button onClick={() => router.push('/phases/phase3')} className={styles.proceedBtn}>
                    Finalize Security Posture
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
