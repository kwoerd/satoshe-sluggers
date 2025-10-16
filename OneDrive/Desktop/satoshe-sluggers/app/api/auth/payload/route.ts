import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    // Generate SIWE payload for wallet signature
    const payload = {
      domain: 'retinaldelights.io',
      address: address,
      statement: 'Sign in to Retinal Delights NFT Marketplace',
      uri: 'https://retinaldelights.io',
      version: '1',
      chainId: 8453, // Base mainnet
      nonce: Math.random().toString(36).substring(2, 15),
      issuedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
    
  } catch (error) {
    console.error('Payload generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
