// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ReputationNFT.sol";

/// @title BugBountyVault
/// @notice Trustless on-chain bug bounty escrow with ETH and ERC20 support
contract BugBountyVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ─── Enums ────────────────────────────────────────────────────────────────
    enum Severity { Low, Medium, High, Critical }
    enum ReportStatus { Pending, Approved, Rejected, Paid }

    // ─── Structs ──────────────────────────────────────────────────────────────
    struct RewardConfig {
        uint256 critical;
        uint256 high;
        uint256 medium;
        uint256 low;
    }

    struct Vault {
        uint256 id;
        address programTeam;
        address governanceAuthority;
        address rewardToken;          // address(0) = ETH
        RewardConfig rewards;
        uint256 totalFunded;
        uint256 totalPaid;
        uint256 approvedCount;
        bool active;
        uint256 createdAt;
    }

    struct Report {
        uint256 id;
        uint256 vaultId;
        address researcher;
        Severity severity;
        string ipfsHash;
        ReportStatus status;
        uint256 payout;
        uint256 submittedAt;
        uint256 resolvedAt;
        string governanceNote;
        bool nftMinted;
    }

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 public vaultCount;
    uint256 public reportCount;

    mapping(uint256 => Vault) public vaults;
    mapping(uint256 => Report) public reports;
    mapping(uint256 => uint256[]) public vaultReports;
    mapping(address => uint256[]) public researcherReports;

    ReputationNFT public reputationNFT;

    // ─── Events ───────────────────────────────────────────────────────────────
    event VaultCreated(uint256 indexed vaultId, address indexed programTeam, address governanceAuthority);
    event VaultFunded(uint256 indexed vaultId, uint256 amount, address token);
    event VaultToggled(uint256 indexed vaultId, bool active);
    event ReportSubmitted(uint256 indexed reportId, uint256 indexed vaultId, address indexed researcher, Severity severity);
    event ReportApproved(uint256 indexed reportId, string reason, uint256 timestamp);
    event ReportRejected(uint256 indexed reportId, string reason);
    event PayoutExecuted(uint256 indexed reportId, address indexed researcher, uint256 amount);
    event NFTMinted(uint256 indexed reportId, address indexed researcher, uint256 tokenId);

    // ─── Modifiers ────────────────────────────────────────────────────────────
    modifier onlyGovernance(uint256 vaultId) {
        require(msg.sender == vaults[vaultId].governanceAuthority, "Not governance authority");
        _;
    }

    modifier onlyProgramTeam(uint256 vaultId) {
        require(msg.sender == vaults[vaultId].programTeam, "Not program team");
        _;
    }

    modifier vaultExists(uint256 vaultId) {
        require(vaultId > 0 && vaultId <= vaultCount, "Vault does not exist");
        _;
    }

    modifier vaultActive(uint256 vaultId) {
        require(vaults[vaultId].active, "Vault is not active");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address _reputationNFT) Ownable(msg.sender) {
        reputationNFT = ReputationNFT(_reputationNFT);
    }

    // ─── Vault Functions ──────────────────────────────────────────────────────
    function createVault(
        address governanceAuthority,
        address rewardToken,
        uint256 critical,
        uint256 high,
        uint256 medium,
        uint256 low
    ) external payable returns (uint256) {
        require(governanceAuthority != address(0), "Invalid governance address");
        require(critical >= high && high >= medium && medium >= low, "Invalid reward tiers");

        vaultCount++;
        uint256 vaultId = vaultCount;

        vaults[vaultId] = Vault({
            id: vaultId,
            programTeam: msg.sender,
            governanceAuthority: governanceAuthority,
            rewardToken: rewardToken,
            rewards: RewardConfig(critical, high, medium, low),
            totalFunded: msg.value,
            totalPaid: 0,
            approvedCount: 0,
            active: true,
            createdAt: block.timestamp
        });

        emit VaultCreated(vaultId, msg.sender, governanceAuthority);
        if (msg.value > 0) emit VaultFunded(vaultId, msg.value, address(0));

        return vaultId;
    }

    function fundVault(uint256 vaultId, uint256 tokenAmount)
        external payable vaultExists(vaultId)
    {
        Vault storage vault = vaults[vaultId];

        if (vault.rewardToken == address(0)) {
            require(msg.value > 0, "Send ETH to fund");
            vault.totalFunded += msg.value;
            emit VaultFunded(vaultId, msg.value, address(0));
        } else {
            require(tokenAmount > 0, "Amount must be > 0");
            IERC20(vault.rewardToken).safeTransferFrom(msg.sender, address(this), tokenAmount);
            vault.totalFunded += tokenAmount;
            emit VaultFunded(vaultId, tokenAmount, vault.rewardToken);
        }
    }

    function toggleVault(uint256 vaultId)
        external vaultExists(vaultId) onlyProgramTeam(vaultId)
    {
        vaults[vaultId].active = !vaults[vaultId].active;
        emit VaultToggled(vaultId, vaults[vaultId].active);
    }

    // ─── Report Functions ─────────────────────────────────────────────────────
    function submitReport(
        uint256 vaultId,
        Severity severity,
        string calldata ipfsHash
    ) external vaultExists(vaultId) vaultActive(vaultId) returns (uint256) {
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(bytes(ipfsHash).length <= 128, "IPFS hash too long");

        Vault storage vault = vaults[vaultId];
        uint256 payout = _getSeverityPayout(vault.rewards, severity);
        require(payout > 0, "No reward set for this severity");

        uint256 available = vault.totalFunded - vault.totalPaid;
        require(available >= payout, "Insufficient vault funds");

        reportCount++;
        uint256 reportId = reportCount;

        reports[reportId] = Report({
            id: reportId,
            vaultId: vaultId,
            researcher: msg.sender,
            severity: severity,
            ipfsHash: ipfsHash,
            status: ReportStatus.Pending,
            payout: payout,
            submittedAt: block.timestamp,
            resolvedAt: 0,
            governanceNote: "",
            nftMinted: false
        });

        vaultReports[vaultId].push(reportId);
        researcherReports[msg.sender].push(reportId);

        vault.totalPaid += payout;

        emit ReportSubmitted(reportId, vaultId, msg.sender, severity);
        return reportId;
    }

    function approveReport(uint256 reportId, string calldata reason) external {
        Report storage report = reports[reportId];
        require(report.id != 0, "Report does not exist");
        require(report.status == ReportStatus.Pending, "Report not pending");
        require(msg.sender == vaults[report.vaultId].governanceAuthority, "Not governance");

        report.status = ReportStatus.Approved;
        report.resolvedAt = block.timestamp;
        report.governanceNote = reason;
        vaults[report.vaultId].approvedCount++;

        emit ReportApproved(reportId, reason, block.timestamp);
    }

    function rejectReport(uint256 reportId, string calldata reason) external {
        Report storage report = reports[reportId];
        require(report.id != 0, "Report does not exist");
        require(report.status == ReportStatus.Pending, "Report not pending");
        require(msg.sender == vaults[report.vaultId].governanceAuthority, "Not governance");

        report.status = ReportStatus.Rejected;
        report.resolvedAt = block.timestamp;
        report.governanceNote = reason;

        vaults[report.vaultId].totalPaid -= report.payout;

        emit ReportRejected(reportId, reason);
    }

    function executePayout(uint256 reportId) external nonReentrant {
        Report storage report = reports[reportId];
        require(report.id != 0, "Report does not exist");
        require(report.researcher == msg.sender, "Not the researcher");
        require(report.status == ReportStatus.Approved, "Report not approved");

        report.status = ReportStatus.Paid;

        Vault storage vault = vaults[report.vaultId];

        if (vault.rewardToken == address(0)) {
            (bool success, ) = payable(msg.sender).call{value: report.payout}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(vault.rewardToken).safeTransfer(msg.sender, report.payout);
        }

        emit PayoutExecuted(reportId, msg.sender, report.payout);
    }

    function mintReputationNFT(uint256 reportId, string calldata tokenURI) external {
        Report storage report = reports[reportId];
        require(report.id != 0, "Report does not exist");
        require(report.researcher == msg.sender, "Not the researcher");
        require(report.status == ReportStatus.Paid, "Report not paid");
        require(!report.nftMinted, "NFT already minted");

        report.nftMinted = true;
        uint256 tokenId = reputationNFT.mintTo(msg.sender, tokenURI);

        emit NFTMinted(reportId, msg.sender, tokenId);
    }

    // ─── View Functions ───────────────────────────────────────────────────────
    function getVault(uint256 vaultId) external view returns (Vault memory) {
        return vaults[vaultId];
    }

    function getReport(uint256 reportId) external view returns (Report memory) {
        return reports[reportId];
    }

    function getVaultReports(uint256 vaultId) external view returns (uint256[] memory) {
        return vaultReports[vaultId];
    }

    function getResearcherReports(address researcher) external view returns (uint256[] memory) {
        return researcherReports[researcher];
    }

    function getVaultBalance(uint256 vaultId) external view returns (uint256) {
        Vault storage vault = vaults[vaultId];
        return vault.totalFunded - vault.totalPaid;
    }

    // ─── Internal ─────────────────────────────────────────────────────────────
    function _getSeverityPayout(RewardConfig storage rc, Severity s)
        internal view returns (uint256)
    {
        if (s == Severity.Critical) return rc.critical;
        if (s == Severity.High)     return rc.high;
        if (s == Severity.Medium)   return rc.medium;
        return rc.low;
    }

    receive() external payable {}
}
