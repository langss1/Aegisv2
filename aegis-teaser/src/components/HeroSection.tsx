'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

export default function HeroSection({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const fullText = 'AI Security Agentic Self Healing'
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
    }, 60)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <section className={styles.hero}>
      {/* Cursor Spotlight */}
      <div 
        className={styles.spotlight} 
        style={{ 
          left: mousePos.x,
          top: mousePos.y
        }} 
      />

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
               A new way to stay secure with autonomous agents.
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
