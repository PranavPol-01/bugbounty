const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("BugBountyVault", function () {

  // ── Fixtures ──────────────────────────────────────────────────────────────

  async function deployFixture() {
    const [owner, governance, researcher, other] = await ethers.getSigners();

    const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
    const nft = await ReputationNFT.deploy();
    await nft.waitForDeployment();

    const BugBountyVault = await ethers.getContractFactory("BugBountyVault");
    const vault = await BugBountyVault.deploy(await nft.getAddress());
    await vault.waitForDeployment();

    await nft.setMinterContract(await vault.getAddress());

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Mock USDC", "USDC");
    await token.waitForDeployment();

    return { vault, nft, token, owner, governance, researcher, other };
  }

  async function vaultCreatedFixture() {
    const base = await deployFixture();
    await base.vault.createVault(
      base.governance.address,
      ethers.ZeroAddress,
      ethers.parseEther("0.4"),
      ethers.parseEther("0.2"),
      ethers.parseEther("0.1"),
      ethers.parseEther("0.05"),
      { value: ethers.parseEther("2") }
    );
    return base;
  }

  async function reportSubmittedFixture() {
    const base = await vaultCreatedFixture();
    await base.vault.connect(base.researcher).submitReport(1, 2, "QmTestHash");
    return base;
  }

  async function reportApprovedFixture() {
    const base = await reportSubmittedFixture();
    await base.vault.connect(base.governance).approveReport(1, "Valid bug");
    return base;
  }

  // ── createVault ────────────────────────────────────────────────────────────

  describe("createVault", function () {

    it("Creates an ETH vault and emits VaultCreated", async function () {
      const { vault, governance, owner } = await loadFixture(deployFixture);
      await expect(
        vault.createVault(
          governance.address, ethers.ZeroAddress,
          ethers.parseEther("0.4"), ethers.parseEther("0.2"),
          ethers.parseEther("0.1"), ethers.parseEther("0.05"),
          { value: ethers.parseEther("1.0") }
        )
      ).to.emit(vault, "VaultCreated").withArgs(1, owner.address, governance.address);

      const v = await vault.getVault(1);
      expect(v.programTeam).to.equal(owner.address);
      expect(v.totalFunded).to.equal(ethers.parseEther("1.0"));
      expect(v.active).to.equal(true);
    });

    it("Increments vaultCount", async function () {
      const { vault, governance } = await loadFixture(deployFixture);
      expect(await vault.vaultCount()).to.equal(0);
      await vault.createVault(governance.address, ethers.ZeroAddress, 100, 80, 50, 20);
      expect(await vault.vaultCount()).to.equal(1);
    });

    it("Reverts on zero governance address", async function () {
      const { vault } = await loadFixture(deployFixture);
      await expect(
        vault.createVault(ethers.ZeroAddress, ethers.ZeroAddress, 100, 80, 50, 20)
      ).to.be.revertedWith("Invalid governance address");
    });

    it("Reverts when critical < high (invalid tiers)", async function () {
      const { vault, governance } = await loadFixture(deployFixture);
      await expect(
        vault.createVault(governance.address, ethers.ZeroAddress, 50, 100, 80, 20)
      ).to.be.revertedWith("Invalid reward tiers");
    });

    it("Supports ERC20 reward token", async function () {
      const { vault, governance, token } = await loadFixture(deployFixture);
      await vault.createVault(
        governance.address,
        await token.getAddress(),
        ethers.parseEther("400"), ethers.parseEther("200"),
        ethers.parseEther("100"), ethers.parseEther("50")
      );
      const v = await vault.getVault(1);
      expect(v.rewardToken).to.equal(await token.getAddress());
    });

    it("Emits VaultFunded when ETH is sent", async function () {
      const { vault, governance } = await loadFixture(deployFixture);
      await expect(
        vault.createVault(
          governance.address, ethers.ZeroAddress, 100, 80, 50, 20,
          { value: ethers.parseEther("1") }
        )
      ).to.emit(vault, "VaultFunded");
    });
  });

  // ── fundVault ─────────────────────────────────────────────────────────────

  describe("fundVault", function () {

    it("Adds ETH and emits VaultFunded", async function () {
      const { vault } = await loadFixture(vaultCreatedFixture);
      await expect(vault.fundVault(1, 0, { value: ethers.parseEther("0.5") }))
        .to.emit(vault, "VaultFunded")
        .withArgs(1, ethers.parseEther("0.5"), ethers.ZeroAddress);
      expect((await vault.getVault(1)).totalFunded).to.equal(ethers.parseEther("2.5"));
    });

    it("Reverts if no ETH sent for ETH vault", async function () {
      const { vault } = await loadFixture(vaultCreatedFixture);
      await expect(vault.fundVault(1, 0)).to.be.revertedWith("Send ETH to fund");
    });

    it("Reverts on non-existent vault", async function () {
      const { vault } = await loadFixture(vaultCreatedFixture);
      await expect(
        vault.fundVault(99, 0, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Vault does not exist");
    });
  });

  // ── toggleVault ───────────────────────────────────────────────────────────

  describe("toggleVault", function () {

    it("Pauses an active vault", async function () {
      const { vault } = await loadFixture(vaultCreatedFixture);
      await vault.toggleVault(1);
      expect((await vault.getVault(1)).active).to.equal(false);
    });

    it("Unpauses a paused vault", async function () {
      const { vault } = await loadFixture(vaultCreatedFixture);
      await vault.toggleVault(1);
      await vault.toggleVault(1);
      expect((await vault.getVault(1)).active).to.equal(true);
    });

    it("Reverts if caller is not program team", async function () {
      const { vault, other } = await loadFixture(vaultCreatedFixture);
      await expect(vault.connect(other).toggleVault(1)).to.be.revertedWith("Not program team");
    });

    it("Emits VaultToggled", async function () {
      const { vault } = await loadFixture(vaultCreatedFixture);
      await expect(vault.toggleVault(1)).to.emit(vault, "VaultToggled").withArgs(1, false);
    });
  });

  // ── submitReport ──────────────────────────────────────────────────────────

  describe("submitReport", function () {

    it("Submits a report and emits ReportSubmitted", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      await expect(vault.connect(researcher).submitReport(1, 2, "QmHash123"))
        .to.emit(vault, "ReportSubmitted")
        .withArgs(1, 1, researcher.address, 2);

      const report = await vault.getReport(1);
      expect(report.status).to.equal(0); // Pending
      expect(report.severity).to.equal(2); // High
      expect(report.ipfsHash).to.equal("QmHash123");
      expect(report.researcher).to.equal(researcher.address);
    });

    it("Reserves payout from vault balance", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      await vault.connect(researcher).submitReport(1, 2, "QmHash"); // High = 0.2 ETH
      const balance = await vault.getVaultBalance(1);
      expect(balance).to.equal(ethers.parseEther("1.8"));
    });

    it("Reverts on empty IPFS hash", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      await expect(vault.connect(researcher).submitReport(1, 1, ""))
        .to.be.revertedWith("IPFS hash required");
    });

    it("Reverts on IPFS hash exceeding 128 chars", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      const longHash = "Q".repeat(129);
      await expect(vault.connect(researcher).submitReport(1, 1, longHash))
        .to.be.revertedWith("IPFS hash too long");
    });

    it("Reverts when vault is paused", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      await vault.toggleVault(1);
      await expect(vault.connect(researcher).submitReport(1, 1, "QmHash"))
        .to.be.revertedWith("Vault is not active");
    });

    it("Reverts when vault balance is insufficient", async function () {
      const { vault, governance, researcher } = await loadFixture(deployFixture);
      await vault.createVault(
        governance.address, ethers.ZeroAddress,
        ethers.parseEther("0.4"), ethers.parseEther("0.2"),
        ethers.parseEther("0.1"), ethers.parseEther("0.05"),
        { value: ethers.parseEther("0.01") }
      );
      await expect(vault.connect(researcher).submitReport(1, 3, "QmHash"))
        .to.be.revertedWith("Insufficient vault funds");
    });

    it("Adds reportId to researcher's array", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      await vault.connect(researcher).submitReport(1, 0, "QmHash1");
      await vault.connect(researcher).submitReport(1, 0, "QmHash2");
      const rReports = await vault.getResearcherReports(researcher.address);
      expect(rReports.length).to.equal(2);
    });
  });

  // ── approveReport ─────────────────────────────────────────────────────────

  describe("approveReport", function () {

    it("Approves a pending report", async function () {
      const { vault, governance } = await loadFixture(reportSubmittedFixture);
      await vault.connect(governance).approveReport(1, "Valid reentrancy bug");
      const report = await vault.getReport(1);
      expect(report.status).to.equal(1); // Approved
      expect(report.governanceNote).to.equal("Valid reentrancy bug");
    });

    it("Increments vault approvedCount", async function () {
      const { vault, governance } = await loadFixture(reportSubmittedFixture);
      await vault.connect(governance).approveReport(1, "OK");
      expect((await vault.getVault(1)).approvedCount).to.equal(1);
    });

    it("Emits ReportApproved", async function () {
      const { vault, governance } = await loadFixture(reportSubmittedFixture);
      await expect(vault.connect(governance).approveReport(1, "OK"))
        .to.emit(vault, "ReportApproved");
    });

    it("Reverts if not governance", async function () {
      const { vault, other } = await loadFixture(reportSubmittedFixture);
      await expect(vault.connect(other).approveReport(1, "OK"))
        .to.be.revertedWith("Not governance");
    });

    it("Reverts double approval", async function () {
      const { vault, governance } = await loadFixture(reportSubmittedFixture);
      await vault.connect(governance).approveReport(1, "OK");
      await expect(vault.connect(governance).approveReport(1, "Again"))
        .to.be.revertedWith("Report not pending");
    });

    it("Reverts on non-existent report", async function () {
      const { vault, governance } = await loadFixture(reportSubmittedFixture);
      await expect(vault.connect(governance).approveReport(99, "OK"))
        .to.be.revertedWith("Report does not exist");
    });
  });

  // ── rejectReport ──────────────────────────────────────────────────────────

  describe("rejectReport", function () {

    it("Rejects a pending report and releases reserved funds", async function () {
      const { vault, governance } = await loadFixture(reportSubmittedFixture);
      const balanceBefore = await vault.getVaultBalance(1);
      await vault.connect(governance).rejectReport(1, "Duplicate");
      const balanceAfter = await vault.getVaultBalance(1);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Sets status to Rejected", async function () {
      const { vault, governance } = await loadFixture(reportSubmittedFixture);
      await vault.connect(governance).rejectReport(1, "Not valid");
      expect((await vault.getReport(1)).status).to.equal(2); // Rejected
    });

    it("Reverts if not governance", async function () {
      const { vault, researcher } = await loadFixture(reportSubmittedFixture);
      await expect(vault.connect(researcher).rejectReport(1, "Fake"))
        .to.be.revertedWith("Not governance");
    });
  });

  // ── executePayout ─────────────────────────────────────────────────────────

  describe("executePayout", function () {

    it("Transfers correct ETH amount to researcher", async function () {
      const { vault, researcher } = await loadFixture(reportApprovedFixture);
      const before = await ethers.provider.getBalance(researcher.address);
      const tx = await vault.connect(researcher).executePayout(1);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const after = await ethers.provider.getBalance(researcher.address);
      expect(after - before + gasUsed).to.equal(ethers.parseEther("0.2"));
    });

    it("Sets status to Paid", async function () {
      const { vault, researcher } = await loadFixture(reportApprovedFixture);
      await vault.connect(researcher).executePayout(1);
      expect((await vault.getReport(1)).status).to.equal(3); // Paid
    });

    it("Emits PayoutExecuted", async function () {
      const { vault, researcher } = await loadFixture(reportApprovedFixture);
      await expect(vault.connect(researcher).executePayout(1))
        .to.emit(vault, "PayoutExecuted");
    });

    it("Reverts if not the researcher", async function () {
      const { vault, other } = await loadFixture(reportApprovedFixture);
      await expect(vault.connect(other).executePayout(1))
        .to.be.revertedWith("Not the researcher");
    });

    it("Reverts double payout", async function () {
      const { vault, researcher } = await loadFixture(reportApprovedFixture);
      await vault.connect(researcher).executePayout(1);
      await expect(vault.connect(researcher).executePayout(1))
        .to.be.revertedWith("Report not approved");
    });

    it("Reverts if report status is Pending", async function () {
      const { vault, researcher } = await loadFixture(reportSubmittedFixture);
      await expect(vault.connect(researcher).executePayout(1))
        .to.be.revertedWith("Report not approved");
    });
  });

  // ── mintReputationNFT ─────────────────────────────────────────────────────

  describe("mintReputationNFT", function () {

    it("Mints NFT after paid report", async function () {
      const { vault, nft, researcher } = await loadFixture(reportApprovedFixture);
      await vault.connect(researcher).executePayout(1);
      await expect(vault.connect(researcher).mintReputationNFT(1, "ipfs://QmMeta"))
        .to.emit(vault, "NFTMinted");
      expect(await nft.totalSupply()).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(researcher.address);
    });

    it("Sets nftMinted flag to true", async function () {
      const { vault, researcher } = await loadFixture(reportApprovedFixture);
      await vault.connect(researcher).executePayout(1);
      await vault.connect(researcher).mintReputationNFT(1, "ipfs://QmMeta");
      expect((await vault.getReport(1)).nftMinted).to.equal(true);
    });

    it("Reverts double NFT mint", async function () {
      const { vault, researcher } = await loadFixture(reportApprovedFixture);
      await vault.connect(researcher).executePayout(1);
      await vault.connect(researcher).mintReputationNFT(1, "ipfs://QmMeta");
      await expect(vault.connect(researcher).mintReputationNFT(1, "ipfs://QmMeta2"))
        .to.be.revertedWith("NFT already minted");
    });

    it("Reverts if report not paid", async function () {
      const { vault, researcher } = await loadFixture(reportApprovedFixture);
      await expect(vault.connect(researcher).mintReputationNFT(1, "ipfs://QmMeta"))
        .to.be.revertedWith("Report not paid");
    });

    it("Reverts if not the researcher", async function () {
      const { vault, other, researcher } = await loadFixture(reportApprovedFixture);
      await vault.connect(researcher).executePayout(1);
      await expect(vault.connect(other).mintReputationNFT(1, "ipfs://QmMeta"))
        .to.be.revertedWith("Not the researcher");
    });
  });

  // ── View helpers ──────────────────────────────────────────────────────────

  describe("View functions", function () {

    it("getVaultBalance returns funded minus reserved", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      await vault.connect(researcher).submitReport(1, 2, "QmHash"); // reserves 0.2
      expect(await vault.getVaultBalance(1)).to.equal(ethers.parseEther("1.8"));
    });

    it("getVaultReports returns correct array", async function () {
      const { vault, researcher } = await loadFixture(vaultCreatedFixture);
      await vault.connect(researcher).submitReport(1, 0, "QmA");
      await vault.connect(researcher).submitReport(1, 0, "QmB");
      expect((await vault.getVaultReports(1)).length).to.equal(2);
    });
  });
});
