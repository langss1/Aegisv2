'use client'
export const dynamic = 'force-dynamic'
import nextDynamic from 'next/dynamic'
import styles from './page.module.css'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import DemoSection from '@/components/DemoSection'
import WhyAegisSection from '@/components/WhyAegisSection'
import ForWhoSection from '@/components/ForWhoSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import TeamSection from '@/components/TeamSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import IconRibbonSection from '@/components/IconRibbonSection'

import { useState, useEffect } from 'react'
const ParticleField = nextDynamic(() => import('@/components/ParticleField'), { ssr: false })

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className={styles.main}>
      <div 
        className="custom-cursor-glow" 
        style={{ left: mousePos.x, top: mousePos.y }} 
      />

      <ParticleField />
      <div className={styles.gridBg} />
      <Navbar />
      <HeroSection onComplete={() => setIsRevealed(true)} />
      
      {isRevealed && (
        <div className={styles.revealContainer}>
          <DemoSection />
          <IconRibbonSection />
          <WhyAegisSection />
          <ForWhoSection />
          <TestimonialsSection />
          <TeamSection />
          <CTASection />
          <Footer />
        </div>
      )}
    </main>
  )
}
