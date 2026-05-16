// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()

//   const supabase = createMiddlewareClient({
//     req,
//     res,
//   })

//   const {
//     data: { session },
//   } = await supabase.auth.getSession()

//   const pathname = req.nextUrl.pathname

//   // =========================================
//   // PUBLIC ROUTES
//   // =========================================
//   const publicRoutes = [
//     '/',
//     '/login',
//     '/register',
//     '/404',
//     '/tidakAdaAkses',
//   ]

//   const isPublicRoute = publicRoutes.includes(pathname)

//   // =========================================
//   // JIKA BELUM LOGIN
//   // =========================================
//   if (!session) {
//     // Kalau buka halaman private → redirect
//     if (!isPublicRoute) {
//       return NextResponse.redirect(new URL('/404', req.url))
//       // atau:
//       // return NextResponse.redirect(new URL('/tidakAdaAkses', req.url))
//     }

//     return res
//   }

//   // =========================================
//   // AMBIL ROLE USER
//   // =========================================
//   const { data: userData } = await supabase
//     .from('users')
//     .select('role')
//     .eq('id', session.user.id)
//     .single()

//   const role = userData?.role

//   // =========================================
//   // JIKA SUDAH LOGIN TAPI KE LOGIN/REGISTER
//   // =========================================
//   if (pathname === '/login' || pathname === '/register') {
//     if (role === 'admin') {
//       return NextResponse.redirect(new URL('/admin', req.url))
//     }

//     if (role === 'agent') {
//       return NextResponse.redirect(new URL('/agent', req.url))
//     }

//     return NextResponse.redirect(new URL('/user', req.url))
//   }

//   // =========================================
//   // ROLE ACCESS CONTROL
//   // =========================================

//   // USER
//   if (role === 'user') {
//     // user tidak boleh ke admin/agent
//     if (
//       pathname.startsWith('/admin') ||
//       pathname.startsWith('/agent')
//     ) {
//       return NextResponse.redirect(
//         new URL('/tidakAdaAkses', req.url)
//       )
//     }

//     // selain /user juga tidak boleh
//     if (
//       !pathname.startsWith('/user') &&
//       pathname !== '/'
//     ) {
//       return NextResponse.redirect(
//         new URL('/tidakAdaAkses', req.url)
//       )
//     }
//   }

//   // AGENT
//   if (role === 'agent') {
//     // agent tidak boleh ke admin/user
//     if (
//       pathname.startsWith('/admin') ||
//       pathname.startsWith('/user')
//     ) {
//       return NextResponse.redirect(
//         new URL('/tidakAdaAkses', req.url)
//       )
//     }

//     // selain /agent juga tidak boleh
//     if (
//       !pathname.startsWith('/agent') &&
//       pathname !== '/'
//     ) {
//       return NextResponse.redirect(
//         new URL('/tidakAdaAkses', req.url)
//       )
//     }
//   }

//   // ADMIN
//   if (role === 'admin') {
//     // admin cuma boleh admin
//     if (
//       pathname.startsWith('/user') ||
//       pathname.startsWith('/agent')
//     ) {
//       return NextResponse.redirect(
//         new URL('/tidakAdaAkses', req.url)
//       )
//     }
//   }

//   // =========================================
//   // ROOT REDIRECT
//   // =========================================
//   if (pathname === '/') {
//     if (role === 'admin') {
//       return NextResponse.redirect(new URL('/admin', req.url))
//     }

//     if (role === 'agent') {
//       return NextResponse.redirect(new URL('/agent', req.url))
//     }

//     return NextResponse.redirect(new URL('/user', req.url))
//   }

//   return res
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }