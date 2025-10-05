// components/CancelBidButton.tsx
"use client";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { cancelAuction } from "thirdweb/extensions/marketplace";

export function CancelBidButton({ contractAddress, auctionId }: { contractAddress: string; auctionId: bigint; }) {
  const account = useActiveAccount();
  const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_CLIENT_ID! });
  const contract = getContract({ client, chain: base, address: contractAddress });
  const { mutate: sendTx, isPending } = useSendTransaction();

  const handleCancel = () => {
    if (!account) return alert("Connect your wallet first.");
    const tx = cancelAuction({ contract: contract!, auctionId });
    sendTx(tx);
  };

  return <button disabled={isPending} onClick={handleCancel}>Cancel Bid</button>;
}
