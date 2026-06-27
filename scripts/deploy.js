const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  if (!deployer) {
    throw new Error(
      "No deployer account found. Set DEPLOYER_PRIVATE_KEY in your .env file."
    );
  }

  const network = hre.network.name;
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("🌾 Deploying Fern Coin ($FERN)");
  console.log("  Network:  ", network);
  console.log("  Deployer: ", deployer.address);
  console.log("  Balance:  ", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  const FernCoin = await hre.ethers.getContractFactory("FernCoin");
  const fern = await FernCoin.deploy(deployer.address);
  await fern.waitForDeployment();

  const address = await fern.getAddress();
  const supply = await fern.totalSupply();

  console.log("✅ FERN deployed!");
  console.log("  Contract: ", address);
  console.log("  Supply:   ", hre.ethers.formatEther(supply), "FERN");
  console.log("  Holder:   ", deployer.address, "(holds 100% of supply)");
  console.log("");
  console.log("Next steps:");
  console.log("  1. Verify on Etherscan:");
  console.log(
    `       npx hardhat verify --network ${network} ${address} ${deployer.address}`
  );
  console.log("  2. Add liquidity on Uniswap to make $FERN tradeable:");
  console.log("       https://app.uniswap.org/#/add/v2/ETH/" + address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
