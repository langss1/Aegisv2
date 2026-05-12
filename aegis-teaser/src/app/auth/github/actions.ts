'use server'
import { createClient } from '@/utils/supabase/server'

export async function getGitHubRepos() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.provider_token) {
    return { error: 'No GitHub token found. Please sign in with GitHub again.' }
  }

  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repositories from GitHub')
    }

    const repos = await response.json()
    return { repos }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function analyzeGitHubRepo(repoFullName: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.provider_token) {
    return { stack: [], error: 'GitHub connection lost. Please re-login.' }
  }

  try {
    // 1. Ambil package.json sebagai indikator utama tech stack
    const response = await fetch(`https://api.github.com/repos/${repoFullName}/contents/package.json`, {
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      return { stack: ['Custom Architecture'], note: 'No package.json found' }
    }

    const fileData = await response.json()
    const content = JSON.parse(atob(fileData.content))
    const allDeps = { ...content.dependencies, ...content.devDependencies }

    // 2. Mapping Logic (Architecture Intelligence)
    const detected = []
    if (allDeps['next']) detected.push('Next.js')
    if (allDeps['react']) detected.push('React')
    if (allDeps['typescript']) detected.push('TypeScript')
    if (allDeps['tailwindcss']) detected.push('TailwindCSS')
    if (allDeps['prisma']) detected.push('Prisma ORM')
    if (allDeps['@supabase/supabase-js']) detected.push('Supabase')
    if (allDeps['drizzle-orm']) detected.push('Drizzle ORM')
    if (allDeps['framer-motion']) detected.push('Framer Motion')
    if (allDeps['lucide-react']) detected.push('Lucide Icons')
    if (allDeps['axios']) detected.push('Axios')
    if (allDeps['express']) detected.push('Express.js')
    if (allDeps['mongoose']) detected.push('MongoDB')
    if (allDeps['firebase']) detected.push('Firebase')
    if (allDeps['@nestjs/core']) detected.push('NestJS')

    return { 
      stack: detected.length > 0 ? detected : ['JavaScript/Node.js'],
      raw: content.name
    }
  } catch (err) {
    console.error('Analysis error:', err)
    return { stack: ['Unknown Stack'], error: 'Analysis failed' }
  }
}
