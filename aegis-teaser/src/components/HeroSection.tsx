'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'
import nextDynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const ParticleField = nextDynamic(() => import('./ParticleField'), { ssr: false })

export default function HeroSection({ onComplete }: { onComplete: () => void }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showGradient, setShowGradient] = useState(false)
  const fullText = 'A new way to stay secure with Agentic AI'
  const words = fullText.split(' ')

  useEffect(() => {
    // Reveal content and trigger final gradient animation after all words finished
    const timer = setTimeout(() => {
       setIsRevealed(true)
       setShowGradient(true)
       onComplete()
    }, words.length * 300 + 1000) 
    return () => clearTimeout(timer)
  }, [onComplete, words.length])

  return (
    <section className={styles.hero}>
      <ParticleField />
      <div className={styles.containerCentered}>
        <div className={styles.contentCentered}>
          <h1 className={`${styles.headlineCentered} ${showGradient ? styles.animateGradient : ''}`}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.8, // Slightly slower for more 'float' feel
                  delay: i * 0.4,
                  ease: [0.2, 0.65, 0.3, 0.9] // Elegant floating landing
                }}
                style={{ display: 'inline-block', marginRight: '0.25em' }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <div className={`${styles.revealContent} ${isRevealed ? styles.visible : ''}`}>
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
