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
    // 1. Cari package.json secara rekursif (jika di dalam subfolder)
    const searchRes = await fetch(`https://api.github.com/search/code?q=filename:package.json+repo:${repoFullName}`, {
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    let packageContent = null
    if (searchRes.ok) {
      const searchData = await searchRes.json()
      if (searchData.items && searchData.items.length > 0) {
        // Ambil yang paling utama atau yang pertama ditemukan
        const fileUrl = searchData.items[0].url
        const fileRes = await fetch(fileUrl, {
          headers: { 'Authorization': `Bearer ${session.provider_token}` }
        })
        if (fileRes.ok) {
          const fileData = await fileRes.json()
          packageContent = JSON.parse(atob(fileData.content))
        }
      }
    }

    // Jika tetap tidak ketemu package.json, coba cek bahasa utama repo
    if (!packageContent) {
      const repoRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
        headers: { 'Authorization': `Bearer ${session.provider_token}` }
      })
      const repoData = await repoRes.json()
      return { stack: [repoData.language || 'Custom Architecture'], note: 'No package.json found' }
    }

    const allDeps = { ...packageContent.dependencies, ...packageContent.devDependencies }

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
    if (allDeps['vite']) detected.push('Vite')

    return { 
      stack: detected.length > 0 ? detected : [packageContent.name || 'Node.js Project'],
      path: 'detected'
    }
  } catch (err) {
    console.error('Analysis error:', err)
    return { stack: ['Unknown Stack'], error: 'Analysis failed' }
  }
}
