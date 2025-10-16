"use client";

import { ConnectButton } from "thirdweb/react";
import { defineChain } from "thirdweb";
import { client } from "@/lib/thirdweb";

// Define Base chain for smart accounts
const baseChain = defineChain({
  id: 8453,
  name: "Base",
  rpc: "https://mainnet.base.org",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "BaseScan",
      url: "https://basescan.org",
    },
  ],
});

// Server actions for authentication
const auth = {
  isLoggedIn: async () => {
    const response = await fetch('/api/auth/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    return result.isLoggedIn || false;
  },
  
  doLogin: async (params: { address: string; signature: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  },
  
  getLoginPayload: async ({ address }: { address: string }) => {
    const response = await fetch('/api/auth/payload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    return response.json();
  },
  
  doLogout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
  }
};

export default function SmartAuthButton() {
  return (
    <ConnectButton
      client={client}
      accountAbstraction={{
        chain: baseChain,
        sponsorGas: true, // Gasless transactions
      }}
      auth={{
        // Server-side authentication methods
        isLoggedIn: async () => {
          const authResult = await auth.isLoggedIn();
          return authResult;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doLogin: async (params) => await auth.doLogin(params as any),
        getLoginPayload: async ({ address }) => auth.getLoginPayload({ address }),
        doLogout: async () => await auth.doLogout(),
      }}
      connectButton={{
        label: "CONNECT",
        style: {
          backgroundColor: "#ff0099",
          color: "white",
          borderRadius: "4px",
          padding: "8px 24px",
          fontSize: "14px",
          fontWeight: "500",
        }
      }}
      connectModal={{
        privacyPolicyUrl: "https://retinaldelights.io/privacy",
        termsOfServiceUrl: "https://retinaldelights.io/terms",
        size: "wide",
        // Custom modal configuration for Turnstile integration
        showThirdwebBranding: false,
        title: "Connect to Retinal Delights",
      }}
      theme={{
        type: "dark",
        fontFamily: "Inter, sans-serif",
        colors: {
          modalOverlayBg: "hsl(0, 0%, 0%, 0.8)",
          skeletonBg: "hsl(0, 0%, 4%)",
          secondaryButtonBg: "hsl(0, 0%, 4%)",
          secondaryButtonHoverBg: "hsl(0, 0%, 4%)",
          connectedButtonBgHover: "hsl(0, 0%, 4%)",
          scrollbarBg: "hsl(0, 0%, 4%)",
          inputAutofillBg: "hsl(0, 0%, 9%)",
          tooltipText: "hsl(0, 0%, 9%)",
          tooltipBg: "hsl(48, 100%, 96%)",
          success: "hsl(160, 84%, 39%)",
          danger: "hsl(0, 84%, 60%)",
          secondaryIconHoverBg: "hsl(0, 0%, 15%)",
          secondaryIconHoverColor: "hsl(48, 100%, 96%)",
          secondaryIconColor: "hsl(0, 0%, 45%)",
          connectedButtonBg: "hsl(324, 100%, 50%)",
          accentButtonText: "hsl(48, 100%, 96%)",
          accentButtonBg: "hsl(324, 100%, 50%)",
          secondaryButtonText: "hsl(48, 100%, 96%)",
          primaryButtonText: "hsl(48, 100%, 96%)",
          primaryButtonBg: "hsl(324, 100%, 50%)",
          selectedTextBg: "hsl(324, 100%, 50%)",
          primaryText: "hsl(48, 100%, 96%)",
          selectedTextColor: "hsl(48, 100%, 96%)",
          secondaryText: "hsl(48, 100%, 96%)",
          tertiaryBg: "hsl(0, 0%, 15%)",
          separatorLine: "hsl(0, 0%, 15%)",
          accentText: "hsl(324, 100%, 50%)",
          borderColor: "hsl(0, 0%, 15%)",
          modalBg: "hsl(0, 0%, 4%)",
        },
      }}
    />
  );
}
