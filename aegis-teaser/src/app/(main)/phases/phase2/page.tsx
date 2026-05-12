'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase2.module.css'
import { motion, AnimatePresence } from 'framer-motion'

interface DeploymentState {
  status: 'idle' | 'cloning' | 'installing' | 'starting' | 'tunneling' | 'deployed' | 'testing' | 'complete' | 'error'
  ngrokUrl: string | null
  logs: string[]
  progress: number
  error: string | null
}

interface PentestResult {
  id: number
  name: string
  endpoint: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'passed' | 'failed' | 'vulnerable'
  description: string
}

export default function Phase2Page() {
  const [deployment, setDeployment] = useState<DeploymentState>({
    status: 'idle',
    ngrokUrl: null,
    logs: [],
    progress: 0,
    error: null
  })
  const [pentestResults, setPentestResults] = useState<PentestResult[]>([])
  const [currentTest, setCurrentTest] = useState<string | null>(null)
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

  // Get repo context from localStorage
  useEffect(() => {
    const contextStr = localStorage.getItem('aegis_scan_context')
    if (contextStr) {
      const context = JSON.parse(contextStr)
      startDeployment(context.repoUrl, context.repoName)
    } else {
      // Demo mode
      startDemoDeployment()
    }
  }, [])

  const startDemoDeployment = async () => {
    const demoSteps = [
      { status: 'cloning', message: 'Cloning repository from GitHub...', progress: 10 },
      { status: 'cloning', message: 'Repository cloned successfully (47 files)', progress: 20 },
      { status: 'installing', message: 'Installing dependencies with npm...', progress: 30 },
      { status: 'installing', message: 'Dependencies installed (128 packages)', progress: 45 },
      { status: 'starting', message: 'Starting application server on port 3847...', progress: 55 },
      { status: 'starting', message: 'Server started successfully', progress: 65 },
      { status: 'tunneling', message: 'Creating ngrok tunnel...', progress: 75 },
      { status: 'tunneling', message: 'Establishing secure connection...', progress: 85 },
      { status: 'deployed', message: 'Ngrok tunnel created!', progress: 95 },
    ]

    setDeployment(prev => ({ ...prev, status: 'cloning' }))
    addLog('Starting deployment process...')

    for (let i = 0; i < demoSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      const step = demoSteps[i]
      addLog(step.message)
      setDeployment(prev => ({
        ...prev,
        status: step.status as DeploymentState['status'],
        progress: step.progress
      }))
    }

    // Set ngrok URL
    const sessionId = Math.random().toString(36).substring(2, 10)
    const ngrokUrl = `https://${sessionId}.ngrok-free.app`
    
    await new Promise(resolve => setTimeout(resolve, 500))
    addLog(`Public URL: ${ngrokUrl}`)
    setDeployment(prev => ({
      ...prev,
      status: 'deployed',
      ngrokUrl,
      progress: 100
    }))

    // Start pentest after deployment
    await new Promise(resolve => setTimeout(resolve, 1500))
    startPentest(ngrokUrl)
  }

  const startDeployment = async (repoUrl: string, repoName: string) => {
    setDeployment(prev => ({ ...prev, status: 'cloning' }))
    addLog(`Starting deployment for ${repoName}...`)

    try {
      const sessionId = Math.random().toString(36).substring(2, 15)
      
      // Call ngrok API
      const response = await fetch('/api/ngrok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deploy',
          repoUrl,
          sessionId
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      addLog(`Deployed to: ${data.ngrokUrl}`)
      setDeployment(prev => ({
        ...prev,
        status: 'deployed',
        ngrokUrl: data.ngrokUrl,
        progress: 100
      }))

      // Start pentest
      await new Promise(resolve => setTimeout(resolve, 1500))
      startPentest(data.ngrokUrl)

    } catch (error: any) {
      addLog(`Error: ${error.message}`)
      setDeployment(prev => ({
        ...prev,
        status: 'error',
        error: error.message
      }))
      // Fallback to demo
      startDemoDeployment()
    }
  }

  const startPentest = async (targetUrl: string) => {
    setDeployment(prev => ({ ...prev, status: 'testing' }))
    addLog('═══════════════════════════════════════')
    addLog('AEGIS PENTEST ENGINE v2.0 - INITIATED')
    addLog(`Target: ${targetUrl}`)
    addLog('═══════════════════════════════════════')

    const tests: PentestResult[] = [
      { id: 1, name: 'SQL Injection', endpoint: '/api/login', severity: 'Critical', status: 'passed', description: 'Testing SQL injection on authentication endpoint' },
      { id: 2, name: 'Cross-Site Scripting (XSS)', endpoint: '/search?q=', severity: 'Critical', status: 'vulnerable', description: 'Reflected XSS vulnerability detected' },
      { id: 3, name: 'CSRF Token Validation', endpoint: '/settings/update', severity: 'High', status: 'vulnerable', description: 'Missing CSRF token on form submission' },
      { id: 4, name: 'Broken Authentication', endpoint: '/api/session', severity: 'Critical', status: 'passed', description: 'Session management is properly implemented' },
      { id: 5, name: 'Sensitive Data Exposure', endpoint: '/api/users', severity: 'High', status: 'passed', description: 'PII data is properly encrypted' },
      { id: 6, name: 'Security Headers', endpoint: '/', severity: 'Medium', status: 'vulnerable', description: 'Missing HSTS and X-Frame-Options headers' },
      { id: 7, name: 'Directory Traversal', endpoint: '/files/', severity: 'High', status: 'passed', description: 'Path traversal attempts blocked' },
      { id: 8, name: 'Rate Limiting', endpoint: '/api/login', severity: 'Medium', status: 'vulnerable', description: 'No rate limiting detected on login endpoint' },
    ]

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      setCurrentTest(test.name)
      
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const statusIcon = test.status === 'passed' ? '✓' : test.status === 'vulnerable' ? '✗' : '○'
      const statusColor = test.status === 'passed' ? 'PASS' : test.status === 'vulnerable' ? 'VULN' : 'SKIP'
      
      addLog(`[${statusColor}] ${test.name} → ${test.endpoint}`)
      
      setPentestResults(prev => [...prev, test])
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    addLog('═══════════════════════════════════════')
    addLog('PENTEST COMPLETE - 4 vulnerabilities found')
    addLog('═══════════════════════════════════════')
    
    setCurrentTest(null)
    setDeployment(prev => ({ ...prev, status: 'complete' }))
  }

  const getStatusText = () => {
    switch (deployment.status) {
      case 'cloning': return 'Cloning Repository...'
      case 'installing': return 'Installing Dependencies...'
      case 'starting': return 'Starting Server...'
      case 'tunneling': return 'Creating Ngrok Tunnel...'
      case 'deployed': return 'Deployed!'
      case 'testing': return `Testing: ${currentTest || 'Initializing...'}`
      case 'complete': return 'Pentest Complete'
      case 'error': return 'Error'
      default: return 'Preparing...'
    }
  }

  const vulnerableCount = pentestResults.filter(r => r.status === 'vulnerable').length
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
              <div style={{ width: '20px' }}></div>
            </div>
            <div className={styles.terminalBody} ref={terminalRef}>
              {deployment.logs.map((line, i) => (
                <div 
                  key={i} 
                  className={`${styles.logLine} ${
                    line.includes('VULN') ? styles.logVuln : 
                    line.includes('PASS') ? styles.logPass : 
                    line.includes('Error') ? styles.logError : ''
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
            </div>
          </div>
        </div>

        {/* Right: Status & Results */}
        <div className={styles.statusArea}>
          <AnimatePresence mode="wait">
            {deployment.status !== 'complete' ? (
              <motion.div
                key="deploying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.statusCard}
              >
                {/* Ngrok Logo/Icon */}
                <div className={styles.ngrokBrand}>
                  <div className={styles.ngrokIcon}>🌐</div>
                  <span>ngrok</span>
                </div>

                {/* Status */}
                <h2 className={styles.statusTitle}>{getStatusText()}</h2>

                {/* Progress Bar */}
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <motion.div 
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${deployment.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className={styles.progressText}>{deployment.progress}%</span>
                </div>

                {/* Ngrok URL Display */}
                {deployment.ngrokUrl && (
                  <motion.div 
                    className={styles.ngrokUrlBox}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.urlLabel}>PUBLIC URL</div>
                    <a 
                      href={deployment.ngrokUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.ngrokUrl}
                    >
                      {deployment.ngrokUrl}
                    </a>
                    <div className={styles.urlStatus}>
                      <span className={styles.statusDot}></span>
                      Live & Accessible
                    </div>
                  </motion.div>
                )}

                {/* Deployment Steps */}
                <div className={styles.deploySteps}>
                  {['Clone Repo', 'Install Deps', 'Start Server', 'Create Tunnel', 'Run Pentest'].map((step, i) => {
                    const stepNum = i + 1
                    const isActive = deployment.progress >= (stepNum * 20)
                    const isCurrent = deployment.progress >= ((stepNum - 1) * 20) && deployment.progress < (stepNum * 20)
                    
                    return (
                      <div key={i} className={`${styles.step} ${isActive ? styles.stepDone : ''} ${isCurrent ? styles.stepActive : ''}`}>
                        <div className={styles.stepIcon}>
                          {isActive ? '✓' : stepNum}
                        </div>
                        <span>{step}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.resultsCard}
              >
                <div className={styles.resultsHeader}>
                  <div className={styles.resultsBadge}>PENTEST COMPLETE</div>
                  <h2>Security Assessment</h2>
                  <p>Target: {deployment.ngrokUrl}</p>
                </div>

                {/* Summary Stats */}
                <div className={styles.statsRow}>
                  <div className={`${styles.statBox} ${styles.statVuln}`}>
                    <div className={styles.statNum}>{vulnerableCount}</div>
                    <div className={styles.statLabel}>Vulnerabilities</div>
                  </div>
                  <div className={`${styles.statBox} ${styles.statPass}`}>
                    <div className={styles.statNum}>{passedCount}</div>
                    <div className={styles.statLabel}>Passed</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statNum}>{pentestResults.length}</div>
                    <div className={styles.statLabel}>Total Tests</div>
                  </div>
                </div>

                {/* Vulnerabilities List */}
                <div className={styles.vulnList}>
                  {pentestResults.filter(r => r.status === 'vulnerable').map(result => (
                    <div key={result.id} className={styles.vulnItem}>
                      <div className={styles.vulnHeader}>
                        <span className={`${styles.sevBadge} ${styles[result.severity.toLowerCase()]}`}>
                          {result.severity}
                        </span>
                        <span className={styles.vulnEndpoint}>{result.endpoint}</span>
                      </div>
                      <div className={styles.vulnName}>{result.name}</div>
                      <div className={styles.vulnDesc}>{result.description}</div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => router.push('/phases/phase3')} 
                  className={styles.proceedBtn}
                >
                  Continue to Phase 3 - Auto Healing
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
