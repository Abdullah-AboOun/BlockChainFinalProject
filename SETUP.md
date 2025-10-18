# Manual Setup Guide

Follow this step-by-step guide to set up CertifyChain locally for development.

## Prerequisites

- Node.js v18+
- pnpm v10+
- Git

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
pnpm install
cd ..

# Hardhat
cd hardhat
pnpm install
cd ..

# Frontend
cd frontend/certy
pnpm install
cd ../..
```

### 2. Start Hardhat Local Network

Open a new terminal and run:

```bash
cd hardhat
npx hardhat node
```

You should see output showing:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

**Keep this terminal open!** The blockchain network must be running.

### 3. Deploy Smart Contract

Open another new terminal and run:

```bash
cd hardhat
npx hardhat run scripts/deploy.ts --network localhost
```

You should see:
```
Deploying CertificateRegistry...
CertificateRegistry deployed to: 0x...
Deployment info saved to deployment.json
```

**Save the contract address!** You'll need it for the environment variables.

### 4. Configure Environment Variables

**Backend Configuration:**

```bash
cd backend
cat > .env << EOF
PORT=3001
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
CONTRACT_ADDRESS=<paste address from step 3>
RPC_URL=http://localhost:8545
HARDHAT_CHAIN_ID=31337
EOF
```

**Frontend Configuration:**

```bash
cd frontend/certy
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS=<paste address from step 3>
EOF
```

### 5. Start Backend Server

Open a new terminal and run:

```bash
cd backend
pnpm dev
```

You should see:
```
Backend server running on http://localhost:3001
```

**Keep this terminal open!**

### 6. Start Frontend Development Server

Open a new terminal and run:

```bash
cd frontend/certy
pnpm dev
```

You should see:
```
> next dev
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
```

## ✅ Verification

All services should now be running:

1. **Hardhat Node** - http://localhost:8545
2. **Backend API** - http://localhost:3001/api/health
3. **Frontend** - http://localhost:3000

Test the API:

```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2025-10-17T..."}
```

## 🔄 Using the Platform

### 1. Create Test Account

1. Go to http://localhost:3000
2. Click "Register" or "Sign up"
3. Fill in your details:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Create Account"

### 2. Register as Issuer

1. You'll be redirected to issuer registration
2. Fill in organization details
3. Connect a wallet (use Hardhat test account)
4. Click "Register as Issuer"

### 3. Get Test Wallets

When you ran `npx hardhat node`, it created 20 test accounts. Get them:

```bash
cd hardhat
npx hardhat accounts
```

Example output:
```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Account #1: 0x70997970C51812e339D9B73b0245ad59c36d569 (10000 ETH)
...
```

To use in MetaMask:
1. Open MetaMask
2. Switch to Custom RPC: http://localhost:8545 (Chain ID: 31337)
3. Click "Import Account"
4. Paste private key from Hardhat

### 4. Issue a Certificate

1. Go to Issuer Dashboard (after being approved)
2. Fill in certificate details
3. Submit to blockchain
4. Certificate is now permanently recorded

### 5. Verify a Certificate

1. Go to Verify page
2. Enter certificate hash
3. See certificate details if it exists
4. Blockchain validation confirms authenticity

## 🛠️ Development Tips

### Database

SQLite database is stored at: `backend/certy.db`

To reset the database:
```bash
rm backend/certy.db
# Restart backend server to recreate
```

### Logs

- **Frontend logs**: Browser console (F12)
- **Backend logs**: Terminal window where `pnpm dev` is running
- **Blockchain logs**: Hardhat node terminal

### API Testing

Use curl or Postman:

```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## ⚠️ Troubleshooting

### Port Already in Use

```bash
# Find and kill process using port 8545 (Hardhat)
lsof -i :8545
kill -9 <PID>

# Port 3001 (Backend)
lsof -i :3001
kill -9 <PID>

# Port 3000 (Frontend)
lsof -i :3000
kill -9 <PID>
```

### MetaMask Connection Issues

1. Clear MetaMask cache
2. Clear browser cache
3. Disconnect and reconnect wallet
4. Verify RPC URL is http://localhost:8545

### Database Errors

- Delete `backend/certy.db` and restart backend
- Check SQLite is properly installed: `pnpm list sqlite3`

### Contract Deployment Issues

```bash
# Clean artifacts and deploy again
cd hardhat
rm -rf artifacts
npx hardhat run scripts/deploy.ts --network localhost
```

## 🎯 Next Steps

- Explore the codebase
- Modify features as needed
- Add more test data
- Set up proper logging
- Prepare for production deployment

## 📚 Useful Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)

---

**Questions?** Check the main README.md for more information.
