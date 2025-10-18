"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/contexts/web3-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ChainSwitcher } from "@/components/chain-switcher"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, FileCheck, Building2, AlertCircle, Plus, ExternalLink, XCircle } from "lucide-react"
import Link from "next/link"
import { getIssuerByAddress, getCertificatesByIssuer, revokeCertificate, type StoredIssuer, type StoredCertificate } from "@/lib/storage"
import { formatAddress } from "@/lib/web3/utils"

export default function IssuerDashboardPage() {
  const router = useRouter()
  const { address, isConnected } = useWeb3()
  const [issuer, setIssuer] = useState<StoredIssuer | null>(null)
  const [certificates, setCertificates] = useState<StoredCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [issuerAddress, setIssuerAddress] = useState<string | null>(null)

  useEffect(() => {
    // Try to get issuer address from localStorage (saved during registration)
    const storedIssuerAddress = localStorage.getItem("issuerAddress")
    if (storedIssuerAddress) {
      setIssuerAddress(storedIssuerAddress)
    } else if (isConnected && address) {
      setIssuerAddress(address)
    }
  }, [isConnected, address])

  useEffect(() => {
    if (!issuerAddress) {
      setLoading(false)
      return
    }

    // Load issuer data using the issuer address
    const issuerData = getIssuerByAddress(issuerAddress)
    if (!issuerData) {
      // Not registered, redirect to registration
      router.push("/register-issuer")
      return
    }

    setIssuer(issuerData)

    // Load certificates
    const certs = getCertificatesByIssuer(issuerAddress)
    setCertificates(certs)
    setLoading(false)
  }, [issuerAddress, router])

  const handleRevokeCertificate = (id: string) => {
    if (confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) {
      revokeCertificate(id)
      // Reload certificates
      if (issuerAddress) {
        const updatedCerts = getCertificatesByIssuer(issuerAddress)
        setCertificates(updatedCerts)
      }
    }
  }

  if (!issuerAddress || !issuer) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">CertifyChain</span>
            </Link>
            <WalletConnectButton />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please register as an issuer first to access the dashboard.</AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">CertifyChain</span>
          </Link>
          <div className="flex items-center gap-3">
            <ChainSwitcher />
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Issuer Dashboard</h1>
              <p className="text-muted-foreground">Manage your certificates and organization profile</p>
            </div>
            <Button asChild>
              <Link href="/issuer/issue-certificate">
                <Plus className="mr-2 h-4 w-4" />
                Issue Certificate
              </Link>
            </Button>
          </div>

          {/* Organization Info */}
          {issuer && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Organization Profile</h2>
                </div>
                <Badge variant={issuer.isActive ? "default" : "secondary"}>
                  {issuer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Organization Name</p>
                  <p className="font-medium">{issuer.organizationName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organization Type</p>
                  <p className="font-medium capitalize">{issuer.organizationType.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{issuer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{issuer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{issuer.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-sm">{formatAddress(issuer.address)}</p>
                </div>
                {issuer.website && (
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={issuer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      {issuer.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{new Date(issuer.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Total Certificates</h3>
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{certificates.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">Issued certificates</p>
            </Card>

            <Card className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Active Certificates</h3>
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold">{certificates.filter((c) => !c.isRevoked).length}</div>
              <p className="mt-1 text-xs text-muted-foreground">Currently valid</p>
            </Card>

            <Card className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Revoked</h3>
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div className="text-3xl font-bold">{certificates.filter((c) => c.isRevoked).length}</div>
              <p className="mt-1 text-xs text-muted-foreground">Revoked certificates</p>
            </Card>
          </div>

          {/* Recent Certificates */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Recent Certificates</h2>
            {certificates.length === 0 ? (
              <div className="py-12 text-center">
                <FileCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="mb-2 text-muted-foreground">No certificates issued yet</p>
                <Button asChild variant="outline">
                  <Link href="/issuer/issue-certificate">Issue Your First Certificate</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.slice(0, 5).map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="font-semibold">{cert.recipientName}</p>
                        <Badge variant={cert.isRevoked ? "destructive" : "default"} className="text-xs">
                          {cert.isRevoked ? "Revoked" : "Active"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{cert.certificateType}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="mb-1 font-mono text-xs text-muted-foreground">{cert.id}</p>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/verify?id=${cert.id}`}>View</Link>
                        </Button>
                      </div>
                      {!cert.isRevoked && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevokeCertificate(cert.id)}
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
