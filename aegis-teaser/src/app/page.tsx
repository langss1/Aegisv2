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
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

import { useState, useEffect } from 'react'
const ParticleField = nextDynamic(() => import('@/components/ParticleField'), { ssr: false })

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <main className={styles.main}>
      <ParticleField />
      <div className={styles.gridBg} />
      <Navbar />
      <HeroSection onComplete={() => setIsRevealed(true)} />
      
      {isRevealed && (
        <div className={styles.revealContainer}>
          <DemoSection />
          <WhyAegisSection />
          <ForWhoSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </div>
      )}
    </main>
  )
}
