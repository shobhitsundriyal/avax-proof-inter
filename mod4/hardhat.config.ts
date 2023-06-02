import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-verify";
import {privateKey, snowtraceApiKey} from "./secrets.json"

const config: HardhatUserConfig = {
  networks: {
    avaxFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [privateKey]
    },
  },
  solidity: "0.8.18",
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: snowtraceApiKey
    }
  }
};

export default config;
// Token address => 0x71f2B59517D6136066b1A06e02050EFDd90Dd31E 
// ShopItems address => 0xBdA36026c2D07DAe91c79746eF1956977d5cF5f8
