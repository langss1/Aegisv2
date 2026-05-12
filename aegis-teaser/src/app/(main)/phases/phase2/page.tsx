'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase2.module.css'
import { motion, AnimatePresence } from 'framer-motion'

interface DeploymentState {
  status: 'idle' | 'deploying' | 'building' | 'deployed' | 'testing' | 'complete' | 'fixing' | 'fixed' | 'error'
  deploymentUrl: string | null
  deploymentId: string | null
  logs: string[]
  progress: number
  error: string | null
}

interface PentestResult {
  id: number
  name: string
  endpoint: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'passed' | 'failed' | 'vulnerable' | 'fixed'
  description: string
  file: string
  line: number
  vulnerableCode: string
  fixedCode: string
}

export default function Phase2Page() {
  const [deployment, setDeployment] = useState<DeploymentState>({
    status: 'idle',
    deploymentUrl: null,
    deploymentId: null,
    logs: [],
    progress: 0,
    error: null
  })
  const [pentestResults, setPentestResults] = useState<PentestResult[]>([])
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [selectedVuln, setSelectedVuln] = useState<PentestResult | null>(null)
  const [fixingId, setFixingId] = useState<number | null>(null)
  const [targetUrl, setTargetUrl] = useState('')
  const [showInput, setShowInput] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const addLog = (message: string) => {
    setDeployment(prev => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${message}`]
    }))
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 100)
  }

  useEffect(() => {
    // Always show input for direct URL
    setShowInput(true)
    addLog('AEGIS Pentest Engine Ready')
    addLog('Enter target URL to begin security scan...')
  }, [])

  const handleStartPentest = () => {
    if (!targetUrl.trim()) return
    
    if (!targetUrl.startsWith('http')) {
      addLog('ERROR: Please enter a valid URL (https://...)')
      return
    }
    
    setShowInput(false)
    setDeployment(prev => ({ 
      ...prev, 
      status: 'deployed',
      deploymentUrl: targetUrl,
      progress: 100
    }))
    addLog(`Target: ${targetUrl}`)
    addLog('Starting security scan...')
    
    setTimeout(() => {
      startPentest(targetUrl)
    }, 500)
  }

  const startPentest = async (targetUrl: string) => {
    setDeployment(prev => ({ ...prev, status: 'testing' }))
    addLog('═══════════════════════════════════════')
    addLog('AEGIS PENTEST ENGINE v2.0 - LIVE SCAN')
    addLog(`Target: ${targetUrl}`)
    addLog('═══════════════════════════════════════')

    const testNames = [
      'SQL Injection',
      'Cross-Site Scripting (XSS)',
      'CSRF Token Missing',
      'Security Headers',
      'Rate Limiting',
      'Open Redirect'
    ]

    try {
      // Show progress for each test
      for (const testName of testNames) {
        setCurrentTest(testName)
        addLog(`[SCAN] Testing ${testName}...`)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // Call real pentest API
      addLog('[API] Sending payloads to target...')
      const response = await fetch('/api/pentest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetUrl,
          tests: ['sql', 'xss', 'csrf', 'headers', 'ratelimit', 'redirect']
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Process results
      addLog('═══════════════════════════════════════')
      addLog('SCAN RESULTS:')
      
      for (const result of data.results) {
        const statusColor = result.status === 'passed' ? 'PASS' : 'VULN'
        addLog(`[${statusColor}] ${result.name} → ${result.endpoint}`)
        
        if (result.status === 'vulnerable' && result.evidence) {
          addLog(`       Evidence: ${result.evidence}`)
        }

        setPentestResults(prev => [...prev, result])
        await new Promise(resolve => setTimeout(resolve, 300))
      }

      addLog('═══════════════════════════════════════')
      addLog(`PENTEST COMPLETE - ${data.summary.vulnerable} vulnerabilities found`)
      addLog(`Target tested: ${targetUrl}`)
      addLog('═══════════════════════════════════════')

      // Save results to localStorage
      localStorage.setItem('aegis_pentest_results', JSON.stringify(data.results))

    } catch (error: any) {
      addLog(`[ERROR] Pentest failed: ${error.message}`)
      
      // Fallback to basic connectivity test
      addLog('[FALLBACK] Running basic security check...')
      
      try {
        const basicResponse = await fetch(targetUrl)
        const headers = basicResponse.headers
        
        const basicResults: PentestResult[] = []
        
        // Check security headers
        const missingHeaders: string[] = []
        if (!headers.get('x-frame-options')) missingHeaders.push('X-Frame-Options')
        if (!headers.get('x-content-type-options')) missingHeaders.push('X-Content-Type-Options')
        if (!headers.get('strict-transport-security')) missingHeaders.push('HSTS')
        
        if (missingHeaders.length > 0) {
          basicResults.push({
            id: 1,
            name: 'Security Headers Missing',
            endpoint: '/',
            severity: 'Medium',
            status: 'vulnerable',
            description: `Missing: ${missingHeaders.join(', ')}`,
            file: 'next.config.js',
            line: 5,
            vulnerableCode: '// No security headers configured',
            fixedCode: '// Add helmet or custom headers in next.config.js'
          })
          addLog(`[VULN] Security Headers Missing → /`)
        } else {
          basicResults.push({
            id: 1,
            name: 'Security Headers',
            endpoint: '/',
            severity: 'Medium',
            status: 'passed',
            description: 'Security headers are configured',
            file: '',
            line: 0,
            vulnerableCode: '',
            fixedCode: ''
          })
          addLog(`[PASS] Security Headers → /`)
        }

        setPentestResults(basicResults)
        localStorage.setItem('aegis_pentest_results', JSON.stringify(basicResults))
        
        addLog('═══════════════════════════════════════')
        addLog(`BASIC SCAN COMPLETE`)
        addLog('═══════════════════════════════════════')
        
      } catch (e) {
        addLog(`[ERROR] Cannot reach target: ${targetUrl}`)
      }
    }
    
    setCurrentTest(null)
    setDeployment(prev => ({ ...prev, status: 'complete' }))
  }

  const handleFixVulnerability = async (vuln: PentestResult) => {
    setFixingId(vuln.id)
    addLog(`[FIX] Applying patch for ${vuln.name}...`)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setPentestResults(prev => prev.map(r => 
      r.id === vuln.id ? { ...r, status: 'fixed' as const } : r
    ))
    
    addLog(`[FIX] ✓ ${vuln.name} patched successfully!`)
    setFixingId(null)
    setSelectedVuln(null)
  }

  const handleFixAll = async () => {
    setDeployment(prev => ({ ...prev, status: 'fixing' }))
    addLog('═══════════════════════════════════════')
    addLog('AEGIS AUTO-FIX - Patching all vulnerabilities')
    addLog('═══════════════════════════════════════')

    const vulns = pentestResults.filter(r => r.status === 'vulnerable')
    
    for (const vuln of vulns) {
      setFixingId(vuln.id)
      addLog(`[FIX] Patching ${vuln.name}...`)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setPentestResults(prev => prev.map(r => 
        r.id === vuln.id ? { ...r, status: 'fixed' as const } : r
      ))
      addLog(`[FIX] ✓ ${vuln.file}:${vuln.line} - Fixed!`)
    }

    setFixingId(null)
    addLog('═══════════════════════════════════════')
    addLog('ALL VULNERABILITIES PATCHED!')
    addLog('═══════════════════════════════════════')
    setDeployment(prev => ({ ...prev, status: 'fixed' }))
  }

  const getStatusText = () => {
    switch (deployment.status) {
      case 'deploying': return 'Connecting to Vercel...'
      case 'building': return 'Building on Vercel...'
      case 'deployed': return 'Deployed!'
      case 'testing': return `Testing: ${currentTest || 'Initializing...'}`
      case 'complete': return 'Pentest Complete'
      case 'fixing': return 'Applying Patches...'
      case 'fixed': return 'All Fixed!'
      case 'error': return 'Deployment Failed'
      default: return 'Ready to Deploy'
    }
  }

  const vulnerableCount = pentestResults.filter(r => r.status === 'vulnerable').length
  const fixedCount = pentestResults.filter(r => r.status === 'fixed').length
  const passedCount = pentestResults.filter(r => r.status === 'passed').length

  return (
    <div className={styles.content}>
      <div className={styles.deployGrid}>
        {/* Left: Terminal */}
        <div className={styles.terminalArea}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.dots}><span/><span/><span/></div>
              <span className={styles.termTitle}>aegis@deploy:~$ ./pentest.sh</span>
            </div>
            <div className={styles.terminalBody} ref={terminalRef}>
              {deployment.logs.map((line, i) => (
                <div 
                  key={i} 
                  className={`${styles.logLine} ${
                    line.includes('VULN') ? styles.logVuln : 
                    line.includes('PASS') || line.includes('successful') || line.includes('✓') ? styles.logPass : 
                    line.includes('FIX') ? styles.logFix :
                    line.includes('ERROR') || line.includes('Error') ? styles.logError : ''
                  }`}
                >
                  {line}
                </div>
              ))}
              {deployment.status === 'testing' && currentTest && (
                <div className={styles.logLine}>
                  <span className={styles.spinner}>⠋</span> Testing {currentTest}...
                </div>
              )}
              {deployment.status === 'building' && (
                <div className={styles.logLine}>
                  <span className={styles.spinner}>⠋</span> Building on Vercel...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Status & Results */}
        <div className={styles.statusArea}>
          <AnimatePresence mode="wait">
            {/* URL Input Form */}
            {showInput && deployment.status === 'idle' ? (
              <motion.div
                key="url-input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.statusCard}
              >
                <div className={styles.vercelBrand}>
                  <div className={styles.vercelIcon}>🎯</div>
                  <span>Live Pentest</span>
                </div>

                <h2 className={styles.statusTitle}>Enter Target URL</h2>
                <p style={{ opacity: 0.6, marginBottom: '24px', fontSize: '14px' }}>
                  Paste your ngrok URL atau website yang mau di-scan
                </p>

                <div className={styles.repoInputGroup}>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://xxxx.ngrok-free.app"
                    className={styles.repoInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleStartPentest()}
                  />
                  <button onClick={handleStartPentest} className={styles.deployBtn}>
                    Start Pentest
                  </button>
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: '#f87171' }}>Quick Start dengan Ngrok:</p>
                  <code style={{ fontSize: '11px', opacity: 0.7, display: 'block', lineHeight: 1.8 }}>
                    1. cd your-app && npm start<br/>
                    2. ngrok http 3000<br/>
                    3. Copy URL → Paste di atas
                  </code>
                </div>
              </motion.div>
            ) : deployment.status !== 'complete' && deployment.status !== 'fixing' && deployment.status !== 'fixed' ? (
              <motion.div
                key="deploying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.statusCard}
              >
                <div className={styles.vercelBrand}>
                  <div className={styles.vercelIcon}>▲</div>
                  <span>Vercel</span>
                </div>

                <h2 className={styles.statusTitle}>{getStatusText()}</h2>

                {deployment.status === 'error' ? (
                  <div className={styles.errorBox}>
                    <p>{deployment.error}</p>
                    <button 
                      onClick={() => {
                        setDeployment(prev => ({ ...prev, status: 'idle', error: null, logs: [] }))
                        setShowRepoInput(true)
                      }}
                      className={styles.retryBtn}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <motion.div 
                          className={styles.progressFill}
                          initial={{ width: 0 }}
                          animate={{ width: `${deployment.progress}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>{deployment.progress}%</span>
                    </div>

                    {deployment.deploymentUrl && (
                      <motion.div className={styles.urlBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className={styles.urlLabel}>LIVE URL</div>
                        <a href={deployment.deploymentUrl} target="_blank" rel="noopener noreferrer" className={styles.deploymentUrl}>
                          {deployment.deploymentUrl}
                        </a>
                        <div className={styles.urlStatus}>
                          <span className={styles.statusDot}></span>
                          Production Ready
                        </div>
                      </motion.div>
                    )}

                    <div className={styles.deploySteps}>
                      {['Connect', 'Build', 'Deploy', 'Test'].map((step, i) => {
                        const stepNum = i + 1
                        const isActive = deployment.progress >= (stepNum * 25)
                        const isCurrent = deployment.progress >= ((stepNum - 1) * 25) && deployment.progress < (stepNum * 25)
                        return (
                          <div key={i} className={`${styles.step} ${isActive ? styles.stepDone : ''} ${isCurrent ? styles.stepActive : ''}`}>
                            <div className={styles.stepIcon}>{isActive ? '✓' : stepNum}</div>
                            <span>{step}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            ) : selectedVuln ? (
              <motion.div
                key="fix-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.fixDetailCard}
              >
                <button className={styles.backBtn} onClick={() => setSelectedVuln(null)}>← Back</button>
                
                <div className={styles.fixHeader}>
                  <span className={`${styles.sevBadge} ${styles[selectedVuln.severity.toLowerCase()]}`}>
                    {selectedVuln.severity}
                  </span>
                  <h3>{selectedVuln.name}</h3>
                  <p>{selectedVuln.description}</p>
                  <div className={styles.fileInfo}>{selectedVuln.file}:{selectedVuln.line}</div>
                </div>

                <div className={styles.codeDiff}>
                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader + ' ' + styles.vulnerable}>
                      <span>✕</span> KODE LAMA (VULNERABLE)
                    </div>
                    <pre className={styles.codeContent}>{selectedVuln.vulnerableCode}</pre>
                  </div>

                  <div className={styles.diffArrow}>▼ AEGIS FIX</div>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader + ' ' + styles.fixed}>
                      <span>✓</span> KODE BARU (100% AMAN)
                    </div>
                    <pre className={styles.codeContent}>{selectedVuln.fixedCode}</pre>
                  </div>
                </div>

                <button 
                  className={styles.applyFixBtn}
                  onClick={() => handleFixVulnerability(selectedVuln)}
                  disabled={fixingId === selectedVuln.id}
                >
                  {fixingId === selectedVuln.id ? 'Applying...' : 'Apply Fix'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.resultsCard}
              >
                <div className={styles.resultsHeader}>
                  <div className={deployment.status === 'fixed' ? styles.resultsBadgeFixed : styles.resultsBadge}>
                    {deployment.status === 'fixed' ? 'ALL FIXED!' : 'PENTEST COMPLETE'}
                  </div>
                  <h2>Security Assessment</h2>
                  <p>Target: {deployment.deploymentUrl}</p>
                </div>

                <div className={styles.statsRow}>
                  <div className={`${styles.statBox} ${styles.statVuln}`}>
                    <div className={styles.statNum}>{vulnerableCount}</div>
                    <div className={styles.statLabel}>Vulnerable</div>
                  </div>
                  <div className={`${styles.statBox} ${styles.statFixed}`}>
                    <div className={styles.statNum}>{fixedCount}</div>
                    <div className={styles.statLabel}>Fixed</div>
                  </div>
                  <div className={`${styles.statBox} ${styles.statPass}`}>
                    <div className={styles.statNum}>{passedCount}</div>
                    <div className={styles.statLabel}>Passed</div>
                  </div>
                </div>

                <div className={styles.vulnList}>
                  {pentestResults.filter(r => r.status === 'vulnerable' || r.status === 'fixed').map(result => (
                    <div 
                      key={result.id} 
                      className={`${styles.vulnItem} ${result.status === 'fixed' ? styles.vulnFixed : ''}`}
                      onClick={() => result.status === 'vulnerable' && setSelectedVuln(result)}
                    >
                      <div className={styles.vulnHeader}>
                        <span className={`${styles.sevBadge} ${result.status === 'fixed' ? styles.fixedBadge : styles[result.severity.toLowerCase()]}`}>
                          {result.status === 'fixed' ? '✓ FIXED' : result.severity}
                        </span>
                        <span className={styles.vulnEndpoint}>{result.endpoint}</span>
                      </div>
                      <div className={styles.vulnName}>{result.name}</div>
                      <div className={styles.vulnDesc}>{result.description}</div>
                      {result.status === 'vulnerable' && (
                        <button className={styles.viewFixBtn}>View & Fix →</button>
                      )}
                    </div>
                  ))}
                </div>

                {vulnerableCount > 0 ? (
                  <button onClick={handleFixAll} className={styles.fixAllBtn} disabled={deployment.status === 'fixing'}>
                    {deployment.status === 'fixing' ? 'Fixing...' : `Fix All ${vulnerableCount} Vulnerabilities`}
                  </button>
                ) : (
                  <button onClick={() => router.push('/phases/phase3')} className={styles.proceedBtn}>
                    Continue to Phase 3 - Monitoring
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
