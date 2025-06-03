// File: scripts/deploy-sepolia.js
// Deploy PrivateTransferVault to Sepolia testnet
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying PrivateTransferVault to Sepolia testnet...");

  // Get the contract factory
  const PrivateTransferVault = await hre.ethers.getContractFactory(
    "PrivateTransferVault"
  );

  // Deploy the contract
  console.log("Deploying contract...");
  const vault = await PrivateTransferVault.deploy();

  // Wait for deployment to complete
  await vault.deployed();

  console.log(`PrivateTransferVault deployed to: ${vault.address}`);
  console.log(`Transaction hash: ${vault.deployTransaction.hash}`);
  console.log(
    `View on Etherscan: https://sepolia.etherscan.io/address/${vault.address}`
  );
  console.log(
    `View transaction: https://sepolia.etherscan.io/tx/${vault.deployTransaction.hash}`
  );

  // Wait for some time to ensure the contract is mined
  console.log("Waiting for contract to be mined and indexed by Etherscan...");
  await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 60 seconds

  // Verify contract on Etherscan
  console.log("Attempting to verify contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: vault.address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification error:", error.message);
  }

  // Save the contract address to a file
  const fs = require("fs");
  const path = require("path");
  fs.writeFileSync(
    path.join(__dirname, "../.sepolia-contract-address"),
    vault.address,
    "utf8"
  );
  console.log("Contract address saved to .sepolia-contract-address file");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
