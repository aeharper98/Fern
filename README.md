# 🌾🐕 Fern Coin ($FERN)

> A meme coin for **Fern** — a one-year-old field golden retriever and certified good girl.

$FERN is a plain, honest, **standard ERC-20 token**. No transfer taxes, no
hidden mint, no owner backdoors, no blacklist. The entire supply is created once
and the contract has no privileged functions — so once you add liquidity, it's
tradeable on any Ethereum DEX (Uniswap, etc.) like any other token.

## Tokenomics

| Property      | Value                                  |
| ------------- | -------------------------------------- |
| Name          | Fern Coin                              |
| Symbol        | `FERN`                                 |
| Decimals      | 18                                     |
| Total supply  | 1,000,000,000 (one billion) — fixed    |
| Mintable?     | ❌ No (supply can never increase)      |
| Burnable?     | ✅ Yes (holders can burn their own)    |
| Owner/admin?  | ❌ None (no pause, tax, or blacklist)  |
| Permit (2612) | ✅ Yes (gasless approvals)             |

Why "field"? Fern is a **field** golden retriever (the lean, athletic, born-to-run
working line — not the fluffy show type), so $FERN is a field coin. 🌾

## What this repo is

This is a complete, ready-to-deploy token project built with **Hardhat** and
**OpenZeppelin** contracts. I can't deploy it to a live blockchain for you (that
needs your wallet's private key and real ETH for gas), but everything is set up
so you can do it yourself with a couple of commands.

```
contracts/FernCoin.sol     The $FERN ERC-20 token
scripts/deploy.js          Deployment script
test/FernCoin.test.js      Full test suite
hardhat.config.js          Network + compiler config
website/index.html         A meme landing page for Fern
```

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Compile the contract
npm run build

# 3. Run the test suite
npm test
```

## Deploying so you can trade it

> ⚠️ Deploying to Ethereum mainnet costs real ETH for gas. **Practice on the
> Sepolia testnet first** — it's free.

1. Copy the env template and fill it in:

   ```bash
   cp .env.example .env
   ```

   You'll need:
   - An **RPC URL** (free from [Alchemy](https://alchemy.com) or
     [Infura](https://infura.io)).
   - The **private key** of a funded deployer wallet. Use a fresh, dedicated
     wallet — never your main one.

2. Deploy to the testnet (free test ETH from a
   [Sepolia faucet](https://sepoliafaucet.com)):

   ```bash
   npm run deploy:sepolia
   ```

3. When you're happy, deploy to mainnet:

   ```bash
   npm run deploy:mainnet
   ```

   The script prints your contract address and the exact commands to verify it
   on Etherscan and add liquidity.

4. **Make it tradeable:** go to Uniswap and create an ETH/FERN liquidity pool.
   Whatever ratio you provide sets the starting price. Once the pool exists,
   anyone can buy and sell $FERN.

   ```
   https://app.uniswap.org/#/add/v2/ETH/<your-contract-address>
   ```

## Launch day

There's a full step-by-step **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** —
follow it top to bottom (it has you do a free testnet dry run first).

### Give FERN to friends (airdrop)

```bash
cp airdrop.example.json airdrop.json   # then edit with friends' addresses + amounts
# set FERN_ADDRESS in .env to your deployed contract, then:
npm run airdrop:sepolia                # test first
npm run airdrop:mainnet                # for real
```

### Lock trust by burning your liquidity

After adding liquidity, burning your Uniswap LP tokens proves you can't pull the
pool ("rug"). Set `LP_TOKEN_ADDRESS` in `.env`, then:

```bash
npx hardhat run scripts/burn-liquidity.js --network mainnet            # dry run
npx hardhat run scripts/burn-liquidity.js --network mainnet -- --confirm  # for real
```

> This is irreversible. Prefer to keep the option to reclaim liquidity later?
> Use a time-lock service (UNCX, Team Finance) instead.

## A note on safety & expectations

- Meme coins are highly speculative and most go to zero. Only put in what you're
  happy to lose, and never invest more than you can afford to part with.
- This contract is intentionally minimal and uses audited OpenZeppelin building
  blocks, but no code in this repo has had a formal third-party audit. Review it
  yourself (it's short!) before putting real money behind it.
- You hold 100% of the supply at deploy time. How you distribute it — liquidity,
  community airdrops, etc. — is up to you. Locking or burning a chunk of
  liquidity is a common way to earn traders' trust.

Made with 🐾 for Fern.
