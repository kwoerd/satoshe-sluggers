import { ConnectButton, darkTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

// Initialize your Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "YOUR_CLIENT_ID_HERE", // replace with your actual Thirdweb clientId
});

// Define available wallets
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

// Main ConnectButton component
export default function CustomAuthButton() {
  return (
    <ConnectButton
      client={client}
      connectButton={{ label: "CONNECT" }}
      connectModal={{
        size: "wide",
        privacyPolicyUrl: "https://retinaldelights.io/privacy",
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