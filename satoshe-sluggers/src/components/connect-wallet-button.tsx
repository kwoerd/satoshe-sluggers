import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("walletConnect"),
];

export default function ConnectWalletButton() {
  return (
    <ConnectButton
      client={client}
      connectButton={{ 
        label: "CONNECT",
        className: "!rounded"
      }}
      connectModal={{
        privacyPolicyUrl:
          "https://retinaldelights.io/privacy",
        size: "compact",
        termsOfServiceUrl:
          "https://retinaldelights.io/terms",
      }}
      auth={{
        async doLogin(params) {
        },
        
        async doLogout() {
        },
        
        async getLoginPayload(params) {
          const now = new Date();
          const issuedAt = now.toISOString();
          const expirationTime = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
          const invalidBefore = now.toISOString();
          
          return {
            address: params.address,
            statement: `Welcome to Satoshe Sluggers Marketplace! Please sign this message to verify your wallet ownership.`,
            issued_at: issuedAt,
            expiration_time: expirationTime,
            invalid_before: invalidBefore,
            domain: "yourdomain.com",
            version: "1",
            nonce: Math.random().toString(36).substring(2, 15),
          };
        },
        
        async isLoggedIn() {
          return true; // Thirdweb handles this automatically
        },
      }}
      theme={darkTheme({
        colors: {
          accentText: "hsl(324, 100%, 50%)",
          accentButtonBg: "hsl(324, 100%, 50%)",
          primaryButtonBg: "hsl(324, 100%, 50%)",
          primaryButtonText: "hsl(0, 0%, 100%)",
          modalBg: "hsl(0, 0%, 9%)",
          borderColor: "hsl(0, 0%, 40%)",
          separatorLine: "hsl(0, 0%, 14%)",
          tertiaryBg: "hsl(0, 0%, 7%)",
          skeletonBg: "hsl(0, 0%, 13%)",
          secondaryButtonBg: "hsl(0, 0%, 13%)",
          secondaryIconHoverBg: "hsl(0, 0%, 9%)",
          tooltipText: "hsl(0, 0%, 9%)",
          inputAutofillBg: "hsl(0, 0%, 9%)",
          scrollbarBg: "hsl(0, 0%, 9%)",
          secondaryIconColor: "hsl(0, 0%, 40%)",
          connectedButtonBg: "hsl(0, 0%, 9%)",
          connectedButtonBgHover: "hsl(0, 0%, 2%)",
          secondaryButtonHoverBg: "hsl(0, 0%, 9%)",
          selectedTextColor: "hsl(0, 0%, 9%)",
          secondaryText: "hsl(0, 0%, 82%)",
          primaryText: "hsl(0, 0%, 100%)",
        },
      })}
      wallets={wallets}
    />
  );
}
