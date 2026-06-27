require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { RPC_URL_SEPOLIA, RPC_URL_MAINNET, DEPLOYER_PRIVATE_KEY, ETHERSCAN_API_KEY } =
  process.env;

// Only attach the deployer key if it's present, so `npm test` works with no .env.
const accounts = DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: RPC_URL_SEPOLIA || "https://rpc.sepolia.org",
      accounts,
    },
    mainnet: {
      url: RPC_URL_MAINNET || "",
      accounts,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
};
