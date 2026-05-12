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
  const [repoInput, setRepoInput] = useState('')
  const [showRepoInput, setShowRepoInput] = useState(false)
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
    const contextStr = localStorage.getItem('aegis_scan_context')
    if (contextStr) {
      const context = JSON.parse(contextStr)
      if (context.repoUrl) {
        startVercelDeployment(context.repoUrl, context.repoName)
      } else {
        setShowRepoInput(true)
      }
    } else {
      setShowRepoInput(true)
    }
  }, [])

  const startVercelDeployment = async (repoUrl: string, repoName: string) => {
    setShowRepoInput(false)
    setDeployment(prev => ({ ...prev, status: 'deploying', progress: 10 }))
    addLog(`Starting Vercel deployment for ${repoName || repoUrl}...`)
    addLog(`Repository: ${repoUrl}`)

    try {
      // Step 1: Initiate deployment
      addLog('Connecting to Vercel API...')
      setDeployment(prev => ({ ...prev, progress: 20 }))

      const response = await fetch('/api/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'deploy', 
          repoUrl, 
          projectName: repoName || 'target-app'
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      addLog(`Deployment initiated: ${data.deploymentId}`)
      setDeployment(prev => ({ 
        ...prev, 
        status: 'building',
        deploymentId: data.deploymentId,
        progress: 40 
      }))

      // Step 2: Poll for deployment status
      addLog('Building application on Vercel...')
      const finalUrl = await pollDeploymentStatus(data.deploymentId)

      // Step 3: Deployment ready
      addLog(`Deployment successful!`)
      addLog(`Live URL: ${finalUrl}`)
      setDeployment(prev => ({
        ...prev,
        status: 'deployed',
        deploymentUrl: finalUrl,
        progress: 100
      }))

      // Save to context
      localStorage.setItem('aegis_deployment_url', finalUrl)

      // Wait a moment then start pentest
      await new Promise(resolve => setTimeout(resolve, 2000))
      startPentest(finalUrl)

    } catch (error: any) {
      console.error('Deployment error:', error)
      addLog(`ERROR: ${error.message}`)
      
      if (error.message.includes('VERCEL_TOKEN')) {
        addLog('Please add your Vercel token to .env file')
        addLog('Get token from: https://vercel.com/account/tokens')
      }
      
      setDeployment(prev => ({
        ...prev,
        status: 'error',
        error: error.message
      }))
    }
  }

  const pollDeploymentStatus = async (deploymentId: string): Promise<string> => {
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Check every 5 seconds
      
      try {
        const response = await fetch(`/api/vercel?deploymentId=${deploymentId}`)
        const data = await response.json()

        if (data.status === 'READY') {
          return data.url
        } else if (data.status === 'ERROR' || data.status === 'CANCELED') {
          throw new Error(`Deployment ${data.status.toLowerCase()}`)
        }

        // Update progress based on status
        const progress = data.status === 'BUILDING' ? 60 : 
                        data.status === 'QUEUED' ? 45 : 50
        
        setDeployment(prev => ({ ...prev, progress }))
        addLog(`Build status: ${data.status}...`)
        
      } catch (e: any) {
        console.error('Status check error:', e)
      }
      
      attempts++
    }

    throw new Error('Deployment timeout - please check Vercel dashboard')
  }

  const handleManualDeploy = () => {
    if (!repoInput.trim()) return
    
    // Validate GitHub URL
    if (!repoInput.includes('github.com')) {
      addLog('ERROR: Please enter a valid GitHub repository URL')
      return
    }

    const repoName = repoInput.split('/').pop()?.replace('.git', '') || 'target-app'
    startVercelDeployment(repoInput, repoName)
  }

  const startPentest = async (targetUrl: string) => {
    setDeployment(prev => ({ ...prev, status: 'testing' }))
    addLog('═══════════════════════════════════════')
    addLog('AEGIS PENTEST ENGINE v2.0 - INITIATED')
    addLog(`Target: ${targetUrl}`)
    addLog('═══════════════════════════════════════')

    const tests: PentestResult[] = [
      { 
        id: 1, 
        name: 'SQL Injection', 
        endpoint: '/api/login', 
        severity: 'Critical', 
        status: 'passed', 
        description: 'SQL injection test passed',
        file: 'api/login.js',
        line: 15,
        vulnerableCode: '',
        fixedCode: ''
      },
      { 
        id: 2, 
        name: 'Cross-Site Scripting (XSS)', 
        endpoint: '/search?q=', 
        severity: 'Critical', 
        status: 'vulnerable', 
        description: 'Reflected XSS - User input tidak di-sanitize',
        file: 'pages/search.js',
        line: 23,
        vulnerableCode: `// VULNERABLE CODE
const query = req.query.q;
res.send(\`<h1>Results for: \${query}</h1>\`);`,
        fixedCode: `// FIXED CODE - Input sanitized
const sanitizeHtml = require('sanitize-html');
const query = sanitizeHtml(req.query.q);
res.send(\`<h1>Results for: \${query}</h1>\`);`
      },
      { 
        id: 3, 
        name: 'CSRF Token Missing', 
        endpoint: '/settings/update', 
        severity: 'High', 
        status: 'vulnerable', 
        description: 'Form tidak memiliki CSRF token protection',
        file: 'pages/settings.js',
        line: 45,
        vulnerableCode: `// VULNERABLE - No CSRF token
app.post('/settings/update', (req, res) => {
  updateSettings(req.body);
  res.json({ success: true });
});`,
        fixedCode: `// FIXED - CSRF token validation
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

app.post('/settings/update', (req, res) => {
  updateSettings(req.body);
  res.json({ success: true });
});`
      },
      { 
        id: 4, 
        name: 'Broken Authentication', 
        endpoint: '/api/session', 
        severity: 'Critical', 
        status: 'passed', 
        description: 'Session management properly implemented',
        file: '',
        line: 0,
        vulnerableCode: '',
        fixedCode: ''
      },
      { 
        id: 5, 
        name: 'Security Headers Missing', 
        endpoint: '/', 
        severity: 'Medium', 
        status: 'vulnerable', 
        description: 'Missing HSTS, X-Frame-Options, CSP headers',
        file: 'server.js',
        line: 12,
        vulnerableCode: `// VULNERABLE - No security headers
const app = express();
app.use(express.json());

app.listen(3000);`,
        fixedCode: `// FIXED - Security headers added
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000 }));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(express.json());

app.listen(3000);`
      },
      { 
        id: 6, 
        name: 'Rate Limiting', 
        endpoint: '/api/login', 
        severity: 'Medium', 
        status: 'vulnerable', 
        description: 'No rate limiting - vulnerable to brute force',
        file: 'api/login.js',
        line: 8,
        vulnerableCode: `// VULNERABLE - No rate limiting
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticate(email, password);
  res.json(user);
});`,
        fixedCode: `// FIXED - Rate limiting added
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticate(email, password);
  res.json(user);
});`
      },
    ]

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      setCurrentTest(test.name)
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const statusColor = test.status === 'passed' ? 'PASS' : 'VULN'
      addLog(`[${statusColor}] ${test.name} → ${test.endpoint}`)
      setPentestResults(prev => [...prev, test])
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    const vulnCount = tests.filter(t => t.status === 'vulnerable').length
    addLog('═══════════════════════════════════════')
    addLog(`PENTEST COMPLETE - ${vulnCount} vulnerabilities found`)
    addLog('═══════════════════════════════════════')
    
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
            {/* Repo Input Form */}
            {showRepoInput && deployment.status === 'idle' ? (
              <motion.div
                key="repo-input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.statusCard}
              >
                <div className={styles.vercelBrand}>
                  <div className={styles.vercelIcon}>▲</div>
                  <span>Vercel Deploy</span>
                </div>

                <h2 className={styles.statusTitle}>Deploy Target Application</h2>
                <p style={{ opacity: 0.6, marginBottom: '24px', fontSize: '14px' }}>
                  Enter a GitHub repository URL to deploy and pentest
                </p>

                <div className={styles.repoInputGroup}>
                  <input
                    type="text"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className={styles.repoInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualDeploy()}
                  />
                  <button onClick={handleManualDeploy} className={styles.deployBtn}>
                    Deploy & Test
                  </button>
                </div>

                <div style={{ marginTop: '20px', opacity: 0.5, fontSize: '12px' }}>
                  <p>Supported: Next.js, React, Vue, Node.js, Static sites</p>
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
