# Overview

TokenContract is a Solidity smart contract that extends the ERC20 token standard. It allows users to mint and manage a limited supply of tokens. The contract provides all erc20 functionalities with some minor changes to mint tokens functionality, and includes some extra functionalities to change the minting allowance for addresses, and retrieve information about the token supply.

# Description

This contract is written in Solidity programming language used for developing smart contracts on the Ethereum blockchain. The contract has a single function that returns the string "Hello World!". The testing was done with hardhat with test cases that you can find in the `tests` folder.

# Getting Started

### steps to run
- Run `npm i`, which will install all the dependencies
- Make modification to the TokenContract as required.
- Run `npx hardhat compile` to check if contract compiles successfully
- There are multiple test in test folder in TokenContract.ts, you can modify and write the test cases there.
- Run `npx hardhat test` to run the test cases.
- You can also spin up a local hardhat node and write new script
**OR**
- Import the contract onto remix ide
- Deploy on vm and test the functionalities

# Author
Shobhit Sundriyal

# License
The Project is licensed under the MIT license.