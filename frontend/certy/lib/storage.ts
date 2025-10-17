export interface StoredIssuer {
  address: string
  name: string
  email: string
  organizationType: string
  organizationName: string
  country: string
  website?: string
  registrationDate: number
  isActive: boolean
  certificatesIssued: number
}

export interface StoredCertificate {
  id: string
  issuerAddress: string
  issuerName: string
  recipientName: string
  recipientEmail: string
  certificateType: string
  issueDate: number
  expiryDate?: number
  documentHash: string
  metadata: string
  isRevoked: boolean
  transactionHash?: string
}

// Issuer management
export function saveIssuer(issuer: StoredIssuer): void {
  const issuers = getIssuers()
  const index = issuers.findIndex((i) => i.address === issuer.address)

  if (index >= 0) {
    issuers[index] = issuer
  } else {
    issuers.push(issuer)
  }

  localStorage.setItem("certify_issuers", JSON.stringify(issuers))
}

export function getIssuers(): StoredIssuer[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("certify_issuers")
  return data ? JSON.parse(data) : []
}

export function getIssuerByAddress(address: string): StoredIssuer | null {
  const issuers = getIssuers()
  return issuers.find((i) => i.address.toLowerCase() === address.toLowerCase()) || null
}

// Certificate management
export function saveCertificate(certificate: StoredCertificate): void {
  const certificates = getCertificates()
  certificates.push(certificate)
  localStorage.setItem("certify_certificates", JSON.stringify(certificates))

  // Update issuer's certificate count
  const issuer = getIssuerByAddress(certificate.issuerAddress)
  if (issuer) {
    issuer.certificatesIssued += 1
    saveIssuer(issuer)
  }
}

export function getCertificates(): StoredCertificate[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("certify_certificates")
  return data ? JSON.parse(data) : []
}

export function getCertificateById(id: string): StoredCertificate | null {
  const certificates = getCertificates()
  return certificates.find((c) => c.id === id) || null
}

export function getCertificatesByIssuer(issuerAddress: string): StoredCertificate[] {
  const certificates = getCertificates()
  return certificates.filter((c) => c.issuerAddress.toLowerCase() === issuerAddress.toLowerCase())
}

export function revokeCertificate(id: string): boolean {
  const certificates = getCertificates()
  const index = certificates.findIndex((c) => c.id === id)

  if (index >= 0) {
    certificates[index].isRevoked = true
    localStorage.setItem("certify_certificates", JSON.stringify(certificates))
    return true
  }

  return false
}

// Platform statistics
export function getPlatformStats() {
  const certificates = getCertificates()
  const issuers = getIssuers()

  return {
    totalIssuers: issuers.length,
    totalCertificates: certificates.length,
    activeCertificates: certificates.filter((c) => !c.isRevoked).length,
  }
}
