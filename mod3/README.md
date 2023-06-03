# Overview

TokenContract is a Solidity smart contract that extends the ERC20 token standard. It allows users to mint and manage a limited supply of tokens. The contract provides all erc20 functionalities with some minor changes to mint tokens functionality, and includes some extra functionalities to change the minting allowance for addresses, and retrieve information about the token supply.

# Description

This contract is written in Solidity programming language. The contract has a multiple functions as follows
#### Public functions
- mint(uint16 amount): Allows a user to mint a specified amount of tokens to their own address. The minting operation is subject to the conditions defined in the MintingRequirements modifier.
- mintToAddress(address to, uint16 amount): Allows the contract owner or an address with a sufficient minting allowance to mint a specified amount of tokens to a designated address. The minting operation is subject to the conditions defined in the MintingRequirements modifier.
changeMintableAllowance(address _modifingAddress, uint16 _mintAllowance): Allows the contract owner to change the minting allowance for a specific address.

#### Public view function
- canMint(address): Retrieves the minting allowance for a given address.

The testing was done with hardhat with test cases that you can find in the `tests` folder.

# Getting Started

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
