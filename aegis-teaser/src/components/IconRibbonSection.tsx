'use client'
import { useEffect, useState, useRef } from 'react'
import styles from './IconRibbonSection.module.css'
import { motion } from 'framer-motion'

const ICONS = [
  '🛡️', '💻', '🔍', '✨', '🔒', '📦', '🚀', '🛠️', '🧬', '🧠', '📡', '⚡'
]

export default function IconRibbonSection() {
  const [text, setText] = useState('')
  const fullText = "Aegis is the autonomous security agent platform, designed to analyze, defend, and heal your infrastructure in the agent-first era."
  const [isTyping, setIsTyping] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsTyping(true)
      }
    }, { threshold: 0.5 })
    
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isTyping) return
    let i = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [isTyping])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.ribbon}>
        {ICONS.map((icon, i) => (
          <motion.div
            key={i}
            className={styles.iconCircle}
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      <div className={styles.textContainer}>
        <h2 className={styles.typingText}>
          {text}<span className={styles.cursor}>|</span>
        </h2>
      </div>
    </section>
  )
}
