const ethers = require("ethers");

// Mock user wallet private key (for demo only)
const userPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat default account #0

// Mock payload to sign (using actual addresses from Hardhat)
const payload = {
    sender: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", // Account #0
    recipient: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Account #1
    amount: "1000",
    timestamp: Date.now()
};

// Function to sign the payload
async function signPayload(wallet, payload) {
    console.log("Generating commitment and signing payload...");
    
    const abiCoder = ethers.utils.defaultAbiCoder;
    const message = abiCoder.encode(
        ["address", "address", "uint256", "uint256"],
        [payload.sender, payload.recipient, payload.amount, payload.timestamp]
    );
    const messageHash = ethers.utils.keccak256(message);
    
    // Sign the hash
    const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
    
    return { messageHash, signature };
}

// Simulate encryption (in a real scenario, this would encrypt with the relayer's public key)
function encryptForRelayer(payload, signature) {
    console.log("Encrypting payload for relayer (simulated)...");
    // In a real implementation, would encrypt using relayer's public key
    return {
        encryptedPayload: payload,
        signature
    };
}

async function main() {
    console.log("--- USER SIDE DEMO ---");
    
    // Create a wallet instance
    const wallet = new ethers.Wallet(userPrivateKey);
    console.log("User address:", wallet.address);
    
    console.log("Payload to transfer:", payload);

    // Sign the payload to prove authenticity
    const { messageHash, signature } = await signPayload(wallet, payload);
    console.log("Commitment (hash):", messageHash);
    console.log("Signature:", signature);
    
    // Encrypt the payload (simulated)
    const encryptedData = encryptForRelayer(payload, signature);
    
    console.log("\nIn a real implementation, the encrypted payload would be sent to the relayer.");
    console.log("The relayer would then:");
    console.log("1. Verify the signature to authenticate the sender");
    console.log("2. Decrypt the payload in a Trusted Execution Environment (TEE)");
    console.log("3. Compute the commitment and submit to the blockchain");
    console.log("4. The commitment is stored onchain, but sender/recipient remain private");
}

main().catch(console.error);
