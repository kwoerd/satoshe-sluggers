// src/components/EnvChecker.tsx

"use client";

export default function EnvChecker() {
  // Check environment variables immediately to avoid flash
  const envStatus = {
    chainId: !!process.env.NEXT_PUBLIC_CHAIN_ID,
    marketplace: !!process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS,
    nftCollection: !!process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS,
  };

  const allSet = envStatus.chainId && envStatus.marketplace && envStatus.nftCollection;

  if (allSet) return null; // Don't show if everything is set

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <h3 className="font-bold">⚠️ Environment Variables Missing</h3>
      <div className="text-sm mt-2">
        <p>Chain ID: {envStatus.chainId ? "✅" : "❌"}</p>
        <p>Marketplace Address: {envStatus.marketplace ? "✅" : "❌"}</p>
        <p>NFT Collection Address: {envStatus.nftCollection ? "✅" : "❌"}</p>
        <p className="mt-2 text-xs">
          Create a <code>.env.local</code> file with these variables to fix the API errors.
        </p>
      </div>
    </div>
  );
}
