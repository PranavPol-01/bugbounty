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

  // 5. Update frontend .env with new addresses
  const envPath = "./frontend/.env";
  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, "utf8");
    env = env.replace(/^NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=.*/m, `NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=${vaultAddress}`);
    env = env.replace(/^NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=.*/m, `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${nftAddress}`);
    fs.writeFileSync(envPath, env);
    console.log("Updated frontend/.env with contract addresses");
  }

  // 6. Copy compiled ABIs to frontend
  const vaultArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/BugBountyVault.sol/BugBountyVault.json", "utf8"));
  const nftArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/ReputationNFT.sol/ReputationNFT.json", "utf8"));
  const abiContent = `// Auto-generated from Hardhat compilation artifacts — do not edit manually.
export const BUG_BOUNTY_VAULT_ABI = ${JSON.stringify(vaultArtifact.abi, null, 2)};

export const REPUTATION_NFT_ABI = ${JSON.stringify(nftArtifact.abi, null, 2)};

export const VAULT_ADDRESS = "${vaultAddress}";
export const NFT_ADDRESS = "${nftAddress}";
`;
  fs.writeFileSync("./frontend/src/lib/contractABI.js", abiContent);
  console.log("Updated frontend ABI file and hardcoded contract addresses");
}

main().catch((err) => { console.error(err); process.exitCode = 1; });
