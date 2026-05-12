'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}

export async function createProject(formData: { name: string; language: string; repo_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        ...formData,
        user_id: user.id,
        status: 'Testing',
        score: 0
      }
    ])
    .select()

  if (error) {
    console.error('Error creating project:', error)
    throw error
  }

  revalidatePath('/projects')
  revalidatePath('/dashboard')
  return data[0]
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    throw error
  }

  revalidatePath('/projects')
  revalidatePath('/dashboard')
}

export async function getDashboardStats() {
  const supabase = await createClient()
  
  // Ambil total project
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  // Ambil rata-rata score
  const { data: scoreData } = await supabase
    .from('projects')
    .select('score')

  const avgScore = scoreData && scoreData.length > 0
    ? Math.round(scoreData.reduce((acc, curr) => acc + curr.score, 0) / scoreData.length)
    : 0

  // Ambil total vulnerabilities (dummy sum from status for now)
  const { count: vulnerableCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Vulnerable')

  return {
    projectCount: projectCount || 0,
    avgScore: avgScore,
    vulnerableCount: vulnerableCount || 0
  }
}

export async function getRecentRuns() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('security_runs')
    .select('*, projects(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent runs:', error)
    return []
  }
  return data
}
