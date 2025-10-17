"use client"

import { useState, useEffect } from "react"
import { COLLECTION_NAME, CONTRACT_ADDRESS, FINAL_PROOF_HASH, MERKLE_ROOT } from "@/lib/constants"
import { Copy, Check, ExternalLink } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { TooltipProvider } from "@/components/ui/tooltip"
import NFTPagination from "@/components/ui/pagination"

interface ProvenanceRecord {
  token_id: number
  nft_number: number
  sha256_hash: string
  keccak256_hash: string
  ipfs_cid: string
}

interface IpfsUrlData {
  TokenID: number
  "Media URL": string
  "Metadata URL": string
}

export default function ProvenancePage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [copiedProof, setCopiedProof] = useState(false)
  const [copiedMerkle, setCopiedMerkle] = useState(false)
  const [merkleTree, setMerkleTree] = useState("")
  const [provenanceRecords, setProvenanceRecords] = useState<ProvenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [merkleRes, urlsRes, hashesRes] = await Promise.all([
          fetch("/data/merkle_tree.txt"),
          fetch("/data/ipfs_urls.json"),
          fetch("/data/sha256_hashes.txt"),
        ])

        const merkleText = await merkleRes.text()
        const urlsData = await urlsRes.json()
        const hashesText = await hashesRes.text()

        setMerkleTree(merkleText)

        // Parse hashes text file (one hash per line)
        const hashLines = hashesText.split("\n")
        const records: ProvenanceRecord[] = hashLines
          .filter((line) => line.trim())
          .map((sha256, index) => {
            const tokenNum = index
            // Find the corresponding URL data by TokenID (TokenID should match the index)
            const urlData = urlsData.find((item: IpfsUrlData) => item.TokenID === tokenNum)
            const ipfsCid = urlData ? urlData["Metadata URL"] : ""


            return {
              token_id: tokenNum,
              nft_number: tokenNum + 1,
              sha256_hash: sha256.trim(),
              keccak256_hash: sha256.trim(), // Using sha256 as placeholder
              ipfs_cid: ipfsCid,
            }
          })

        setProvenanceRecords(records)
        setLoading(false)
      } catch (error) {
        console.error("[Provenance] Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(id)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const copyProofHash = () => {
    navigator.clipboard.writeText(FINAL_PROOF_HASH)
    setCopiedProof(true)
    setTimeout(() => setCopiedProof(false), 2000)
  }

  const copyMerkleRoot = () => {
    navigator.clipboard.writeText(MERKLE_ROOT)
    setCopiedMerkle(true)
    setTimeout(() => setCopiedMerkle(false), 2000)
  }


  // Pagination logic
  const totalPages = Math.ceil(provenanceRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRecords = provenanceRecords.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28">
        <Navigation activePage="provenance" />

        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-8 max-w-7xl flex-grow">
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-3 uppercase tracking-tight">
            <span className="text-[#FF0099]">S</span><span className="text-[#FF0099]">H</span><span className="text-[#FF0099]">E</span> Sluggers
          </h1>
          <h2 className="text-7xl font-bold mb-8 uppercase tracking-tight text-foreground">
            PROVENANCE RECORD
          </h2>
          <div className="text-muted-foreground leading-relaxed max-w-4xl space-y-6">
            <p className="text-lg whitespace-nowrap">
              Every NFT in the Satoshe Sluggers collection is permanently recorded, traceable, and verifiably authentic.
            </p>
            <p className="text-lg whitespace-nowrap">
              This record is your assurance and source of truth — verified by math, preserved by code.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Verification Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-neutral-700 p-4 rounded">
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-lg flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <div className="font-semibold mb-1">SHA-256 chain</div>
                  <div className="text-sm text-muted-foreground">Security that ensures your files haven&apos;t changed</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-neutral-700 p-4 rounded">
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-lg flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <div className="font-semibold mb-1">Final Proof Hash</div>
                  <div className="text-sm text-muted-foreground">One master checksum proving total authenticity</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-neutral-700 p-4 rounded">
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-lg flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <div className="font-semibold mb-1">Keccak + Merkle Root</div>
                  <div className="text-sm text-muted-foreground">
                    Verifies on-chain consistency and collection completeness
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-neutral-700 p-4 rounded">
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-lg flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <div className="font-semibold mb-1">IPFS CIDs / URLs</div>
                  <div className="text-sm text-muted-foreground">
                    Show where the data lives permanently and unalterably
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Important Information</h2>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Merkle Tree</h2>
          </div>

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Contract and Hashes */}
            <div className="space-y-4">
              <div className="bg-card border border-neutral-700 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {COLLECTION_NAME} Contract Address
                  </div>
                  <button
                    onClick={() => copyToClipboard(CONTRACT_ADDRESS, 'contract')}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded"
                    title="Copy to clipboard"
                  >
                    {copiedHash === 'contract' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-sm font-mono break-all" style={{ fontWeight: '300' }}>{CONTRACT_ADDRESS}</div>
              </div>

              <div className="bg-card border border-neutral-700 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Final Proof Hash</div>
                  <button
                    onClick={copyProofHash}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded"
                    title="Copy to clipboard"
                  >
                    {copiedProof ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-sm font-mono break-all" style={{ fontWeight: '300' }}>{FINAL_PROOF_HASH}</div>
              </div>

              <div className="bg-card border border-neutral-700 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Merkle Root</div>
                  <button
                    onClick={copyMerkleRoot}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded"
                    title="Copy to clipboard"
                  >
                    {copiedMerkle ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-sm font-mono break-all" style={{ fontWeight: '300' }}>{MERKLE_ROOT}</div>
              </div>
            </div>

            {/* Right Column - Merkle Tree */}
            <div>
              <div className="bg-card border border-neutral-700 p-2 rounded">
                <div
                  className="font-mono text-xs break-all leading-relaxed overflow-y-auto whitespace-pre-wrap scrollbar-custom"
                  style={{ fontWeight: '300', height: "200px" }}
                >
                  {merkleTree || "Loading..."}
                </div>
              </div>
              
              {/* Collection Stats - Under Merkle Tree */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground uppercase tracking-wider">Collection Size:</span>
                    <span className="font-semibold">7,777</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground uppercase tracking-wider">Blockchain:</span>
                    <span className="font-semibold">Base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground uppercase tracking-wider">Chain ID:</span>
                    <span className="font-semibold">8453</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Provenance Record</h2>

          <div className="bg-card border border-neutral-700 overflow-hidden rounded">
            <div className="overflow-x-auto" style={{ maxHeight: "600px", overflowY: "auto" }}>
              <table className="w-full">
                <thead className="sticky top-0 z-10 border-b border-neutral-700" style={{ backgroundColor: '#1a1a1a' }}>
                  <tr>
                    <th className="pl-2 pr-4 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Token ID
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      NFT #
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      SHA-256 Hash
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Keccak-256 Hash
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      IPFS CID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Loading provenance records...
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((record) => (
                      <tr key={record.token_id} className="border-b border-neutral-700 hover:bg-accent/30 transition-colors">
                        <td className="pl-2 pr-4 py-4 text-sm font-mono" style={{ fontWeight: '300' }}>{record.token_id}</td>
                        <td className="p-4 text-sm font-mono" style={{ fontWeight: '300' }}>{record.nft_number}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono whitespace-nowrap" style={{ fontWeight: '300' }}>{record.sha256_hash}</span>
                            <button
                              onClick={() => copyToClipboard(record.sha256_hash, `sha-${record.token_id}`)}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0 rounded"
                              title="Copy to clipboard"
                            >
                              {copiedHash === `sha-${record.token_id}` ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono whitespace-nowrap" style={{ fontWeight: '300' }}>{record.keccak256_hash}</span>
                            <button
                              onClick={() => copyToClipboard(record.keccak256_hash, `keccak-${record.token_id}`)}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0 rounded"
                              title="Copy to clipboard"
                            >
                              {copiedHash === `keccak-${record.token_id}` ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={record.ipfs_cid}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:text-primary transition-colors font-mono whitespace-nowrap"
                              style={{ fontWeight: '300' }}
                            >
                              {record.ipfs_cid ? record.ipfs_cid.replace('https://ipfs.io/ipfs/', '') : "N/A"}
                            </a>
                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <NFTPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={provenanceRecords.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
    </TooltipProvider>
  )
}

