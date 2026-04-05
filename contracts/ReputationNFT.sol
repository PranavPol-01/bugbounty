// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ReputationNFT
/// @notice Minted by BugBountyVault on successful report payouts
contract ReputationNFT is ERC721URIStorage, Ownable {

    uint256 public tokenCount;
    address public minterContract;

    event ReputationMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    modifier onlyMinter() {
        require(msg.sender == minterContract, "Not authorized minter");
        _;
    }

    constructor() ERC721("DecentraBounty Reputation", "DBREP") Ownable(msg.sender) {}

    /// @notice Set the vault contract that may call mintTo — owner only
    function setMinterContract(address _minterContract) external onlyOwner {
        minterContract = _minterContract;
    }

    /// @notice Mint a new Reputation NFT
    function mintTo(address to, string calldata _tokenURI)
        external onlyMinter returns (uint256)
    {
        tokenCount++;
        uint256 newTokenId = tokenCount;
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        emit ReputationMinted(to, newTokenId, _tokenURI);
        return newTokenId;
    }

    function totalSupply() external view returns (uint256) {
        return tokenCount;
    }
}
