// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MathContract {

    function divide(uint256 a, uint256 b) public pure returns (uint256) {
        assert(b != 0);
        
        if(a%b > 0) {
            revert("Numbers are not perfectly divisible");
        }
        
        uint256 result = a / b;
        return result;
    }   
    
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        require(a >= b, "Subtraction underflow");
        
        uint256 result = a - b;
        
        return result;
    }
    
}