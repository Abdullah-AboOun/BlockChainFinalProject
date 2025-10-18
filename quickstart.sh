#!/bin/bash

# CertifyChain Quick Start Script
# This script sets up and starts the entire platform

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🚀 CertifyChain Platform - Quick Start"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in correct directory
if [ ! -d "backend" ] || [ ! -d "hardhat" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Run this script from the project root directory${NC}"
    exit 1
fi

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found${NC}"
echo -e "${GREEN}✓ pnpm found${NC}"
echo ""

# Install dependencies if needed
echo "📦 Installing dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "   Installing backend dependencies..."
    cd backend
    pnpm install
    cd ..
fi

if [ ! -d "hardhat/node_modules" ]; then
    echo "   Installing hardhat dependencies..."
    cd hardhat
    pnpm install
    cd ..
fi

if [ ! -d "frontend/certy/node_modules" ]; then
    echo "   Installing frontend dependencies..."
    cd frontend/certy
    pnpm install
    cd ../..
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Create .env files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}⚠️  Created backend/.env - update with contract address after deployment${NC}"
fi

if [ ! -f "frontend/certy/.env.local" ]; then
    cp frontend/certy/.env.example frontend/certy/.env.local
    echo -e "${YELLOW}⚠️  Created frontend/certy/.env.local - update with contract address after deployment${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📍 Next steps:"
echo "   1. Start Hardhat node:      npx hardhat node     (from ./hardhat)"
echo "   2. Deploy contract:        npx hardhat run scripts/deploy.ts --network localhost"
echo "   3. Update .env files with the contract address from deployment.json"
echo "   4. Start backend:          pnpm dev              (from ./backend)"
echo "   5. Start frontend:         pnpm dev              (from ./frontend/certy)"
echo ""
echo "📚 Full documentation: See README.md"
echo ""
