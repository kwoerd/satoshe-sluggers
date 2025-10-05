import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// IPFS -> http helper (safe for thirdwebcdn)
const GATEWAY = "https://ipfs.thirdwebcdn.com/ipfs";
export function ipfsToHttp(url?: string | null) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) {
    const m = url.match(/\/ipfs\/([^/?#]+)(.*)?$/i);
    if (m) return `${GATEWAY}/${m[1]}${m[2] || ""}`;
    return url;
  }
  if (url.startsWith("ipfs://")) {
    const rest = url.slice(7).replace(/^ipfs\//i, "");
    return `${GATEWAY}/${rest}`;
  }
  if (/^[A-Za-z0-9]{46,}$/.test(url)) return `${GATEWAY}/${url}`;
  return url;
}
