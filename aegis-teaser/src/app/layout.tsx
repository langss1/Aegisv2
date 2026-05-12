import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AEGIS — A New Era of Secure Development',
  description: 'AEGIS is the autonomous AI-powered security platform that protects your code from vulnerabilities before they become breaches. Built for developers, trusted by teams.',
  keywords: ['security', 'SAST', 'DAST', 'AI security', 'developer security', 'code analysis', 'cybersecurity', 'Indonesia'],
  openGraph: {
    title: 'AEGIS — A New Era of Secure Development',
    description: 'Autonomous AI security agent for the modern developer.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
