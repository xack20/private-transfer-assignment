// File: scripts/test-sepolia.js
// Test the PrivateTransferVault on Sepolia testnet
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Helper function to get the deployed contract address
function getDeployedContractAddress() {
  try {
    // Try to read from the file created during deployment
    return fs.readFileSync(
      path.join(__dirname, "../.sepolia-contract-address"),
      "utf8"
    ).trim();
  } catch (error) {
    throw new Error("Contract address file not found. Please deploy the contract first using 'npx hardhat run scripts/deploy-sepolia.js --network sepolia'");
  }
}

async function main() {
  // Get the contract address (from file or specify manually if needed)
  const contractAddress = process.env.CONTRACT_ADDRESS || getDeployedContractAddress();
  console.log("Using contract at address:", contractAddress);
  
  // Get signer
  const [signer] = await hre.ethers.getSigners();
  const signerAddress = await signer.getAddress();
  console.log("Signer address:", signerAddress);

  // Connect to the deployed contract
  const PrivateTransferVault = await hre.ethers.getContractFactory("PrivateTransferVault");
  const vault = await PrivateTransferVault.attach(contractAddress);
  
  // Create a mock transfer
  const sender = signerAddress;
  const recipient = "0x24776C87d7DF39D3Bb2f4ACcAbE8640B650910DB"; // Example recipient
  const amount = hre.ethers.utils.parseEther("0.001");
  const timestamp = Math.floor(Date.now() / 1000);
  
  console.log("\nCreating private transfer:");
  console.log(`From: ${sender}`);
  console.log(`To: ${recipient}`);
  console.log(`Amount: ${hre.ethers.utils.formatEther(amount)} ETH`);
  console.log(`Timestamp: ${timestamp}`);
  
  // Generate commitment
  const abiCoder = hre.ethers.utils.defaultAbiCoder;
  const encoded = abiCoder.encode(
    ["address", "address", "uint256", "uint256"],
    [sender, recipient, amount, timestamp]
  );
  const commitment = hre.ethers.utils.keccak256(encoded);
  
  console.log(`\nGenerated commitment: ${commitment}`);
  console.log("Submitting commitment to contract...");
  
  // Submit the commitment
  const tx = await vault.submitTransfer(commitment);
  console.log(`Transaction hash: ${tx.hash}`);
  console.log(`View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
  
  // Wait for transaction to be mined
  console.log("\nWaiting for transaction to be mined...");
  const receipt = await tx.wait();
  console.log("Transaction mined successfully in block:", receipt.blockNumber);
  
  // Parse event logs
  const event = receipt.events[0];
  const emittedCommitment = event.args.commitment;
  
  console.log(`\nEmitted commitment: ${emittedCommitment}`);
  if (emittedCommitment === commitment) {
    console.log("✅ Success: Commitment correctly emitted in event");
  } else {
    console.log("❌ Error: Commitment mismatch");
  }
  
  console.log("\n🎉 Test completed successfully");
  console.log(`You can view this transaction on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
  console.log(`To see all transactions for this contract: https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
