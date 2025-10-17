// lib/thirdweb.ts - Thirdweb v5 SDK Configuration
// lib/thirdweb.ts
import { createThirdwebClient } from "thirdweb";

// Initialize Thirdweb client with your client ID
// This will be loaded from environment variables
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID environment variable"
  );
}

