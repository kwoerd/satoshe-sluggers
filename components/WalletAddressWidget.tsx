// File: components/WalletAddressWidget.tsx
import { useActiveAccount } from "thirdweb/react";

export function WalletAddressWidget() {
  const account = useActiveAccount();
  return (
    <div>
      {account?.address
        ? `Your wallet address: ${account.address}`
        : "Not connected"}
    </div>
  );
}