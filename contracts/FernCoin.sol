// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title FernCoin
 * @notice $FERN — a meme coin for Fern, a one-year-old field golden retriever. 🌾🐕
 *
 * Design goals (so people can actually trust it enough to trade):
 *  - Fixed supply. The ENTIRE supply is minted once, at deployment, to the
 *    deployer. There is no `mint()` function, so the supply can never be
 *    inflated. No rug-by-printing.
 *  - No owner privileges. The contract is not Ownable — there are no admin
 *    switches, no pausing, no blacklists, no transfer taxes. It is a plain,
 *    standard ERC-20 that any DEX (Uniswap, etc.) can list immediately.
 *  - Burnable. Holders may permanently destroy their own tokens.
 *  - Gasless approvals via ERC-2612 permit().
 *
 * Total supply: 1,000,000,000 FERN (one billion good girls).
 */
contract FernCoin is ERC20, ERC20Burnable, ERC20Permit {
    /// @notice The full, fixed token supply: 1,000,000,000 FERN (with 18 decimals).
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    /**
     * @param initialHolder The address that receives the entire initial supply.
     *        Typically the deployer, who then seeds a liquidity pool.
     */
    constructor(address initialHolder)
        ERC20("Fern Coin", "FERN")
        ERC20Permit("Fern Coin")
    {
        require(initialHolder != address(0), "FernCoin: zero holder");
        _mint(initialHolder, MAX_SUPPLY);
    }
}
