"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/contexts/web3-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ChainSwitcher } from "@/components/chain-switcher"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Building2, AlertCircle, CheckCircle2, Copy, Check } from "lucide-react"
import { saveIssuer, getIssuerByAddress } from "@/lib/storage"
import { HARDHAT_WALLETS, copyToClipboard } from "@/lib/hardhat-wallets"
import Link from "next/link"

export default function RegisterIssuerPage() {
  const router = useRouter()
  const { address, isConnected } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationType: "",
    organizationName: "",
    country: "",
    website: "",
  })

  const handleCopyAddress = (address: string) => {
    copyToClipboard(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate wallet selection
    if (!selectedWallet) {
      setError("Please select a Hardhat wallet address")
      return
    }

    // Check if already registered
    const existingIssuer = getIssuerByAddress(selectedWallet)
    if (existingIssuer) {
      setError("This wallet address is already registered as an issuer")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save issuer data
      saveIssuer({
        address: selectedWallet,
        name: formData.name,
        email: formData.email,
        organizationType: formData.organizationType,
        organizationName: formData.organizationName,
        country: formData.country,
        website: formData.website,
        registrationDate: Date.now(),
        isActive: true,
        certificatesIssued: 0,
      })

      setSuccess(true)

      // Redirect to issuer dashboard after 2 seconds
      setTimeout(() => {
        router.push("/issuer/dashboard")
      }, 2000)
    } catch (err) {
      setError("Failed to register issuer. Please try again.")
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
            <h1 className="mb-2 text-3xl font-bold">Register as Certificate Issuer</h1>
            <p className="text-muted-foreground">
              Join the CertifyChain network to issue verified certificates on the blockchain
            </p>
          </div>

          {success ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h2 className="mb-2 text-2xl font-bold">Registration Successful!</h2>
              <p className="mb-4 text-muted-foreground">
                Your organization has been registered as a certificate issuer.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
            </Card>
          ) : (
            <>
              {/* Wallet Selection */}
              <div className="mb-8 space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Select one of the 20 pre-funded Hardhat test wallets below to register your organization.
                  </AlertDescription>
                </Alert>

                <Card className="p-4">
                  <h3 className="mb-3 font-semibold">Available Hardhat Wallets</h3>
                  <div className="grid gap-2 max-h-64 overflow-y-auto">
                    {HARDHAT_WALLETS.map((wallet) => (
                      <div
                        key={wallet.address}
                        onClick={() => setSelectedWallet(wallet.address)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-3 transition-all ${
                          selectedWallet === wallet.address
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-sm">{wallet.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{wallet.address}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyAddress(wallet.address)
                          }}
                          className="ml-2 p-1 hover:bg-secondary rounded"
                        >
                          {copiedAddress === wallet.address ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedWallet && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Selected wallet: <span className="font-mono">{selectedWallet}</span>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Building2 className="h-5 w-5" />
                    <span>Organization Information</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Person Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@organization.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      required
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="Acme University"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select
                      value={formData.organizationType}
                      onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                      required
                    >
                      <SelectTrigger id="organizationType">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="university">University / Educational Institution</SelectItem>
                        <SelectItem value="government">Government Agency</SelectItem>
                        <SelectItem value="corporate">Corporate / Business</SelectItem>
                        <SelectItem value="training">Training Center</SelectItem>
                        <SelectItem value="certification">Certification Body</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="United States"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.organization.com"
                    />
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
                    {isSubmitting ? "Registering..." : "Register as Issuer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  By registering, you agree to comply with all platform policies and regulations regarding certificate
                  issuance and verification.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
