import { sepolia, mainnet } from "wagmi/chains";

// ─── Chains ───────────────────────────────────────────────────────────────────
export const SUPPORTED_CHAINS = [sepolia, mainnet] as const;
export const SEPOLIA_CHAIN_ID = sepolia.id;   // 11155111
export const MAINNET_CHAIN_ID = mainnet.id;   // 1

/** Legacy export — still resolves to Sepolia as the default/safe chain. */
export const CHAIN = sepolia;
export const CHAIN_ID = sepolia.id;

// ─── RPC URLs ─────────────────────────────────────────────────────────────────
export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";

export const MAINNET_RPC_URL =
  process.env.NEXT_PUBLIC_MAINNET_RPC_URL ?? "https://ethereum-rpc.publicnode.com";

// ─── Registry Addresses ───────────────────────────────────────────────────────
/** Sepolia Wrappers Registry (docs.zama.org/protocol/protocol-apps/addresses/testnet/sepolia) */
export const REGISTRY_ADDRESS =
  "0x2f0750Bbb0A246059d80e94c454586a7F27a128e" as const;

/** Ethereum Mainnet Wrappers Registry (docs.zama.org/protocol/protocol-apps/addresses/mainnet/ethereum) */
export const MAINNET_REGISTRY_ADDRESS =
  "0xeb5015fF021DB115aCe010f23F55C2591059bBA0" as const;

export function getRegistryAddress(chainId: number): `0x${string}` {
  return chainId === MAINNET_CHAIN_ID ? MAINNET_REGISTRY_ADDRESS : REGISTRY_ADDRESS;
}

// ─── Relayer URLs ─────────────────────────────────────────────────────────────
/**
 * Zama relayer-sdk requires an absolute http(s) URL.
 * In the browser, defaults to the same-origin Next.js proxy (`/api/relayer/<chainId>`).
 * Override with NEXT_PUBLIC_RELAYER_URL / NEXT_PUBLIC_MAINNET_RELAYER_URL.
 */
export function getRelayerUrl(chainId?: number, origin?: string): string {
  const base = origin?.replace(/\/$/, "");

  if (chainId === MAINNET_CHAIN_ID) {
    const env = process.env.NEXT_PUBLIC_MAINNET_RELAYER_URL;
    if (env?.startsWith("http")) return env;
    if (base) return `${base}/api/relayer/1`;
    return "https://relayer.mainnet.zama.org/v2";
  }

  const env = process.env.NEXT_PUBLIC_RELAYER_URL;
  if (env?.startsWith("http")) return env;
  if (base) return `${base}/api/relayer/11155111`;
  return "https://relayer.testnet.zama.org/v2";
}

// ─── Faucet Config ────────────────────────────────────────────────────────────
export const FAUCET_MINT_CAP = 1_000n;
export const FAUCET_MINT_DECIMALS_CAP = 1_000_000n;

// ─── WalletConnect ────────────────────────────────────────────────────────────
export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

// ─── Sepolia Known Pairs ──────────────────────────────────────────────────────
export const KNOWN_MOCK_PAIRS = [
  {
    symbol: "cUSDCMock",
    name: "Confidential USDC (Mock)",
    wrapper: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639" as const,
    underlying: "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF" as const,
    isMock: true,
    chainId: SEPOLIA_CHAIN_ID,
  },
  {
    symbol: "cUSDTMock",
    name: "Confidential USDT (Mock)",
    wrapper: "0x4E7B06D78965594eB5EF5414c357ca21E1554491" as const,
    underlying: "0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0" as const,
    isMock: true,
    chainId: SEPOLIA_CHAIN_ID,
  },
  {
    symbol: "cWETHMock",
    name: "Confidential WETH (Mock)",
    wrapper: "0x46208622DA27d91db4f0393733C8BA082ed83158" as const,
    underlying: "0xff54739b16576FA5402F211D0b938469Ab9A5f3F" as const,
    isMock: true,
    chainId: SEPOLIA_CHAIN_ID,
  },
  {
    symbol: "cBRONMock",
    name: "Confidential BRON (Mock)",
    wrapper: "0xaa5612FA27c927a0c7961f5AEFEE5ba3A0F9C891" as const,
    underlying: "0xFf021fB13cA64e5354c62c954b949a88cfDEb25E" as const,
    isMock: true,
    chainId: SEPOLIA_CHAIN_ID,
  },
  {
    symbol: "cZAMAMock",
    name: "Confidential ZAMA (Mock)",
    wrapper: "0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB" as const,
    underlying: "0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57" as const,
    isMock: true,
    chainId: SEPOLIA_CHAIN_ID,
  },
  {
    symbol: "ctGBPMock",
    name: "Confidential tGBP (Mock)",
    wrapper: "0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC" as const,
    underlying: "0x93c931278A2aad1916783F952f94276eA5111442" as const,
    isMock: true,
    chainId: SEPOLIA_CHAIN_ID,
  },
  {
    symbol: "cXAUtMock",
    name: "Confidential XAUt (Mock)",
    wrapper: "0xe4FcF848739845BC81Dee1d5352cf3844F0a60C7" as const,
    underlying: "0x24377AE4AA0C45ecEe71225007f17c5D423dd940" as const,
    isMock: true,
    chainId: SEPOLIA_CHAIN_ID,
  },
  {
    symbol: "ctGBP",
    name: "Confidential tGBP",
    wrapper: "0x167DC962808B32CFFFc7e14B5018c0bE06A3A208" as const,
    underlying: "0xf6Ef9ADB61A48E29E36bc873070A46A3D2667ff3" as const,
    isMock: false,
    chainId: SEPOLIA_CHAIN_ID,
  },
] as const;

/** Wrapper addresses listed in Zama Sepolia docs — used for docs-verified badge only. */
export const OFFICIAL_DOC_WRAPPER_ADDRESSES = new Set(
  KNOWN_MOCK_PAIRS.map((p) => p.wrapper.toLowerCase())
);

// ─── Mainnet Known Pairs ──────────────────────────────────────────────────────
/**
 * Official mainnet confidential wrapper pairs.
 * Source: docs.zama.org/protocol/protocol-apps/addresses/mainnet/ethereum
 * Verified: 2026-07-06
 */
export const MAINNET_KNOWN_PAIRS = [
  {
    symbol: "cUSDC",
    name: "Confidential USDC",
    wrapper: "0xe978F22157048E5DB8E5d07971376e86671672B2" as const,
    underlying: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "cUSDT",
    name: "Confidential USDT",
    wrapper: "0xAe0207C757Aa2B4019Ad96edD0092ddc63EF0c50" as const,
    underlying: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "cWETH",
    name: "Confidential WETH",
    wrapper: "0xda9396b82634Ea99243cE51258B6A5Ae512D4893" as const,
    underlying: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "cBRON",
    name: "Confidential BRON",
    wrapper: "0x85dE671c3bec1aDeD752c3Cea943521181C826bc" as const,
    underlying: "0xBA2C598E11eD093079cC324FCa5BbbA99F616E83" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "cZAMA",
    name: "Confidential ZAMA",
    wrapper: "0x80CB147Fd86dC6dEe3Eee7e4Cee33d1397d98071" as const,
    underlying: "0xA12CC123ba206d4031D1c7f6223D1C2Ec249f4f3" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "ctGBP",
    name: "Confidential tGBP",
    wrapper: "0xa873750ccBafD5ec7Dd13bfD5237d7129832eDD9" as const,
    underlying: "0x27f6c8289550fce67f6b50bed1f519966afe5287" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "cXAUt",
    name: "Confidential XAUt",
    wrapper: "0x73cc9aF9d6BEFdb3c3fAf8a5E8c05Cb95FdaEEf1" as const,
    underlying: "0x68749665FF8D2d112Fa859AA293F07A622782F38" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "cbbqTGBP",
    name: "Confidential bbqTGBP",
    wrapper: "0xBA4cFF6ED6F7Cb2A58776dECa4E984b498446762" as const,
    underlying: "0xbeeffABcd0dB09589Dd21854aa760C52aB4bf04F" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
  {
    symbol: "csteakcUSDC",
    name: "Confidential steakcUSDC",
    wrapper: "0x66Bf74E96900D1a19c7070D939D124f2F565C458" as const,
    underlying: "0xbEEF00A59B577423653A1526c7009bdE103F542B" as const,
    isMock: false,
    chainId: MAINNET_CHAIN_ID,
  },
] as const;

export const MAINNET_OFFICIAL_DOC_WRAPPER_ADDRESSES = new Set(
  MAINNET_KNOWN_PAIRS.map((p) => p.wrapper.toLowerCase())
);

/** Get the official wrapper address set for a given chain. */
export function getOfficialAddresses(chainId: number): Set<string> {
  return chainId === MAINNET_CHAIN_ID
    ? MAINNET_OFFICIAL_DOC_WRAPPER_ADDRESSES
    : OFFICIAL_DOC_WRAPPER_ADDRESSES;
}

/** Check if a chainId is supported by Macetz. */
export function isSupportedChain(chainId: number): boolean {
  return chainId === SEPOLIA_CHAIN_ID || chainId === MAINNET_CHAIN_ID;
}

/** Returns true if chainId is Ethereum mainnet. */
export function isMainnet(chainId: number): boolean {
  return chainId === MAINNET_CHAIN_ID;
}
