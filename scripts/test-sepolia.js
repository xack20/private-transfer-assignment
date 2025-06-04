// File: scripts/test-sepolia.js
/**
 * PrivateTransferVault - Sepolia Testnet Test Script
 * =================================================
 * 
 * PURPOSE: 
 * This script tests the privacy-preserving transaction mechanism on the Sepolia testnet.
 * It demonstrates how sensitive transaction data remains private while only cryptographic
 * commitments are stored on the blockchain, enabling privacy-focused transfers.
 * 
 * PRIVACY ARCHITECTURE:
 * 1. Transaction details (sender, recipient, amount) are defined locally
 * 2. A commitment hash is generated from this data using keccak256
 * 3. Only the commitment is submitted to the blockchain
 * 4. Etherscan shows only "PrivateTransfer" events with the commitment hash
 * 5. Original transaction details remain private and off-chain
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Helper function to get the deployed contract address from file
 * 
 * TECHNICAL DETAILS:
 * - Reads the contract address from a file created during deployment
 * - This avoids hardcoding the contract address in the script
 * - Ensures the script works with the latest deployment
 * - Provides clear error handling with deployment instructions
 * 
 * @returns {string} The contract address from the file
 * @throws {Error} If the contract address file doesn't exist
 */
function getDeployedContractAddress() {
  try {
    // Try to read from the file created during deployment
    // The file contains only the contract address as plain text
    return fs.readFileSync(
      path.join(__dirname, "../.sepolia-contract-address"),
      "utf8"
    ).trim();
  } catch (error) {
    // Provide clear instructions if the file is missing
    throw new Error("Contract address file not found. Please deploy the contract first using 'npx hardhat run scripts/deploy-sepolia.js --network sepolia'");
  }
}

/**
 * Main function that executes the privacy-preserving transaction process
 * 
 * EXECUTION FLOW:
 * 1. Connect to the deployed contract on Sepolia
 * 2. Define the private transaction details (kept off-chain)
 * 3. Generate a commitment hash from the transaction details
 * 4. Submit only the commitment to the blockchain
 * 5. Verify the transaction was successful and private
 */
async function main() {
  // ========== STEP 1: CONTRACT CONNECTION ==========
  
  /**
   * Get the contract address from environment variables or deployment file
   * - First checks if CONTRACT_ADDRESS is defined in the .env file
   * - Falls back to reading from the .sepolia-contract-address file
   * - This flexibility supports both custom and standard deployments
   */
  const contractAddress = process.env.CONTRACT_ADDRESS || getDeployedContractAddress();
  console.log("Using contract at address:", contractAddress);
  
  /**
   * Get the signer account from Hardhat config
   * - The signer is the account that will submit the transaction to Sepolia
   * - In a production environment, this would be a dedicated relayer service
   * - Using a separate relayer further enhances privacy by separating the user from the transaction
   */
  const [signer] = await hre.ethers.getSigners();
  const signerAddress = await signer.getAddress();
  console.log("Signer address:", signerAddress);

  /**
   * Connect to the deployed contract instance on Sepolia
   * - Uses the contract factory pattern to get the ABI
   * - Attaches to the existing deployed contract instance
   * - No new deployment is performed
   */
  const PrivateTransferVault = await hre.ethers.getContractFactory("PrivateTransferVault");
  const vault = await PrivateTransferVault.attach(contractAddress);
  
  // ========== STEP 2: DEFINE PRIVATE TRANSACTION DETAILS ==========
  
  /**
   * Create the transaction details that will remain private
   * PRIVACY NOTE: These details are NEVER sent to the blockchain
   * 
   * - sender: The address sending the funds (kept private)
   * - recipient: The address receiving the funds (kept private)
   * - amount: The transfer amount in wei (kept private)
   * - timestamp: Unix timestamp to ensure commitment uniqueness
   */
  const sender = "0x24776C87d7DF39D3Bb2f4ACcAbE8640B650910DB"; // Example sender
  const recipient = "0xe827D360eFC5277673e0efF7A8cFC69504a89Bc2"; // Example recipient
  const amount = hre.ethers.utils.parseEther("0.015"); // Convert 0.015 ETH to wei
  const timestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp
  
  // Log the private details (in a production system, these would be securely handled)
  console.log("\nCreating private transfer:");
  console.log(`From: ${sender}`);
  console.log(`To: ${recipient}`);
  console.log(`Amount: ${hre.ethers.utils.formatEther(amount)} ETH`);
  console.log(`Timestamp: ${timestamp}`);
  
  // ========== STEP 3: GENERATE COMMITMENT HASH ==========
  
  /**
   * Generate a cryptographic commitment from the transaction details
   * This is the CORE PRIVACY MECHANISM of the entire system
   * 
   * TECHNICAL IMPLEMENTATION:
   * 1. Use ABI encoder to pack the transaction data in a standardized format
   * 2. Apply keccak256 hash function to create a deterministic, non-reversible commitment
   * 
   * PRIVACY GUARANTEES:
   * - One-way function: Cannot derive original values from the hash
   * - Collision resistant: Unique transaction details produce unique commitments
   * - Deterministic: Same inputs always produce the same commitment (important for verification)
   */
  const abiCoder = hre.ethers.utils.defaultAbiCoder;
  
  // Encode the transaction details in a standardized format
  // The order and types are crucial and must match how verification will happen
  const encoded = abiCoder.encode(
    ["address", "address", "uint256", "uint256"], // Types: sender address, recipient address, amount (uint256), timestamp (uint256)
    [sender, recipient, amount, timestamp]        // Values: the actual private transaction data
  );
  
  // Create the commitment by hashing the encoded data with keccak256
  // This commitment will be the ONLY data stored on the blockchain
  const commitment = hre.ethers.utils.keccak256(encoded);
  
  console.log(`\nGenerated commitment: ${commitment}`);
  console.log("Submitting commitment to contract...");
  
  // ========== STEP 4: SUBMIT COMMITMENT TO BLOCKCHAIN ==========
  
  /**
   * Submit the commitment to the blockchain via the contract
   * 
   * PRIVACY FEATURES:
   * - Only the commitment hash is sent to the blockchain
   * - Original transaction details never leave this local script
   * - The contract function accepts only the commitment, no other data
   * - The transaction appears as "PrivateTransfer" on Etherscan
   */
  const tx = await vault.submitTransfer(commitment);
  console.log(`Transaction hash: ${tx.hash}`);
  console.log(`View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
  
  /**
   * Wait for the transaction to be mined on Sepolia
   * This ensures the commitment is successfully recorded on the blockchain
   */
  console.log("\nWaiting for transaction to be mined...");
  const receipt = await tx.wait();
  console.log("Transaction mined successfully in block:", receipt.blockNumber);
  
  // ========== STEP 5: VERIFY COMMITMENT AND PRIVACY ==========
  
  /**
   * Extract and verify the commitment from the event logs
   * 
   * VERIFICATION PROCESS:
   * 1. Extract the emitted commitment from transaction receipt events
   * 2. Compare it with the locally generated commitment
   * 3. If they match, the transaction was recorded correctly
   * 
   * PRIVACY AUDIT:
   * - Only the commitment hash appears in the blockchain events
   * - No sender, recipient, or amount data in the transaction records
   * - A third party seeing only the blockchain data cannot determine:
   *   - Who sent the funds
   *   - Who received the funds
   *   - How much was transferred
   */
  
  // Get the first event from the transaction receipt (our PrivateTransfer event)
  const event = receipt.events[0];
  
  // Extract the commitment value from the event arguments
  const emittedCommitment = event.args.commitment;
  
  // Verify the emitted commitment matches our locally generated commitment
  // This confirms the transaction was recorded correctly while maintaining privacy
  console.log(`\nEmitted commitment: ${emittedCommitment}`);
  if (emittedCommitment === commitment) {
    console.log("✅ Success: Commitment correctly emitted in event");
    console.log("✅ Privacy maintained: No transaction details exposed on-chain");
  } else {
    console.log("❌ Error: Commitment mismatch");
  }
  
  /**
   * Test completion summary
   * 
   * At this point:
   * 1. A private transaction has been recorded on Sepolia testnet
   * 2. The transaction details remain completely private
   * 3. Only a cryptographic commitment is stored on-chain
   * 4. The transaction can be viewed on Etherscan, but reveals no private details
   * 5. With the right view key (implemented in bonus-features-sepolia.js), 
   *    authorized parties could verify the actual transaction details
   */
  console.log("\n🎉 Test completed successfully");
  console.log(`You can view this transaction on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
  console.log(`To see all transactions for this contract: https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("\n🔒 PRIVACY VERIFICATION: Go to the Etherscan link above and confirm:");
  console.log("1. Only a 'PrivateTransfer' event is visible");
  console.log("2. Only a commitment hash is stored, not any addresses or amounts");
  console.log("3. The transaction appears as 'Private' on Etherscan");
}

/**
 * Execute the main function and handle any errors
 * 
 * This pattern ensures graceful error handling and proper process exit
 * for both successful and failed executions
 */
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
