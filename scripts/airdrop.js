const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Airdrop $FERN to a list of friends.
 *
 * 1. Deploy FERN first, then put its address in .env as FERN_ADDRESS.
 * 2. Copy airdrop.example.json -> airdrop.json and fill in your friends'
 *    wallet addresses and how much FERN each should get (in whole FERN).
 * 3. Run:  npm run airdrop:sepolia   (test first!)  or  npm run airdrop:mainnet
 *
 * Each transfer is its own transaction, so you pay a little gas per friend.
 * For a handful of friends that's totally fine.
 */
async function main() {
  const fernAddress = process.env.FERN_ADDRESS;
  if (!fernAddress) {
    throw new Error("Set FERN_ADDRESS in your .env (the deployed FERN contract).");
  }

  const listPath = path.join(process.cwd(), "airdrop.json");
  if (!fs.existsSync(listPath)) {
    throw new Error(
      "No airdrop.json found. Copy airdrop.example.json to airdrop.json and edit it."
    );
  }

  const recipients = JSON.parse(fs.readFileSync(listPath, "utf8"));
  if (!Array.isArray(recipients) || recipients.length === 0) {
    throw new Error("airdrop.json must be a non-empty array of { address, amount }.");
  }

  const [sender] = await hre.ethers.getSigners();
  const fern = await hre.ethers.getContractAt("FernCoin", fernAddress);

  // Validate everything BEFORE sending anything.
  let total = 0n;
  for (const r of recipients) {
    if (!hre.ethers.isAddress(r.address)) {
      throw new Error(`Invalid address in airdrop.json: ${r.address}`);
    }
    if (!(Number(r.amount) > 0)) {
      throw new Error(`Invalid amount for ${r.address}: ${r.amount}`);
    }
    total += hre.ethers.parseEther(String(r.amount));
  }

  const balance = await fern.balanceOf(sender.address);
  console.log("🌾 FERN airdrop");
  console.log("  Network:    ", hre.network.name);
  console.log("  Sender:     ", sender.address);
  console.log("  Recipients: ", recipients.length);
  console.log("  Total send: ", hre.ethers.formatEther(total), "FERN");
  console.log("  Your balance:", hre.ethers.formatEther(balance), "FERN");
  console.log("");

  if (balance < total) {
    throw new Error("You don't hold enough FERN to cover this airdrop.");
  }

  const results = { sent: 0, failed: 0 };
  for (const r of recipients) {
    const amount = hre.ethers.parseEther(String(r.amount));
    try {
      const tx = await fern.transfer(r.address, amount);
      await tx.wait();
      results.sent++;
      console.log(`  ✅ ${r.amount} FERN -> ${r.address}  (${tx.hash})`);
    } catch (err) {
      results.failed++;
      console.log(`  ❌ ${r.address} failed: ${err.message}`);
    }
  }

  console.log("");
  console.log(`Done. Sent: ${results.sent}, Failed: ${results.failed}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
