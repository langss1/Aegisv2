'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase1.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function Phase1Page() {
  const [isScanning, setIsScanning] = useState(true)
  const [progress, setProgress] = useState(0)
  const [findings, setFindings] = useState<any[]>([])
  const [selectedFinding, setSelectedFinding] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsScanning(false)
            setFindings([
              { 
                id: 1, 
                file: 'auth.py', 
                issue: 'Hardcoded API Key', 
                severity: 'Critical',
                currentCode: `AWS_SECRET = "AKIAIOSFODNN7EXAMPLE"`,
                fixedCode: `AWS_SECRET = os.environ.get("AWS_SECRET_KEY")`,
                line: 12
              },
              { 
                id: 2, 
                file: 'db.py', 
                issue: 'SQL Injection Vulnerability', 
                severity: 'Critical',
                currentCode: `cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")`,
                fixedCode: `cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))`,
                line: 45
              }
            ])
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isScanning])

  return (
    <div className={styles.content}>
      <AnimatePresence mode="wait">
        {isScanning ? (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className={styles.scanningView}
          >
            <div className={styles.analysisVisual}>
              <div className={styles.codeStream}>
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className={styles.codeLine}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {`0x${Math.random().toString(16).slice(2, 10).toUpperCase()} >> ANALYZING_BLOCK_${i}...`}
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className={styles.magnifier}
                animate={{ 
                  x: [-50, 50, -50],
                  y: [-20, 20, -20]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🔍
              </motion.div>
            </div>

            <h1 className={styles.scanTitle}>Analyzing Code Patterns</h1>
            <div className={styles.progressBarLarge}>
              <motion.div 
                className={styles.progressFillLarge} 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.scanStats}>
              <span>{progress}% SECURED</span>
              <span>ENGINE: AEGIS_NEURAL_V2</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.resultsGrid}
          >
            <div className={styles.findingsSidebar}>
              <div className={styles.sidebarHeader}>
                <h3>Vulnerabilities</h3>
                <span className={styles.badgeCount}>{findings.length}</span>
              </div>
              <div className={styles.findingList}>
                {findings.map(f => (
                  <div 
                    key={f.id} 
                    className={`${styles.findingItem} ${selectedFinding?.id === f.id ? styles.selected : ''}`}
                    onClick={() => setSelectedFinding(f)}
                  >
                    <div className={styles.findingMeta}>
                      <span className={styles.sevBadge}>{f.severity}</span>
                      <span className={styles.fName}>{f.file}</span>
                    </div>
                    <p className={styles.fIssue}>{f.issue}</p>
                  </div>
                ))}
              </div>
              
              <button onClick={() => router.push('/phases/phase2')} className={styles.nextPhaseBtn}>
                Patch All & Continue
              </button>
            </div>

            <div className={styles.remediationMain}>
              {selectedFinding ? (
                <div className={styles.patchView}>
                  <div className={styles.patchHeader}>
                    <div className={styles.patchTitle}>
                      <h2>Remediation Patch</h2>
                      <p>Contextual fix for security issue in <code>{selectedFinding.file}</code></p>
                    </div>
                    <div className={styles.aiBadge}>AI HEALING ACTIVE</div>
                  </div>

                  <div className={styles.editorContainer}>
                    <div className={styles.editorPane}>
                      <div className={styles.paneHeader}>CURRENT_VERSION (VULNERABLE)</div>
                      <div className={`${styles.codeArea} ${styles.vulnerable}`}>
                        <div className={styles.lineNumbers}>
                          {selectedFinding.line - 1}<br />
                          {selectedFinding.line}<br />
                          {selectedFinding.line + 1}
                        </div>
                        <div className={styles.codeContent}>
                          {`# ... existing code\n${selectedFinding.currentCode}\n# ... existing code`}
                        </div>
                      </div>
                    </div>
                    <div className={styles.editorPane}>
                      <div className={styles.paneHeader}>AEGIS_PATCH (SECURED - EDITABLE)</div>
                      <div className={`${styles.codeArea} ${styles.fixed}`}>
                        <div className={styles.lineNumbers}>
                          {selectedFinding.line - 1}<br />
                          {selectedFinding.line}<br />
                          {selectedFinding.line + 1}
                        </div>
                        <div 
                          className={styles.codeContent} 
                          contentEditable 
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const updated = e.currentTarget.innerText;
                            setFindings(prev => prev.map(f => f.id === selectedFinding.id ? {...f, fixedCode: updated} : f))
                          }}
                        >
                          {`# ... existing code\n${selectedFinding.fixedCode}\n# ... existing code`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.patchFooter}>
                    <button className={styles.rejectBtn}>Discard</button>
                    <button className={styles.applyBtn}>Apply Patch</button>
                  </div>
                </div>
              ) : (
                <div className={styles.emptyResults}>
                  <div className={styles.emptyIcon}>🛡️</div>
                  <h2>Security Analysis Complete</h2>
                  <p>No critical zero-days found in initial sweep. Select an issue to review suggested AI patches.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
