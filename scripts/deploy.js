// File: scripts/deploy.js
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get contract artifact
  const contractPath = path.join(__dirname, "../artifacts/contracts/PrivateTransferVault.sol/PrivateTransferVault.json");
  const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  
  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  const signer = await provider.getSigner(0);
  const address = await signer.getAddress();
  
  console.log("Deploying contract from:", address);
  
  // Deploy the contract
  const factory = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, signer);
  const contract = await factory.deploy();
  
  console.log("Transaction hash:", contract.deployTransaction.hash);
  await contract.deployed();
  
  const deployedAddress = contract.address;
  console.log("PrivateTransferVault deployed to:", deployedAddress);
  
  // Save the contract address for the relayer
  fs.writeFileSync(
    path.join(__dirname, "../.contract-address"),
    deployedAddress,
    "utf8"
  );
  
  return { contractAddress: deployedAddress };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
