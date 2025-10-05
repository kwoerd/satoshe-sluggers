# MarketplaceV3 Event Signatures — Base (8453)

## 🧩 NewAuction

**Topic 0 (hash):**
`0x5afd538bb1e7fc354db91c5dc4876ea2321a22fb8fbb69c84bda1f84ce1f45df`

**Event Definition:**
```solidity
event NewAuction(
  address indexed auctionCreator,
  uint256 indexed listingId,
  address indexed assetContract,
  (
    uint256 reservePrice,
    uint256 buyoutPrice,
    uint256 currencyAmount,
    uint256 tokenId,
    uint256 startTimestamp,
    uint64 endTimestamp,
    uint64 timeBufferInSeconds,
    uint64 bidBufferBps,
    uint64 minBidIncrementBps,
    address currency,
    address bidder,
    address seller,
    uint8 status,
    uint8 auctionType
  ) auction
);
