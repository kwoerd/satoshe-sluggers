// src/components/CancelBidButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CancelBidButton({ listingId }: { listingId: bigint }) {
  // DISABLED: All RPC calls disabled to prevent rate limiting
  // This component is temporarily disabled until we can implement proper rate limiting controls

  const handleCancel = async () => {
    toast.error("Cancel bid temporarily disabled to prevent rate limiting");
  };

  return (
    <Button
      disabled={true}
      onClick={handleCancel}
    >
      Cancel Bid (Disabled)
    </Button>
  );
}