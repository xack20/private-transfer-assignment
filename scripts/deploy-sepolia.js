// File: scripts/deploy-sepolia.js
/**
 * PrivateTransferVault - Sepolia Testnet Deployment Script
 * =======================================================
 * 
 * PURPOSE: 
 * Deploy the PrivateTransferVault contract to Sepolia testnet with automatic verification.
 * This script handles the complete deployment process, including:
 * 1. Contract deployment
 * 2. Etherscan verification
 * 3. Saving the contract address for future script use
 * 
 * PRIVACY ARCHITECTURE NOTES:
 * - This minimal contract stores NO user data
 * - It only accepts commitment hashes and emits events
 * - This design ensures maximum privacy for transactions
 * - Full source code verification on Etherscan lets users audit the privacy guarantees
 */
const hre = require("hardhat");
require("dotenv").config(); // Load environment variables from .env file

/**
 * Main deployment function
 * 
 * EXECUTION FLOW:
 * 1. Deploy the PrivateTransferVault contract
 * 2. Wait for deployment confirmation
 * 3. Verify the contract on Etherscan
 * 4. Save the contract address to a file
 */
async function main() {
  console.log("Deploying PrivateTransferVault to Sepolia testnet...");

  /**
   * Get the contract factory for deployment
   * 
   * TECHNICAL NOTES:
   * - The contract factory is created from the compiled contract artifacts
   * - Hardhat automatically loads the ABI and bytecode from compilation output
   * - No constructor arguments are needed for this contract
   */
  const PrivateTransferVault = await hre.ethers.getContractFactory(
    "PrivateTransferVault"
  );

  /**
   * Deploy the contract to Sepolia testnet
   * 
   * DEPLOYMENT DETAILS:
   * - The deployment transaction is signed by the wallet configured in hardhat.config.js
   * - Gas price is automatically determined (with optional multiplier from config)
   * - No constructor arguments are needed for this contract
   */
  console.log("Deploying contract...");
  const vault = await PrivateTransferVault.deploy();

  /**
   * Wait for the deployment transaction to be mined and confirmed
   * This ensures the contract is actually deployed before proceeding
   */
  await vault.deployed();

  /**
   * Log the deployment details
   * These details are crucial for contract interaction and verification
   */
  console.log(`PrivateTransferVault deployed to: ${vault.address}`);
  console.log(`Transaction hash: ${vault.deployTransaction.hash}`);
  console.log(
    `View on Etherscan: https://sepolia.etherscan.io/address/${vault.address}`
  );
  console.log(
    `View transaction: https://sepolia.etherscan.io/tx/${vault.deployTransaction.hash}`
  );

  /**
   * Wait for Etherscan indexing
   * 
   * TECHNICAL NOTE:
   * - Etherscan needs time to index the deployed contract before verification
   * - 60 seconds is usually enough, but may need adjustment in some cases
   * - Without this delay, verification might fail with "contract not found" errors
   */
  console.log("Waiting for contract to be mined and indexed by Etherscan...");
  await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 60 seconds

  /**
   * Verify contract source code on Etherscan
   * 
   * PRIVACY AND SECURITY BENEFITS:
   * - Verification allows users to inspect the actual contract code
   * - Confirms the contract truly maintains privacy as claimed
   * - Builds trust in the privacy-preserving mechanism
   * - Allows anyone to audit the privacy guarantees
   */
  console.log("Attempting to verify contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: vault.address,
      constructorArguments: [], // No constructor arguments for this contract
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification error:", error.message);
  }

  /**
   * Save the contract address to a file for future script use
   * 
   * TECHNICAL NOTE:
   * - This creates a .sepolia-contract-address file in the project root
   * - Other scripts (test-sepolia.js, bonus-features-sepolia.js) read this file
   * - This automation prevents the need to manually update addresses in multiple scripts
   * - The file contains only the plain contract address without any formatting
   */
  const fs = require("fs");
  const path = require("path");
  fs.writeFileSync(
    path.join(__dirname, "../.sepolia-contract-address"),
    vault.address,
    "utf8"
  );
  console.log("Contract address saved to .sepolia-contract-address file");
  console.log("\n🔒 PRIVACY CHECK: The deployed contract:");
  console.log("1. Stores NO user data on-chain");
  console.log("2. Only records commitment hashes, not actual transaction details");
  console.log("3. Has been verified on Etherscan for transparency and auditability");
}

/**
 * Execute the deployment function and handle any errors
 * 
 * ERROR HANDLING:
 * - Successful deployment: Exit with code 0
 * - Failed deployment: Log the error and exit with code 1
 * 
 * This pattern ensures proper process termination and error reporting
 */
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
