import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format ETH price without trailing zeros
export function formatETHPrice(price: string | number | bigint): string {
  if (!price || price === "0") return "0";
  
  try {
    let ethValue: number;
    
    if (typeof price === "bigint" || (typeof price === "string" && /^\d{12,}$/.test(price))) {
      // Convert from wei
      ethValue = Number(BigInt(price)) / 1e18;
    } else {
      ethValue = Number(price);
    }
    
    if (isNaN(ethValue) || ethValue < 0) return "0";
    
    // Remove trailing zeros and unnecessary decimal point
    return parseFloat(ethValue.toString()).toString();
  } catch {
    return "0";
  }
}
