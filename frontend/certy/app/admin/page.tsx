"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWeb3 } from "@/contexts/web3-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ChainSwitcher } from "@/components/chain-switcher"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Users, FileCheck, AlertCircle, Building2, XCircle } from "lucide-react"
import {
  getPlatformStats,
  getIssuers,
  getCertificates,
  revokeCertificate,
  type StoredIssuer,
  type StoredCertificate,
} from "@/lib/storage"
import { formatAddress } from "@/lib/web3/utils"

export default function AdminPage() {
  const { address, isConnected } = useWeb3()
  const [stats, setStats] = useState(getPlatformStats())
  const [issuers, setIssuers] = useState<StoredIssuer[]>([])
  const [certificates, setCertificates] = useState<StoredCertificate[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setStats(getPlatformStats())
    setIssuers(getIssuers())
    setCertificates(getCertificates())
  }

  const handleRevokeCertificate = (id: string) => {
    if (confirm("Are you sure you want to revoke this certificate?")) {
      revokeCertificate(id)
      loadData()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">CertifyChain Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            {isConnected && <ChainSwitcher />}
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please connect your wallet to access the admin dashboard.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage platform operations and monitor activity</p>
            </div>

            {/* Platform Statistics */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Issuers</h3>
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stats.totalIssuers}</div>
                <p className="mt-1 text-xs text-muted-foreground">Registered organizations</p>
              </Card>

              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Certificates</h3>
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stats.totalCertificates}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stats.activeCertificates} active</p>
              </Card>

              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Active Issuers</h3>
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div className="text-3xl font-bold">{issuers.filter((i) => i.isActive).length}</div>
                <p className="mt-1 text-xs text-muted-foreground">Currently active</p>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="issuers" className="space-y-6">
              <TabsList>
                <TabsTrigger value="issuers">Issuers</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
              </TabsList>

              {/* Issuers Tab */}
              <TabsContent value="issuers">
                <Card className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Registered Issuers</h2>
                  {issuers.length === 0 ? (
                    <div className="py-12 text-center">
                      <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No issuers registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {issuers.map((issuer) => (
                        <div key={issuer.address} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <p className="font-semibold">{issuer.organizationName}</p>
                              <Badge variant={issuer.isActive ? "default" : "secondary"}>
                                {issuer.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">
                              {issuer.organizationType.replace("_", " ")} • {issuer.country}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Contact: {issuer.name} ({issuer.email})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="mb-1 font-mono text-xs text-muted-foreground">
                              {formatAddress(issuer.address)}
                            </p>
                            <p className="text-sm font-medium">{issuer.certificatesIssued} certificates</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* Certificates Tab */}
              <TabsContent value="certificates">
                <Card className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">All Certificates</h2>
                  {certificates.length === 0 ? (
                    <div className="py-12 text-center">
                      <FileCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No certificates issued yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <p className="font-semibold">{cert.recipientName}</p>
                              <Badge variant={cert.isRevoked ? "destructive" : "default"}>
                                {cert.isRevoked ? "Revoked" : "Valid"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {cert.certificateType} • {cert.issuerName}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/verify?id=${cert.id}`}>View</Link>
                            </Button>
                            {!cert.isRevoked && (
                              <Button size="sm" variant="destructive" onClick={() => handleRevokeCertificate(cert.id)}>
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
              </TabsContent>
            </Tabs>

            {/* Admin Info */}
            <Card className="border-accent/50 bg-accent/5 p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Admin Access</h3>
                  <p className="text-sm text-muted-foreground">
                    You have full administrative access to manage issuers, certificates, and platform settings. All
                    actions are recorded on the blockchain for transparency.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
