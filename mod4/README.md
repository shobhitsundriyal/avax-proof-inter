# Overview

TokenContract and ShopItems are two Solidity smart contracts that provide functionality for managing tokens and purchasing items in a virtual shop. TokenContract implements the ERC20 token standard and allows users to mint and manage a limited supply of tokens. ShopItems, on the other hand, implements the ERC1155 standard and enables users to purchase game items using tokens which in this case are hard coded to Gold, Silver, and Diamond.

# Description

This contracts were written in Solidity programming language. There are 2 contracts which has a multiple functions as follows

### TokenContract
TokenContract allows users to mint and manage a limited supply of tokens. It extends ERC20 with few extra functions as follows:

#### Public functions
- mint(uint16 amount): Allows a user to mint a specified amount of tokens to their own address. The minting operation is subject to the conditions defined in the MintingRequirements modifier.
- mintToAddress(address to, uint16 amount): Allows the contract owner or an address with a sufficient minting allowance to mint a specified amount of tokens to a designated address. The minting operation is subject to the conditions defined in the MintingRequirements modifier.
- changeMintableAllowance(address _modifingAddress, uint16 _mintAllowance): Allows the contract owner to change the minting allowance for a specific address.

#### Public view function
- canMint(address): Retrieves the minting allowance for a given address.

### ShopItem
ShopItems represents a virtual shop where users can purchase game items using tokens. It extends ERC1155 with some extra functions:

#### Public Functions
- setURI(string memory newuri): Allows the contract owner to set the Uniform Resource Identifier (URI) for the token metadata.
- buyItem(uint256 id, uint256 amount, bytes memory data): Allows a user to purchase game items by providing the item ID, desired quantity, and optional data. The function checks the user's token balance and allowance, transfers the required tokens to the contract, and mints the purchased items to the user's address.

The testing was done with hardhat with test cases that you can find in the `tests` folder.

# Getting Started

### Important point to remember
If you want to deploy the contracts:
1. First deploy the TokenContract, as this will be used as currency in ShopItems contract
2. When deploying ShopItem you have to pass cost of items(in ethers) for Gold, Silver and Diamonds respectively, plus the address of the TokenContract(or any other erc20 token that you want to use as the currency for the shop)

### steps to run
- Run `npm i`, which will install all the dependencies
- Make modification to the TokenContract as required.
- Run `npx hardhat compile` to check if contract compiles successfully
- There are multiple test in test folder in TokenContract.ts, you can modify and write the test cases there.
- Run `npx hardhat test` to run the test cases.
- You can also spin up a local hardhat node and write new script
<!-- <br /> -->
  OR
<br />

- Import the contract onto remix ide
- Deploy on vm and test the functionalities on remix

# Author
Shobhit Sundriyal

# License
The Project is licensed under the MIT license.
