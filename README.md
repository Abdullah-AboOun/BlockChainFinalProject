# CertifyChain 🔗

A decentralized certificate management platform built on blockchain technology. CertifyChain allows organizations to **issue**, **store**, and **verify** tamper-proof digital certificates — eliminating fraud and enabling instant, trustless verification.

## Features

- 🏢 **Entity Management** — Register as an issuer (organization) or requester (individual), with admin approval workflow
- 📜 **Certificate Issuance** — Approved issuers can mint certificates directly on-chain
- ✅ **Tamper-proof Verification** — Verify any certificate by its hash; results are read directly from the blockchain
- 📂 **Document Storage** — Attach document hashes (e.g. IPFS) to on-chain certificate records
- 🔐 **JWT Authentication** — Secure REST API with JSON Web Token-based auth

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity, Hardhat |
| Blockchain Interaction | ethers.js |
| Backend | Node.js, Express, TypeScript |
| Frontend | Next.js 15, React 19, Tailwind CSS, Radix UI |
| Package Manager | pnpm |

## Project Structure

```
BlockChainFinalProject/
├── hardhat/          # Solidity smart contracts & deployment scripts
│   └── contracts/
│       └── CertificateRegistry.sol
├── backend/          # Express REST API
│   └── src/
│       ├── routes/   # auth, entity, certificate endpoints
│       └── index.ts
├── frontend/
│   └── certy/        # Next.js web application
├── quickstart.sh     # One-time setup helper
└── start.sh          # Start all services
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

## Setup

### 1. Install dependencies

```bash
# Backend
cd backend && pnpm install && cd ..

# Hardhat
cd hardhat && pnpm install && cd ..

# Frontend
cd frontend/certy && pnpm install && cd ../..
```

> **Shortcut:** run `./quickstart.sh` from the project root to do all of the above automatically.

### 2. Configure environment variables

```bash
# Backend — copy the example and edit as needed
cp backend/.env backend/.env.local
```

`backend/.env` defaults:

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
CONTRACT_ADDRESS=   # filled in after deployment (step 4)
RPC_URL=http://localhost:8545
HARDHAT_CHAIN_ID=31337
```

### 3. Start the local Hardhat blockchain

```bash
cd hardhat
npx hardhat node
```

Leave this terminal running. The node listens on `http://localhost:8545`.

### 4. Deploy the smart contract

Open a **new terminal**:

```bash
cd hardhat
npx hardhat run scripts/deploy.ts --network localhost
```

Copy the contract address printed in the output and paste it into `backend/.env` as `CONTRACT_ADDRESS`.

### 5. Start the backend

```bash
cd backend
pnpm dev
```

API is available at `http://localhost:3001`.

### 6. Start the frontend

```bash
cd frontend/certy
pnpm dev
```

Open `http://localhost:3000` in your browser.

---

### One-command start (after initial setup)

Once dependencies are installed and `.env` files are configured, you can start all services with:

```bash
./start.sh
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/entities` | List all entities |
| POST | `/api/entities` | Register an entity on-chain |
| GET | `/api/certificates/:id` | Get certificate details |
| POST | `/api/certificates` | Issue a new certificate |
| GET | `/api/health` | Health check |

## License

This project is for educational purposes.
