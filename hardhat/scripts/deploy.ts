import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying CertificateRegistry...");

  // Connect to the localhost provider
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // Use Account #0 (the first hardhat account) as the deployer/admin
  const adminPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb476cdb7235f9d19e20987cb5860";
  const signer = new ethers.Wallet(adminPrivateKey, provider);

  console.log("Deploying from admin wallet:", await signer.getAddress());

  // Read contract ABI and bytecode
  const contractName = "CertificateRegistry";
  const artifact = await hre.artifacts.readArtifact(contractName);
  
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const certificateRegistry = await factory.deploy();

  await certificateRegistry.waitForDeployment();

  const address = await certificateRegistry.getAddress();
  console.log("CertificateRegistry deployed to:", address);
  console.log("Admin wallet:", await signer.getAddress());

  // Save deployment address to a file for frontend use
  const deploymentInfo = {
    CertificateRegistry: address,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
  };

  const deploymentPath = path.join(process.cwd(), "deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to deployment.json");

  // Also save to frontend directory
  const frontendPath = path.join(
    process.cwd(),
    "..",
    "frontend",
    "certy",
    "public",
    "deployment.json"
  );
  fs.writeFileSync(frontendPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(
    "Deployment info also saved to frontend/certy/public/deployment.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
