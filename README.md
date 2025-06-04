# Private Transfer Vault - Sepolia Testnet Implementation

## Live Deployment

- **GitHub Repository**: [https://github.com/xack20/private-transfer-assignment](https://github.com/xack20/private-transfer-assignment)
- **Contract Address**: [0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8](https://sepolia.etherscan.io/address/0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8)
- **Example Transaction**: [0x9f327a56c118d6dac1d322bbf271805dd0090f93b7a8cd96f2d322afb9bfd029#eventlog](https://sepolia.etherscan.io/tx/0x9f327a56c118d6dac1d322bbf271805dd0090f93b7a8cd96f2d322afb9bfd029#eventlog)

## Sepolia Deployment Overview

This project implements a privacy-preserving transfer system on Sepolia testnet with the following features:

- **On-chain Privacy**: No transaction details (sender, recipient, amount) are exposed on-chain
- **Commitment-Based Architecture**: Only commitment hashes are stored on the blockchain
- **Sepolia Verified Contract**: Smart contract deployed and verified on Sepolia testnet
- **Enhanced Privacy Features**: Demonstrations of TEE attestation and view key mechanisms

## Privacy Features Verification on Sepolia

Examining the transaction on Sepolia Etherscan confirms all privacy requirements are met:

- ✅ **Clearly marked as "Private"** - Transaction event is named `PrivateTransfer`
- ❌ **No leakage of sensitive data** - No sender, recipient, or amount information exposed on-chain
- ✅ **Only commitment hash visible** - Transaction shows only a commitment hash, preserving privacy

### Sepolia Scripts and Components

- **PrivateTransferVault.sol**: Smart contract deployed to Sepolia testnet
- **deploy-sepolia.js**: Script for deploying the contract to Sepolia
- **test-sepolia.js**: Script to test the deployed contract on Sepolia
- **bonus-features-sepolia.js**: Demonstrates additional privacy features on Sepolia

## How Privacy Works on Sepolia

1. **Off-chain Privacy**: Transaction details (sender, recipient, amount) are kept off-chain
2. **Commitment-Based**: Only a hash of the transaction details is submitted to the Sepolia blockchain
3. **Relayer Architecture**: Transactions are submitted through a relayer, concealing the true transaction originator
4. **View Keys**: (Bonus) Allow authorized parties selective access to transaction data while maintaining privacy from others
5. **Verifiable on Sepolia**: All transactions can be verified on Sepolia Etherscan while preserving privacy

## Working with Sepolia Deployment

### Prerequisites
- Node.js (v14+) and npm
- Sepolia ETH in your wallet (from [Sepolia faucet](https://sepoliafaucet.com/))
- Infura API key for Sepolia access
- Etherscan API key for contract verification

### Setup
The contract is already deployed to Sepolia at [0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8](https://sepolia.etherscan.io/address/0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8), but if you want to run your own tests:

1. Clone the repository:
   ```bash
   git clone https://github.com/xack20/private-transfer-assignment.git
   cd private-transfer-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required keys:
   ```
   INFURA_API_KEY=your_infura_api_key_here
   PRIVATE_KEY=your_private_key_here_without_0x_prefix
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   CONTRACT_ADDRESS=0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8  # Use existing deployment
   ```

4. Compile the smart contract:
   ```bash
   npm run compile
   ```

## Interacting with Sepolia Deployment

### Using the Existing Deployment
The contract is already deployed to Sepolia. You can interact with it directly:

```bash
npm run test:sepolia
```

This test script:
1. Connects to the deployed contract on Sepolia (0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8)
2. Creates a commitment hash from sample transaction data
3. Submits the commitment to the Sepolia blockchain
4. Verifies the emitted event contains the correct commitment

### Deploying Your Own Instance (Optional)
If you want to deploy your own instance to Sepolia:

```bash
npm run deploy:sepolia
```

This will:
1. Deploy a new contract to Sepolia testnet
2. Output the contract address and transaction hash
3. Verify the contract on Etherscan automatically
4. Save the contract address for future script use

### Bonus Features on Sepolia

Run the enhanced privacy features demonstration on Sepolia:

```bash
npm run bonus:sepolia
```

This demonstrates:
1. TEE remote attestation simulation on Sepolia
2. View key generation for selective disclosure
3. Encryption and decryption of transaction data using view keys
4. Commitment submission to the blockchain

## Verifying Privacy on Sepolia

You can verify our privacy implementation by examining our [transactions on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8):

1. **Check our completed transactions on Sepolia**:
   - [Standard Private Transfer](https://sepolia.etherscan.io/tx/0x4a0e0873d71b77a8dddeb1215d6e6e00512af13e27e75848d167fb473b1fd72a)
   - [Bonus Features Demo](https://sepolia.etherscan.io/tx/0x79b17f7a7e8cfd107a3d3afd2c459037578b85a077d26b308c001dff1ff9860d)
   - [Example Transaction](https://sepolia.etherscan.io/tx/0x9f327a56c118d6dac1d322bbf271805dd0090f93b7a8cd96f2d322afb9bfd029)

2. **Examine the "Events" tab on any transaction**:
   - Only `PrivateTransfer` events are emitted
   - Each event contains only a commitment hash, not transaction details

3. **Verify privacy in transaction data**:
   - No sender address (only the relayer's address appears)
   - No recipient address is visible in the transaction data
   - No transfer amount is exposed on-chain
   - Only the commitment hash is stored on the Sepolia blockchain

4. **Confirm contract security**:
   - The contract source code is [verified on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x2C0ADc84933a0a55Be36909c2E54df185EbC64A8#code)
   - The contract shows it only accepts a commitment hash and emits an event

## Sepolia-Based Privacy Features

- **Commitment-based Privacy on Sepolia**: Only cryptographic commitments are stored on the Sepolia blockchain
- **No Public Transfer Data**: Unlike standard Sepolia transactions, sender/recipient addresses and amounts are not exposed
- **Simulated TEE on Sepolia**: Demonstrates how a relayer would handle encrypted data securely in production
- **View Keys with Sepolia Transactions**: Shows selective disclosure while maintaining privacy on public blockchain

## Technical Implementation on Sepolia

### Deployed Smart Contract

The `PrivateTransferVault` contract deployed to Sepolia is minimal by design, accepting only commitment hashes and emitting events. 
No sensitive data is stored or exposed on the Sepolia blockchain.

### Sepolia Transaction Data

All transactions on Sepolia use commitments created by hashing the tuple `(sender, recipient, amount, timestamp)` using keccak256.
This ensures that even when examining the blockchain, no private data can be extracted.

### Bonus Implementation on Sepolia

The bonus implementation on Sepolia demonstrates real-world privacy features:
- Remote attestation for verifying TEE integrity with actual Sepolia transactions
- View keys for controlled access to transaction data while maintaining on-chain privacy
- Private transactions that are publicly verifiable but maintain confidentiality

## License

MIT
