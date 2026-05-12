'use client'
import styles from './reports.module.css'

export default function ReportsPage() {
  const reports = [
    { id: 'R-2026-001', project: 'aegis-core-backend', date: '2026-05-12', type: 'Full Security Audit', status: 'Completed' },
    { id: 'R-2026-002', project: 'payment-gateway-api', date: '2026-05-11', type: 'SAST & Patch Review', status: 'Draft' },
    { id: 'R-2026-003', project: 'user-auth-service', date: '2026-05-10', type: 'DAST Pentest Results', status: 'Completed' },
  ]

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <h1 className={styles.title}>Security Reports</h1>
        <p className={styles.subtitle}>Access and export comprehensive security analysis reports for all your projects.</p>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.table}>
          <div className={styles.tHead}>
            <span>Report ID</span>
            <span>Project</span>
            <span>Date</span>
            <span>Type</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {reports.map(r => (
            <div key={r.id} className={styles.tRow}>
              <span className={styles.rId}>{r.id}</span>
              <span className={styles.rProject}>{r.project}</span>
              <span className={styles.rDate}>{r.date}</span>
              <span className={styles.rType}>{r.type}</span>
              <span className={styles.rStatus} data-status={r.status}>{r.status}</span>
              <button className={styles.downloadBtn}>PDF</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
