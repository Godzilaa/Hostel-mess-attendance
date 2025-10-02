// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Hostel Mess Token
 * @dev ERC-1155 token for meal coupons that auto-burn on redemption
 * - Only admin can mint tokens
 * - Students burn tokens to redeem meals
 * - All redemptions emit verifiable events
 */
contract MessToken is ERC1155, Ownable, ReentrancyGuard {
    // Single token ID for all meal coupons
    uint256 public constant MEAL_TOKEN_ID = 1;
    
    // Base URI for off-chain metadata (IPFS)
    string private _baseTokenURI = "ipfs://QmYourMetadataHash/";

    // Events
    event MealRedeemed(address indexed student, uint256 amount, uint256 timestamp);
    event TokensMinted(address indexed admin, address indexed to, uint256 amount, uint256 timestamp);

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        // Constructor sets initial owner
    }

    /**
     * @dev Mint meal tokens to a student (admin only)
     * @param to Student wallet address
     * @param amount Number of meal tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be > 0");
        
        _mint(to, MEAL_TOKEN_ID, amount, "");
        emit TokensMinted(msg.sender, to, amount, block.timestamp);
    }

    /**
     * @dev Burn meal tokens to redeem meals
     * @param amount Number of meals to redeem
     */
    function redeemMeal(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(
            balanceOf(msg.sender, MEAL_TOKEN_ID) >= amount,
            "Insufficient meal tokens"
        );
        
        _burn(msg.sender, MEAL_TOKEN_ID, amount);
        emit MealRedeemed(msg.sender, amount, block.timestamp);
    }

    /**
     * @dev Set base URI for token metadata (admin only)
     */
    function setBaseTokenURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /**
     * @dev Override URI to return metadata
     */
    function uri(uint256 /*id*/) public view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Rescue accidentally sent ERC20 tokens (admin only)
     */
    function rescueERC20(
        address tokenAddress,
        uint256 amount
    ) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token");
        require(
            tokenAddress != address(this),
            "Cannot rescue native token"
        );
        IERC20(tokenAddress).transfer(owner(), amount);
    }
}