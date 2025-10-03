// src/utils/thirdweb.ts

import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";

// Create client for transactions only - no RPC calls for reading data
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
});

// Export the Base chain
export { base };