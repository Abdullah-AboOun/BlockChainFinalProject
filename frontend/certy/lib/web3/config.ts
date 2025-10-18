export const SUPPORTED_CHAINS = {
  localhost: {
    id: 31337,
    name: "Hardhat Localhost",
    rpcUrl: "http://localhost:8545",
    blockExplorer: "http://localhost:8545",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  ethereum: {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    blockExplorer: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  sepolia: {
    id: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorer: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
} as const

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS

// Default chain for the application (localhost for local development)
export const DEFAULT_CHAIN: SupportedChainId = "localhost"

// Contract addresses (loaded from public/deployment.json after deployment)
export const CONTRACT_ADDRESSES = {
  certificateRegistry: process.env.NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS || "",
} as const

// Fee structure (in wei)
export const FEES = {
  certificateIssuance: "0", // Free for local development
  certificateVerification: "0", // Free for local development
} as const
