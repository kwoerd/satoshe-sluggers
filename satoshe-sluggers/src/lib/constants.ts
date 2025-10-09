export const COLLECTION_NAME = "Satoshe Sluggers";
export const COLLECTION_SIZE = 7777;
export const NFT_COLLECTION_ADDRESS = "0xE3f1694adCe46ffcF82D15dd88859147c72f7C5a";
export const MARKETPLACE_ADDRESS = "0xF0f26455b9869d4A788191f6Aedc78410731072C";
export const NFT_CONTRACT_OWNER = "0x32692E05E0480a0eA425845bdA4e889F9cb1B244";
export const NFT_COLLECTION_OWNER = "0x52C902ad7661618089e8BcDFcb3a6dD945ff383d";
export const FINAL_PROOF_HASH = "2d684a58a325b13e84148cccadd2fa751bd2f88d780864397b46955f132f152f";

export const BAD_LISTING_IDS = [0, 1, 2, 3, 4, 5, 6, 7782, 7783, 7784, 7785, 7786, 7787, 7788];

// Function to load concatenated hash from file
export async function getConcatenatedHashString(): Promise<string> {
  try {
    const response = await fetch('/provenance/sha256_concatenated.txt');
    if (!response.ok) {
      throw new Error('Failed to load concatenated hash');
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading concatenated hash:', error);
    return '';
  }
}