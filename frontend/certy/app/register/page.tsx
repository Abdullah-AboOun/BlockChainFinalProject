import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">CertifyChain</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Register to start verifying certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup defaultValue="verifier">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="issuer" id="issuer" />
                    <Label htmlFor="issuer" className="font-normal">
                      Certificate Issuer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verifier" id="verifier" />
                    <Label htmlFor="verifier" className="font-normal">
                      Verification Requester
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entity-name">Entity Name</Label>
                <Input id="entity-name" placeholder="Your organization name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or register with</span>
                </div>
              </div>

              <Button variant="outline" className="mt-4 w-full bg-transparent" type="button">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Connect Web3 Wallet
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
