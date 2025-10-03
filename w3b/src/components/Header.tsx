// src/components/Header.tsx

"use client";

import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Header() {
  const account = useActiveAccount();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="text-xl font-bold">
        Retinal Delights
      </Link>

      <nav className="flex gap-6">
        <Link href="/nfts">NFTs</Link>
        {account && <Link href="/my-nfts">My NFTs</Link>}
      </nav>

      <ConnectWalletButton />
    </header>
  );
}