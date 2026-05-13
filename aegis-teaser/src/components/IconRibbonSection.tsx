'use client'
import styles from './IconRibbonSection.module.css'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Shield, Search, Sparkles, Lock, Terminal, Code, 
  Cpu, Activity, Globe, Zap, Fingerprint, Bug,
  ShieldCheck, Database, Server, Radio
} from 'lucide-react'
import { useRef } from 'react'

const ICON_COMPONENTS = [
  Shield, Search, Sparkles, Lock, Terminal, Code, 
  Cpu, Activity, Globe, Zap, Fingerprint, Bug,
  ShieldCheck, Database, Server, Radio,
  Shield, Search, Sparkles, Lock, Terminal, Code // Duplicates for width
]

export default function IconRibbonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Horizontal movement
  const xTranslate = useTransform(scrollYProgress, [0, 1], [0, -1200])

  const fullText = "Aegis is the autonomous security agent platform, designed to analyze, defend, and heal your infrastructure in the agent-first era. We empower developers with advanced AI agents that identify vulnerabilities, mitigate risks, and ensure a robust security posture across your entire tech stack."

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.scrollWrapper}>
        <motion.div 
          className={styles.ribbonRow}
          style={{ x: xTranslate }}
        >
          {ICON_COMPONENTS.map((Icon, i) => {
            // Wave movement (sine) based on index and scroll
            const yOffset = Math.sin(i * 0.8) * 40
            
            return (
              <div 
                key={i} 
                className={styles.iconCircle}
                style={{ transform: `translateY(${yOffset}px)` }}
              >
                <Icon size={24} strokeWidth={1.5} color="rgba(255,255,255,0.8)" />
              </div>
            )
          })}
        </motion.div>
      </div>

      <div className={styles.textContainer}>
        <motion.p 
          className={styles.paragraphText}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {fullText}
        </motion.p>
      </div>
    </section>
  )
}
