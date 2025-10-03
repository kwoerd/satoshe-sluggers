// src/app/page.tsx

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Welcome to Retinal Delights</h1>
      <p className="mt-2 text-muted-foreground">
        Explore live NFT auctions on the <a href="/nfts" className="underline">NFTs page</a>.
      </p>
    </main>
  );
}
