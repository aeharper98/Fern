const hre = require("hardhat");

/**
 * Permanently BURN your Uniswap LP (liquidity provider) tokens.
 *
 * Why: when you add ETH/FERN liquidity on Uniswap you receive "LP tokens" that
 * represent your share of the pool. Whoever holds them can pull that liquidity
 * back out. Burning them (sending them to a dead address no one controls) proves
 * to traders that the liquidity is locked forever and you can't "rug" the pool.
 *
 * ⚠️ THIS IS IRREVERSIBLE. Once burned, you can never reclaim that liquidity or
 *    the trading fees it would have earned. This is the maximum-trust option.
 *    If you'd rather be able to reclaim it later, use a time-lock service
 *    (UNCX, Team Finance) instead of this script.
 *
 * Setup:
 *   1. Add liquidity on Uniswap first.
 *   2. Find your LP token address (Uniswap shows it; it's the pair contract).
 *   3. Put it in .env as LP_TOKEN_ADDRESS.
 *   4. Run with a confirmation flag so you can't do it by accident:
 *        npx hardhat run scripts/burn-liquidity.js --network mainnet -- --confirm
 *      Optionally burn only part:  -- --confirm --amount 1.5
 *      (no --amount = burn your entire LP balance)
 */
const DEAD = "0x000000000000000000000000000000000000dEaD";

// Minimal ERC-20 interface — LP tokens are standard ERC-20s.
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

function parseArgs(argv) {
  const args = { confirm: false, amount: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--confirm") args.confirm = true;
    if (argv[i] === "--amount") args.amount = argv[i + 1];
  }
  return args;
}

async function main() {
  const lpAddress = process.env.LP_TOKEN_ADDRESS;
  if (!lpAddress || !hre.ethers.isAddress(lpAddress)) {
    throw new Error("Set a valid LP_TOKEN_ADDRESS in your .env first.");
  }

  const { confirm, amount } = parseArgs(process.argv.slice(2));
  const [owner] = await hre.ethers.getSigners();
  const lp = new hre.ethers.Contract(lpAddress, ERC20_ABI, owner);

  const [symbol, decimals, balance] = await Promise.all([
    lp.symbol().catch(() => "LP"),
    lp.decimals().catch(() => 18),
    lp.balanceOf(owner.address),
  ]);

  const toBurn = amount ? hre.ethers.parseUnits(amount, decimals) : balance;

  console.log("🔥 Burn liquidity (irreversible)");
  console.log("  Network:    ", hre.network.name);
  console.log("  LP token:   ", lpAddress, `(${symbol})`);
  console.log("  Your LP bal:", hre.ethers.formatUnits(balance, decimals));
  console.log("  Burning:    ", hre.ethers.formatUnits(toBurn, decimals));
  console.log("  Sending to: ", DEAD, "(no one controls this address)");
  console.log("");

  if (toBurn <= 0n) throw new Error("Nothing to burn (LP balance is zero).");
  if (toBurn > balance) throw new Error("Burn amount exceeds your LP balance.");

  if (!confirm) {
    console.log("Dry run only. Re-run with  -- --confirm  to actually burn.");
    return;
  }

  const tx = await lp.transfer(DEAD, toBurn);
  console.log("  Submitted:", tx.hash);
  await tx.wait();
  console.log("✅ Liquidity burned. The pool can never be pulled.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
