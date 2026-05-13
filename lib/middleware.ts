import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // ============================================
  // 1. CEK SESSION (BELUM LOGIN)
  // ============================================
  
  // Halaman yang membutuhkan login
  const protectedRoutes = ['/dashboard', '/profil', '/jual-sampah', '/riwayat', '/tukar-poin', '/user', '/agent', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Halaman auth (login/register) - redirect ke dashboard jika sudah login
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (session && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Jika tidak ada session, lanjutkan
  if (!session) {
    return res
  }

  // ============================================
  // 2. AMBIL ROLE USER DARI DATABASE
  // ============================================
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const role = userData?.role || 'user'

  // ============================================
  // 3. ROLE-BASED REDIRECT
  // ============================================
  
  // 3a. USER (masyarakat) - tidak bisa akses /admin/* dan /agent/*
  if (role === 'user') {
    if (pathname.startsWith('/admin') || pathname.startsWith('/agent')) {
      const redirectUrl = new URL('/user/home', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 3b. AGENT - tidak bisa akses /admin/*
  if (role === 'agent') {
    if (pathname.startsWith('/admin')) {
      const redirectUrl = new URL('/agent/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    // ============================================
    // 4. CEK SUBSCRIPTION AGENT (KECUALI DI HALAMAN SUBSCRIPTION)
    // ============================================
    const isSubscriptionPage = pathname.startsWith('/agent/subscription')
    const isSubscriptionCompletePage = pathname.startsWith('/agent/subscription/complete')
    
    if (!isSubscriptionPage && !isSubscriptionCompletePage) {
      // Ambil agent_id
      const { data: agentData } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
      
      if (agentData) {
        // Cek status subscription
        const { data: statusData } = await supabase
          .rpc('check_agent_subscription_status', { p_agent_id: agentData.id })
        
        const isActive = statusData?.is_active === true
        
        // Jika subscription tidak aktif, redirect ke halaman subscription
        if (!isActive) {
          const redirectUrl = new URL('/agent/subscription', req.url)
          return NextResponse.redirect(redirectUrl)
        }
      }
    }
  }

  // 3c. ADMIN - bisa akses semua (tidak perlu redirect)

  // ============================================
  // 5. DEFAULT REDIRECT BERDASARKAN ROLE (Untuk root /dashboard)
  // ============================================
  
  if (pathname === '/dashboard') {
    if (role === 'admin') {
      const redirectUrl = new URL('/admin/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    } else if (role === 'agent') {
      const redirectUrl = new URL('/agent/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    } else {
      const redirectUrl = new URL('/user/home', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)'],
}