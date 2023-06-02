import { ethers } from "hardhat";

async function main() {

  const Erc20Token = await ethers.getContractFactory("TokenContract");
  const erc20Token = await Erc20Token.deploy();
  await erc20Token.deployed()

  const itemsPrices = [50, 20, 100] // gold, silver, diamond
  const ShopItems = await ethers.getContractFactory("ShopItems");
  const shopItems = await ShopItems.deploy(50, 20, 100, erc20Token.address);
  await shopItems.deployed()


  console.log(
    `Token address => ${erc20Token.address} \nShopItems address => ${shopItems.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
