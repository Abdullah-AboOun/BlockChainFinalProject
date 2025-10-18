#!/bin/bash

# CertifyChain - Simple Start Script
# Starts all services sequentially in the background

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS=()

echo "🚀 Starting CertifyChain..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Function to start a service
start_service() {
    local name=$1
    local dir=$2
    local cmd=$3
    
    echo "Starting $name..."
    cd "$dir"
    $cmd > /tmp/certifychain_${name}.log 2>&1 &
    PIDS+=($!)
    echo -e "${GREEN}✓${NC} $name started (PID: $!)"
    sleep 2
}

# Trap to kill all processes on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    for pid in "${PIDS[@]}"; do
        kill $pid 2>/dev/null
    done
    echo "All services stopped."
}
trap cleanup EXIT INT TERM

# Start services
start_service "Hardhat Node" "$PROJECT_ROOT/hardhat" "npx hardhat node"
start_service "Contract Deploy" "$PROJECT_ROOT/hardhat" "npx hardhat run scripts/deploy.ts --network localhost"
sleep 3
start_service "Backend API" "$PROJECT_ROOT/backend" "pnpm dev"
start_service "Frontend" "$PROJECT_ROOT/frontend/certy" "pnpm dev"

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "📍 URLs:"
echo "   🌐 Frontend:   http://localhost:3000"
echo "   🔌 Backend:    http://localhost:3001"
echo "   ⛓️  Hardhat:    http://localhost:8545"
echo ""
echo "📋 Logs:"
echo "   /tmp/certifychain_Hardhat\\ Node.log"
echo "   /tmp/certifychain_Contract\\ Deploy.log"
echo "   /tmp/certifychain_Backend\\ API.log"
echo "   /tmp/certifychain_Frontend.log"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for all processes
wait
