'use client'
import { useEffect, useState } from 'react'
import styles from './phase3.module.css'

export default function Phase3Page() {
  const [traffic, setTraffic] = useState<{id: number, path: string, status: string, ip: string}[]>([])
  const [alerts, setAlerts] = useState<{id: number, type: string, action: string}[]>([])

  useEffect(() => {
    const paths = ['/api/login', '/dashboard', '/api/users', '/search', '/profile', '/settings']
    const interval = setInterval(() => {
      const newReq = {
        id: Date.now(),
        path: paths[Math.floor(Math.random() * paths.length)],
        status: Math.random() > 0.9 ? '403 Blocked' : '200 OK',
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x.x`
      }
      setTraffic(prev => [newReq, ...prev.slice(0, 7)])

      if (newReq.status.includes('Blocked')) {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'Suspicious Payload Detected',
          action: 'Automatic IP Throttling Applied'
        }, ...prev.slice(0, 3)])
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div className={styles.badge}>Phase 3</div>
        <h1 className={styles.title}>Real-time Monitoring & Self-Healing</h1>
        <p className={styles.subtitle}>Autonomous defense system monitoring traffic and applying instant patches to emerging threats.</p>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h3>Live Traffic Stream</h3>
            <span className={styles.liveBadge}>LIVE</span>
          </div>
          <div className={styles.trafficTable}>
            <div className={styles.tHead}>
              <span>Path</span>
              <span>Status</span>
              <span>Source IP</span>
            </div>
            {traffic.map(t => (
              <div key={t.id} className={styles.tRow} data-status={t.status}>
                <span className={styles.tPath}>{t.path}</span>
                <span className={styles.tStatus}>{t.status}</span>
                <span className={styles.tIp}>{t.ip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.alertCard}>
            <h3>Autonomous Alerts</h3>
            <div className={styles.alertList}>
              {alerts.length === 0 ? (
                <div className={styles.emptyAlerts}>Waiting for security events...</div>
              ) : (
                alerts.map(a => (
                  <div key={a.id} className={styles.alertItem}>
                    <div className={styles.alertType}>{a.type}</div>
                    <div className={styles.alertAction}>{a.action}</div>
                    <button className={styles.reverseBtn}>Reverse Action</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.healthCard}>
            <h3>App Health</h3>
            <div className={styles.healthBar}>
              <div className={styles.healthFill} />
            </div>
            <div className={styles.healthStatus}>99.9% Secure Availability</div>
          </div>
        </div>
      </div>
    </div>
  )
}
