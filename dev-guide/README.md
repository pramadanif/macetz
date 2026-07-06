# Macetz Dev Guide — Deploy Your Own ERC-20 + ERC-7984 Pair

Cross-platform (macOS + Windows) Hardhat project. Uses Node.js scripts only — no bash-specific commands.

Pattern verified against [Zama's ERC7984ERC20Wrapper example](https://docs.zama.org/protocol/examples/openzeppelin-confidential-contracts/erc7984/erc7984erc20wrappermock).

## Prerequisites

- Node.js 20+
- Sepolia ETH on deployer wallet
- `PRIVATE_KEY` for deployer (never commit)

## Setup

```bash
cd dev-guide
npm install
cp .env.example .env
# Edit .env — set PRIVATE_KEY and RPC URLs
```

## Deploy on Sepolia

```bash
npm run deploy:sepolia
```

Expected output: `deployed-addresses.json` with `erc20` + `wrapper` addresses.

Edit token metadata in `scripts/deploy.ts` (`TOKEN_NAME`, `WRAPPER_SYMBOL`, etc.) before deploying.

## Deploy on Mainnet

```bash
npm run deploy:mainnet
```

Requires real ETH. Only deploy when you intend to use mainnet confidential tokens.

## Add your pair to Macetz

### Option A — In-app Admin UI

1. Open Macetz → **Registry → Add a Pair**
2. Paste ERC-20 + ERC-7984 from `deployed-addresses.json`
3. Pair appears as **Preview** (browser-only)
4. Click **Copy Config Snippet** for permanent config

### Option B — `config/custom-pairs.json`

Add under the correct chain key:

```json
{
  "11155111": [
    {
      "erc20": "0xYourErc20",
      "erc7984": "0xYourWrapper",
      "symbol": "cMTUSD",
      "decimals": 6,
      "source": "local-dev"
    }
  ]
}
```

Restart dev server. Pair shows with **Dev** badge.

## Wrap + verify decrypt (Sepolia)

After deploy:

```bash
npm run wrap-verify
```

Mints underlying, wraps into confidential token, decrypts balance via Zama relayer — same crypto path as Macetz **Decrypt → Any ERC-7984**.

Paste the wrapper address in Macetz Decrypt tab to confirm universal decrypt works for non-registry tokens.

## Cross-platform notes

- Uses `path.join()` — no hardcoded `/` paths
- Uses `dotenv` for env loading on all OSes
- Line endings: keep `.env` as UTF-8 LF or CRLF — both work with dotenv

## Contracts

| File | Purpose |
|------|---------|
| `contracts/MintableERC20.sol` | Underlying ERC-20 with public `mint` |
| `contracts/MacetzConfidentialWrapper.sol` | ERC-7984 wrapper (Zama + OpenZeppelin pattern) |
