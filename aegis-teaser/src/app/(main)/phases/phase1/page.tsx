'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase1.module.css'
import { motion, AnimatePresence } from 'framer-motion'

interface Finding {
  id: number
  file: string
  issue: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  line: number
  currentCode: string
  fixedCode: string
  description: string
}

interface ScanContext {
  repoUrl: string
  repoName: string
  techStack: string[]
  projectId?: string
}

interface ScanSummary {
  critical: number
  high: number
  medium: number
  low: number
}

export default function Phase1Page() {
  const [isScanning, setIsScanning] = useState(true)
  const [progress, setProgress] = useState(0)
  const [findings, setFindings] = useState<Finding[]>([])
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
  const [scanContext, setScanContext] = useState<ScanContext | null>(null)
  const [summary, setSummary] = useState<ScanSummary>({ critical: 0, high: 0, medium: 0, low: 0 })
  const [scannedFiles, setScannedFiles] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [scanLogs, setScanLogs] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load scan context from localStorage
    const contextStr = localStorage.getItem('aegis_scan_context')
    if (contextStr) {
      const context = JSON.parse(contextStr)
      setScanContext(context)
      startScan(context.repoUrl)
    } else {
      // Demo mode - use dummy data
      simulateDemoScan()
    }
  }, [])

  const startScan = async (repoUrl: string) => {
    setIsScanning(true)
    setProgress(0)
    setScanLogs([])
    
    // Simulate progress while fetching
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
      setScanLogs(prev => {
        const logs = [
          'Connecting to GitHub API...',
          'Fetching repository tree...',
          'Analyzing directory structure...',
          'Scanning source files for vulnerabilities...',
          'Checking for hardcoded secrets...',
          'Analyzing SQL query patterns...',
          'Detecting XSS vulnerabilities...',
          'Scanning for command injection risks...',
          'Analyzing authentication patterns...',
          'Generating vulnerability report...'
        ]
        if (prev.length < logs.length) {
          return [...prev, logs[prev.length]]
        }
        return prev
      })
    }, 500)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl })
      })

      const data = await response.json()
      
      clearInterval(progressInterval)
      
      if (data.error) {
        setError(data.error)
        setIsScanning(false)
        return
      }

      setFindings(data.findings || [])
      setSummary(data.summary || { critical: 0, high: 0, medium: 0, low: 0 })
      setScannedFiles(data.scannedFiles || 0)
      setProgress(100)
      
      // Store findings for Phase 2
      localStorage.setItem('aegis_scan_findings', JSON.stringify(data.findings || []))
      
      setTimeout(() => setIsScanning(false), 1000)
    } catch (err: any) {
      clearInterval(progressInterval)
      setError(err.message || 'Failed to scan repository')
      setIsScanning(false)
    }
  }

  const simulateDemoScan = () => {
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
              line: 12,
              description: 'API keys should be stored in environment variables, not in source code.'
            },
            { 
              id: 2, 
              file: 'db.py', 
              issue: 'SQL Injection Risk', 
              severity: 'Critical',
              currentCode: `cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")`,
              fixedCode: `cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))`,
              line: 45,
              description: 'Dynamic SQL queries can allow attackers to inject malicious SQL.'
            },
            { 
              id: 3, 
              file: 'utils.js', 
              issue: 'Eval Usage', 
              severity: 'High',
              currentCode: `const result = eval(userInput)`,
              fixedCode: `const result = JSON.parse(userInput)`,
              line: 23,
              description: 'eval() executes arbitrary code and is a security risk.'
            }
          ])
          setSummary({ critical: 2, high: 1, medium: 0, low: 0 })
          setScannedFiles(15)
          return 100
        }
        return prev + 2
      })
    }, 50)
    return () => clearInterval(interval)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#dc2626'
      case 'High': return '#f97316'
      case 'Medium': return '#eab308'
      case 'Low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const handleApplyPatch = (finding: Finding) => {
    setFindings(prev => prev.map(f => 
      f.id === finding.id ? { ...f, patched: true } as any : f
    ))
  }

  const handlePatchAllAndContinue = async () => {
    // Store patched findings
    const patchedFindings = findings.map(f => ({ ...f, patched: true }))
    localStorage.setItem('aegis_scan_findings', JSON.stringify(patchedFindings))
    
    // Send Telegram notification for Phase 1 completion
    try {
      await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'phase1_complete',
          projectName: scanContext?.repoName || 'Unknown Project',
          findings: findings.length,
          summary
        })
      })
    } catch (e) {
      console.log('Telegram notification skipped')
    }
    
    router.push('/phases/phase2')
  }

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
                {scanLogs.slice(-6).map((log, i) => (
                  <motion.div 
                    key={i}
                    className={styles.codeLine}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span style={{ color: '#dc2626', marginRight: '10px' }}>▶</span>
                    {log}
                  </motion.div>
                ))}
                {scanLogs.length === 0 && [...Array(6)].map((_, i) => (
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

            <h1 className={styles.scanTitle}>
              {scanContext ? `Scanning ${scanContext.repoName}` : 'Analyzing Code Patterns'}
            </h1>
            <div className={styles.progressBarLarge}>
              <motion.div 
                className={styles.progressFillLarge} 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.scanStats}>
              <span>{Math.round(progress)}% COMPLETE</span>
              <span>ENGINE: AEGIS_NEURAL_V2</span>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.errorView}
            style={{ textAlign: 'center', padding: '60px' }}
          >
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
            <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Scan Failed</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>{error}</p>
            <button 
              onClick={() => router.push('/phases/phase0')} 
              style={{ 
                background: 'rgba(220, 38, 38, 0.2)', 
                border: '1px solid #dc2626',
                color: '#fff',
                padding: '12px 32px',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
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
              
              {/* Summary Stats */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '8px', 
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{summary.critical}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6 }}>CRITICAL</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316' }}>{summary.high}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6 }}>HIGH</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eab308' }}>{summary.medium}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6 }}>MEDIUM</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{summary.low}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6 }}>LOW</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', opacity: 0.5, marginBottom: '12px', textAlign: 'center' }}>
                Scanned {scannedFiles} files
              </div>

              <div className={styles.findingList}>
                {findings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', opacity: 0.5 }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                    <p>No vulnerabilities found!</p>
                  </div>
                ) : (
                  findings.map(f => (
                    <div 
                      key={f.id} 
                      className={`${styles.findingItem} ${selectedFinding?.id === f.id ? styles.selected : ''}`}
                      onClick={() => setSelectedFinding(f)}
                    >
                      <div className={styles.findingMeta}>
                        <span 
                          className={styles.sevBadge}
                          style={{ 
                            background: `${getSeverityColor(f.severity)}20`,
                            color: getSeverityColor(f.severity),
                            border: `1px solid ${getSeverityColor(f.severity)}40`
                          }}
                        >
                          {f.severity}
                        </span>
                        <span className={styles.fName}>{f.file}</span>
                      </div>
                      <p className={styles.fIssue}>{f.issue}</p>
                    </div>
                  ))
                )}
              </div>
              
              <button onClick={handlePatchAllAndContinue} className={styles.nextPhaseBtn}>
                {findings.length > 0 ? 'Patch All & Continue' : 'Continue to Phase 2'}
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

                  <div style={{ 
                    background: 'rgba(220, 38, 38, 0.1)', 
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ 
                        background: getSeverityColor(selectedFinding.severity),
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {selectedFinding.severity}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>{selectedFinding.issue}</span>
                    </div>
                    <p style={{ opacity: 0.7, fontSize: '14px', margin: 0 }}>
                      {selectedFinding.description}
                    </p>
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
                          {`// ... existing code\n${selectedFinding.currentCode}\n// ... existing code`}
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
                          {`// ... existing code\n${selectedFinding.fixedCode}\n// ... existing code`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.patchFooter}>
                    <button className={styles.rejectBtn}>Discard</button>
                    <button 
                      className={styles.applyBtn}
                      onClick={() => handleApplyPatch(selectedFinding)}
                    >
                      Apply Patch
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.emptyResults}>
                  <div className={styles.emptyIcon}>🛡️</div>
                  <h2>Security Analysis Complete</h2>
                  <p>
                    {findings.length > 0 
                      ? `Found ${findings.length} security issues. Select an issue to review AI-generated patches.`
                      : 'No vulnerabilities found in initial sweep. Your code is secure!'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
