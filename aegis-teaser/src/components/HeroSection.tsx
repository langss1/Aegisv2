'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

export default function HeroSection({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const fullText = 'A NEW WAY TO STAY SECURE WITH AGENTIC AI'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsDone(true)
          onComplete()
        }, 800)
      }
    }, 50)
    return () => clearInterval(interval)
  }, []) // Empty dependency array ensures it only runs once

  return (
    <section className={styles.hero}>
      <div className={styles.containerCentered}>
        <div className={styles.contentCentered}>
          <div className={styles.badgeCentered}>
             Introducing Aegis V2
          </div>
          
          <h1 className={styles.headlineCentered}>
            {text}<span className={styles.cursor}>|</span>
          </h1>

          <div className={`${styles.revealContent} ${isDone ? styles.visible : ''}`}>
            <p className={styles.subtextCentered}>
               Empowering developers with autonomous security agents.
            </p>

            <div className={styles.actionsCentered}>
              <Link href="/login" className="btn-primary-large">
                 Login to Dashboard
              </Link>
              <button 
                className="btn-outline-large" 
                onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})}
              >
                Explore by Terminal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
