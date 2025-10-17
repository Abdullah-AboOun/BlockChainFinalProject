export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

export interface Certificate {
  id: string
  issuerAddress: string
  recipientName: string
  recipientEmail: string
  certificateType: string
  issueDate: number
  expiryDate?: number
  documentHash: string
  metadata: string
  isRevoked: boolean
  blockNumber: number
  transactionHash: string
}

export interface IssuerRegistration {
  address: string
  name: string
  email: string
  organizationType: string
  registrationDate: number
  isActive: boolean
  certificatesIssued: number
}

export interface VerificationRequest {
  certificateId: string
  requesterAddress: string
  timestamp: number
  fee: string
}

export interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  status: "success" | "failed"
  gasUsed: string
}
