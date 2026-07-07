import hre from "hardhat";
import fs from "fs";
import path from "path";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { ZamaSDK } from "@zama-fhe/sdk";
import { node as relayerNode } from "@zama-fhe/sdk/node";
import { createConfig } from "@zama-fhe/sdk/viem";
import { sepolia as sepoliaFhe, type FheChain } from "@zama-fhe/sdk/chains";
import { ERC7984_INTERFACE_ID } from "@zama-fhe/sdk";

const WRAP_UNITS = 50n; // 50 MTUSD
const DECIMALS = 6n;

async function main() {
  const deployedPath = path.join(__dirname, "..", "deployed-addresses.json");
  const deployed = JSON.parse(fs.readFileSync(deployedPath, "utf8")) as {
    erc20: { address: string; decimals: number };
    wrapper: { address: string; symbol: string };
  };

  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing in dev-guide/.env");

  const account = privateKeyToAccount(pk as `0x${string}`);
  const rpcUrl =
    process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";

  const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(rpcUrl),
  });

  const [signer] = await hre.ethers.getSigners();
  const erc20 = await hre.ethers.getContractAt(
    "MintableERC20",
    deployed.erc20.address,
    signer
  );
  const wrapper = await hre.ethers.getContractAt(
    "MacetzConfidentialWrapper",
    deployed.wrapper.address,
    signer
  );

  const rawAmount = WRAP_UNITS * 10n ** DECIMALS;

  console.log("Minting underlying...");
  const mintTx = await erc20.mint(account.address, rawAmount * 2n);
  await mintTx.wait();
  console.log("Mint tx:", mintTx.hash);

  console.log("Approving wrapper...");
  const approveTx = await erc20.approve(deployed.wrapper.address, rawAmount);
  await approveTx.wait();
  console.log("Approve tx:", approveTx.hash);

  console.log("Wrapping", WRAP_UNITS.toString(), deployed.wrapper.symbol, "...");
  const wrapTx = await wrapper.wrap(account.address, rawAmount);
  await wrapTx.wait();
  console.log("Wrap tx:", wrapTx.hash);

  const supports = await publicClient.readContract({
    address: deployed.wrapper.address as `0x${string}`,
    abi: [
      {
        inputs: [{ name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "supportsInterface",
    args: [ERC7984_INTERFACE_ID],
  });

  if (!supports) {
    throw new Error("Wrapper does not support ERC-7984 interface");
  }
  console.log("ERC-7984 interface check: OK");

  const fheChain = {
    ...sepoliaFhe,
    network: rpcUrl,
    relayerUrl: "https://relayer.testnet.zama.org/v2",
  } as const satisfies FheChain;

  const config = createConfig({
    chains: [fheChain],
    publicClient,
    walletClient,
    relayers: { [fheChain.id]: relayerNode() },
  });

  const sdk = new ZamaSDK(config);
  const token = sdk.createToken(deployed.wrapper.address as `0x${string}`);
  const decryptedBalance = await token.balanceOf(account.address);

  console.log("\n=== VERIFY RESULT ===");
  console.log("Wrapper (paste in Macetz Decrypt):", deployed.wrapper.address);
  console.log("Wrap tx:", wrapTx.hash);
  console.log("Decrypted balance:", decryptedBalance.toString());
  console.log("Expected:", rawAmount.toString());
  console.log(
    decryptedBalance === rawAmount ? "MATCH ✅" : "MISMATCH ❌"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
