# CertifyChain - Quick Start Checklist

## 🚀 Initial Setup

- [ ] **Clone or navigate to project directory**
  ```bash
  cd /home/abdullah/dev/v0
  ```

- [ ] **Install all dependencies**
  ```bash
  # Backend
  cd backend && pnpm install && cd ..
  
  # Hardhat
  cd hardhat && pnpm install && cd ..
  
  # Frontend
  cd frontend/certy && pnpm install && cd ../..
  ```

- [ ] **Run quickstart script** (optional, but helpful)
  ```bash
  chmod +x quickstart.sh
  ./quickstart.sh
  ```

## 🏃 Running the Platform

### Terminal 1: Hardhat Blockchain Node
```bash
cd hardhat
npx hardhat node
# Keep this running
```

### Terminal 2: Deploy Smart Contract
```bash
cd hardhat
npx hardhat run scripts/deploy.ts --network localhost
# Copy the contract address from output
```

### Terminal 3: Backend API Server
```bash
# Set environment variables in backend/.env
cd backend
cat > .env << EOF
PORT=3001
NODE_ENV=development
JWT_SECRET=dev-secret-key
CONTRACT_ADDRESS=<paste address from deployment>
RPC_URL=http://localhost:8545
HARDHAT_CHAIN_ID=31337
EOF

# Start backend
pnpm dev
# Keep this running
```

### Terminal 4: Frontend Development Server
```bash
# Set environment variables in frontend/certy/.env.local
cd frontend/certy
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS=<paste address from deployment>
EOF

# Start frontend
pnpm dev
# Keep this running
```

## ✅ Verification

- [ ] Hardhat node running on http://localhost:8545
- [ ] Backend API responding at http://localhost:3001/api/health
- [ ] Frontend loading at http://localhost:3000
- [ ] No errors in any terminal

## 🎮 Test the Platform

### 1. User Registration
- [ ] Go to http://localhost:3000/register
- [ ] Create test account
- [ ] Verify login works

### 2. Get Test Wallet
- [ ] Run: `cd hardhat && npx hardhat accounts`
- [ ] Install MetaMask (if not already)
- [ ] Add localhost network (http://localhost:8545, Chain ID: 31337)
- [ ] Import a test account into MetaMask

### 3. Register as Issuer
- [ ] Go to register page
- [ ] Connect MetaMask wallet
- [ ] Fill in organization details
- [ ] Submit registration

### 4. Admin Approval
- [ ] Check database for pending entities
- [ ] (Future: Create admin dashboard to approve)

### 5. Issue Certificate
- [ ] Navigate to issuer dashboard
- [ ] Issue a test certificate
- [ ] Verify it's recorded on blockchain

### 6. Verify Certificate
- [ ] Go to verification page
- [ ] Enter certificate hash
- [ ] Confirm it validates correctly

## 📝 Important Files to Know

### Smart Contract
- `hardhat/contracts/CertificateRegistry.sol` - Main contract logic

### Backend
- `backend/src/index.ts` - Server entry point
- `backend/src/routes/auth.ts` - Authentication endpoints
- `backend/src/routes/entity.ts` - Entity registration endpoints
- `backend/src/routes/certificate.ts` - Certificate management

### Frontend
- `frontend/certy/app/page.tsx` - Home page
- `frontend/certy/app/login/page.tsx` - Login page
- `frontend/certy/app/register/page.tsx` - Registration page
- `frontend/certy/app/register-issuer/page.tsx` - Issuer registration
- `frontend/certy/app/verify/page.tsx` - Certificate verification
- `frontend/certy/lib/web3/config.ts` - Web3 configuration

## 🔧 Useful Commands

```bash
# Reset hardhat accounts (clear blockchain state)
pkill hardhat  # Kill the node
cd hardhat && npx hardhat node  # Restart fresh

# Clear frontend cache
cd frontend/certy && rm -rf .next && pnpm dev

# Clear backend database
rm backend/certy.db

# View blockchain accounts
cd hardhat && npx hardhat accounts

# Check contract deployment
cat hardhat/deployment.json

# View database
cd backend
sqlite3 certy.db
# In sqlite3: .tables (see tables), .schema (see structure)

# Check all running services
lsof -i :8545  # Hardhat
lsof -i :3001  # Backend
lsof -i :3000  # Frontend
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Connection refused: 8545 | Hardhat node not running |
| API not responding | Backend not running or connection issue |
| Contract not found | Run deployment script again |
| Database locked | Kill any existing backend processes |
| Port already in use | Kill process: `pkill -f 'node\|next\|hardhat'` |

## 🎯 Next Steps After Setup

1. **Customize the platform**: Modify contracts, add features
2. **Deploy to testnet**: Follow production setup in README.md
3. **Add more features**: Create admin dashboard, notifications, etc.
4. **Security audit**: Before production deployment
5. **Performance optimization**: Database indexing, caching, etc.

## 📚 Documentation

- **README.md** - Full project documentation
- **SETUP.md** - Detailed setup instructions
- **Smart Contract** - See inline comments in CertificateRegistry.sol
- **API Docs** - See README.md for endpoint specifications

## 💡 Tips

- Use browser DevTools (F12) to debug frontend
- Check terminal logs for backend errors
- MetaMask shows transaction details for blockchain operations
- Database is in `backend/certy.db` (SQLite)
- All data stored locally, reset by deleting database

---

**Ready to get started?** Follow the "Running the Platform" section above! 🚀
