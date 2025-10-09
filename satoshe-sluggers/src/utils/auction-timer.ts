export function getAuctionCountdown(auctionEnd: string | number | bigint) {
  if (!auctionEnd) return "Auction ended";
  const now = Date.now();
  const end = Number(auctionEnd) * 1000;
  const timeLeft = end - now;
  if (timeLeft <= 0) return "Auction ended";
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  // Format: "Ends: Xd Yh Zm" or "Ends: Yh Zm" or "Ends: Zm" or "Ends: Zs"
  if (days > 0) {
    return `Ends: ${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `Ends: ${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `Ends: ${minutes}m ${seconds}s`;
  }
  return `Ends: ${seconds}s`;
}

export function getAuctionEndColor(auctionEnd: string | number | bigint) {
  if (!auctionEnd) return "text-neutral-400";
  const now = Date.now();
  const end = Number(auctionEnd) * 1000;
  const hoursLeft = (end - now) / (1000 * 60 * 60);
  if (hoursLeft <= 24) return "text-red-500 font-bold";
  if (hoursLeft <= 24 * 7) return "text-yellow-400 font-bold";
  return "text-neutral-400";
}
