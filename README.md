# Private Transfer Vault - Blackbox Assignment

## Overview

This project implements a privacy-focused token transfer flow using commitments to maintain privacy on-chain. 
Instead of publishing wallet addresses and amounts publicly, this system uses encrypted payloads and publishes only hashed commitments on-chain.

### Components

- **PrivateTransferVault.sol**: Solidity smart contract that accepts hashed commitments and emits private events.
- **demo-complete-flow.js**: Complete demo showing the user signing a payload, the relayer processing it, and the contract transaction.
- **demo-bonus-features.js**: Bonus implementation showing TEE attestation and view key concepts.
- **demo.js**: Demo script showing how a user signs a transaction payload.
- **relayer.js**: Simulated relayer that accepts encrypted payloads, decrypts them, and submits commitments to the contract.

## Architecture

1. **User** encrypts transaction details (sender, recipient, amount) and signs the commitment hash
2. **Relayer** receives the encrypted payload, decrypts it in a TEE (simulated), and submits the commitment hash on-chain
3. **Smart Contract** stores only the commitment hash, with no way to derive the original details
4. Optional: **View Keys** allow authorized parties limited access to decrypted data

## Prerequisites

- Node.js (v14+)
- npm/yarn
- Hardhat or any Ethereum local node

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/private-transfer-assignment.git
   cd private-transfer-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the smart contract:
   ```bash
   npx hardhat compile
   ```

4. Start a local Ethereum node:
   ```bash
   npx hardhat node
   ```

5. Run tests (optional):
   ```bash
   npx hardhat test
   ```

## Running the Demo

### Option 1: Complete Flow Demo
Run the comprehensive demo that shows the complete flow:

```bash
npm run demo
# or
node demo-complete-flow.js
```

This will:
1. Deploy the contract
2. Create a mock encrypted payload as the user
3. Simulate the relayer receiving and processing the payload
4. Submit the commitment on-chain
5. Show the event emitted by the contract

### Option 2: Step by Step Demo

1. First run the user demo to see how transaction payloads are signed:
   ```bash
   npm run demo:user
   # or
   node demo.js
   ```

2. Then run the relayer to process and submit the commitment:
   ```bash
   npm run demo:relayer
   # or
   node relayer.js
   ```

### Bonus: Remote Attestation & View Keys Demo

Run the bonus implementation showing TEE attestation and view key concepts:

```bash
npm run demo:bonus
# or
node demo-bonus-features.js
```

## Sepolia Testnet Deployment

To deploy and test on Sepolia testnet, follow these steps:

1. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the following:
     ```
     INFURA_API_KEY=your_infura_api_key_here
     PRIVATE_KEY=your_private_key_here_without_0x_prefix
     ETHERSCAN_API_KEY=your_etherscan_api_key_here
     ```

2. Make sure your wallet has Sepolia ETH:
   - Request from [Sepolia faucet](https://sepoliafaucet.com/)

3. Deploy to Sepolia:
   ```bash
   npm run deploy:sepolia
   ```

4. Test the deployed contract on Sepolia:
   ```bash
   npm run test:sepolia
   ```

5. View on Etherscan:
   - After deployment, the console will provide Etherscan links
   - Contract: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
   - Transactions: Check events under the "Events" tab in Etherscan
   
6. Verify the contract on Etherscan (if needed manually):
   ```bash
   npm run verify:sepolia YOUR_CONTRACT_ADDRESS
   ```

## Privacy Features

- **Commitment-based Privacy**: Only cryptographic commitments are stored on-chain
- **No Public Transfer Data**: Unlike ERC-20, sender/recipient addresses are not exposed
- **Simulated TEE**: Represents how a relayer would handle encrypted data securely
- **View Keys**: (Bonus) Demonstrates the concept of selective disclosure

## Technical Details

### Smart Contract

The `PrivateTransferVault` contract is minimal by design, accepting only commitment hashes and emitting events. 
No sensitive data is stored or exposed.

### Commitment Generation

Commitments are created by hashing the tuple `(sender, recipient, amount, timestamp)` using keccak256.

### Bonus Implementation

The bonus implementation demonstrates:
- Remote attestation for verifying TEE integrity
- View keys for controlling access to decrypted transaction data

## License

MIT
