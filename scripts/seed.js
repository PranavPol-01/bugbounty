const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const addressFile = path.resolve(__dirname, "../deployed-addresses.json");
  if (!fs.existsSync(addressFile)) {
    console.error("deployed-addresses.json not found. Run deploy first.");
    process.exit(1);
  }
  const addresses = JSON.parse(fs.readFileSync(addressFile, "utf8"));

  const [deployer, governance, researcher] = await ethers.getSigners();
  const vault = await ethers.getContractAt("BugBountyVault", addresses.bugBountyVault, deployer);

  // Get current vault count to use dynamic IDs
  const currentCount = await vault.vaultCount();
  const nextVaultId = Number(currentCount) + 1;

  // Create a vault with 2 ETH funding
  const tx1 = await vault.createVault(
    governance.address,
    ethers.ZeroAddress,
    ethers.parseEther("0.4"),   // critical
    ethers.parseEther("0.2"),   // high
    ethers.parseEther("0.1"),   // medium
    ethers.parseEther("0.05"),  // low
    { value: ethers.parseEther("2.0") }
  );
  await tx1.wait();
  console.log(`Vault #${nextVaultId} created`);

  // Submit a report
  const tx2 = await vault.connect(researcher).submitReport(
    nextVaultId,
    2, // High severity
    "QmSampleIPFSCIDForTestingOnlyNotRealData123456789"
  );
  const rc = await tx2.wait();
  
  // Get report ID from logs or just find the latest for this vault.
  // Given report IDs start at 1 and increment globally, we'll try approving the latest.
  const vaultData = await vault.getVault(nextVaultId);
  // Wait, report IDs are global in BugBountyVault (reportCount)
  // But wait, are they? Let's assume reportCount is global. We don't have getReportCount function exposed, 
  // let's grab the last report array element for this vault.
  const reports = await vault.getVaultReports(nextVaultId);
  const reportId = reports[reports.length - 1];

  console.log(`Report #${reportId} submitted by:`, researcher.address);

  // Approve the report
  const tx3 = await vault.connect(governance).approveReport(reportId, "Confirmed - valid reentrancy bug");
  await tx3.wait();
  console.log(`Report #${reportId} approved`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
