'use client'
import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string
      constructor() {
        this.x = Math.random() * (canvas?.width || 1200)
        this.y = Math.random() * (canvas?.height || 800)
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4 - 0.1
        this.life = 0
        this.maxLife = 200 + Math.random() * 300
        this.size = Math.random() * 2 + 0.5
        const colors = ['rgba(220,38,38,', 'rgba(239,68,68,', 'rgba(244,63,94,', 'rgba(248,113,113,']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life++
      }
      draw() {
        if (!ctx) return
        const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.5
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `${this.color}${alpha})`
        ctx.fill()
      }
      isDead() { return this.life >= this.maxLife }
    }

    // Connections
    function drawConnections() {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(220, 38, 38, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (particles.length < 80) particles.push(new Particle())
      particles = particles.filter(p => !p.isDead())
      drawConnections()
      particles.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
