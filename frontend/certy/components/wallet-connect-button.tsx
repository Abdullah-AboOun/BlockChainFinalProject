"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWeb3 } from "@/contexts/web3-context"
import { formatAddress, getChainInfo } from "@/lib/web3/utils"
import { Wallet, LogOut, ExternalLink, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function WalletConnectButton() {
  const { address, chainId, isConnected, isConnecting, error, connect, disconnect } = useWeb3()

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!isConnected) {
    return (
      <Button onClick={connect} disabled={isConnecting}>
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  const chain = chainId ? getChainInfo(chainId) : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          {formatAddress(address!)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet Info</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2 text-sm">
          <div className="mb-1 text-muted-foreground">Address</div>
          <div className="font-mono text-xs">{address}</div>
        </div>
        {chain && (
          <div className="px-2 py-2 text-sm">
            <div className="mb-1 text-muted-foreground">Network</div>
            <div className="font-medium">{chain.name}</div>
          </div>
        )}
        <DropdownMenuSeparator />
        {chain && (
          <DropdownMenuItem asChild>
            <a href={`${chain.blockExplorer}/address/${address}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={disconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
