// src/components/CollectionExamples.tsx

import NftCollection from "./NftCollection";

export default function CollectionExamples() {
  return (
    <div className="space-y-12">
      {/* Your main collection */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Satoshe Sluggers Collection</h2>
        <NftCollection 
          contractAddress="0xe3f1694adce46ffcf82d15dd88859147c72f7c5a"
          limit={6}
          page={1}
        />
      </section>

      {/* Example: Different collection */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Another Collection</h2>
        <NftCollection 
          contractAddress="0x1234567890123456789012345678901234567890"
          limit={8}
          page={1}
          className="grid-cols-2 md:grid-cols-4" // Custom grid layout
        />
      </section>

      {/* Example: Different chain */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Ethereum Collection</h2>
        <NftCollection 
          contractAddress="0xabcdef1234567890abcdef1234567890abcdef12"
          chainId="1" // Ethereum mainnet
          limit={4}
          page={1}
        />
      </section>
    </div>
  );
}
