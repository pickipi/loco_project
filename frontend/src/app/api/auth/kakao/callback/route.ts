import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/login?error=no_code');
  }

  try {
    // 백엔드로 인가 코드 전달
    const backendResponse = await fetch('http://localhost:8090/api/v1/auth/kakao/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to authenticate with Kakao');
    }

    const data = await backendResponse.json();
    
    // 토큰을 쿠키에 저장하고 리다이렉트
    const redirectResponse = NextResponse.redirect('/');
    redirectResponse.cookies.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1주일
    });

    return redirectResponse;
  } catch (error) {
    console.error('Kakao authentication error:', error);
    return NextResponse.redirect('/login?error=kakao_auth_failed');
  }
} 