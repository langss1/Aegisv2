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
    const headers = {
      'Authorization': `Bearer ${session.provider_token}`,
      'Accept': 'application/vnd.github.v3+json'
    }

    // 1. Ambil Statistik Bahasa (Sangat Detail)
    const langRes = await fetch(`https://api.github.com/repos/${repoFullName}/languages`, { headers })
    const languages = langRes.ok ? await langRes.json() : {}
    const topLanguages = Object.keys(languages).slice(0, 3)

    // 2. Cari manifest files (package.json, Dockerfile, v3nd.json, dll)
    const searchRes = await fetch(`https://api.github.com/search/code?q=filename:package.json+OR+filename:Dockerfile+OR+filename:docker-compose.yml+OR+filename:vercel.json+repo:${repoFullName}`, { headers })
    
    let packageContent: any = null
    const infraDetails = []
    
    if (searchRes.ok) {
      const searchData = await searchRes.json()
      for (const item of (searchData.items || [])) {
        if (item.name === 'Dockerfile') infraDetails.push('Docker Container')
        if (item.name === 'docker-compose.yml') infraDetails.push('Docker Orchestration')
        if (item.name === 'vercel.json') infraDetails.push('Vercel Infrastructure')
        
        if (item.name === 'package.json' && !packageContent) {
          const fileRes = await fetch(item.url, { headers })
          if (fileRes.ok) {
            const fileData = await fileRes.json()
            packageContent = JSON.parse(atob(fileData.content))
          }
        }
      }
    }

    const detected = [...topLanguages, ...infraDetails]
    
    if (packageContent) {
      const allDeps = { ...packageContent.dependencies, ...packageContent.devDependencies }
      
      // Frameworks
      if (allDeps['next']) detected.push('Next.js Framework')
      if (allDeps['express']) detected.push('Express.js Server')
      if (allDeps['@nestjs/core']) detected.push('NestJS Architecture')
      
      // Database & ORM
      if (allDeps['prisma']) detected.push('Prisma (PostgreSQL/MySQL)')
      if (allDeps['mongoose']) detected.push('MongoDB (NoSQL)')
      if (allDeps['drizzle-orm']) detected.push('Drizzle (SQL)')
      if (allDeps['pg']) detected.push('PostgreSQL Native')
      if (allDeps['redis']) detected.push('Redis Cache')
      
      // Auth & Cloud
      if (allDeps['@supabase/supabase-js']) detected.push('Supabase Cloud')
      if (allDeps['firebase']) detected.push('Firebase Infrastructure')
      if (allDeps['next-auth'] || allDeps['@auth/core']) detected.push('Auth.js Security')
      
      // UI & Logic
      if (allDeps['tailwindcss']) detected.push('Tailwind CSS')
      if (allDeps['framer-motion']) detected.push('Framer Animations')
    }

    // Jika kosong, pakai bahasa utama
    const finalStack = detected.length > 0 ? Array.from(new Set(detected)) : ['Custom Stack']

    return { 
      stack: finalStack,
      details: {
        languages,
        mainLang: topLanguages[0]
      }
    }
  } catch (err) {
    console.error('Analysis error:', err)
    return { stack: ['Analysis Failed'], error: 'Deep analysis failed' }
  }
}
