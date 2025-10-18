"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/contexts/web3-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ChainSwitcher } from "@/components/chain-switcher"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, FileCheck, AlertCircle, Upload, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getIssuerByAddress, saveCertificate } from "@/lib/storage"
import { hashDocument } from "@/lib/web3/utils"

export default function IssueCertificatePage() {
  const router = useRouter()
  const { address, isConnected } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [certificateId, setCertificateId] = useState("")
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [issuerAddress, setIssuerAddress] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    certificateType: "",
    metadata: "",
    expiryDate: "",
  })

  useEffect(() => {
    // Try to get issuer address from localStorage
    const storedIssuerAddress = localStorage.getItem("issuerAddress")
    if (storedIssuerAddress) {
      setIssuerAddress(storedIssuerAddress)
    } else if (isConnected && address) {
      setIssuerAddress(address)
    }
  }, [isConnected, address])

  useEffect(() => {
    if (issuerAddress) {
      const issuer = getIssuerByAddress(issuerAddress)
      if (!issuer) {
        router.push("/register-issuer")
      }
    }
  }, [issuerAddress, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocumentFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!issuerAddress) {
      setError("Please register as an issuer first")
      return
    }

    if (!documentFile) {
      setError("Please upload a certificate document")
      return
    }

    const issuer = getIssuerByAddress(issuerAddress)
    if (!issuer) {
      setError("You must be registered as an issuer")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Read file content and hash it
      const fileContent = await documentFile.text()
      const documentHash = await hashDocument(fileContent)

      // Generate certificate ID
      const timestamp = Date.now()
      const id = `CERT-${documentHash.slice(2, 10)}-${timestamp}`

      await new Promise((resolve) => setTimeout(resolve, 2000))
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`

      // Save certificate
      saveCertificate({
        id,
        issuerAddress: issuerAddress,
        issuerName: issuer.organizationName,
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        certificateType: formData.certificateType,
        issueDate: timestamp,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).getTime() : undefined,
        documentHash,
        metadata: formData.metadata,
        isRevoked: false,
        transactionHash: mockTxHash,
      })

      setCertificateId(id)
      setSuccess(true)
    } catch (err) {
      setError("Failed to issue certificate. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            {isConnected && <ChainSwitcher />}
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Issue New Certificate</h1>
            <p className="text-muted-foreground">Create and register a new certificate on the blockchain</p>
          </div>

        {success ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h2 className="mb-2 text-2xl font-bold">Certificate Issued Successfully!</h2>
              <p className="mb-4 text-muted-foreground">The certificate has been registered on the blockchain.</p>
              <div className="mb-6 rounded-lg bg-muted p-4">
                <p className="mb-1 text-sm text-muted-foreground">Certificate ID</p>
                <p className="font-mono text-lg font-semibold">{certificateId}</p>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1" asChild>
                  <Link href={`/verify?id=${certificateId}`}>View Certificate</Link>
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/issuer/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <FileCheck className="h-5 w-5" />
                    <span>Recipient Information</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name *</Label>
                    <Input
                      id="recipientName"
                      required
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email *</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      required
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="space-y-4">
                  <div className="text-lg font-semibold">Certificate Details</div>

                  <div className="space-y-2">
                    <Label htmlFor="certificateType">Certificate Type *</Label>
                    <Select
                      value={formData.certificateType}
                      onValueChange={(value) => setFormData({ ...formData, certificateType: value })}
                      required
                    >
                      <SelectTrigger id="certificateType">
                        <SelectValue placeholder="Select certificate type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="degree">Academic Degree</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="certification">Professional Certification</SelectItem>
                        <SelectItem value="training">Training Completion</SelectItem>
                        <SelectItem value="achievement">Achievement Award</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metadata">Description / Additional Information</Label>
                    <Textarea
                      id="metadata"
                      value={formData.metadata}
                      onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                      placeholder="Bachelor of Science in Computer Science, Graduated with Honors"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <div className="text-lg font-semibold">Certificate Document</div>

                  <div className="space-y-2">
                    <Label htmlFor="document">Upload Certificate File *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="document"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                        required
                      />
                      {documentFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Upload className="h-4 w-4" />
                          <span>{documentFile.name}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, TXT (Max 10MB)</p>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Issuing Certificate..." : "Issue Certificate"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This action will register the certificate on the blockchain. The transaction cannot be undone.
                  </AlertDescription>
                </Alert>
              </form>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
