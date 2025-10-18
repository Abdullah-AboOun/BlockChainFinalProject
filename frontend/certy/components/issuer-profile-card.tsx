"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getIssuerByAddress, type StoredIssuer } from "@/lib/storage"
import { formatAddress } from "@/lib/web3/utils"
import { Building2, LogOut, LayoutDashboard } from "lucide-react"

export function IssuerProfileCard() {
  const router = useRouter()
  const [issuer, setIssuer] = useState<StoredIssuer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get issuer address from localStorage
    const issuerAddress = localStorage.getItem("issuerAddress")
    if (issuerAddress) {
      const issuerData = getIssuerByAddress(issuerAddress)
      if (issuerData) {
        setIssuer(issuerData)
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("issuerAddress")
    // Redirect to home
    router.push("/")
  }

  const handleDashboard = () => {
    router.push("/issuer/dashboard")
  }

  if (isLoading || !issuer) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">{issuer.organizationName}</span>
          <span className="sm:hidden">{issuer.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Issuer Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-3 text-sm space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Organization</p>
            <p className="font-medium text-sm">{issuer.organizationName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Contact Person</p>
            <p className="font-medium text-sm">{issuer.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="font-medium text-sm break-all">{issuer.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
            <p className="font-mono text-xs">{formatAddress(issuer.address)}</p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant={issuer.isActive ? "default" : "secondary"}>
              {issuer.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {issuer.certificatesIssued} certificates
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Go to Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
