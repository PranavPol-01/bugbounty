const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  // 1. Deploy ReputationNFT
  const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
  const nft = await ReputationNFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("ReputationNFT:", nftAddress);

  // 2. Deploy BugBountyVault
  const BugBountyVault = await ethers.getContractFactory("BugBountyVault");
  const vault = await BugBountyVault.deploy(nftAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("BugBountyVault:", vaultAddress);

  // 3. Grant vault minting rights on NFT
  const tx = await nft.setMinterContract(vaultAddress);
  await tx.wait();
  console.log("Minter set on ReputationNFT");

  // 4. Save addresses for frontend use
  const network = await ethers.provider.getNetwork();
  const addresses = {
    bugBountyVault: vaultAddress,
    reputationNFT: nftAddress,
    network: network.name,
    chainId: network.chainId.toString(),
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    "./deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("Saved to deployed-addresses.json");
}

main().catch((err) => { console.error(err); process.exitCode = 1; });
