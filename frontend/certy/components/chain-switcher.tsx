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
import { SUPPORTED_CHAINS } from "@/lib/web3/config"
import { getChainInfo } from "@/lib/web3/utils"
import { Network, Check } from "lucide-react"

export function ChainSwitcher() {
  const { chainId, isConnected, switchChain } = useWeb3()

  if (!isConnected) {
    return null
  }

  const currentChain = chainId ? getChainInfo(chainId) : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Network className="mr-2 h-4 w-4" />
          {currentChain?.name || "Unknown Network"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(SUPPORTED_CHAINS).map((chain) => (
          <DropdownMenuItem key={chain.id} onClick={() => switchChain(chain.id)}>
            <div className="flex w-full items-center justify-between">
              <span>{chain.name}</span>
              {chainId === chain.id && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
