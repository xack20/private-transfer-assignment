# Deployment Scripts

This directory contains scripts for deploying the PrivateTransferVault contract.

## deploy.js

This script deploys the PrivateTransferVault contract to a local or remote network and saves the deployed address to a `.contract-address` file.

### Usage

```bash
# Using the script directly
node scripts/deploy.js

# Or using the npm script
npm run deploy
```

### What it does

1. Loads the compiled contract artifact
2. Connects to the network using ethers.js
3. Deploys the contract
4. Saves the contract address to `.contract-address` for later use by other scripts
