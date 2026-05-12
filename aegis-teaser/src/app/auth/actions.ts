'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  let callback = formData.get('callback') as string
  const mode = formData.get('mode') as string

  // Auto-detect CLI mode and use hardcoded secure bridge
  if (mode === 'cli' && !callback) {
    callback = 'http://localhost:5732'
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    let url = '/login?error=' + encodeURIComponent(error.message)
    if (mode === 'cli') url += '&mode=cli'
    redirect(url)
  }

  if (callback && authData?.session?.access_token) {
    const target = new URL(callback)
    target.searchParams.set('token', authData.session.access_token)
    target.searchParams.set('email', authData.user?.email || '')
    redirect(target.toString())
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check your email to confirm your account')
}

export async function signInWithGitHub(callback?: string) {
  const supabase = await createClient()
  
  // Deteksi URL secara dinamis dari ENV atau default
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  let callbackUrl = `${siteUrl.replace(/\/$/, '')}/auth/callback`
  if (callback) callbackUrl += `?next=${encodeURIComponent(callback)}`
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: callbackUrl,
      scopes: 'repo',
    },
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
