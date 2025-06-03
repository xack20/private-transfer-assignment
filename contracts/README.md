# Smart Contracts

This directory contains the smart contracts for the private transfer system.

## PrivateTransferVault.sol

A privacy-focused smart contract that accepts hashed commitments and emits events without exposing sender, recipient, or amount information.

### Key Features

- **Commitment-Based Privacy**: Only stores a hash of the transaction details
- **No Public Exposure**: No sender or recipient addresses are stored or emitted in events
- **Simple API**: A single function `submitTransfer` accepting a bytes32 commitment
- **Event-Driven**: Emits a `PrivateTransfer` event with the commitment hash

### Usage

The contract should be used in conjunction with an off-chain relayer that:
1. Receives encrypted transaction details
2. Decrypts them in a secure environment (like a TEE)
3. Hashes the details to create a commitment
4. Submits the commitment to this contract

### Commitment Format

The commitment is a keccak256 hash of the ABI-encoded tuple containing:
- sender address
- recipient address
- amount
- timestamp
