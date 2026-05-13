'use client'
import styles from './WhyAegisSection.module.css'
import { motion } from 'framer-motion'

import { ShieldAlert, Terminal, Landmark, Scale } from 'lucide-react'

const CARDS = [
  {
    title: 'Biggest Problem: Indonesia #1',
    desc: 'BSSN 2024 reports Indonesia as the top target for cyber anomalies in SE Asia. Our infrastructure remains highly vulnerable to sophisticated threats.',
    date: 'Jan 20, 2025',
    category: 'Market Risk',
    Icon: ShieldAlert
  },
  {
    title: 'Developer Neglect & Vibe Coding',
    desc: 'Speed over security: Developers often ignore code safety for faster delivery, leaving fatal gaps that autonomous agents must heal immediately.',
    date: 'Dec 15, 2024',
    category: 'Internal Gap',
    Icon: Terminal
  },
  {
    title: 'Billions in Financial Loss',
    desc: 'A single data breach in Indonesia now costs billions in recovery fees and irreversible loss of public trust. Security is no longer optional.',
    date: 'Nov 22, 2024',
    category: 'Financial Impact',
    Icon: Landmark
  },
  {
    title: 'Strict UU PDP Enforcement',
    desc: 'The grace period for UU PDP 2024 has ended. Data leaks are now criminal offenses with heavy fines up to 2% of global annual revenue.',
    date: 'Oct 17, 2024',
    category: 'Compliance',
    Icon: Scale
  }
]

export default function WhyAegisSection() {
  return (
    <section id="why" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>The Security Crisis</h2>
          <button className={styles.viewBlog}>View Analysis</button>
        </div>

        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <motion.div 
              key={i} 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.cardVisual}>
                 <div className={styles.dotsOverlay} />
                 <div className={styles.iconWrapper}>
                   <card.Icon size={40} strokeWidth={1.5} color="#ff0000" />
                 </div>
                 <div className={styles.cardTag}>{card.category}</div>
              </div>
              <div className={styles.cardContent}>
                 <h3 className={styles.cardTitle}>{card.title}</h3>
                 <p className={styles.cardDesc}>{card.desc}</p>
                 <div className={styles.cardMeta}>
                    <span>{card.date}</span>
                    <span className={styles.separator}>•</span>
                    <span>{card.category}</span>
                 </div>
                 <button className={styles.readMore}>Read analysis <span>→</span></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
