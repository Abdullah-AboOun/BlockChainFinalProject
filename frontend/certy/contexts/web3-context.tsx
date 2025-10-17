"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { SUPPORTED_CHAINS } from "@/lib/web3/config"
import { isSupportedChain } from "@/lib/web3/utils"
import type { WalletState } from "@/lib/web3/types"

interface Web3ContextType extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  }, [])

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      setWalletState({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: null,
      })
    } else {
      setWalletState((prev) => ({
        ...prev,
        address: accounts[0],
        isConnected: true,
        error: null,
      }))
    }
  }, [])

  // Handle chain changes
  const handleChainChanged = useCallback((chainIdHex: string) => {
    const chainId = Number.parseInt(chainIdHex, 16)
    setWalletState((prev) => ({
      ...prev,
      chainId,
      error: isSupportedChain(chainId) ? null : "Unsupported network. Please switch to a supported network.",
    }))
  }, [])

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState((prev) => ({
        ...prev,
        error: "MetaMask is not installed. Please install MetaMask to continue.",
      }))
      return
    }

    setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const chainIdHex = await window.ethereum.request({
        method: "eth_chainId",
      })
      const chainId = Number.parseInt(chainIdHex, 16)

      setWalletState({
        address: accounts[0],
        chainId,
        isConnected: true,
        isConnecting: false,
        error: isSupportedChain(chainId) ? null : "Unsupported network. Please switch to a supported network.",
      })
    } catch (error: any) {
      console.error("[v0] Wallet connection error:", error)
      setWalletState({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
      })
    }
  }, [isMetaMaskInstalled])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWalletState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    })
  }, [])

  // Switch chain
  const switchChain = useCallback(
    async (chainId: number) => {
      if (!isMetaMaskInstalled()) {
        return
      }

      const chainIdHex = `0x${chainId.toString(16)}`

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        })
      } catch (error: any) {
        // Chain not added to MetaMask
        if (error.code === 4902) {
          const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId)
          if (!chain) return

          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainIdHex,
                  chainName: chain.name,
                  nativeCurrency: chain.nativeCurrency,
                  rpcUrls: [chain.rpcUrl],
                  blockExplorerUrls: [chain.blockExplorer],
                },
              ],
            })
          } catch (addError) {
            console.error("[v0] Failed to add chain:", addError)
          }
        } else {
          console.error("[v0] Failed to switch chain:", error)
        }
      }
    },
    [isMetaMaskInstalled],
  )

  // Set up event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    // Check if already connected
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts: string[]) => {
        if (accounts.length > 0) {
          handleAccountsChanged(accounts)
          window.ethereum.request({ method: "eth_chainId" }).then((chainIdHex: string) => {
            handleChainChanged(chainIdHex)
          })
        }
      })
      .catch((error: any) => {
        console.error("[v0] Failed to check accounts:", error)
      })

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [isMetaMaskInstalled, handleAccountsChanged, handleChainChanged])

  return (
    <Web3Context.Provider
      value={{
        ...walletState,
        connect,
        disconnect,
        switchChain,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum: any
  }
}
