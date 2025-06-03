// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PrivateTransferVault
 * @dev A commitment-based private transfer vault that emits events with only a commitment hash.
 * This preserves privacy by not exposing sender, recipient, or amount information on-chain.
 *
 * The commitment is a keccak256 hash of (sender, recipient, amount, timestamp)
 */
contract PrivateTransferVault {
    /**
     * @dev Emitted when a private transfer commitment is submitted
     * @param commitment The keccak256 hash of the transfer details
     */
    event PrivateTransfer(bytes32 indexed commitment);

    /**
     * @dev Submit a transfer commitment to the vault
     * @param commitment The keccak256 hash of the transfer details
     * The commitment should be generated off-chain using: keccak256(abi.encode(sender, recipient, amount, timestamp))
     */
    function submitTransfer(bytes32 commitment) external {
        emit PrivateTransfer(commitment);
    }
}
