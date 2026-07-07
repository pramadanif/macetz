import { MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID } from "./config";

function networkLabel(chainId?: number): string {
  if (chainId === MAINNET_CHAIN_ID) return "Ethereum mainnet";
  if (chainId === SEPOLIA_CHAIN_ID) return "Sepolia testnet";
  return "Sepolia testnet or Ethereum mainnet";
}

function nativeCurrencyLabel(chainId?: number): string {
  if (chainId === MAINNET_CHAIN_ID) return "ETH";
  return "Sepolia ETH";
}

function isWrongNetworkMessage(msg: string): boolean {
  return (
    msg.includes("wrong network") ||
    msg.includes("unsupported chain") ||
    msg.includes("chain mismatch") ||
    msg.includes("network mismatch") ||
    msg.includes("please switch") ||
    msg.includes("network changed") ||
    msg.includes("chainid") ||
    msg.includes("chain id")
  );
}

export function formatWalletError(error: unknown, chainId?: number): string {
  const raw = error instanceof Error ? error.message : String(error);
  const msg = raw.toLowerCase();

  if (msg.includes("returned no data") || msg.includes("confidentialbalanceof")) {
    return "No confidential contract at this address. Dev Pair config examples are registry-only — use an official pair or deploy your own.";
  }

  if (msg.includes("walletnotconnected") || msg.includes("without a connected wallet")) {
    return "Wallet not connected to the FHE signer. Disconnect and reconnect your wallet, then try again.";
  }

  if (msg.includes("user rejected") || msg.includes("user denied")) {
    return "Transaction rejected by user.";
  }

  if (msg.includes("insufficient funds") || msg.includes("insufficient balance")) {
    return "Insufficient balance for this transaction.";
  }

  if (msg.includes("exceeds allowance") || msg.includes("erc20: insufficient allowance")) {
    return "Token approval required. Please approve the spending amount first.";
  }

  if (isWrongNetworkMessage(msg)) {
    return `Please switch to ${networkLabel(chainId)} to continue.`;
  }

  if (msg.includes("nonce")) {
    return "Transaction nonce conflict. Please try again.";
  }

  if (msg.includes("gas")) {
    return `Transaction requires more gas. Ensure you have enough ${nativeCurrencyLabel(chainId)}.`;
  }

  if (msg.includes("reverted") || msg.includes("revert")) {
    return "Transaction reverted. The contract rejected this operation.";
  }

  if (msg.includes("timeout")) {
    return "Transaction timed out. Please check your wallet and try again.";
  }

  const short = raw.length > 200
    ? raw.slice(0, 200) + "..."
    : raw;

  return short;
}
