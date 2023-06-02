// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenContract is ERC20, ERC20Burnable {
    mapping(address => uint16) public canMint;
    address owner;
    uint16 MAX_SUPPLY = 10000;
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
    constructor() ERC20("DEGEN", "DGN") {
        //premint 10 tokens on deployment
        _mint(msg.sender, 10 * 10 ** decimals());
        owner = msg.sender;
        canMint[owner] = 100;
    }

    function mint(uint16 amount) public MintingRequirements(amount) {
        _mint(msg.sender, amount * 10 ** decimals());
        currentSupply += amount;
        if(msg.sender != owner) {
            canMint[msg.sender] -= amount;
        }
    }

    function mintToAddress(address to, uint16 amount) public MintingRequirements(amount) {
        _mint(to, amount * 10 ** decimals());
        currentSupply += amount;
        if(msg.sender != owner) {
            canMint[msg.sender] -= amount;
        }
    }

    function changeMintableAllowance(address _modifingAddress, uint16 _mintAllowance) public onlyOwner {
        canMint[_modifingAddress] = _mintAllowance;
    }
}

contract ShopItems is ERC1155, Ownable {
    enum gameItems {gold, silver, diamond}

    uint256[] itemsPrice;
    IERC20 currency;
    address currencyAddress;
    constructor(uint256 goldPrice, uint256 silverPrice, uint256 diamondPrice, address _erc20Address) ERC1155("") {
        //prices in 'ether'
        itemsPrice.push(goldPrice);
        itemsPrice.push(silverPrice);
        itemsPrice.push(diamondPrice);
        currencyAddress = _erc20Address;
        currency = IERC20(_erc20Address);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }


    function buyItem(uint256 id, uint256 amount, bytes memory data)
        public
    {   
        require(id < 3, "This is not available in the shop"); // game items have three items
        require(currency.balanceOf(msg.sender) >= itemsPrice[id] * amount * 10 ** 18, "You dont have enough tokens to buy this item");
        require(currency.allowance(msg.sender, address(this)) >= itemsPrice[id] * amount * 10 ** 18, "Please increase the allowance");
        currency.transferFrom(msg.sender, address(this), itemsPrice[id] * amount * 10 ** 18);
        _mint(msg.sender, id, amount, data);
    }
}
