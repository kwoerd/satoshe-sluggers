import { ConnectButton, darkTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "....",
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

export default function CustomAuthButton() {
  return (
    <ConnectButton
      auth={{
        async doLogin(params) {
          // call your backend to verify the signed payload passed in params
          return;
        },
        async doLogout() {
          // call your backend to logout the user if needed
          return;
        },
        async getLoginPayload(params) {
          // call your backend and return the payload
          const now = new Date();
          const expirationTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
          
          return {
            domain: window.location.host,
            address: params.address,
            statement: "Please sign this message to authenticate",
            uri: window.location.origin,
            version: "1",
            chainId: params.chainId,
            nonce: Math.random().toString(36).substring(2, 15),
            issuedAt: now.toISOString(),
            issued_at: now.toISOString(),
            expirationTime: expirationTime.toISOString(),
            expiration_time: expirationTime.toISOString(),
            invalidBefore: now.toISOString(),
            invalid_before: now.toISOString(),
          };
        },
        async isLoggedIn(address) {
          // call your backend to check if the user is logged in
          return false;
        },
      }}
      client={client}
      connectButton={{ 
        label: "CONNECT",
      }}
      connectModal={{
        privacyPolicyUrl: "https://retinaldelights.io/privacy",
        size: "wide",
        termsOfServiceUrl: "https://retinaldelights.io/terms",
      }}
      theme={darkTheme({
        colors: {
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
          secondaryText: "hsl(0, 0%, 45%)",
          tertiaryBg: "hsl(0, 0%, 15%)",
          separatorLine: "hsl(0, 0%, 15%)",
          accentText: "hsl(324, 100%, 50%)",
          borderColor: "hsl(0, 0%, 15%)",
          modalBg: "hsl(0, 0%, 4%)",
        },
      })}
      wallets={wallets}
    />
  );
}