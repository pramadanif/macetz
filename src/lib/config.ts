import { sepolia } from "wagmi/chains";

export const CHAIN = sepolia;
export const CHAIN_ID = sepolia.id;

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";

/** Zama relayer-sdk requires absolute http(s) URL. */
export function getRelayerUrl(): string {
  const env = process.env.NEXT_PUBLIC_RELAYER_URL;
  if (env?.startsWith("http")) return env;
  return "https://relayer.testnet.zama.org/v2";
}

export const REGISTRY_ADDRESS =
  "0x2f0750Bbb0A246059d80e94c454586a7F27a128e" as const;

export const FAUCET_MINT_CAP = 1_000n;
export const FAUCET_MINT_DECIMALS_CAP = 1_000_000n;

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const KNOWN_MOCK_PAIRS = [
  {
    symbol: "cUSDCMock",
    name: "Confidential USDC (Mock)",
    wrapper: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639" as const,
    underlying: "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF" as const,
    isMock: true,
  },
  {
    symbol: "cUSDTMock",
    name: "Confidential USDT (Mock)",
    wrapper: "0x4E7B06D78965594eB5EF5414c357ca21E1554491" as const,
    underlying: "0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0" as const,
    isMock: true,
  },
  {
    symbol: "cWETHMock",
    name: "Confidential WETH (Mock)",
    wrapper: "0x46208622DA27d91db4f0393733C8BA082ed83158" as const,
    underlying: "0xff54739b16576FA5402F211D0b938469Ab9A5f3F" as const,
    isMock: true,
  },
  {
    symbol: "cBRONMock",
    name: "Confidential BRON (Mock)",
    wrapper: "0xaa5612FA27c927a0c7961f5AEFEE5ba3A0F9C891" as const,
    underlying: "0xFf021fB13cA64e5354c62c954b949a88cfDEb25E" as const,
    isMock: true,
  },
  {
    symbol: "cZAMAMock",
    name: "Confidential ZAMA (Mock)",
    wrapper: "0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB" as const,
    underlying: "0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57" as const,
    isMock: true,
  },
  {
    symbol: "ctGBPMock",
    name: "Confidential tGBP (Mock)",
    wrapper: "0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC" as const,
    underlying: "0x93c931278A2aad1916783F952f94276eA5111442" as const,
    isMock: true,
  },
  {
    symbol: "cXAUtMock",
    name: "Confidential XAUt (Mock)",
    wrapper: "0xe4FcF848739845BC81Dee1d5352cf3844F0a60C7" as const,
    underlying: "0x24377AE4AA0C45ecEe71225007f17c5D423dd940" as const,
    isMock: true,
  },
  {
    symbol: "ctGBP",
    name: "Confidential tGBP",
    wrapper: "0x167DC962808B32CFFFc7e14B5018c0bE06A3A208" as const,
    underlying: "0xf6Ef9ADB61A48E29E36bc873070A46A3D2667ff3" as const,
    isMock: false,
  },
  {
    symbol: "csteakcUSDC",
    name: "csteakcUSDC (Mock)",
    wrapper: "0x13F7d34A4f0102734F19E3Ff16e068Fe194B28c4" as const,
    underlying: "0x6AB54988261AEC573a2CA13cF802d3B1114f864C" as const,
    isMock: true,
  },
] as const;
