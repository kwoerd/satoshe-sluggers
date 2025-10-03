// src/hooks/useDataSource.ts
import { useState, useEffect } from "react";

const INSIGHT_CLIENT_ID = process.env.NEXT_PUBLIC_INSIGHT_CLIENT_ID!;
const COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "8453";

export type DataSource = "insight" | "static";

export function useDataSource() {
  const [dataSource, setDataSource] = useState<DataSource>("static");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Try to check if Insight API is available
    const checkInsightAvailability = async () => {
      try {
        const url = `https://${CHAIN_ID}.insight.thirdweb.com/v1/nftCollection/${COLLECTION_ADDRESS}`;
        const response = await fetch(url, {
          headers: { "x-client-id": INSIGHT_CLIENT_ID },
        });
        
        if (response.ok) {
          setDataSource("insight");
        } else {
          setDataSource("static");
        }
      } catch {
        console.log("Insight API not available, using static data");
        setDataSource("static");
      } finally {
        setIsChecking(false);
      }
    };

    checkInsightAvailability();
  }, []);

  return { dataSource, isChecking };
}
