"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, FileCheck, Users, Lock, Globe } from "lucide-react"
import { IssuerProfileCard } from "@/components/issuer-profile-card"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if issuer is logged in
    const issuerAddress = localStorage.getItem("issuerAddress")
    setIsLoggedIn(!!issuerAddress)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">CertifyChain</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="/verify" className="text-sm text-muted-foreground hover:text-foreground">
              Verify Certificate
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <IssuerProfileCard />
                <Button variant="outline" asChild>
                  <Link href="/verify">Verify Certificate</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/issuer/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register-issuer">Register as Issuer</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/verify">Verify Certificate</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Secure Certificate Verification on the Blockchain
          </h1>
          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Document, verify, and authenticate certificates with official authorities using Web3.0 technology.
            Immutable, transparent, and trusted.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register-issuer">Start Issuing</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/verify">Verify a Certificate</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Platform Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Blockchain Security</h3>
              <p className="text-muted-foreground">
                Certificates stored on Web3.0 blockchain for immutable and tamper-proof verification.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <FileCheck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Instant Verification</h3>
              <p className="text-muted-foreground">
                Verify certificate authenticity in seconds with our advanced verification system.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Multi-Entity Support</h3>
              <p className="text-muted-foreground">
                Register as an issuer or verifier. Manage multiple entities from one platform.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure Storage</h3>
              <p className="text-muted-foreground">
                Electronic copies of certificates stored securely with encrypted access control.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Global Access</h3>
              <p className="text-muted-foreground">Access and verify certificates from anywhere in the world, 24/7.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Register Your Entity</h3>
                <p className="text-muted-foreground">
                  Sign up as a certificate issuer or verification requester. Connect your Web3 wallet for blockchain
                  integration.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Issue or Upload Certificates</h3>
                <p className="text-muted-foreground">
                  Issuers can create and document certificates. Upload electronic copies and register them on the
                  blockchain.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Verify Authenticity</h3>
                <p className="text-muted-foreground">
                  Anyone can verify a certificate using its unique ID. Instant verification against blockchain records.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                4
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Manage & Track</h3>
                <p className="text-muted-foreground">
                  Use the admin dashboard to manage certificates and track verifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">Join the future of certificate verification today</p>
          <Button size="lg" asChild>
            <Link href="/register-issuer">Register as Issuer</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-semibold">CertifyChain</span>
              </div>
              <p className="text-sm text-muted-foreground">Secure certificate verification on the blockchain</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="hover:text-foreground">
                    Verify Certificate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">For Issuers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/register-issuer" className="hover:text-foreground">
                    Register as Issuer
                  </Link>
                </li>
                <li>
                  <Link href="/issuer/dashboard" className="hover:text-foreground">
                    Issuer Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/issuer/issue-certificate" className="hover:text-foreground">
                    Issue Certificate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Admin</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/admin" className="hover:text-foreground">
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CertifyChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
