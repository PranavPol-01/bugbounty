const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ReputationNFT", function () {

  async function deployFixture() {
    const [owner, minter, user, other] = await ethers.getSigners();
    const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
    const nft = await ReputationNFT.deploy();
    await nft.waitForDeployment();
    return { nft, owner, minter, user, other };
  }

  it("Has correct name and symbol", async function () {
    const { nft } = await loadFixture(deployFixture);
    expect(await nft.name()).to.equal("DecentraBounty Reputation");
    expect(await nft.symbol()).to.equal("DBREP");
  });

  it("Owner can set minter contract", async function () {
    const { nft, owner, minter } = await loadFixture(deployFixture);
    await nft.connect(owner).setMinterContract(minter.address);
    expect(await nft.minterContract()).to.equal(minter.address);
  });

  it("Reverts setMinterContract from non-owner", async function () {
    const { nft, other } = await loadFixture(deployFixture);
    await expect(nft.connect(other).setMinterContract(other.address)).to.be.reverted;
  });

  it("Authorized minter can mintTo", async function () {
    const { nft, owner, minter, user } = await loadFixture(deployFixture);
    await nft.connect(owner).setMinterContract(minter.address);
    await expect(nft.connect(minter).mintTo(user.address, "ipfs://QmMeta1"))
      .to.emit(nft, "ReputationMinted")
      .withArgs(user.address, 1, "ipfs://QmMeta1");
    expect(await nft.ownerOf(1)).to.equal(user.address);
    expect(await nft.tokenURI(1)).to.equal("ipfs://QmMeta1");
  });

  it("Unauthorized address cannot mintTo", async function () {
    const { nft, other, user } = await loadFixture(deployFixture);
    await expect(nft.connect(other).mintTo(user.address, "ipfs://fake"))
      .to.be.revertedWith("Not authorized minter");
  });

  it("Token IDs increment sequentially", async function () {
    const { nft, owner, minter, user } = await loadFixture(deployFixture);
    await nft.connect(owner).setMinterContract(minter.address);
    for (let i = 1; i <= 5; i++) {
      await nft.connect(minter).mintTo(user.address, `ipfs://meta${i}`);
    }
    expect(await nft.totalSupply()).to.equal(5);
    expect(await nft.ownerOf(5)).to.equal(user.address);
  });

  it("totalSupply returns correct count", async function () {
    const { nft, owner, minter, user } = await loadFixture(deployFixture);
    await nft.connect(owner).setMinterContract(minter.address);
    expect(await nft.totalSupply()).to.equal(0);
    await nft.connect(minter).mintTo(user.address, "ipfs://a");
    await nft.connect(minter).mintTo(user.address, "ipfs://b");
    expect(await nft.totalSupply()).to.equal(2);
  });
});
