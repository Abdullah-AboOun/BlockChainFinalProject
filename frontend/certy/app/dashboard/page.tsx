"use client"

import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ChainSwitcher } from "@/components/chain-switcher"
import { useWeb3 } from "@/contexts/web3-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, FileCheck, Wallet, AlertCircle, Building2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const { isConnected, address } = useWeb3()

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
        <div className="space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your certificates and verifications</p>
          </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Certificates Issued</h3>
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold">0</div>
                <p className="mt-1 text-xs text-muted-foreground">No certificates yet</p>
              </Card>

              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Verifications</h3>
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div className="text-3xl font-bold">0</div>
                <p className="mt-1 text-xs text-muted-foreground">No verifications yet</p>
              </Card>

              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Wallet Balance</h3>
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold">0.00 ETH</div>
                <p className="mt-1 text-xs text-muted-foreground">Connected wallet</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Button size="lg" className="h-auto flex-col items-start gap-2 p-6" asChild>
                  <Link href="/register-issuer">
                    <Building2 className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Register as Issuer</div>
                      <div className="text-xs font-normal opacity-80">Become a certificate issuer</div>
                    </div>
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto flex-col items-start gap-2 p-6 bg-transparent"
                  asChild
                >
                  <Link href="/issuer/dashboard">
                    <FileCheck className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Issuer Dashboard</div>
                      <div className="text-xs font-normal opacity-80">Manage issued certificates</div>
                    </div>
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto flex-col items-start gap-2 p-6 bg-transparent"
                  asChild
                >
                  <Link href="/verify">
                    <Shield className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Verify Certificate</div>
                      <div className="text-xs font-normal opacity-80">Check certificate authenticity</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Getting Started</AlertTitle>
              <AlertDescription>
                You can now issue certificates, verify existing ones, and manage your blockchain transactions.
                Optionally connect your wallet to use custom addresses, or use Hardhat test wallets.
              </AlertDescription>
            </Alert>
          </div>
      </main>
    </div>
  )
}
