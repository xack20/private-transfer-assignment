/**
 * Hardhat Configuration for Private Transfer Vault
 * ===============================================
 * 
 * PURPOSE:
 * This configuration file sets up the development and deployment environment
 * for the PrivateTransferVault project, focused on Sepolia testnet deployment.
 * 
 * PRIVACY NOTE:
 * While the contract itself preserves privacy, sensitive information like
 * private keys should NEVER be committed to source control. Always use
 * environment variables loaded from a secure .env file.
 */

// Load required Hardhat plugins
require("@nomiclabs/hardhat-ethers");    // For ethers.js integration
require("@nomiclabs/hardhat-etherscan");  // For automatic contract verification
require("dotenv").config();               // Load environment variables from .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Solidity compiler configuration
  solidity: "0.8.28",  // Use a recent, stable Solidity version
  
  // Network configurations
  networks: {
    /**
     * Sepolia testnet configuration
     * 
     * This is the main target network for our privacy-preserving contract
     * All automated tests and demonstrations operate on this network
     * 
     * PRIVACY NOTE:
     * Even on testnet, the contract preserves transaction privacy through
     * the commitment-based mechanism
     */
    sepolia: {
      // Connect to Sepolia via Infura
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      
      // Use private key from environment variables
      // NEVER hardcode private keys in source code
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      
      // Increase gas limit slightly to ensure transactions go through
      gasMultiplier: 1.2
    }
  },
  /**
   * Gas reporter configuration
   * 
   * Used to analyze transaction gas costs during testing
   * This helps optimize contract efficiency and minimize costs
   * 
   * For privacy-preserving contracts, gas efficiency is particularly
   * important to make privacy features economically viable
   */
  gasReporter: {
    // Enable only when specifically requested via environment variable
    enabled: process.env.REPORT_GAS ? true : false,
    
    // Report costs in USD for better context
    currency: "USD",
    
    // Monitor all contracts in the project
    excludeContracts: [],
    src: "./contracts"
  },
  
  /**
   * Etherscan verification configuration
   * 
   * TRANSPARENCY PARADOX:
   * While our contract preserves transaction privacy, the contract code
   * itself should be transparent and verified to build trust in the
   * privacy-preserving mechanism
   * 
   * This allows users to confirm that:
   * 1. The contract truly stores only commitment hashes
   * 2. No backdoors or vulnerabilities exist
   * 3. Privacy claims can be independently verified
   */
  etherscan: {
    // API key for Etherscan verification (from environment variables)
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
