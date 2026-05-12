'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase3.module.css'
import { motion, AnimatePresence } from 'framer-motion'

interface ScanContext {
  repoUrl: string
  repoName: string
  techStack: string[]
  projectId?: string
}

export default function Phase3Page() {
  const [traffic, setTraffic] = useState<{id: number, msg: string, isAttack: boolean}[]>([])
  const [automationLog, setAutomationLog] = useState<{id: number, msg: string}[]>([])
  const [notifications, setNotifications] = useState<{id: number, msg: string}[]>([])
  const [scanContext, setScanContext] = useState<ScanContext | null>(null)
  const [phase1Findings, setPhase1Findings] = useState<any[]>([])
  const [pentestResults, setPentestResults] = useState<any[]>([])
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | 'waiting'>('waiting')
  const [sessionId, setSessionId] = useState<string>('')
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load context and results
    const contextStr = localStorage.getItem('aegis_scan_context')
    const findingsStr = localStorage.getItem('aegis_scan_findings')
    const pentestStr = localStorage.getItem('aegis_pentest_results')
    const storedSessionId = localStorage.getItem('aegis_session_id')
    
    if (contextStr) setScanContext(JSON.parse(contextStr))
    if (findingsStr) setPhase1Findings(JSON.parse(findingsStr))
    if (pentestStr) setPentestResults(JSON.parse(pentestStr))
    if (storedSessionId) setSessionId(storedSessionId)

    // Start monitoring simulation
    startMonitoring()
    
    // Send Phase 3 completion notification after a delay
    setTimeout(() => {
      sendApprovalRequest()
    }, 5000)
  }, [])

  const sendApprovalRequest = async () => {
    const contextStr = localStorage.getItem('aegis_scan_context')
    const findingsStr = localStorage.getItem('aegis_scan_findings')
    const pentestStr = localStorage.getItem('aegis_pentest_results')
    const storedSessionId = localStorage.getItem('aegis_session_id') || `session_${Date.now()}`
    
    const context = contextStr ? JSON.parse(contextStr) : null
    const findings = findingsStr ? JSON.parse(findingsStr) : []
    const pentest = pentestStr ? JSON.parse(pentestStr) : []
    
    setApprovalStatus('pending')
    setShowApprovalModal(true)
    
    // Send Telegram notification with approval buttons
    try {
      await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'phase3_complete',
          projectName: context?.repoName || 'Unknown Project',
          repoUrl: context?.repoUrl,
          sessionId: storedSessionId,
          summary: {
            phase1: findings.length,
            phase2: pentest.filter((p: any) => p.status === 'vulnerable').length,
            fixed: findings.filter((f: any) => f.patched).length
          }
        })
      })
      
      // Add to automation log
      setAutomationLog(prev => [{
        id: Date.now(),
        msg: '<b>Approval Request Sent:</b> Waiting for human confirmation via Telegram...'
      }, ...prev])
      
      // Poll for approval status
      pollApprovalStatus(storedSessionId)
    } catch (e) {
      console.log('Telegram notification skipped')
      // Show local approval modal instead
    }
  }

  const pollApprovalStatus = async (sid: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/telegram/webhook?sessionId=${sid}`)
        const data = await response.json()
        
        if (data.status === 'approved') {
          setApprovalStatus('approved')
          handlePushToRepo()
          return true
        } else if (data.status === 'rejected') {
          setApprovalStatus('rejected')
          setAutomationLog(prev => [{
            id: Date.now(),
            msg: '<b>Deployment Rejected:</b> Changes will not be pushed to repository.'
          }, ...prev])
          return true
        }
        return false
      } catch (e) {
        return false
      }
    }
    
    // Poll every 3 seconds for up to 5 minutes
    let attempts = 0
    const maxAttempts = 100
    const pollInterval = setInterval(async () => {
      attempts++
      const done = await checkStatus()
      if (done || attempts >= maxAttempts) {
        clearInterval(pollInterval)
      }
    }, 3000)
  }

  const handleLocalApprove = () => {
    setApprovalStatus('approved')
    setShowApprovalModal(false)
    handlePushToRepo()
  }

  const handleLocalReject = () => {
    setApprovalStatus('rejected')
    setShowApprovalModal(false)
    setAutomationLog(prev => [{
      id: Date.now(),
      msg: '<b>Deployment Rejected:</b> Changes will not be pushed to repository.'
    }, ...prev])
  }

  const handlePushToRepo = async () => {
    setAutomationLog(prev => [{
      id: Date.now(),
      msg: '<b>Pushing Changes:</b> Committing security patches to repository...'
    }, ...prev])
    
    // Simulate push process
    await new Promise(r => setTimeout(r, 2000))
    
    setAutomationLog(prev => [{
      id: Date.now(),
      msg: '<b>Success:</b> All security patches have been pushed to the repository!'
    }, ...prev])
    
    // Send success notification
    const telMsg = { id: Date.now(), msg: '✅ Security patches pushed to repository!' }
    setNotifications(prev => [telMsg, ...prev])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== telMsg.id)), 5000)
  }

  const startMonitoring = () => {
    const paths = ['/api/v1/auth', '/dashboard/settings', '/api/v1/users/42', '/search?q=admin', '/profile/edit', '/api/v1/checkout']
    
    const interval = setInterval(() => {
      const isAttack = Math.random() > 0.85
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const path = paths[Math.floor(Math.random() * paths.length)]
      
      const logMsg = isAttack 
        ? `[ALERT] WAF_BLOCK: Malicious pattern detected on ${path}. Request rejected.`
        : `[INFO] TRAFFIC_PASS: Standard GET request to ${path} validated.`

      const newLog = { id: Date.now(), msg: logMsg, isAttack }
      
      setTraffic(prev => [...prev.slice(-49), newLog])

      if (isAttack) {
        const reason = Math.random() > 0.5 ? 'SQL_INJECTION' : 'XSS_FILTER_MATCH'
        setAutomationLog(prev => [{
          id: Date.now(),
          msg: `<b>Incident Resolved:</b> ${reason} attempt blocked on ${path}. IP has been temporary blacklisted.`
        }, ...prev.slice(0, 10)])

        const telMsg = { id: Date.now(), msg: `Attack Blocked! Attempted ${reason} on ${path}` }
        setNotifications(prev => [telMsg, ...prev.slice(0, 0)])
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== telMsg.id)), 4000)
        
        // Send real Telegram notification for attack
        fetch('/api/telegram/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'attack_blocked',
            attackType: reason,
            endpoint: path,
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          })
        }).catch(() => {})
      }

      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 1500)
    
    return () => clearInterval(interval)
  }

  const getSummaryStats = () => {
    const phase1Count = phase1Findings.length
    const phase2Count = pentestResults.filter((p: any) => p.status === 'vulnerable').length
    const fixedCount = phase1Findings.filter((f: any) => f.patched).length
    
    return { phase1Count, phase2Count, fixedCount, total: phase1Count + phase2Count }
  }

  const stats = getSummaryStats()

  return (
    <div className={styles.content}>
      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && approvalStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '500px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔔</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Security Pipeline Complete</h2>
              <p style={{ opacity: 0.6, marginBottom: '24px' }}>
                All phases completed for <strong>{scanContext?.repoName || 'your project'}</strong>
              </p>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.6 }}>Source Code Issues:</span>
                  <span style={{ fontWeight: 'bold' }}>{stats.phase1Count}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.6 }}>Pentest Findings:</span>
                  <span style={{ fontWeight: 'bold' }}>{stats.phase2Count}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.6 }}>Patches Applied:</span>
                  <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{stats.fixedCount}</span>
                </div>
              </div>
              
              <p style={{ opacity: 0.5, fontSize: '13px', marginBottom: '24px' }}>
                Waiting for Telegram approval... or approve locally below.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleLocalReject}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Reject
                </button>
                <button 
                  onClick={handleLocalApprove}
                  style={{
                    flex: 2,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Approve & Push to Repo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.monitorGrid}>
        {/* Terminal (Live SIEM) */}
        <div className={styles.terminalArea}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.dots}><span/><span/><span/></div>
              <span className={styles.termTitle}>aegis_waf@node-01:~# tail -f /var/log/siem.log</span>
              <div style={{ color: '#22c55e', fontSize: '10px', fontWeight: 900 }}>● LIVE</div>
            </div>
            <div className={styles.terminalBody} ref={terminalRef}>
              {traffic.map(t => (
                <div key={t.id} className={styles.logLine} style={{ color: t.isAttack ? '#ef4444' : 'rgba(255,255,255,0.6)' }}>
                  <span className={styles.timestamp}>[{new Date(t.id).toLocaleTimeString()}]</span> {t.msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className={styles.dashboardArea}>
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <div className={styles.metricLabel}>Total Issues Found</div>
              <div className={styles.metricValue}>{stats.total}</div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.metricLabel}>Patches Applied</div>
              <div className={styles.metricValue} style={{ color: '#22c55e' }}>{stats.fixedCount}</div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.metricLabel}>Approval Status</div>
              <div className={styles.metricValue} style={{ 
                color: approvalStatus === 'approved' ? '#22c55e' : 
                       approvalStatus === 'rejected' ? '#ef4444' : '#eab308',
                fontSize: '16px'
              }}>
                {approvalStatus === 'waiting' ? 'INITIALIZING' :
                 approvalStatus === 'pending' ? 'PENDING' :
                 approvalStatus === 'approved' ? 'APPROVED' : 'REJECTED'}
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.metricLabel}>Threats Blocked</div>
              <div className={styles.metricValue} style={{ color: '#ef4444' }}>
                {traffic.filter(t => t.isAttack).length}
              </div>
            </div>
          </div>

          <div className={styles.aiCard}>
            <div className={styles.aiHeader}>
              <div className={styles.aiIcon}>🧠</div>
              <h3>AI Automation Log</h3>
            </div>
            <div className={styles.aiReasoning}>
              {automationLog.length === 0 ? (
                <div className={styles.reasonEntry}>Monitoring active. Waiting for security events...</div>
              ) : (
                automationLog.map(log => (
                  <div key={log.id} className={styles.reasonEntry} dangerouslySetInnerHTML={{ __html: log.msg }} />
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              onClick={() => router.push('/dashboard')}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => router.push('/reports')}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>

      {/* Telegram Notifications */}
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div 
            key={n.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={styles.teleOverlay}
          >
            <div style={{ fontSize: '20px' }}>✈️</div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase' }}>Telegram Alert</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{n.msg}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
