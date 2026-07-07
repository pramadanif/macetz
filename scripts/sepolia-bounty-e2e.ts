/**
 * Run full Macetz bounty flow on Sepolia and print tx hashes for README evidence.
 * Usage: node --env-file=dev-guide/.env --import tsx scripts/sepolia-bounty-e2e.ts
 */
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { ZamaSDK } from "@zama-fhe/sdk";
import { node as relayerNode } from "@zama-fhe/sdk/node";
import { createConfig } from "@zama-fhe/sdk/viem";
import { sepolia as sepoliaFhe, type FheChain } from "@zama-fhe/sdk/chains";
import {
  ConfidentialDisperseClient,
  ERC7984_OPERATOR_MAX_DEADLINE,
} from "@tokenops/sdk/fhe-disperse";

const ERC20_USDC_MOCK = "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF" as const;
const WRAPPER_CUSDC_MOCK = "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639" as const;
const DISPERSE_SINGLETON = "0x710dD9885Cc9986EfD234E7719483147a6d8DBb4" as const;

const ERC20_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

async function main() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing — set in dev-guide/.env");

  const rpcUrl =
    process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";

  const account = privateKeyToAccount(pk as `0x${string}`);
  const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(rpcUrl),
  });

  console.log("Deployer:", account.address);
  console.log("Network: Sepolia\n");

  const fheChain = {
    ...sepoliaFhe,
    network: rpcUrl,
    relayerUrl: "https://relayer.testnet.zama.org/v2",
  } as const satisfies FheChain;

  const zamaConfig = createConfig({
    chains: [fheChain],
    publicClient,
    walletClient,
    relayers: { [fheChain.id]: relayerNode() },
  });

  const sdk = new ZamaSDK(zamaConfig);
  const wrapped = sdk.createWrappedToken(WRAPPER_CUSDC_MOCK);

  const mintAmount = parseUnits("100", 6);
  const shieldAmount = parseUnits("50", 6);
  const unshieldAmount = parseUnits("10", 6);
  const disperseAmount = parseUnits("1", 6);

  // 1. Faucet mint (official cUSDCMock underlying)
  console.log("1/5 Faucet mint cUSDCMock underlying...");
  const mintHash = await walletClient.writeContract({
    address: ERC20_USDC_MOCK,
    abi: ERC20_ABI,
    functionName: "mint",
    args: [account.address, mintAmount],
  });
  await publicClient.waitForTransactionReceipt({ hash: mintHash });
  console.log("   mintTx:", mintHash);

  // 2. Shield (wrap)
  console.log("2/5 Shield (wrap) to cUSDCMock...");
  const shieldResult = await wrapped.shield(shieldAmount);
  await publicClient.waitForTransactionReceipt({ hash: shieldResult.txHash });
  console.log("   wrapTx:", shieldResult.txHash);

  // 3. Decrypt balance (EIP-712 relayer — no on-chain tx)
  console.log("3/5 Decrypt confidential balance...");
  const decrypted = await wrapped.balanceOf(account.address);
  console.log("   decryptedBalance:", decrypted.toString());
  console.log("   decryptNote: EIP-712 relayer (no on-chain tx)");

  // 4. Unshield (unwrap + finalize)
  console.log("4/5 Unshield (unwrap + finalize)...");
  const unshieldResult = await wrapped.unshield(unshieldAmount);
  console.log("   unshieldResult:", JSON.stringify(unshieldResult, (_, v) => typeof v === "bigint" ? v.toString() : v));

  // 5. TokenOps disperse (direct mode)
  console.log("5/5 TokenOps disperse...");
  const recipient = "0x000000000000000000000000000000000000dEaD" as const;

  const operatorHash = await walletClient.writeContract({
    chain: sepolia,
    account,
    address: WRAPPER_CUSDC_MOCK,
    abi: [
      {
        inputs: [
          { name: "operator", type: "address" },
          { name: "until", type: "uint48" },
        ],
        name: "setOperator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "setOperator",
    args: [DISPERSE_SINGLETON, ERC7984_OPERATOR_MAX_DEADLINE],
  });
  await publicClient.waitForTransactionReceipt({ hash: operatorHash });
  console.log("   setOperatorTx:", operatorHash);

  const encryptor = {
    encrypt: async (params: {
      values: { value: bigint; type: string }[];
      contractAddress: `0x${string}`;
      userAddress: `0x${string}`;
    }) => {
      const result = await sdk.encrypt({
        values: params.values as { value: bigint; type: "euint64" }[],
        contractAddress: params.contractAddress,
        userAddress: params.userAddress,
      });
      const { hexToBytes } = await import("viem");
      return {
        handles: result.encryptedValues.map((v) => hexToBytes(v as `0x${string}`)),
        inputProof: hexToBytes(result.inputProof as `0x${string}`),
      };
    },
  };

  const disperseClient = new ConfidentialDisperseClient({
    publicClient,
    walletClient,
    address: DISPERSE_SINGLETON,
    chainId: sepolia.id,
    encryptor: () => encryptor,
  });

  const disperseResult = await disperseClient.disperse({
    token: WRAPPER_CUSDC_MOCK,
    mode: "direct",
    recipients: [recipient],
    amounts: [disperseAmount],
    account,
  });
  console.log("   disperseTx:", disperseResult.hash);

  // Bonus: arbitrary ERC-7984 decrypt (dev-guide cMTUSD)
  const CMTUSD = "0x3A1E3F5a8C5975078C587C73E80A916505538C4B" as const;
  console.log("\nBonus: decrypt cMTUSD (arbitrary ERC-7984)...");
  const cmtusd = sdk.createWrappedToken(CMTUSD);
  const cmtusdBalance = await cmtusd.balanceOf(account.address);
  console.log("   cMTUSD decryptedBalance:", cmtusdBalance.toString());

  console.log("\n=== BOUNTY E2E SUMMARY ===");
  console.log(JSON.stringify({
    faucetMint: mintHash,
    wrap: shieldResult.txHash,
    decrypt: "EIP-712 relayer (no on-chain tx)",
    decryptedBalance: decrypted.toString(),
    unshield: unshieldResult,
    disperse: disperseResult.hash,
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
