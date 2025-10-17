import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";

export default function SimpleConnectButton() {
  return (
    <ConnectButton
      client={client}
      connectButton={{ label: "CONNECT" }}
      connectModal={{
        size: "wide",
        privacyPolicyUrl: "https://retinaldelights.io/privacy",
        termsOfServiceUrl: "https://retinaldelights.io/terms",
      }}
    />
  );
}
