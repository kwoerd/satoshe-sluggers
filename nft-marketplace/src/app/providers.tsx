// app/providers.tsx
"use client";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuctionProvider } from "@/contexts/AuctionContext";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <AuctionProvider>
          {children}
        </AuctionProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
