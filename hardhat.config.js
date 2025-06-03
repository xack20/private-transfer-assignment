require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // Default network for testing
    hardhat: {
      chainId: 1337
    },
    // Local development network
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    // Example testnet configuration (you would add your own provider API key)
    sepolia: {
      url: "https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
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
