import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const privateKey = process.env.WALLET_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "blockchain/artifacts",
    cache: "blockchain/cache",
  },
  networks: {
    amoy: {
      type: "http",
      url: process.env.POLYGON_AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: privateKey ? [privateKey] : [],
    },
  },
};

export default config;
