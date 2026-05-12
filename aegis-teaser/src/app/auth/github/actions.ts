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
