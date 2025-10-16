import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { address, signature, turnstileToken } = await request.json();
    
    if (!address || !signature) {
      return NextResponse.json({ error: 'Address and signature required' }, { status: 400 });
    }

    // Verify Turnstile token
    if (turnstileToken) {
      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY || '',
          response: turnstileToken,
          remoteip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        }),
      });

      const turnstileResult = await turnstileResponse.json();
      
      if (!turnstileResult.success) {
        return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 });
      }
    }

    // Verify wallet signature (you'll need to implement SIWE verification)
    // For now, just create a mock JWT
    const jwt = `mock-jwt-${address}-${Date.now()}`;
    
    // Set JWT cookie
    const cookieStore = await cookies();
    cookieStore.set('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ 
      success: true, 
      jwt,
      address 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
