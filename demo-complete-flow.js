// Complete demo showing the full private transfer flow
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

// Load the contract artifact
const contractPath = path.join(__dirname, 'artifacts/contracts/PrivateTransferVault.sol/PrivateTransferVault.json');
const contractArtifact = JSON.parse(fs.readFileSync(contractPath));

async function main() {
  console.log('======== BLACKBOX PRIVACY DEMO ========');
  console.log('A demonstration of private transfers using a commitment-based approach');
  console.log('===========================================\n');

  // Connect to the local network
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const [user, relayer] = await Promise.all([
    provider.getSigner(0),
    provider.getSigner(1)
  ]);
  
  const userAddr = await user.getAddress();
  const relayerAddr = await relayer.getAddress();
  
  console.log(`User: ${userAddr}`);
  console.log(`Relayer: ${relayerAddr}\n`);
  
  // PART 1: Deploy the contract
  console.log('1️⃣ DEPLOYING CONTRACT...');
  const factory = new ethers.ContractFactory(
    contractArtifact.abi, 
    contractArtifact.bytecode, 
    relayer
  );
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`   Contract deployed at: ${contract.address}`);
  
  // PART 2: USER CREATES A TRANSFER REQUEST
  console.log('\n2️⃣ USER CREATES ENCRYPTED TRANSFER (Client-side)');
  const transferPayload = {
    sender: userAddr,
    recipient: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Account #2
    amount: "1000",
    timestamp: Date.now()
  };
  console.log(`   Transfer Details (would be encrypted in production):`);
  console.log(`   - From: ${transferPayload.sender}`);
  console.log(`   - To: ${transferPayload.recipient}`);
  console.log(`   - Amount: ${transferPayload.amount}`);
  
  // Create the commitment by hashing the transfer details
  const abiEncoder = ethers.utils.defaultAbiCoder;
  const encodedData = abiEncoder.encode(
    ["address", "address", "uint256", "uint256"],
    [
      transferPayload.sender,
      transferPayload.recipient,
      transferPayload.amount,
      transferPayload.timestamp
    ]
  );
  const commitment = ethers.utils.keccak256(encodedData);
  console.log(`   Generated commitment: ${commitment}`);
  
  // User signs the payload to prove ownership
  const messageHash = ethers.utils.arrayify(commitment);
  const signature = await user.signMessage(messageHash);
  console.log(`   User signature: ${signature}`);
  
  // PART 3: RELAYER RECEIVES AND PROCESSES THE REQUEST
  console.log('\n3️⃣ RELAYER RECEIVES ENCRYPTED PAYLOAD');
  console.log('   Relayer simulates decryption in TEE...');
  console.log('   Relayer validates signature...');
  
  // Verify the signature
  const recoveredAddress = ethers.utils.verifyMessage(messageHash, signature);
  const isValid = recoveredAddress.toLowerCase() === transferPayload.sender.toLowerCase();
  console.log(`   Signature verification: ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
  
  if (!isValid) {
    throw new Error('Invalid signature');
  }
  
  // PART 4: RELAYER SUBMITS THE COMMITMENT TO THE CONTRACT
  console.log('\n4️⃣ RELAYER SUBMITS COMMITMENT TO BLOCKCHAIN');
  const tx = await contract.connect(relayer).submitTransfer(commitment);
  console.log(`   Transaction hash: ${tx.hash}`);
  
  // Wait for transaction to be mined
  const receipt = await tx.wait();
  console.log(`   Mined in block: ${receipt.blockNumber}`);
  
  // Filter for the PrivateTransfer event
  const privateTransferEvent = receipt.events?.find(
    e => e.event === 'PrivateTransfer'
  );
  
  if (privateTransferEvent) {
    console.log('\n✅ PRIVATE TRANSFER SUCCEEDED');
    console.log(`   Event: PrivateTransfer(commitment: ${privateTransferEvent.args.commitment})`);
    console.log('\n   Note: Sender and recipient addresses are NOT exposed on-chain!');
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
