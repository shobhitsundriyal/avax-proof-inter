// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenContract is ERC20 {
    mapping(address => uint16) public canMint;
    address owner;
    uint16 MAX_SUPPLY = 100;
    uint16 currentSupply = 10; //preminting 10 tokens

    modifier onlyOwner {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    modifier MintingRequirements(uint16 amount) {
        require(canMint[msg.sender] > 0, "You can't mint this token");
        require(currentSupply + amount <= MAX_SUPPLY, "There is only limited supply");
        require(msg.sender == owner || canMint[msg.sender] >= amount, "You are trying to mint2 more than allowed");
        _;
    }
    constructor() ERC20("Shobhit", "SBT") {
        //premint 10 tokens on deployment
        _mint(msg.sender, 10 * 10 ** decimals());
        owner = msg.sender;
        canMint[owner] = 100;
    }

    function mint(uint16 amount) public MintingRequirements(amount) {
        _mint(msg.sender, amount * 10 ** decimals());
        if(msg.sender != owner) {
            canMint[msg.sender] -= amount;
        }
    }

    function mintToAddress(address to, uint16 amount) public MintingRequirements(amount) {
        _mint(to, amount * 10 ** decimals());
        if(msg.sender != owner) {
            canMint[msg.sender] -= amount;
        }
    }

    function changeMintableAllowance(address _modifingAddress, uint16 _mintAllowance) public onlyOwner {
        canMint[_modifingAddress] = _mintAllowance;
    }
}