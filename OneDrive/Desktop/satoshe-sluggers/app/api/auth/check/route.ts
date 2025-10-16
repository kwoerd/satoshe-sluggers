import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Check if JWT exists and is valid
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt');
    
    if (!jwt) {
      return NextResponse.json({ isLoggedIn: false });
    }

    // Verify JWT (you'll need to implement JWT verification)
    // For now, just check if it exists
    return NextResponse.json({ isLoggedIn: true });
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
