require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // Sepolia testnet configuration
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasMultiplier: 1.2
    }
  },
  // For gas reporting in tests
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
    excludeContracts: [],
    src: "./contracts"
  },
  // For etherscan verification
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
