# CertifyChain - Visual Quick Reference

## 🎯 What Is CertifyChain?

A blockchain-based certificate verification platform that allows organizations to issue, store, and verify digital certificates with complete transparency and immutability.

## 👥 User Types

```
┌─────────────────────────────────────────────────────────────────┐
│                          ALL USERS                              │
│                    (Can verify certificates)                    │
└────────────┬──────────────────────────────────┬─────────────────┘
             │                                  │
      ┌──────▼──────────┐              ┌───────▼─────────────┐
      │   ISSUERS       │              │  REQUESTERS         │
      │ (Universities)  │              │ (Employers)         │
      │                 │              │                     │
      │ • Issue certs   │              │ • Verify certs      │
      │ • Manage docs   │              │ • Request docs      │
      │ • Track issued  │              │ • View received     │
      └─────────────────┘              └─────────────────────┘
                │                              │
                └──────────────┬───────────────┘
                               │
                     ┌─────────▼──────────┐
                     │   ADMIN APPROVES   │
                     │   Both types first  │
                     └────────────────────┘
```

## 📱 Platform Pages

```
Home Page (/)
    │
    ├─► Register (new users)
    │       │
    │       └─► Login with credentials
    │           │
    │           └─► Issuer Registration
    │               │
    │               ├─► [Admin Approves]
    │               │
    │               └─► Issuer Dashboard
    │                   ├─ Issue Certificate
    │                   ├─ View Issued
    │                   └─ Manage Entities
    │
    ├─► Login (existing users)
    │       │
    │       └─► Dashboard
    │           ├─ My Certificates
    │           ├─ Profile Settings
    │           └─ Wallet Link
    │
    ├─► Verify (/verify)
    │       │
    │       └─ Enter Certificate Hash
    │           └─ See Verification Result
    │
    └─► Admin Panel (/admin)
            ├─ Approve Entities
            ├─ Manage Users
            └─ View Statistics
```

## 🔄 Certificate Lifecycle

```
STEP 1: ISSUE
┌──────────────────────┐
│ Issuer logs in       │
│ Fills certificate    │
│ data (recipient,     │
│ type, document)      │
└──────────┬───────────┘
           │
           ▼
STEP 2: BLOCKCHAIN RECORD
┌──────────────────────────┐
│ Smart contract records   │
│ • Certificate ID         │
│ • Issuer address        │
│ • Recipient address     │
│ • Document hash         │
│ • Timestamp             │
└──────────┬───────────────┘
           │
           ▼
STEP 3: BACKEND RECORD
┌──────────────────────────┐
│ Database stores:         │
│ • Transaction details    │
│ • Metadata               │
│ • Status info            │
│ • Linked user ID         │
└──────────┬───────────────┘
           │
           ▼
STEP 4: VERIFY
┌──────────────────────────┐
│ Anyone enters hash       │
│ System checks:           │
│ • Database               │
│ • Blockchain             │
│ Shows result ✓ or ✗      │
└──────────────────────────┘
```

## 🏗️ System Components

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js + React)                              │
│ • User Interface                                        │
│ • Wallet Connection                                     │
│ • Form Validation                                       │
└────────────────┬──────────────────────────────────────┬─┘
                 │                                      │
        ┌────────▼─────────┐            ┌──────────────▼──────┐
        │ BACKEND (Express)│            │ BLOCKCHAIN (Hardhat)│
        │ • User Auth      │            │ • Contract Logic    │
        │ • Database       │            │ • Transaction Log   │
        │ • API Routes     │            │ • Account State     │
        └────────┬─────────┘            └─────────────────────┘
                 │
        ┌────────▼─────────┐
        │ DATABASE (SQLite)│
        │ • Users          │
        │ • Entities       │
        │ • Certificates   │
        └──────────────────┘
```

## 🔐 Authentication Flow

```
1. REGISTER
User fills form
    ↓
Password hashed with bcryptjs
    ↓
User stored in database
    ↓
JWT token generated
    ↓
Token sent to frontend

2. LOGIN
User enters email/password
    ↓
Password compared with hash
    ↓
JWT token generated
    ↓
Token stored in localStorage
    ↓
Added to all API requests
    ↓
Backend verifies token
    ↓
Request processed
```

## 📊 Database Schema (Simplified)

```
USERS
├─ id (unique)
├─ email (unique)
├─ password_hash
├─ name
├─ wallet_address
└─ created_at

ENTITIES
├─ id (unique)
├─ user_id (links to USERS)
├─ wallet_address
├─ entity_type (ISSUER/REQUESTER)
├─ organization_name
├─ status (PENDING/APPROVED/REJECTED)
└─ created_at

CERTIFICATES
├─ id (unique)
├─ certificate_id (from blockchain)
├─ issuer_address
├─ recipient_address
├─ certificate_hash (unique)
├─ document_hash
├─ certificate_type
└─ created_at
```

## 🔗 Smart Contract Structure

```
CertificateRegistry.sol

DATA:
├─ admin (address)
├─ certificateCounter (uint256)
├─ entities (mapping)
├─ certificates (mapping)
└─ certificateHashToId (mapping)

ADMIN FUNCTIONS:
├─ registerEntity()
├─ updateEntityStatus()
├─ deactivateEntity()
└─ verifyCertificate()

ISSUER FUNCTIONS:
├─ issueCertificate()
└─ storeDocument()

QUERY FUNCTIONS:
├─ getCertificate()
├─ getEntity()
├─ verifyCertificateByHash()
├─ getUserCertificates()
└─ getIssuedCertificates()

EVENTS:
├─ EntityRegistered
├─ EntityStatusChanged
├─ CertificateIssued
├─ CertificateVerified
└─ DocumentStored
```

## 🚀 Deployment Architecture

```
LOCAL DEVELOPMENT
├─ Frontend:   http://localhost:3000
├─ Backend:    http://localhost:3001
├─ Blockchain: http://localhost:8545
└─ Database:   SQLite file

PRODUCTION (Example)
├─ Frontend:   https://certifychain.com (Vercel)
├─ Backend:    https://api.certifychain.com (AWS/GCP)
├─ Blockchain: Ethereum Mainnet
└─ Database:   PostgreSQL (Cloud)
```

## 📈 User Journey

```
NEW USER FLOW:
1. Visit http://localhost:3000
2. Click "Sign up"
3. Enter email, name, password
4. Account created, receive JWT
5. Redirected to issuer registration
6. (Optional) Register as issuer/requester
7. Start using platform

EXISTING USER FLOW:
1. Go to /login
2. Enter credentials
3. Receive JWT token
4. Access dashboard
5. View certificates or issue new

VERIFICATION FLOW:
1. Go to /verify (no login needed)
2. Enter certificate hash
3. System checks blockchain + database
4. Display results (Valid/Invalid/Not Found)
```

## ⚡ Quick Commands Reference

```bash
# Start Development Environment
cd hardhat && npx hardhat node              # Terminal 1
cd hardhat && npx hardhat run scripts/deploy.ts --network localhost  # Terminal 2
cd backend && pnpm dev                      # Terminal 3
cd frontend/certy && pnpm dev              # Terminal 4

# Check System Status
curl http://localhost:3001/api/health      # Backend running?
npx hardhat accounts                        # Get test accounts
sqlite3 backend/certy.db ".tables"          # See database tables

# Stop Everything
Ctrl+C (in each terminal) or
pkill -f 'hardhat|node|next'
```

## 🎨 UI Components Used

```
From Radix UI + Tailwind CSS:
├─ Button
├─ Card
├─ Input
├─ Label
├─ Select
├─ RadioGroup
├─ Alert
├─ Badge
├─ Tabs
└─ Dialog
```

## 🔌 API Response Examples

```
LOGIN SUCCESS:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}

CERTIFICATE RECORD:
{
  "id": "uuid",
  "certificateId": 1,
  "issuerAddress": "0x...",
  "recipientAddress": "0x...",
  "certificateHash": "QmXx...",
  "documentHash": "QmYy...",
  "certificateType": "Diploma",
  "createdAt": "2025-10-17T..."
}

VERIFICATION RESULT:
{
  "found": true,
  "verified": true,
  "certificate": {...},
  "blockchainConfirmed": true
}
```

## 🛡️ Security Best Practices Implemented

✓ Password hashing with bcryptjs
✓ JWT token authentication
✓ Smart contract owner controls
✓ Admin approval workflow
✓ Input validation on frontend & backend
✓ Error messages don't leak sensitive info
✓ CORS properly configured
✓ Wallet signature support ready

## 📝 Key Files at a Glance

| File | Purpose |
|------|---------|
| CertificateRegistry.sol | Core blockchain logic |
| backend/src/index.ts | Express server setup |
| backend/src/routes/auth.ts | User authentication |
| frontend/app/login/page.tsx | Login interface |
| frontend/app/verify/page.tsx | Certificate verification |
| frontend/lib/web3/config.ts | Blockchain configuration |

---

**Ready to start?** Follow the steps in README.md or QUICKSTART.md!
