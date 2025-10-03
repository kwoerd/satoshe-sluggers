// src/components/ConnectWalletButton.tsx

"use client";

import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
});

export default function ConnectWalletButton() {
  return (
    <ConnectButton
      client={client}
      connectModal={{
        size: "compact",
        title: "Connect to W3B Marketplace",
        showThirdwebBranding: false,
      }}
    />
  );
}
