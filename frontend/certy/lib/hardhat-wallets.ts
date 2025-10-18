// Hardhat test wallets - these are the 20 pre-funded accounts from hardhat node
export const HARDHAT_WALLETS = [
  {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb476cdb7235f9d19e20987cb5860",
    name: "Account #0",
  },
  {
    address: "0x70997970c51812e339d9b73b0245ad59c36d569f",
    privateKey: "0x47c86d7530ac28177e550e651b718cc8c4a6b0da652220b2219a120ab0cb128d",
    name: "Account #1",
  },
  {
    address: "0x3c44cdddb6a900756603e8d5e6553e6b9757c415",
    privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e8175e8ecc627",
    name: "Account #2",
  },
  {
    address: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    privateKey: "0x92db14e403d91d5ebff5423aac5f1678acf199fda5fda374d3dd50fd9534e98b",
    name: "Account #3",
  },
  {
    address: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    privateKey: "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
    name: "Account #4",
  },
  {
    address: "0x1cbd3b2770909d4e10f157cabc84c7264073c9be",
    privateKey: "0x707e2b4d8e2327ad0242b76eebdb63d0ea1416eee956c8d7888c93e1900d2cfa",
    name: "Account #5",
  },
  {
    address: "0x0dcd1bf9a1b36ce34237eeafef220fc8be4bf1f5",
    privateKey: "0x1d268417918f803e407f6d7eb3de23060e213ec8532ae37b6cf01bdc626c1c91",
    name: "Account #6",
  },
  {
    address: "0xcd3b766ccdd6ae6d8376597140ea18993f7e8e50",
    privateKey: "0x8ba1a6dfd471c7b60a070a912cffe1d4c45f82efea5 dbaf78092291c87b1c86",
    name: "Account #7",
  },
  {
    address: "0x2546bcd3c84621e4a7c7e560247e9e38ceac4736",
    privateKey: "0xeaa45c86cebed8928f46647cc8abab4da1c52d0cbf1f3b7e3d4a3e4ce5da7b8c",
    name: "Account #8",
  },
  {
    address: "0xbcd4042de499d752f3570db86520dce93768f00a",
    privateKey: "0x60203e528b09b8c5c0b2360ef3a11cdc050322bef1d7291d6f8f3e7e6b5a4c9d",
    name: "Account #9",
  },
]

// Admin wallet is Account #0 (the deployer account in Hardhat)
export const ADMIN_WALLET = HARDHAT_WALLETS[0]

export function getWalletByAddress(address: string) {
  return HARDHAT_WALLETS.find(
    (w) => w.address.toLowerCase() === address.toLowerCase()
  )
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error("Failed to copy:", err)
  })
}
