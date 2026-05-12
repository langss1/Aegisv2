'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './DemoSection.module.css'

export default function DemoSection() {
  const [playing, setPlaying] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(0.8)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how much of the section is visible
      const visiblePct = Math.min(Math.max((windowHeight - rect.top) / (windowHeight * 0.8), 0), 1)
      
      // Scale from 0.8 to 1.0
      setScale(0.8 + (visiblePct * 0.2))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} id="demo" className={styles.section}>
      <div 
        className={styles.videoWrapper} 
        style={{ 
            transform: `scale(${scale})`,
            opacity: Math.min(scale * 1.5 - 0.5, 1)
        }}
      >
        {!playing ? (
          <div className={styles.thumbnail}>
             <div className={styles.overlay}>
                <div className={styles.brand}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(255,0,0,0.4)"/>
                        <path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1" strokeOpacity="0.6"/>
                    </svg>
                    <span className={styles.brandName}>Aegis Agentic</span>
                </div>
                <button className={styles.playIntro} onClick={() => setPlaying(true)}>
                    <span>▶</span> Play intro
                </button>
             </div>
             <div className={styles.dotsBg} />
          </div>
        ) : (
          <iframe
            className={styles.iframe}
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Aegis Intro"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>
    </section>
  )
}
