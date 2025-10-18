"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle } from "lucide-react"
import { getIssuers } from "@/lib/storage"
import { HARDHAT_WALLETS, copyToClipboard } from "@/lib/hardhat-wallets"
import { IssuerProfileCard } from "@/components/issuer-profile-card"

export default function IssuerLoginPage() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"email" | "wallet">("email")
  const [email, setEmail] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const issuers = getIssuers()
      const issuer = issuers.find((i) => i.email.toLowerCase() === email.toLowerCase())

      if (!issuer) {
        setError("No issuer found with this email address")
        setIsLoading(false)
        return
      }

      // Save the issuer address to localStorage
      localStorage.setItem("issuerAddress", issuer.address)

      // Redirect to dashboard
      router.push("/issuer/dashboard")
    } catch (err) {
      setError("An error occurred during login")
      setIsLoading(false)
    }
  }

  const handleWalletLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const issuers = getIssuers()
      const issuer = issuers.find(
        (i) => i.address.toLowerCase() === selectedWallet.toLowerCase()
      )

      if (!issuer) {
        setError("No issuer found with this wallet address")
        setIsLoading(false)
        return
      }

      // Save the issuer address to localStorage
      localStorage.setItem("issuerAddress", issuer.address)

      // Redirect to dashboard
      router.push("/issuer/dashboard")
    } catch (err) {
      setError("An error occurred during login")
      setIsLoading(false)
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
          <IssuerProfileCard />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-muted/30 px-4 py-12">
        <div className="w-full max-w-md">

        <Card>
          <CardHeader>
            <CardTitle>Issuer Login</CardTitle>
            <CardDescription>Access your issuer dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-2">
              <Button
                variant={loginMethod === "email" ? "default" : "outline"}
                onClick={() => setLoginMethod("email")}
                className="flex-1"
              >
                Email
              </Button>
              <Button
                variant={loginMethod === "wallet" ? "default" : "outline"}
                onClick={() => setLoginMethod("wallet")}
                className="flex-1"
              >
                Wallet
              </Button>
            </div>

            {loginMethod === "email" ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Organization Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleWalletLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Wallet Address</Label>
                  <div className="grid gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {HARDHAT_WALLETS.map((wallet) => (
                      <button
                        key={wallet.address}
                        type="button"
                        onClick={() => setSelectedWallet(wallet.address)}
                        className={`text-left p-2 rounded-lg border-2 transition-all ${
                          selectedWallet === wallet.address
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium text-sm">{wallet.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{wallet.address}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !selectedWallet}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Not registered yet?{" "}
                <Link href="/register-issuer" className="text-primary hover:underline">
                  Register as Issuer
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  )
}
