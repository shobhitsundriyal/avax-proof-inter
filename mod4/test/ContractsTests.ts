//@ts-ignore
import {ethers} from 'hardhat';
import { Contract, Signer } from 'ethers';
import { expect } from 'chai';

describe('TokenContract', function () {
  let tokenContract: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    // Deploy the contract
    const TokenContract = await ethers.getContractFactory('TokenContract');
    [owner, addr1, addr2] = await ethers.getSigners();
    tokenContract = await TokenContract.deploy();
    await tokenContract.deployed();
  });

  it('should have correct name, symbol, and initial supply', async function () {
    expect(await tokenContract.name()).to.equal('DEGEN');
    expect(await tokenContract.symbol()).to.equal('DGN');
    expect(await tokenContract.totalSupply()).to.equal(BigInt(10 * 10**18));
  });

  it('should mint tokens to the owner', async function () {
    await tokenContract.connect(owner).mint(50);
    expect(await tokenContract.balanceOf(await owner.getAddress())).to.equal(BigInt(60 * 10**18));
  });

  it('should allow mint iff owner approved and should not allow to mint more', async function () {
    // allow addr1
    await tokenContract.connect(owner).changeMintableAllowance(addr1.getAddress(), 5);
    await tokenContract.connect(addr1).mint(4);
    expect(await tokenContract.balanceOf(await addr1.getAddress())).to.equal(BigInt(4 * 10**18));
    // if try to mint more than allowed revert
    await expect(tokenContract.connect(addr1).mint(2)).to.be.revertedWith('You are trying to mint2 more than allowed');
  });

  it('should not allow minting more than the maximum supply', async function () {
    await expect(tokenContract.connect(owner).mint(11000)).to.be.revertedWith('There is only limited supply');
  });

  it('should not allow minting if not allowed to mint', async function () {
    await expect(tokenContract.connect(addr1).mint(10)).to.be.revertedWith('You can\'t mint this token');
  });

  it('should allow the owner to change minting allowance', async function () {
    await tokenContract.changeMintableAllowance(await addr1.getAddress(), 50);
    expect(await tokenContract.canMint(await addr1.getAddress())).to.equal(50);
  });

  it('should be able to mint to other address and reduce mint allowance', async function () {
    await tokenContract.changeMintableAllowance(await addr1.getAddress(), 50);
    await tokenContract.connect(addr1).mintToAddress(addr2.getAddress(), 20); // 20 to addr2
    await tokenContract.connect(addr1).mint(30);//30 to itself
    expect(await tokenContract.balanceOf(await addr1.getAddress())).to.equal(BigInt(30 * 10**18));
    expect(await tokenContract.balanceOf(await addr2.getAddress())).to.equal(BigInt(20 * 10**18));
    //address1 mint allowance exhausted
    expect(await tokenContract.canMint(await addr1.getAddress())).to.equal(0);
  });
  // ----- new tests
  it('tokens should be burnable', async function () {
    await tokenContract.burn(BigInt(5 * 10**18));
    expect(await tokenContract.balanceOf(owner.getAddress())).to.equal(BigInt(5* 10**18));
  });
});

describe('ShopItems', function () {
  let shopItems: Contract;
  let currency: Contract;
  let owner: Signer;
  let addr1: Signer;
  const goldPrice = 50, silverPrice = 20, diamondPrice = 100;
  const [goldId, silverId, diamondId] = [0,1,2];

  const amountInWei = (etherAmount: number): BigInt => BigInt(etherAmount * 10 ** 18);

  beforeEach(async function () {
    // deploy erc20 first
    const ERC20 = await ethers.getContractFactory('TokenContract');
    currency = await ERC20.deploy();
    await currency.deployed();

    // Deploy the contracts and retrieve the deployed instances
    const ShopItems = await ethers.getContractFactory('ShopItems');
    shopItems = await ShopItems.deploy(goldPrice, silverPrice, diamondPrice, currency.address); 
    await shopItems.deployed();


    [owner, addr1] = await ethers.getSigners();
    currency.mint(500); // owner have 310 tokens
    currency.transfer(addr1.getAddress(), BigInt(200 * 10 ** 18)); // addr1 have 200 tokens
  });


  it('should allow the users to buy an item', async function () {
    const data = '0x';

    await currency.connect(addr1).approve(shopItems.address, amountInWei(200));
    await shopItems.connect(addr1).buyItem(silverId, 4, data);
    const addr1SilverBalance = await shopItems.balanceOf(addr1.getAddress(), silverId);

    await shopItems.connect(addr1).buyItem(goldId, 1, data);
    const addr1GoldBalance = await shopItems.balanceOf(addr1.getAddress(), goldId);

    expect(addr1SilverBalance).to.equal(4);
    expect(addr1GoldBalance).to.equal(1);
    expect(await currency.balanceOf(addr1.getAddress())).to.equal(BigInt(70 * 10 ** 18));
  });

  it('should revert if the item is not available in the shop', async function () {
    const itemId = 5; 
    const amount = 1;
    const data = '0x';

    await expect(
      shopItems.connect(owner).buyItem(itemId, amount, data)
    ).to.be.revertedWith('This is not available in the shop');
  });

  it('should revert if the buyer does not have enough tokens', async function () {
    const itemId = diamondId;
    const amount = 10;
    const data = '0x';

    await currency.connect(addr1).approve(shopItems.address, amountInWei(200));

    await expect(
      shopItems.connect(owner).buyItem(itemId, amount, data)
    ).to.be.revertedWith('You dont have enough tokens to buy this item');
  });

  it('should revert if the buyer has insufficient allowance', async function () {
    const itemId = diamondId;
    const amount = 2;
    const data = '0x';

    await currency.connect(addr1).approve(shopItems.address, amountInWei(100));

    await expect(
      shopItems.connect(owner).buyItem(itemId, amount, data)
    ).to.be.revertedWith('Please increase the allowance');
  });
});