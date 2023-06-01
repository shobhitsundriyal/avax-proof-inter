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
    expect(await tokenContract.name()).to.equal('Shobhit');
    expect(await tokenContract.symbol()).to.equal('SBT');
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
    await expect(tokenContract.connect(owner).mint(1000)).to.be.revertedWith('There is only limited supply');
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
});
