# CertifyChain - Certificate Verification Platform

A complete Web3-based certificate verification platform built with Next.js, Express, and Hardhat smart contracts. This platform enables secure, decentralized certification management with full blockchain integration.

## 🚀 Features

- **User Registration & Authentication**: JWT-based authentication system
- **Entity Management**: Register as Certificate Issuer or Verification Requester
- **Certificate Issuance**: Issue digital certificates stored on blockchain
- **Certificate Storage**: Store electronic copies of certificates
- **Certificate Verification**: Verify certificate authenticity against blockchain records
- **Admin Dashboard**: Manage and approve entities
- **Issuer Dashboard**: Issue and manage certificates
- **Web3 Integration**: Full Ethereum/Hardhat blockchain integration
- **Local Development**: Run completely locally with Hardhat

## 📋 Prerequisites

- Node.js (v18+)
- pnpm (v10+)
- Git

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd /home/abdullah/dev/v0

# Install backend dependencies
cd backend
pnpm install

# Install hardhat dependencies
cd ../hardhat
pnpm install

# Install frontend dependencies
cd ../frontend/certy
pnpm install

cd /home/abdullah/dev/v0
```

### 2. Start Hardhat Local Network

In a new terminal window:

```bash
cd hardhat

# Start local blockchain node
npx hardhat node
```

This will start a local Hardhat network on `http://localhost:8545` with 20 pre-funded test accounts.

### 3. Deploy Smart Contract

In another terminal window:

```bash
cd hardhat

# Deploy the CertificateRegistry contract
npx hardhat run scripts/deploy.ts --network localhost
```

This will:
- Deploy the `CertificateRegistry` contract
- Save the deployment info to `deployment.json`
- Copy deployment info to frontend's public folder

### 4. Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env

# Update .env with:
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
CONTRACT_ADDRESS=<address from deployment.json>
RPC_URL=http://localhost:8545
HARDHAT_CHAIN_ID=31337
```

**Frontend (.env.local):**
```bash
cd frontend/certy
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS=<address from deployment.json>
EOF
```

### 5. Start Backend Server

In a terminal window:

```bash
cd backend

# Start development server
pnpm dev
```

Backend will run on `http://localhost:3001`

### 6. Start Frontend Development Server

In another terminal window:

```bash
cd frontend/certy

# Start Next.js development server
pnpm dev
```

Frontend will run on `http://localhost:3000`

## 📊 Project Structure

```
/home/abdullah/dev/v0/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── routes/            # API routes (auth, entity, certificate)
│   │   ├── middleware/        # Auth middleware, JWT
│   │   ├── database/          # SQLite database setup
│   │   └── index.ts           # Main server file
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── hardhat/                    # Solidity smart contracts
│   ├── contracts/
│   │   └── CertificateRegistry.sol
│   ├── scripts/
│   │   └── deploy.ts          # Deployment script
│   ├── ignition/
│   │   └── modules/           # Hardhat Ignition modules
│   ├── hardhat.config.ts
│   └── package.json
├── frontend/certy/            # Next.js frontend
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── issuer/
│   │   └── verify/
│   ├── components/
│   ├── lib/
│   │   ├── web3/
│   │   │   ├── config.ts      # Web3 configuration
│   │   │   ├── abi.ts         # Contract ABI
│   │   │   └── utils.ts       # Web3 utilities
│   │   └── storage.ts         # LocalStorage utilities
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/link-wallet` - Link wallet address

### Entities
- `GET /api/entities` - Get all entities (admin only)
- `POST /api/entities/register` - Register as issuer/requester
- `GET /api/entities/my-entity` - Get user's entity
- `PATCH /api/entities/:id/approve` - Approve entity (admin only)
- `PATCH /api/entities/:id/reject` - Reject entity (admin only)

### Certificates
- `POST /api/certificates/store` - Store certificate info
- `GET /api/certificates/my-certificates` - Get user's certificates
- `GET /api/certificates/by-hash/:hash` - Get certificate by hash
- `GET /api/certificates/issued-by/:address` - Get certificates issued by address
- `GET /api/certificates/received-by/:address` - Get certificates received by address

## 🔐 Smart Contract Functions

### CertificateRegistry.sol

**Admin Functions:**
- `registerEntity()` - Register a new entity
- `updateEntityStatus()` - Approve/reject entity
- `deactivateEntity()` - Deactivate entity
- `verifyCertificate()` - Verify a certificate

**Issuer Functions:**
- `issueCertificate()` - Issue new certificate
- `storeDocument()` - Store electronic copy hash

**Query Functions:**
- `getCertificate()` - Get certificate details
- `getEntity()` - Get entity details
- `verifyCertificateByHash()` - Verify by hash
- `getUserCertificates()` - Get user's certificates
- `getIssuedCertificates()` - Get certificates issued by address
- `isApprovedIssuer()` - Check if address is approved issuer
- `isCertificateValid()` - Check certificate validity

## 🔑 Test Accounts

When you run `npx hardhat node`, you'll get 20 pre-funded accounts. Example:

```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476cdb7235f9d19e20987cb5860
```

## 📝 User Flow

### 1. Registration
1. User signs up with email and password
2. Account is created and JWT token is issued
3. User is redirected to entity registration page

### 2. Entity Registration
1. User selects entity type (Issuer or Requester)
2. Provides organization details and wallet address
3. Entity is set to "PENDING" status
4. Admin reviews and approves the entity

### 3. Certificate Issuance (For Issuers)
1. Approved issuer goes to issuer dashboard
2. Issues certificate to recipient with document hash
3. Certificate is stored on blockchain
4. Backend records transaction details

### 4. Certificate Verification
1. User visits verification page
2. Enters or scans certificate hash
3. System verifies against blockchain
4. Displays certificate details if valid

## 🧪 Testing

### Get Admin Account
```bash
# Using hardhat CLI
npx hardhat accounts
```

### Create Test User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Register as Issuer
```bash
curl -X POST http://localhost:3001/api/entities/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "entityType": "ISSUER",
    "organizationName": "Test University",
    "walletAddress": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  }'
```

## 🐛 Troubleshooting

### Issue: Connection refused to localhost:8545
**Solution**: Make sure Hardhat node is running with `npx hardhat node`

### Issue: Contract not deployed
**Solution**: Run deployment script: `npx hardhat run scripts/deploy.ts --network localhost`

### Issue: API returning 401 Unauthorized
**Solution**: Make sure you're including the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Issue: Frontend can't connect to backend
**Solution**: Verify backend is running and check CORS settings. Backend has CORS enabled for all origins by default.

## 📚 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, SQLite3, ethers.js
- **Blockchain**: Solidity, Hardhat, ethers.js
- **Authentication**: JWT, bcryptjs
- **Database**: SQLite (local development)

## 🔄 Deployment to Production

For production deployment:

1. **Update environment variables** in all services
2. **Use a production database** (PostgreSQL recommended) instead of SQLite
3. **Deploy smart contract** to testnet/mainnet
4. **Set up HTTPS** and proper CORS policies
5. **Use environment secrets** for JWT and private keys
6. **Enable proper monitoring and logging**

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📞 Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

---

**Last Updated**: October 17, 2025

**Happy certifying! 🎓**
