'use client'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import DemoSection from '@/components/DemoSection'
import WhyAegisSection from '@/components/WhyAegisSection'
import ForWhoSection from '@/components/ForWhoSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

const ParticleField = dynamic(() => import('@/components/ParticleField'), { ssr: false })

export default function Home() {
  return (
    <main className={styles.main}>
      <ParticleField />
      <div className={styles.gridBg} />
      <Navbar />
      <HeroSection />
      <DemoSection />
      <WhyAegisSection />
      <ForWhoSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
