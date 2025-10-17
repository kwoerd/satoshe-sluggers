"use client";

import { ConnectButton, darkTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "github",
        "tiktok",
        "passkey",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("com.ledger"),
  createWallet("walletConnect"),
];

export function ConnectWalletButton() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectButton={{ label: "CONNECT" }}
      connectModal={{
        privacyPolicyUrl: "https://retinaldelights.io/privacy",
        termsOfServiceUrl: "https://retinaldelights.io/terms",
        size: "wide",
      }}
      theme={darkTheme({
        colors: {
          primaryButtonBg: "hsl(324, 100%, 50%)",
          primaryButtonText: "hsl(48, 100%, 96%)",
          connectedButtonBg: "hsl(324, 100%, 50%)",
          connectedButtonBgHover: "hsl(324, 100%, 60%)",
          modalBg: "hsl(0, 0%, 4%)",
          primaryText: "hsl(48, 100%, 96%)",
        },
      })}
    />
  );
}
