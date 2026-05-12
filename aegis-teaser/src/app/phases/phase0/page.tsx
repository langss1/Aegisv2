'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase0.module.css'

export default function Phase0Page() {
  const [sourceType, setSourceType] = useState<'github' | 'zip'>('github')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate ingestion process
    setTimeout(() => {
      router.push('/phases/review-project')
    }, 2500)
  }

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div className={styles.badge}>Phase 0</div>
        <h1 className={styles.title}>Project Setup & Ingestion</h1>
        <p className={styles.subtitle}>Import your source code for automated security analysis and self-healing.</p>
      </header>

      <div className={styles.card}>
        <div className={styles.tabs}>
          <button 
            className={sourceType === 'github' ? styles.tabActive : styles.tab}
            onClick={() => setSourceType('github')}
          >
            GitHub Repository
          </button>
          <button 
            className={sourceType === 'zip' ? styles.tabActive : styles.tab}
            onClick={() => setSourceType('zip')}
          >
            Upload ZIP / Local
          </button>
        </div>

        <form onSubmit={handleAnalyze} className={styles.form}>
          {sourceType === 'github' ? (
            <div className={styles.inputGroup}>
              <label>Repository URL</label>
              <input 
                type="text" 
                placeholder="https://github.com/username/repo" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <span className={styles.hint}>Public or private repositories are supported via OAuth.</span>
            </div>
          ) : (
            <div className={styles.uploadArea}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21H19.439a2 2 0 001.94-1.515L22 17" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Drag and drop your project folder or ZIP file here</p>
              <button type="button" className={styles.browseBtn}>Browse Files</button>
            </div>
          )}

          <div className={styles.options}>
            <div className={styles.option}>
              <input type="checkbox" id="deep-scan" defaultChecked />
              <label htmlFor="deep-scan">Deep dependency analysis (SCA)</label>
            </div>
            <div className={styles.option}>
              <input type="checkbox" id="auto-heal" defaultChecked />
              <label htmlFor="auto-heal">Enable AI Self-Healing suggestions</label>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <div className={styles.spinner} />
                Ingesting Project...
              </>
            ) : (
              'Start Analysis'
            )}
          </button>
        </form>
      </div>

      <div className={styles.info}>
        <h3>Supported Languages</h3>
        <div className={styles.langGrid}>
          {['Javascript', 'Typescript', 'Python', 'Java', 'Go', 'PHP', 'Rust', 'Ruby'].map(l => (
            <span key={l} className={styles.langTag}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
