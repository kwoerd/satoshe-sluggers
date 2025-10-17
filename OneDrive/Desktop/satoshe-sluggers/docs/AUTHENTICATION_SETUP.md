<!-- docs/AUTHENTICATION_SETUP.md -->
# Custom Authentication with Turnstile Integration

## Overview

This implementation provides a custom authentication flow that integrates Cloudflare Turnstile between wallet connection and final authentication, solving the double modal issue and adding security verification.

## Flow

1. **User clicks "Connect"** → Triggers `useConnectModal()`
2. **Wallet Selection** → User selects MetaMask, Coinbase, etc.
3. **Wallet Signature** → MetaMask popup for signature
4. **Turnstile Challenge** → Cloudflare verification modal appears
5. **Green Checkmark** → User must complete verification before proceeding
6. **Final Authentication** → Complete login with JWT

## Setup Required

### 1. Cloudflare Turnstile

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile" in the sidebar
3. Create a new site
4. Copy your Site Key and Secret Key

### 2. Environment Variables

Create `.env.local` with:

```bash
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
TURNSTILE_SECRET_KEY=your_secret_key_here

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_here

# Thirdweb (if not already configured)
THIRDWEB_CLIENT_ID=your_client_id_here
```

### 3. Update Turnstile Site Key

The component uses `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` for the Turnstile widget. Make sure this environment variable is set correctly.

## API Routes

The following API routes handle the authentication flow:

- `POST /api/auth/check` - Check if user is logged in
- `POST /api/auth/payload` - Generate SIWE payload for wallet signature
- `POST /api/auth/login` - Complete login after Turnstile verification
- `POST /api/auth/logout` - Logout user

## Components

- `CustomAuthButton` - Custom authentication component with Turnstile
- `TurnstileModal` - Cloudflare verification modal with green checkmark
- Updated `Navigation` and `MobileMenu` to use custom auth

## Testing

1. Click "Connect" button
2. Select wallet (MetaMask, etc.)
3. Sign the message in your wallet
4. **Turnstile modal appears** - Complete verification
5. **Green checkmark shows** - Verification complete
6. Authentication completes automatically
7. Should be logged in with JWT token

## Key Features

- ✅ **Exact Flow Match**: Follows your described authentication flow
- ✅ **Turnstile Integration**: Security verification between wallet signature and final auth
- ✅ **Green Checkmark**: Visual confirmation of verification completion
- ✅ **No Double Modals**: Single, clean authentication flow
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Error Handling**: Proper error states and recovery

## Security Notes

- Turnstile tokens are verified server-side
- JWT tokens are httpOnly cookies
- Wallet signatures are verified
- Users must complete Turnstile before final confirmation

## Next Steps

1. Get Turnstile keys from Cloudflare
2. Set environment variables
3. Test the complete flow
4. Implement buy button functionality
5. Add error handling and user feedback
