"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Mail,
  FileText,
  Hash,
  ExternalLink,
  Building2,
  Download,
} from "lucide-react"
import { getCertificateById, type StoredCertificate } from "@/lib/storage"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { IssuerProfileCard } from "@/components/issuer-profile-card"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const [certificateId, setCertificateId] = useState("")
  const [certificate, setCertificate] = useState<StoredCertificate | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if ID is in URL params
  useEffect(() => {
    const issuerAddress = localStorage.getItem("issuerAddress")
    setIsLoggedIn(!!issuerAddress)
    setIsLoading(false)

    const id = searchParams.get("id")
    if (id) {
      setCertificateId(id)
      handleVerify(id)
    }
  }, [searchParams])

  const handleVerify = async (id?: string) => {
    const searchId = id || certificateId

    if (!searchId.trim()) {
      setError("Please enter a certificate ID")
      return
    }

    setIsSearching(true)
    setError("")
    setSearched(false)

    // Simulate blockchain verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const cert = getCertificateById(searchId.trim())

    setCertificate(cert)
    setSearched(true)
    setIsSearching(false)

    if (!cert) {
      setError("Certificate not found. Please check the ID and try again.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">CertifyChain</span>
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn && <IssuerProfileCard />}
            {!isLoggedIn && <WalletConnectButton />}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold">Verify Certificate</h1>
            <p className="text-lg text-muted-foreground">Enter the certificate ID to verify its authenticity</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>Enter the unique certificate ID to check its validity on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-id">Certificate ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cert-id"
                      placeholder="e.g., CERT-a1b2c3d4-1234567890"
                      className="flex-1"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      disabled={isSearching}
                    />
                    <Button type="submit" disabled={isSearching}>
                      <Search className="mr-2 h-4 w-4" />
                      {isSearching ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Certificate Not Found */}
          {searched && !certificate && !error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <XCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
                  <h2 className="mb-2 text-2xl font-bold">Certificate Not Found</h2>
                  <p className="text-muted-foreground">
                    No certificate with ID "{certificateId}" was found on the blockchain.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificate Found */}
          {certificate && (
            <div className="space-y-6">
              {/* Verification Status */}
              <Card
                className={
                  certificate.isRevoked
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-green-500/50 bg-green-500/5"
                }
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    {certificate.isRevoked ? (
                      <XCircle className="h-12 w-12 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    )}
                    <div className="flex-1">
                      <h2 className="mb-1 text-2xl font-bold">
                        {certificate.isRevoked ? "Certificate Revoked" : "Certificate Verified"}
                      </h2>
                      <p className="text-muted-foreground">
                        {certificate.isRevoked
                          ? "This certificate has been revoked and is no longer valid"
                          : "This certificate is authentic and registered on the blockchain"}
                      </p>
                    </div>
                    <Badge variant={certificate.isRevoked ? "destructive" : "default"} className="text-sm">
                      {certificate.isRevoked ? "Revoked" : "Valid"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Document Preview */}
              {certificate.documentData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Certificate Document</CardTitle>
                    <CardDescription>Attached document preview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {certificate.documentData.startsWith("data:image") ? (
                      <div className="w-full rounded-lg border border-border overflow-hidden bg-muted">
                        <img
                          src={certificate.documentData}
                          alt="Certificate Document"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full rounded-lg border border-border p-8 bg-muted text-center">
                        <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {certificate.documentName || "Document"} attached to this certificate
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.href = certificate.documentData!
                            link.download = certificate.documentName || `${certificate.id}.pdf`
                            link.click()
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Document
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Certificate Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Details</CardTitle>
                  <CardDescription>Complete information about this certificate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Recipient Information */}
                  <div>
                    <h3 className="mb-3 font-semibold">Recipient Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Recipient Name</p>
                          <p className="font-medium">{certificate.recipientName}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email Address</p>
                          <p className="font-medium">{certificate.recipientEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Information */}
                  <div>
                    <h3 className="mb-3 font-semibold">Certificate Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Certificate Type</p>
                          <p className="font-medium capitalize">{certificate.certificateType.replace("_", " ")}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Issue Date</p>
                          <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {certificate.expiryDate && (
                        <div className="flex gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Expiry Date</p>
                            <p className="font-medium">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Issuing Organization</p>
                          <p className="font-medium">{certificate.issuerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {certificate.metadata && (
                    <div>
                      <h3 className="mb-2 font-semibold">Description</h3>
                      <p className="text-muted-foreground">{certificate.metadata}</p>
                    </div>
                  )}

                  {/* Blockchain Information */}
                  <div>
                    <h3 className="mb-3 font-semibold">Blockchain Information</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Certificate ID</p>
                          <p className="break-all font-mono text-sm">{certificate.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Document Hash</p>
                          <p className="break-all font-mono text-sm">{certificate.documentHash}</p>
                        </div>
                      </div>
                      {certificate.transactionHash && (
                        <div className="flex gap-3">
                          <ExternalLink className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Transaction Hash</p>
                            <p className="break-all font-mono text-sm">{certificate.transactionHash}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Issuer Address</p>
                          <p className="break-all font-mono text-sm">{certificate.issuerAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                {certificate.documentData && (
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = certificate.documentData!
                      link.download = certificate.documentName || `${certificate.id}.pdf`
                      link.click()
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setCertificate(null)
                    setCertificateId("")
                    setSearched(false)
                  }}
                >
                  Verify Another
                </Button>
              </div>
            </div>
          )}

          {/* Info Card */}
          {!searched && (
            <Card className="border-accent/50 bg-accent/5">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Blockchain Verified</h3>
                    <p className="text-sm text-muted-foreground">
                      All certificates are verified against immutable blockchain records for guaranteed authenticity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
