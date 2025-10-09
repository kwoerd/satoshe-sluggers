"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Pagination from "@/components/ui/pagination"
import { Copy, Check, ExternalLink } from "lucide-react"

const COLLECTION_NAME = "Satoshe Sluggers"
const COLLECTION_SIZE = 7777
const CONTRACT_ADDRESS = "0xE3f1694adCe46ffcF82D15dd88859147c72f7C5a"
const FINAL_PROOF_HASH = "0aee8280e18ce8e76ddd08256b8fc1ec5eb16416c64aa0c985e1da7393fc66ac"
const MERKLE_ROOT = "acb780a12b14fe3ffa1a660b84bcb2e9c36e0dc7ea519c85c1e8fe4747ff5e0a"

interface ProvenanceRecord {
  initial_sequence_index: number
  assigned_token_id: number
  sha256_hash: string
  keccak_hash: string
  ipfs_hash: string
}

export default function ProvenancePage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [concatenatedHash, setConcatenatedHash] = useState<string>("")
  const [provenanceRecords, setProvenanceRecords] = useState<ProvenanceRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(50)
  const [isLoading, setIsLoading] = useState(true)

  // Load real data
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        // Load concatenated hash
        const hashResponse = await fetch('/provenance/sha256_concatenated.txt')
        if (!hashResponse.ok) throw new Error('Failed to load concatenated hash')
        const hashText = await hashResponse.text()
        
        if (isMounted) {
          setConcatenatedHash(hashText)
        }

        // Load provenance records
        const [sha256Response, keccakResponse, ipfsResponse] = await Promise.all([
          fetch('/provenance/sha256_hashes.txt'),
          fetch('/provenance/keccak256_hashes.txt'),
          fetch('/provenance/ipfs_cids_list.txt')
        ])

        if (!sha256Response.ok || !keccakResponse.ok || !ipfsResponse.ok) {
          throw new Error('Failed to load provenance data files')
        }

        const [sha256Text, keccakText, ipfsText] = await Promise.all([
          sha256Response.text(),
          keccakResponse.text(),
          ipfsResponse.text()
        ])

        if (!isMounted) return

        // Parse the data - clean and filter each line
        const sha256Lines = sha256Text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
        const keccakLines = keccakText.split('\n').map(line => {
          const trimmed = line.trim()
          // Remove token ID prefix if present (e.g., "0 0x123..." -> "0x123...")
          return trimmed.replace(/^\d+\s+/, '')
        }).filter(line => line.length > 0)
        const ipfsLines = ipfsText.split('\n').map(line => line.trim()).filter(line => line.length > 0)

        // Create provenance records
        const records: ProvenanceRecord[] = []
        for (let i = 0; i < COLLECTION_SIZE; i++) {
          records.push({
            initial_sequence_index: i,
            assigned_token_id: i,
            sha256_hash: sha256Lines[i] || '',
            keccak_hash: keccakLines[i] || '',
            ipfs_hash: ipfsLines[i] || ''
          })
        }

        if (isMounted) {
          setProvenanceRecords(records)
        }
      } catch (error) {
        console.error('Error loading provenance data:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHash(id)
      setTimeout(() => setCopiedHash(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(provenanceRecords.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = provenanceRecords.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activePage="provenance" />
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-12 max-w-7xl">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4" style={{ color: "#fffbeb" }}>Loading Provenance Data...</div>
            <div className="text-muted-foreground">Please wait while we load the cryptographic proofs.</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 sm:pt-36">
      <Navigation activePage="provenance" />
      
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 pt-8 sm:pt-12 pb-12 max-w-7xl">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 uppercase tracking-tight" style={{ color: "#fffbeb" }}>
            PROVENANCE RECORD
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8" style={{ color: "#fffbeb" }}>
            SATO<span style={{ color: "#ff0099" }}>SHE</span> SLUGGERS
          </h2>
          <p className="text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed" style={{ color: "#fffbeb" }}>
            This record is your assurance: one collection, one truth — verified by math, preserved by code.
          </p>
        </div>

        {/* Collection Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold mb-2" style={{ color: "#fffbeb" }}>7,777</div>
            <div className="text-sm text-neutral-400">Total NFTs</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold mb-2" style={{ color: "#fffbeb" }}>ERC-721</div>
            <div className="text-sm text-neutral-400">Contract Type</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold mb-2" style={{ color: "#fffbeb" }}>Base</div>
            <div className="text-sm text-neutral-400">Blockchain</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold mb-2" style={{ color: "#fffbeb" }}>2025</div>
            <div className="text-sm text-neutral-400">Year</div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: "#fffbeb" }}>
            CONTRACT INFORMATION
          </h3>
          
          <div className="space-y-8">
            <div className="bg-neutral-900/30 border border-neutral-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3" style={{ color: "#fffbeb" }}>Collection Address</h4>
              <div className="flex items-start gap-2">
                <div className="font-mono text-sm break-all bg-neutral-800 p-3 rounded flex-1" style={{ color: "#fffbeb" }}>
                  {CONTRACT_ADDRESS}
                </div>
                <button
                  onClick={() => copyToClipboard(CONTRACT_ADDRESS, 'contract-address')}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded"
                  title="Copy to clipboard"
                >
                  {copiedHash === 'contract-address' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-neutral-900/30 border border-neutral-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3" style={{ color: "#fffbeb" }}>Final Proof Hash</h4>
              <div className="flex items-start gap-2">
                <div className="font-mono text-sm break-all bg-neutral-800 p-3 rounded flex-1" style={{ color: "#fffbeb" }}>
                  {FINAL_PROOF_HASH}
                </div>
                <button
                  onClick={() => copyToClipboard(FINAL_PROOF_HASH, 'final-proof-hash')}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded"
                  title="Copy to clipboard"
                >
                  {copiedHash === 'final-proof-hash' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-neutral-900/30 border border-neutral-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3" style={{ color: "#fffbeb" }}>Merkle Root</h4>
              <div className="flex items-start gap-2">
                <div className="font-mono text-sm break-all bg-neutral-800 p-3 rounded flex-1" style={{ color: "#fffbeb" }}>
                  {MERKLE_ROOT}
                </div>
                <button
                  onClick={() => copyToClipboard(MERKLE_ROOT, 'merkle-root')}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded"
                  title="Copy to clipboard"
                >
                  {copiedHash === 'merkle-root' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-base leading-relaxed max-w-4xl mx-auto" style={{ color: "#fffbeb" }}>
              Every NFT in the Satoshe Sluggers collection is permanently recorded, traceable, and verifiably authentic. Together, these cryptographic proofs form an unbreakable chain of custody from mint to marketplace, giving collectors verifiable confidence that each NFT is exactly as it was created — authentic, original, and forever anchored on-chain.
            </p>
          </div>
        </div>

        {/* Concatenated Hash String */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: "#fffbeb" }}>
            CONCATENATED HASH STRING
          </h3>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-h-64 overflow-y-auto">
            <div className="font-mono text-xs leading-tight break-all" style={{ color: "#fffbeb" }}>
              {concatenatedHash}
            </div>
          </div>
        </div>

        {/* Provenance Record Table */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: "#fffbeb" }}>
            PROVENANCE RECORD
          </h3>

          {/* Records per page selector */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-neutral-400">
              Showing {startIndex + 1}-{Math.min(endIndex, provenanceRecords.length)} of {provenanceRecords.length} records
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">Records per page:</span>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-1 bg-neutral-800 border border-neutral-600 rounded text-sm text-neutral-300"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="p-4 text-left text-sm font-medium uppercase tracking-wider text-neutral-300">Token ID</th>
                  <th className="p-4 text-left text-sm font-medium uppercase tracking-wider text-neutral-300">NFT #</th>
                  <th className="p-4 text-left text-sm font-medium uppercase tracking-wider text-neutral-300">SHA-256 Hash</th>
                  <th className="p-4 text-left text-sm font-medium uppercase tracking-wider text-neutral-300">Keccak-256 Hash</th>
                  <th className="p-4 text-left text-sm font-medium uppercase tracking-wider text-neutral-300">IPFS CID</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record) => (
                  <tr key={record.initial_sequence_index} className="border-t border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4 text-sm font-mono text-neutral-300">{record.initial_sequence_index}</td>
                    <td className="p-4 text-sm font-mono text-neutral-300">{record.assigned_token_id + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono break-all text-neutral-300 flex-1">{record.sha256_hash}</span>
                        <button
                          onClick={() => copyToClipboard(record.sha256_hash, `sha-${record.initial_sequence_index}`)}
                          className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedHash === `sha-${record.initial_sequence_index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono break-all text-neutral-300 flex-1">{record.keccak_hash}</span>
                        <button
                          onClick={() => copyToClipboard(record.keccak_hash, `keccak-${record.initial_sequence_index}`)}
                          className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedHash === `keccak-${record.initial_sequence_index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://ipfs.io/ipfs/${record.ipfs_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono break-all text-blue-400 hover:text-blue-300 transition-colors flex-1"
                        >
                          {record.ipfs_hash}
                        </a>
                        <ExternalLink className="h-4 w-4 text-neutral-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {provenanceRecords.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={provenanceRecords.length}
              itemsPerPage={recordsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}