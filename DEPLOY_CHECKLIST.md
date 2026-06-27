# 🌾 $FERN Deploy Day Checklist

Follow this top to bottom. **Do the whole thing on the testnet first** — it's
free and identical to mainnet. Only repeat on mainnet once the testnet run feels
boring and predictable.

> ⚠️ Golden rule: never paste your real private key anywhere except your local
> `.env` file, and never commit `.env`. Use a fresh wallet made just for FERN.

---

## Phase 0 — One-time setup (~15 min)

- [ ] Install [MetaMask](https://metamask.io) and create a **brand-new wallet**
      just for this. Write down the seed phrase on paper.
- [ ] Get a free RPC URL from [Alchemy](https://alchemy.com) (one for Sepolia
      testnet, one for Ethereum mainnet).
- [ ] Get a free [Etherscan API key](https://etherscan.io/myapikey) (for
      verifying the contract source so people can read it).
- [ ] In the project: `npm install`
- [ ] `cp .env.example .env`, then fill in:
      `RPC_URL_SEPOLIA`, `RPC_URL_MAINNET`, `DEPLOYER_PRIVATE_KEY`,
      `ETHERSCAN_API_KEY`.
      (Export your private key from MetaMask: Account → ⋮ → Account details →
      Show private key.)
- [ ] `npm test` — confirm the test suite passes.

---

## Phase 1 — Testnet dry run (free, do this fully)

- [ ] Get free test ETH from a [Sepolia faucet](https://sepoliafaucet.com) into
      your new wallet.
- [ ] Deploy: `npm run deploy:sepolia`
- [ ] Copy the printed contract address into `.env` as `FERN_ADDRESS`.
- [ ] Verify the source (command is printed by the deploy script):
      `npx hardhat verify --network sepolia <FERN_ADDRESS> <your_wallet_address>`
- [ ] Open `https://sepolia.etherscan.io/token/<FERN_ADDRESS>` — confirm you see
      "Fern Coin", symbol FERN, supply 1,000,000,000, and 100% in your wallet.
- [ ] Practice an airdrop: copy `airdrop.example.json` → `airdrop.json`, put a
      second test wallet of yours in it, run `npm run airdrop:sepolia`, and
      confirm the tokens arrive.

If all of that worked, you understand the whole flow. 🎉

---

## Phase 2 — Mainnet launch (this costs real ETH)

> Rough costs: ~$5–40 in gas to deploy (varies with network congestion), plus
> however much ETH you choose to seed the liquidity pool with. The pool ETH is
> real money that's genuinely at risk.

- [ ] Fund your deployer wallet with enough ETH for gas **plus** your intended
      liquidity (e.g. gas + 0.1–0.5 ETH for the pool).
- [ ] Deploy: `npm run deploy:mainnet`
- [ ] Save the contract address. Put it in `.env` as `FERN_ADDRESS`.
- [ ] Verify on Etherscan:
      `npx hardhat verify --network mainnet <FERN_ADDRESS> <your_wallet_address>`

---

## Phase 3 — Make it tradeable (add liquidity)

- [ ] Go to `https://app.uniswap.org/#/add/v2/ETH/<FERN_ADDRESS>`
- [ ] Deposit ETH **and** FERN together. The ratio sets the opening price.
      Example: 0.2 ETH + 100,000,000 FERN. (More ETH in the pool = less wild
      price swings when people trade.)
- [ ] Confirm the transaction. The pool is now live — anyone can buy/sell FERN.

---

## Phase 4 — Earn trust before inviting friends

- [ ] **Burn the liquidity** so people know you can't pull the pool:
      find your LP token address (Uniswap shows it), put it in `.env` as
      `LP_TOKEN_ADDRESS`, then:
      `npx hardhat run scripts/burn-liquidity.js --network mainnet`  (dry run)
      → re-run with `-- --confirm` to actually burn.
      *(Prefer to keep the option to reclaim it? Use a time-lock like UNCX or
      Team Finance instead.)*
- [ ] Decide what to do with the supply you hold. Common, trust-building moves:
      keep most in the pool, airdrop some to friends, and **don't sell a big
      chunk at once** (that crashes the price and looks like a rug).

---

## Phase 5 — Hand it to friends

- [ ] Share the **contract address** — friends paste it into Uniswap and swap
      ETH → FERN themselves.
- [ ] Or gift directly: add their addresses to `airdrop.json` and run
      `npm run airdrop:mainnet`.
- [ ] Share the website (`website/index.html`) with `FERN_ADDRESS` filled in.
- [ ] Keep reminding everyone: **it's a dog meme, not an investment.** 🐕

---

### Quick command reference

| Goal                  | Command                                                        |
| --------------------- | ------------------------------------------------------------- |
| Run tests             | `npm test`                                                     |
| Deploy (testnet)      | `npm run deploy:sepolia`                                       |
| Deploy (mainnet)      | `npm run deploy:mainnet`                                       |
| Airdrop (testnet)     | `npm run airdrop:sepolia`                                      |
| Airdrop (mainnet)     | `npm run airdrop:mainnet`                                      |
| Burn LP (dry run)     | `npx hardhat run scripts/burn-liquidity.js --network mainnet` |
| Burn LP (for real)    | add `-- --confirm` to the command above                       |
