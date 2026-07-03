# Macetz

A production-ready dApp that turns the official Zama Wrappers Registry
into a usable product -- wrap, unwrap, decrypt, and confidentially
distribute ERC-7984 tokens, all in one place.

## Live URL
https://macetz.vercel.app

## Supported Networks
- Sepolia (primary, fully supported: shield / unshield / decrypt)

## How the Registry Is Sourced
Macetz reads the official onchain Wrappers Registry as its primary
source of truth. A local config file (config/custom-pairs.json)
additionally supports custom or dev-only pairs, clearly labeled
"Dev Pair" in the UI and excluded from production stats.

## How to Add a New Pair
1. Open config/custom-pairs.json
2. Add an entry with erc20, erc7984, symbol, decimals, source: "local-dev"
3. Restart the dev server -- the pair appears in the Registry automatically

Example:
```json
{
  "pairs": [
    {
      "erc20": "0xYourTestToken...",
      "erc7984": "0xYourWrappedToken...",
      "symbol": "cXYZ",
      "decimals": 18,
      "source": "local-dev"
    }
  ]
}
```

## Features
- Browse every official ERC-20 <-> ERC-7984 pair on Sepolia
- Wrap / unwrap with full approval flow and error handling
- Decrypt any ERC-7984 balance (registry or not) via EIP-712
- Claim official cTokenMocks from the Sepolia faucet
- Confidential distribution via TokenOps SDK (Special Bounty Track)

## Tech Stack
Next.js, TypeScript, Tailwind CSS, wagmi/viem, @zama-fhe/sdk, TokenOps SDK

## Deployment
```bash
npm install
npm run build
npm run start
```

No backend required -- all FHE operations run client-side via Zama's
public Sepolia relayer (relayer.testnet.zama.cloud).

## Known Limitations
See "Known Limitations" section on the live site -- summarized:
Sepolia-only, single-token distribution batches for now, unaudited.

## License
MIT -- this is an unaudited community project built for the Zama
Developer Program Season 3. Use at your own risk.
