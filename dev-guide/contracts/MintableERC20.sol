// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * Simple mintable ERC-20 for dev/test deployments.
 * Edit TOKEN_NAME and TOKEN_SYMBOL below before deploying.
 */
contract MintableERC20 is ERC20 {
    uint8 private immutable _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @notice Public mint for testnet demos — do not use in production.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
