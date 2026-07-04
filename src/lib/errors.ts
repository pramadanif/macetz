export function formatWalletError(error: Error): string {
  const msg = error.message.toLowerCase();

  if (msg.includes("user rejected") || msg.includes("user denied")) {
    return "Transaction rejected by user.";
  }

  if (msg.includes("insufficient funds") || msg.includes("insufficient balance")) {
    return "Insufficient balance for this transaction.";
  }

  if (msg.includes("exceeds allowance") || msg.includes("erc20: insufficient allowance")) {
    return "Token approval required. Please approve the spending amount first.";
  }

  if (msg.includes("network") || msg.includes("chain")) {
    return "Please switch to Sepolia testnet to continue.";
  }

  if (msg.includes("nonce")) {
    return "Transaction nonce conflict. Please try again.";
  }

  if (msg.includes("gas")) {
    return "Transaction requires more gas. Ensure you have enough Sepolia ETH.";
  }

  if (msg.includes("reverted") || msg.includes("revert")) {
    return "Transaction reverted. The contract rejected this operation.";
  }

  if (msg.includes("timeout")) {
    return "Transaction timed out. Please check your wallet and try again.";
  }

  const short = error.message.length > 200
    ? error.message.slice(0, 200) + "..."
    : error.message;

  return short;
}
