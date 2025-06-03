const ethers = require("ethers");
const fs = require("fs");
const path = require("path");

// Get the contract artifact
const contractPath = path.join(__dirname, "artifacts/contracts/PrivateTransferVault.sol/PrivateTransferVault.json");
const PrivateTransferVault = JSON.parse(fs.readFileSync(contractPath, "utf8"));

// Mock encrypted payload (in reality this would be encrypted)
const encryptedPayload = {
    sender: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", // Account #0 
    recipient: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Account #1
    amount: "1000",
    timestamp: Date.now()
};

// Simulate decryption (just return the payload here)
function decryptPayload(payload) {
    // In real scenario, decrypt the payload here
    console.log("Decrypting payload (simulated)...");
    return payload;
}

// Hash the transfer details to create a commitment
function createCommitment({ sender, recipient, amount, timestamp }) {
    const abiCoder = ethers.utils.defaultAbiCoder;
    return ethers.utils.keccak256(
        abiCoder.encode(
            ["address", "address", "uint256", "uint256"],
            [sender, recipient, amount, timestamp]
        )
    );
}

// Deploy the contract and return its address
async function deployContract(signer) {
    console.log("Deploying PrivateTransferVault contract...");
    const factory = new ethers.ContractFactory(
        PrivateTransferVault.abi,
        PrivateTransferVault.bytecode,
        signer
    );    const contract = await factory.deploy();
    await contract.deployed();
    const address = contract.address;
    console.log("Contract deployed to:", address);
    return address;
}

async function submitCommitment(commitment, contractAddress, signer) {
    console.log("Submitting commitment to contract...");
    const contract = new ethers.Contract(
        contractAddress,
        PrivateTransferVault.abi,
        signer
    );

    const tx = await contract.submitTransfer(commitment);
    console.log("Transaction submitted:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction mined in block:", receipt.blockNumber);    // Parse and display events
    for (const log of receipt.logs) {
        try {
            const parsedLog = contract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === "PrivateTransfer") {
                console.log("PrivateTransfer event emitted with commitment:", parsedLog.args[0]);
            }
        } catch (e) {
            // Not a log we can parse
        }
    }
}

async function main() {
    // Connect to the network
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();
    
    console.log("Relayer address:", await signer.getAddress());

    // Deploy the contract
    const contractAddress = await deployContract(signer);
    
    // RELAYER FUNCTIONALITY
    console.log("\n--- RELAYER FUNCTIONALITY ---");
    
    // Simulate decrypting the payload
    const decrypted = decryptPayload(encryptedPayload);
    console.log("Decrypted payload:", decrypted);

    // Create commitment
    const commitment = createCommitment(decrypted);
    console.log("Commitment:", commitment);

    // Submit commitment to the contract
    await submitCommitment(commitment, contractAddress, signer);
}

main().catch(console.error);
