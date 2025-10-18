# CertifyChain - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│                    (Frontend - Next.js 15)                          │
│  http://localhost:3000                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Pages:                                                      │  │
│  │  • Home Page (/)                                           │  │
│  │  • Login & Register                                        │  │
│  │  • Dashboard (authenticated users)                        │  │
│  │  • Issuer Dashboard (certificate management)             │  │
│  │  • Admin Panel (entity management)                       │  │
│  │  • Verification Page (validate certificates)            │  │
│  │                                                           │  │
│  │  Web3 Integration:                                        │  │
│  │  • MetaMask connection                                   │  │
│  │  • Wallet operations                                     │  │
│  │  • Smart contract interaction                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
         ↓ HTTP Requests                    ↓ Web3.js Calls
         │                                  │
    ┌────┴──────────────────────────────────┴────┐
    │                                             │
┌───▼──────────────────────────┐   ┌────────────▼───────────────────┐
│   BACKEND API SERVER         │   │  BLOCKCHAIN NETWORK             │
│   (Express.js)               │   │  (Hardhat Local Node)           │
│   http://localhost:3001      │   │  http://localhost:8545          │
│                              │   │                                 │
│ Routes:                      │   │ ┌─────────────────────────────┐│
│ ├─ /api/auth/               │   │ │ CertificateRegistry Contract ││
│ │  ├─ register              │   │ │                              ││
│ │  ├─ login                 │   │ │ Functions:                   ││
│ │  ├─ me                    │   │ │ • registerEntity()           ││
│ │  └─ link-wallet           │   │ │ • issueCertificate()        ││
│ │                           │   │ │ • verifyCertificate()       ││
│ ├─ /api/entities/           │   │ │ • storeDocument()           ││
│ │  ├─ register              │   │ │ • updateEntityStatus()       ││
│ │  ├─ my-entity             │   │ │                              ││
│ │  ├─ approve               │   │ │ Data Structures:             ││
│ │  └─ reject                │   │ │ • Certificate                ││
│ │                           │   │ │ • Entity                     ││
│ ├─ /api/certificates/       │   │ │ • Events                     ││
│ │  ├─ store                 │   │ │                              ││
│ │  ├─ my-certificates       │   │ │ Admin: 0x...                ││
│ │  ├─ by-hash               │   │ └─────────────────────────────┘│
│ │  ├─ issued-by             │   │                                 │
│ │  └─ received-by           │   │ Chain ID: 31337                │
│ │                           │   │ Network: Localhost             │
│ Middleware:                 │   │                                 │
│ • JWT Authentication        │   └─────────────────────────────────┘
│ • CORS                      │
│ • Error Handling            │
│                              │
└──────┬───────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      SQLITE DATABASE                    │
│      File: backend/certy.db            │
│                                        │
│  Tables:                               │
│  ├─ users                              │
│  │  (email, password_hash, wallet_addr)│
│  │                                     │
│  ├─ entities                           │
│  │  (user_id, wallet_addr, status)    │
│  │                                     │
│  └─ certificates                       │
│     (cert_id, issuer, recipient, hash)│
│                                        │
└─────────────────────────────────────────┘
```

## Data Flow

### User Registration Flow
```
User → Frontend Form → Backend /register → Database (users table)
                           ↓
                      Generate JWT Token
                           ↓
                    Return token to frontend
                           ↓
                    Frontend stores in localStorage
```

### Certificate Issuance Flow
```
Issuer → Issuer Dashboard → Form submission
           ↓
      Frontend /issue-certificate
           ↓
      Backend API /certificates/store
           ↓
      Smart Contract Call
      (issueCertificate)
           ↓
      Blockchain records transaction
           ↓
      Backend stores reference in DB
           ↓
      Return success to frontend
```

### Certificate Verification Flow
```
User → Verification Page → Enter certificate hash
         ↓
    Frontend calls backend
    /certificates/by-hash/:hash
         ↓
    Backend checks database
         ↓
    Frontend calls Web3.js
    to query blockchain
         ↓
    Display verification result
    (Valid/Invalid/Not Found)
```

## Component Interaction

### Authentication Flow
```
┌─────────────────┐
│   Frontend      │
│   Login Form    │
└────────┬────────┘
         │
         ▼ Credentials
┌─────────────────────────┐
│ Backend                 │
│ bcrypt.compare()        │
│ jwt.sign()              │
└────────┬────────────────┘
         │
         ▼ Token
┌──────────────────────┐
│ Frontend             │
│ localStorage.token   │
└──────────────────────┘
```

### Entity Registration
```
┌──────────────────────┐
│ Frontend             │
│ Entity Form          │
│ + MetaMask Wallet    │
└────────┬─────────────┘
         │
         ▼ Wallet Address + Details
┌────────────────────────────────┐
│ Backend                        │
│ POST /entities/register        │
│ Validate & Store in Database   │
└────────┬───────────────────────┘
         │
         ▼ Status: PENDING
┌──────────────────────────────┐
│ Admin Dashboard              │
│ Approve/Reject Entity        │
│ Call Smart Contract Update   │
└──────────────────────────────┘
```

## Technology Stack Map

```
                Frontend Layer
        ┌─────────────────────────────┐
        │ Next.js 15 + React 19        │
        │ TypeScript                   │
        │ Tailwind CSS + Radix UI      │
        │ ethers.js (Web3)             │
        └────────────┬──────────────────┘
                     │
              ─────────────────────
             │                     │
             ▼                     ▼
    ┌──────────────────┐  ┌──────────────────┐
    │  Backend Layer   │  │  Blockchain      │
    │ ┌──────────────┐ │  │ ┌──────────────┐ │
    │ │ Express.js   │ │  │ │ Hardhat      │ │
    │ │ TypeScript   │ │  │ │ Solidity     │ │
    │ │ ethers.js    │ │  │ │ Smart Ct.    │ │
    │ └──────────────┘ │  │ └──────────────┘ │
    └────────┬─────────┘  └──────────────────┘
             │
             ▼
    ┌──────────────────┐
    │  Data Layer      │
    │ ┌──────────────┐ │
    │ │ SQLite       │ │
    │ │ Local DB     │ │
    │ └──────────────┘ │
    └──────────────────┘
```

## Network Connectivity

```
Local Machine (Development)
│
├─ http://localhost:3000 ─────► Frontend (Next.js)
│                                └─ Port: 3000
│
├─ http://localhost:3001 ─────► Backend API (Express)
│                                └─ Port: 3001
│                                └─ Blockchain RPC Calls
│
└─ http://localhost:8545 ─────► Hardhat Blockchain Node
                                 └─ Port: 8545
                                 └─ Chain ID: 31337
```

## File Structure

```
/home/abdullah/dev/v0/
│
├── frontend/certy/              # Next.js Frontend
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # Home page
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── issuer/
│   │   ├── admin/
│   │   ├── verify/
│   │   └── layout.tsx
│   │
│   ├── components/              # React Components
│   │   └── ui/                  # Reusable UI components
│   │
│   ├── lib/                     # Utilities
│   │   ├── web3/                # Web3 configuration & helpers
│   │   │   ├── config.ts
│   │   │   ├── abi.ts
│   │   │   └── utils.ts
│   │   └── storage.ts
│   │
│   ├── contexts/                # React Context
│   │   └── web3-context.tsx     # MetaMask/Web3 provider
│   │
│   └── package.json
│
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── routes/              # API Routes
│   │   │   ├── auth.ts
│   │   │   ├── entity.ts
│   │   │   └── certificate.ts
│   │   │
│   │   ├── middleware/          # Express Middleware
│   │   │   └── auth.ts          # JWT verification
│   │   │
│   │   ├── database/            # Database
│   │   │   └── db.ts            # SQLite setup
│   │   │
│   │   └── index.ts             # Server entry point
│   │
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── hardhat/                     # Smart Contracts
│   ├── contracts/
│   │   └── CertificateRegistry.sol  # Main contract
│   │
│   ├── scripts/
│   │   └── deploy.ts            # Deployment script
│   │
│   ├── ignition/
│   │   └── modules/
│   │
│   ├── hardhat.config.ts
│   └── package.json
│
├── README.md                    # Main documentation
├── SETUP.md                     # Detailed setup guide
├── QUICKSTART.md                # Quick start checklist
├── ARCHITECTURE.md              # This file
├── quickstart.sh                # Setup script
└── start-dev.sh                 # Development startup
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS=0x...
```

### Backend (.env)
```
PORT=3001
NODE_ENV=development
JWT_SECRET=secret-key
CONTRACT_ADDRESS=0x...
RPC_URL=http://localhost:8545
HARDHAT_CHAIN_ID=31337
```

## Security Considerations

1. **Authentication**: JWT tokens stored in localStorage
2. **Smart Contract**: Admin controls entity approval
3. **Database**: Local SQLite (not for production)
4. **Wallet**: MetaMask handles private keys securely
5. **API**: CORS enabled for all origins (dev only)

## Scalability Notes

For production:
- Replace SQLite with PostgreSQL
- Add Redis for caching
- Deploy to AWS/GCP/Azure
- Use testnet (Sepolia) or mainnet
- Implement proper error handling
- Add monitoring and logging
- Set up CI/CD pipeline

---

**Last Updated**: October 17, 2025
