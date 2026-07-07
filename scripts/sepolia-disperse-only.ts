/** Disperse-only continuation — run after main bounty-e2e mint/wrap/unshield. */
import { createPublicClient, createWalletClient, http, parseUnits, hexToBytes, type Address } from "viem";
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

const WRAPPER = "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639" as const;
const SINGLETON = "0x710dD9885Cc9986EfD234E7719483147a6d8DBb4" as const;

async function main() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing");

  const rpc = process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";
  const account = privateKeyToAccount(pk as `0x${string}`);
  const publicClient = createPublicClient({ chain: sepolia, transport: http(rpc) });
  const walletClient = createWalletClient({ account, chain: sepolia, transport: http(rpc) });

  const fheChain = {
    ...sepoliaFhe,
    network: rpc,
    relayerUrl: "https://relayer.testnet.zama.org/v2",
  } as const satisfies FheChain;

  const sdk = new ZamaSDK(
    createConfig({
      chains: [fheChain],
      publicClient,
      walletClient,
      relayers: { [fheChain.id]: relayerNode() },
    })
  );

  const encryptor = {
    encrypt: async (params: {
      values: { value: bigint; type: string }[];
      contractAddress: Address;
      userAddress: Address;
    }) => {
      const result = await sdk.encrypt({
        values: params.values as { value: bigint; type: "euint64" }[],
        contractAddress: params.contractAddress,
        userAddress: params.userAddress,
      });
      return {
        handles: result.encryptedValues.map((v) => hexToBytes(v as `0x${string}`)),
        inputProof: hexToBytes(result.inputProof as `0x${string}`),
      };
    },
  };

  const opHash = await walletClient.writeContract({
    chain: sepolia,
    account,
    address: WRAPPER,
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
    args: [SINGLETON, ERC7984_OPERATOR_MAX_DEADLINE],
  });
  await publicClient.waitForTransactionReceipt({ hash: opHash });
  console.log("setOperator:", opHash);

  const client = new ConfidentialDisperseClient({
    publicClient,
    walletClient,
    address: SINGLETON,
    chainId: sepolia.id,
    encryptor: () => encryptor,
  });

  const result = await client.disperse({
    token: WRAPPER,
    mode: "direct",
    recipients: ["0x000000000000000000000000000000000000dEaD"],
    amounts: [parseUnits("1", 6)],
    account,
  });
  console.log("disperse:", result.hash);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
