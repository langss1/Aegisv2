'use client'
import styles from './IconRibbonSection.module.css'
import { motion } from 'framer-motion'

const ICONS = [
  '🛡️', '💻', '🔍', '✨', '🔒', '📦', '🚀', '🛠️', '🧬', '🧠', '📡', '⚡'
]

export default function IconRibbonSection() {
  const fullText = "Aegis is the autonomous security agent platform, designed to analyze, defend, and heal your infrastructure in the agent-first era."

  return (
    <section className={styles.section}>
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
          {fullText}
        </h2>
      </div>
    </section>
  )
}
