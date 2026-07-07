/**
 * In-app documentation content — edit sections here without touching layout code.
 */

export interface DocsCodeBlock {
  id: string;
  language: string;
  code: string;
}

export type DocsBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "subheading"; text: string }
  | { type: "code"; blockId: string }
  | { type: "anchor"; id: string; label: string };

export interface DocsSection {
  id: string;
  title: string;
  blocks: DocsBlock[];
  codeBlocks?: DocsCodeBlock[];
}

export const DOCS_SECTIONS: DocsSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    blocks: [
      {
        type: "paragraph",
        text: "Macetz is a browser dApp for Zama FHE confidential tokens (ERC-7984). You start with a normal ERC-20, wrap it into a confidential wrapper so balances stay encrypted on-chain, decrypt your own balance when you need to read it, and unwrap back to the underlying token when you are done. No FHE background required: connect a wallet, pick a token pair from the Registry, Shield to wrap, Decrypt to view your balance, then Unshield to get ERC-20 back.",
      },
      {
        type: "paragraph",
        text: "Typical flow: Registry → Shield (wrap) → Decrypt (read balance) → Shield tab Unshield (two-step via Zama relayer). On Sepolia, the Faucet mints mock underlying tokens for official tutorial pairs.",
      },
    ],
  },
  {
    id: "how-registry-works",
    title: "How the Registry Works",
    blocks: [
      {
        type: "paragraph",
        text: "Macetz uses hybrid sourcing. The onchain Zama Wrappers Registry is the primary source of truth — every valid onchain pair is shown automatically (zero code changes after registration). Pairs in Zama's official docs table get a Docs-verified badge; other onchain pairs show a Registry badge with a caution note. Local config (config/custom-pairs.json) and in-browser preview pairs add dev or custom pairs, clearly labeled Dev or Preview.",
      },
      {
        type: "subheading",
        text: "Dual-network support",
      },
      {
        type: "paragraph",
        text: "Sepolia (chain 11155111) and Ethereum Mainnet (chain 1) are both supported. Use the network switcher in the sidebar to change chains. Registry contents, validation, and custom pairs are scoped per chainId — a Sepolia pair never appears on Mainnet.",
      },
      {
        type: "list",
        items: [
          "Sepolia: full tutorial experience — Registry, Shield, Decrypt, Faucet (mock mints), Distribute.",
          "Mainnet: Registry browse is fully supported. Shield/Decrypt depend on Zama's mainnet relayer (may fail until provisioned). Faucet nav hides automatically. Distribute is Sepolia-only.",
          "Switching networks re-fetches on-chain registry data and reloads chain-scoped local pairs.",
        ],
      },
    ],
  },
  {
    id: "adding-a-pair",
    title: "Adding a New Pair — Four Ways",
    blocks: [
      {
        type: "paragraph",
        text: "You can surface a confidential token pair four ways. Pick based on permanence: official onchain registration for production, local JSON for repo commits, Admin UI for quick browser-only tests, or the dev-guide for deploying your own contracts from scratch.",
      },
      {
        type: "anchor",
        id: "official-registration",
        label: "1. Official onchain registration (recommended for production)",
      },
      {
        type: "paragraph",
        text: "Register the pair in the Zama Wrappers Registry contract (0x2f0750Bb…128e on Sepolia, 0xeb5015fF…bBA0 on Mainnet). Once isValid, Macetz surfaces it automatically on the next load — zero code changes. Pairs listed in Zama's official docs additionally get the Docs-verified badge.",
      },
      {
        type: "anchor",
        id: "local-config",
        label: "2. Local config (config/custom-pairs.json)",
      },
      {
        type: "paragraph",
        text: "Add entries under the chain key (11155111 for Sepolia, 1 for Mainnet). Restart the dev server. Pairs show with a Dev badge. The seeded Dev Pair example on Sepolia:",
      },
      {
        type: "code",
        blockId: "custom-pairs-example",
      },
      {
        type: "anchor",
        id: "admin-ui",
        label: "3. In-app Admin UI",
      },
      {
        type: "paragraph",
        text: "Registry → Add a Pair. Paste ERC-20 and ERC-7984 addresses; Macetz validates checksum, ERC-7984 interface, and decimals on the currently connected network.",
      },
      {
        type: "list",
        items: [
          "Preview pairs live in localStorage keyed by chainId — visible only in this browser, not synced across devices.",
          "Use Copy Config Snippet after adding to paste into config/custom-pairs.json for permanent, shareable config.",
          "Validation always runs against the active network; switch to Sepolia or Mainnet before submitting.",
        ],
      },
      {
        type: "anchor",
        id: "deploy-from-scratch",
        label: "4. Deploy your own token from scratch (dev-guide)",
      },
      {
        type: "paragraph",
        text: "The most complete extensibility path. The dev-guide/ Hardhat project deploys a mintable ERC-20 plus an ERC-7984 wrapper using Zama + OpenZeppelin patterns (same stack as Zama's ERC7984ERC20Wrapper example). Works on macOS and Windows.",
      },
      {
        type: "subheading",
        text: "Prerequisites",
      },
      {
        type: "list",
        items: [
          "Node.js 20+",
          "Sepolia ETH on deployer wallet (or Mainnet ETH for mainnet deploy)",
          "PRIVATE_KEY in dev-guide/.env — never commit this file",
        ],
      },
      {
        type: "subheading",
        text: "Environment setup",
      },
      {
        type: "paragraph",
        text: "Copy dev-guide/.env.example to .env and fill in your deployer key and RPC URLs:",
      },
      {
        type: "code",
        blockId: "env-example",
      },
      {
        type: "subheading",
        text: "Install and deploy",
      },
      {
        type: "code",
        blockId: "deploy-setup",
      },
      {
        type: "paragraph",
        text: "One command deploys both contracts on Sepolia:",
      },
      {
        type: "code",
        blockId: "deploy-sepolia",
      },
      {
        type: "paragraph",
        text: "Expected output: deployed-addresses.json with erc20 and wrapper fields. Edit TOKEN_NAME, WRAPPER_SYMBOL, etc. in scripts/deploy.ts before deploying if you want custom metadata.",
      },
      {
        type: "subheading",
        text: "Mainnet deploy",
      },
      {
        type: "code",
        blockId: "deploy-mainnet",
      },
      {
        type: "subheading",
        text: "Wrap + verify decrypt (Sepolia)",
      },
      {
        type: "paragraph",
        text: "After deploy, run the wrap-and-verify script. It mints underlying, wraps, and decrypts via the Zama relayer — same crypto path as Macetz Decrypt → Any ERC-7984:",
      },
      {
        type: "code",
        blockId: "wrap-verify",
      },
      {
        type: "subheading",
        text: "Plug addresses into Macetz",
      },
      {
        type: "list",
        items: [
          "Option A — Registry → Add a Pair: paste addresses from deployed-addresses.json, get instant Preview pair, then Copy Config Snippet.",
          "Option B — Add to config/custom-pairs.json under the correct chain key (see local config above), restart dev server.",
          "Confirm universal decrypt: paste wrapper address in Decrypt tab (Any ERC-7984) even if the pair is not in the official registry.",
        ],
      },
      {
        type: "code",
        blockId: "custom-pairs-template",
      },
    ],
    codeBlocks: [
      {
        id: "custom-pairs-example",
        language: "json",
        code: `{
  "11155111": [
    {
      "erc20": "0xDE709e08de12Bc4768c6D2FEE8dfD1d6C71D7CF6",
      "erc7984": "0xe709e08De12Bc4768C6D2FeE8DFD1D6C71D7cF70",
      "symbol": "cDEMO1",
      "decimals": 18,
      "source": "local-dev",
      "configExample": true
    },
    {
      "erc20": "0xAB709e08De12Bc4768C6d2FeE8DfD1d6c71d7CF6",
      "erc7984": "0xBB709e08de12BC4768C6d2FeE8DFD1D6C71D7cf7",
      "symbol": "cDEMO2",
      "decimals": 6,
      "source": "local-dev",
      "configExample": true
    }
  ],
  "1": [
    {
      "erc20": "0xcD709e08De12Bc4768C6D2FEE8DFd1D6c71d7CF6",
      "erc7984": "0xdD709e08De12bC4768c6D2FEe8DFD1D6C71D7CF7",
      "symbol": "cMDEMO",
      "decimals": 18,
      "source": "local-dev",
      "configExample": true
    }
  ]
}`,
      },
      {
        id: "env-example",
        language: "env",
        code: `PRIVATE_KEY=
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
MAINNET_RPC_URL=https://ethereum-rpc.publicnode.com`,
      },
      {
        id: "deploy-setup",
        language: "bash",
        code: `cd dev-guide
npm install
cp .env.example .env
# Edit .env — set PRIVATE_KEY and RPC URLs`,
      },
      {
        id: "deploy-sepolia",
        language: "bash",
        code: "npm run deploy:sepolia",
      },
      {
        id: "deploy-mainnet",
        language: "bash",
        code: "npm run deploy:mainnet",
      },
      {
        id: "wrap-verify",
        language: "bash",
        code: "npm run wrap-verify",
      },
      {
        id: "custom-pairs-template",
        language: "json",
        code: `{
  "11155111": [
    {
      "erc20": "0xYourErc20",
      "erc7984": "0xYourWrapper",
      "symbol": "cMTUSD",
      "decimals": 6,
      "source": "local-dev"
    }
  ]
}`,
      },
    ],
  },
  {
    id: "security-notes",
    title: "Security Notes",
    blocks: [
      {
        type: "paragraph",
        text: "FHE decrypt and unwrap flows use the Zama relayer. By default the browser routes through the same-origin proxy at {origin}/api/relayer/[chainId] (see getRelayerUrl in config.ts). Override with NEXT_PUBLIC_RELAYER_URL or NEXT_PUBLIC_MAINNET_RELAYER_URL to call Zama relayers directly. The proxy forwards requests only — no API keys are injected server-side.",
      },
      {
        type: "list",
        items: [
          "Sepolia proxy → https://relayer.testnet.zama.org/v2",
          "Mainnet proxy → https://relayer.mainnet.zama.org/v2 (or MAINNET_RELAYER_URL env override)",
          "EIP-712 signatures authorize decryption of only the signing user's balance.",
        ],
      },
      {
        type: "subheading",
        text: "Network-scoped validation",
      },
      {
        type: "paragraph",
        text: "Add Pair validation, registry fetching, and custom-pair loading all key off the active chainId. Addresses are checksum-normalized (EIP-55) before use. Preview pairs in localStorage cannot leak across networks because storage keys include chainId.",
      },
    ],
  },
  {
    id: "known-limitations",
    title: "Known Limitations",
    blocks: [
      {
        type: "paragraph",
        text: "Honest constraints — same list as the project README. Macetz is a community Zama Developer Program build; plan accordingly.",
      },
      {
        type: "list",
        items: [
          "Testnet focus — Sepolia is the primary supported network for this bounty; Mainnet registry browse works; Shield/Decrypt are relayer-dependent.",
          "Distribute payroll safety — TokenOps Distribute on Sepolia accepts docs-verified registry pairs only (isDistributeOperationalPair). Non-docs onchain pairs remain usable in Shield/Decrypt.",
          "Single-token batches — TokenOps Distribute processes one token per operation; multi-token batches are roadmapped.",
          "Injected wallet — Requires MetaMask or any EIP-1193 wallet; hardware wallets via WalletConnect.",
          "Relayer latency — Unwrap finalization depends on Zama's relayer (~30–90s on Sepolia).",
          "Unaudited — Community project; do not use with real funds you cannot afford to lose.",
          "Dev pairs — Local config and preview pairs are clearly labeled and excluded from production registry stats.",
        ],
      },
    ],
  },
];

export const DOCS_TOC = DOCS_SECTIONS.map((s) => ({ id: s.id, title: s.title }));

/** Flat TOC including in-section anchors for the flagship deploy section. */
export const DOCS_TOC_EXTENDED: { id: string; title: string; depth: number }[] = [
  { id: "getting-started", title: "Getting Started", depth: 0 },
  { id: "how-registry-works", title: "How the Registry Works", depth: 0 },
  { id: "adding-a-pair", title: "Adding a New Pair", depth: 0 },
  { id: "official-registration", title: "Official registration", depth: 1 },
  { id: "local-config", title: "Local config", depth: 1 },
  { id: "admin-ui", title: "Admin UI", depth: 1 },
  { id: "deploy-from-scratch", title: "Deploy from scratch", depth: 1 },
  { id: "security-notes", title: "Security Notes", depth: 0 },
  { id: "known-limitations", title: "Known Limitations", depth: 0 },
];
