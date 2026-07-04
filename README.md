# Macetz

A production-ready dApp that turns the official Zama Wrappers Registry into a usable product — wrap, unwrap, decrypt, and manage ERC-7984 confidential tokens, all in one place.

**Built for the Zama Developer Program, Season 3 — Wrappers Registry Bounty Track.**

## Live URL

https://macetz.vercel.app

## Supported Networks

- **Sepolia** (primary, fully supported: shield / unshield / decrypt / faucet)

## Features

- **Browse the Registry** — See every official ERC-20 ↔ ERC-7984 wrapper pair on Sepolia, sourced directly from the onchain Wrappers Registry contract.
- **Wrap (Shield)** — Convert any registry ERC-20 into its ERC-7984 confidential equivalent. The SDK handles ERC-20 approval automatically.
- **Unwrap (Unshield)** — Convert confidential tokens back to ERC-20. The SDK orchestrates the full two-step async flow (unwrap request → relayer decryption → finalize) transparently.
- **Decrypt Balances** — View the decrypted balance of any ERC-7984 token in your wallet via the EIP-712 user-decryption flow. Works for both registry tokens and arbitrary ERC-7984 addresses.
- **Testnet Faucet** — Claim official cTokenMock test tokens (up to 1,000 per mint) to try the flow immediately.
- **Custom Pairs** — Add dev/custom pairs via a local JSON config, clearly labeled "Dev Pair" in the UI.

## How the Registry Is Sourced

Macetz uses a **hybrid registry source**:

1. **Primary**: Reads all pairs from the onchain `ConfidentialTokenWrappersRegistry` contract at [`0x2f0750Bbb0A246059d80e94c454586a7F27a128e`](https://sepolia.etherscan.io/address/0x2f0750Bbb0A246059d80e94c454586a7F27a128e) via `getTokenConfidentialTokenPairs()`, filtering `isValid == true`.
2. **Secondary**: Merges pairs from `config/custom-pairs.json` for dev/custom pairs, tagged with `source: "local-dev"` and displayed with a "Dev Pair" badge.

## How to Add a New Pair

1. Open `config/custom-pairs.json`
2. Add an entry:

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

3. Restart the dev server — the pair appears in the Registry tab automatically, labeled "Dev Pair"

## Official Sepolia cTokenMocks

| Symbol | Wrapper Address | Underlying ERC-20 | Mint |
|--------|-----------------|-------------------|------|
| cUSDCMock | `0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639` | `0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF` | Public |
| cUSDTMock | `0x4E7B06D78965594eB5EF5414c357ca21E1554491` | `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0` | Public |
| cWETHMock | `0x46208622DA27d91db4f0393733C8BA082ed83158` | `0xff54739b16576FA5402F211D0b938469Ab9A5f3F` | Public |
| cBRONMock | `0xaa5612FA27c927a0c7961f5AEFEE5ba3A0F9C891` | `0xFf021fB13cA64e5354c62c954b949a88cfDEb25E` | Public |
| cZAMAMock | `0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB` | `0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57` | Public |
| ctGBPMock | `0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC` | `0x93c931278A2aad1916783F952f94276eA5111442` | Public |
| cXAUtMock | `0xe4FcF848739845BC81Dee1d5352cf3844F0a60C7` | `0x24377AE4AA0C45ecEe71225007f17c5D423dd940` | Public |
| ctGBP | `0x167DC962808B32CFFFc7e14B5018c0bE06A3A208` | `0xf6Ef9ADB61A48E29E36bc873070A46A3D2667ff3` | Restricted |

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript (strict mode), Tailwind CSS v4
- **Web3**: wagmi v3, viem v2
- **FHE**: `@zama-fhe/sdk` + `@zama-fhe/react-sdk` (handles shield, unshield, decrypt, permits)
- **State**: TanStack React Query

## Architecture

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── app/page.tsx      # Functional dApp
│   └── api/relayer/      # Relayer proxy route
├── components/
│   ├── app/              # dApp components (logic + presentation)
│   └── *.tsx             # Landing page components
├── hooks/                # Custom hooks (registry, faucet)
├── lib/
│   ├── config.ts         # Single source of truth for constants
│   ├── types.ts          # TypeScript type definitions
│   ├── abis.ts           # Contract ABIs
│   ├── registry.ts       # Registry data fetching
│   └── errors.ts         # Error formatting
└── providers/
    └── Web3Provider.tsx  # wagmi + Zama SDK provider setup
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run lint

# Build for production
npm run build
```

## Deployment

```bash
npm run build
npm run start
```

No backend required — all FHE operations run client-side via the Zama SDK. The relayer proxy (`/api/relayer/[chainId]`) forwards requests to Zama's public Sepolia relayer.

## Key Implementation Details

### Two-Step Unwrap
The `useUnshield` hook from `@zama-fhe/react-sdk` orchestrates the full two-step async unwrap:
1. `unwrap()` → emits `UnwrapRequested` event
2. Relayer publicly decrypts the amount → `finalizeUnwrap()` sends underlying ERC-20

The UI displays a pending-finalization state between steps.

### Universal Decrypt
Any ERC-7984 token can be decrypted, not just registry pairs:
- **Registry mode**: Select from the dropdown
- **Custom mode**: Paste any address — validated via `supportsInterface(0x4958f2a4)` before attempting decrypt

### Decimal Handling
Confidential wrappers have max 6 decimals. The `rate()` function on wrappers handles conversion. The UI displays amounts using the correct decimals for each token type.

## Known Limitations

- Sepolia testnet only (by design for this bounty)
- Single-token operations (no batched wraps)
- Unaudited community project — use at your own risk
- Requires MetaMask or similar injected wallet (EIP-1193 provider)

## License

MIT
