// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert IPFS URLs to HTTP URLs for Next.js Image component
 * @param url - The URL to convert (can be IPFS or HTTP)
 * @returns HTTP URL that can be used with Next.js Image component
 */
export function convertIpfsUrl(url: string | undefined | null): string {
  if (!url) return "/nfts/placeholder-nft.webp";
  
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  
  return url;
}