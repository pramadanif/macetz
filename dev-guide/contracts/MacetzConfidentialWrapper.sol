// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {ERC7984} from "@openzeppelin/confidential-contracts/token/ERC7984/ERC7984.sol";
import {
    ERC7984ERC20Wrapper
} from "@openzeppelin/confidential-contracts/token/ERC7984/extensions/ERC7984ERC20Wrapper.sol";

/**
 * Confidential ERC-7984 wrapper + mintable ERC-20 underlying.
 * Pattern from Zama OpenZeppelin confidential contracts examples.
 */
contract MacetzConfidentialWrapper is ERC7984ERC20Wrapper, ZamaEthereumConfig {
    constructor(
        IERC20 underlying_,
        string memory name_,
        string memory symbol_,
        string memory uri_
    ) ERC7984ERC20Wrapper(underlying_) ERC7984(name_, symbol_, uri_) {}
}
