export const SUPPORTED_CHAINS = {
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
  polygon: {
    id: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
} as const

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS

// Default chain for the application
export const DEFAULT_CHAIN: SupportedChainId = "sepolia"

// Contract addresses (to be deployed)
export const CONTRACT_ADDRESSES = {
  certificateRegistry: process.env.NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS || "",
  feeCollector: process.env.NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS || "",
} as const

// Fee structure (in wei)
export const FEES = {
  certificateIssuance: "10000000000000000", // 0.01 ETH
  certificateVerification: "1000000000000000", // 0.001 ETH
} as const
