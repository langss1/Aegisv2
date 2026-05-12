'use client'
import { useEffect, useState, useRef } from 'react'
import styles from './phase3.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function Phase3Page() {
  const [traffic, setTraffic] = useState<{id: number, msg: string, isAttack: boolean}[]>([])
  const [automationLog, setAutomationLog] = useState<{id: number, msg: string}[]>([])
  const [notifications, setNotifications] = useState<{id: number, msg: string}[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

        const telMsg = { id: Date.now(), msg: `🚨 Attack Blocked! Attempted ${reason} on ${path}` }
        setNotifications(prev => [telMsg, ...prev.slice(0, 0)])
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== telMsg.id)), 4000)
      }

      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.content}>
      <div className={styles.monitorGrid}>
        {/* Element 1: Terminal (Live SIEM) */}
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

        {/* Element 2: Dashboard (Stats & AI) */}
        <div className={styles.dashboardArea}>
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <div className={styles.metricLabel}>Total Requests (24h)</div>
              <div className={styles.metricValue}>24,842</div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.metricLabel}>Threats Blocked</div>
              <div className={styles.metricValue} style={{ color: '#ef4444' }}>142</div>
            </div>
          </div>

          <div className={styles.aiCard}>
            <div className={styles.aiHeader}>
              <div className={styles.aiIcon}>🧠</div>
              <h3>AI reasoning & Automation</h3>
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
        </div>
      </div>

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
