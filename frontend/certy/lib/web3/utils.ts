import { SUPPORTED_CHAINS } from "./config"

/**
 * Format wallet address for display (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format ETH amount from wei
 */
export function formatEther(wei: string | bigint): string {
  const weiValue = typeof wei === "string" ? BigInt(wei) : wei
  const ether = Number(weiValue) / 1e18
  return ether.toFixed(4)
}

/**
 * Parse ETH amount to wei
 */
export function parseEther(ether: string): bigint {
  const value = Number.parseFloat(ether)
  return BigInt(Math.floor(value * 1e18))
}

/**
 * Get chain info by chain ID
 */
export function getChainInfo(chainId: number) {
  const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId)
  return chain || null
}

/**
 * Check if chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return Object.values(SUPPORTED_CHAINS).some((c) => c.id === chainId)
}

/**
 * Generate certificate ID from hash
 */
export function generateCertificateId(documentHash: string, timestamp: number): string {
  return `CERT-${documentHash.slice(0, 8)}-${timestamp}`
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerUrl(chainId: number, txHash: string): string {
  const chain = getChainInfo(chainId)
  if (!chain) return ""
  return `${chain.blockExplorer}/tx/${txHash}`
}

/**
 * Get block explorer URL for address
 */
export function getAddressExplorerUrl(chainId: number, address: string): string {
  const chain = getChainInfo(chainId)
  if (!chain) return ""
  return `${chain.blockExplorer}/address/${address}`
}

/**
 * Hash document content (simple implementation)
 */
export async function hashDocument(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return `0x${hashHex}`
}
