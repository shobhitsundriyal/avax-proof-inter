# Overview

MathContract is a Solidity smart contract that provides mathematical operations such as division and subtraction. It ensures the validity of the calculations and handles exceptional scenarios using assert(), require(), and revert() functions.

# Description

MathContract allows users to perform mathematical operations and provides the following functions:

#### Public Functions
- divide(uint256 a, uint256 b): This function performs division of two numbers a and b. It ensures that the divisor (b) is not zero using the assert() function. Additionally, it checks if the numbers are perfectly divisible using the modulo operator. If they are not perfectly divisible, it reverts the transaction with an error message using revert(). If the conditions are met, it calculates and returns the division result.
- subtract(uint256 a, uint256 b): This function performs subtraction of two numbers a and b. It ensures that the minuend (a) is greater than or equal to the subtrahend (b) using the require() function. If the condition is not met, it reverts the transaction with an error message. If the condition is met, it performs the subtraction and returns the result.

# Getting Started

### steps to run
- Import the contract onto remix ide
- Deploy on vm and test the functionalities on remix

# Author
Shobhit Sundriyal

# License
The Project is licensed under the MIT license.
