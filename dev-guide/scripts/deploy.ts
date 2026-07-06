import hre from "hardhat";
import fs from "fs";
import path from "path";

/** Edit these three values before deploying your own pair. */
const TOKEN_NAME = "Macetz Test USD";
const TOKEN_SYMBOL = "MTUSD";
const TOKEN_DECIMALS = 6;
const WRAPPER_NAME = "Confidential MTUSD";
const WRAPPER_SYMBOL = "cMTUSD";
const WRAPPER_URI = "https://macetz.vercel.app/metadata/cmtusd.json";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("Deployer:", deployer.address);
  console.log("Chain ID:", chainId);

  const erc20Factory = await hre.ethers.getContractFactory("MintableERC20");
  const erc20 = await erc20Factory.deploy(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS);
  await erc20.waitForDeployment();
  const erc20Address = await erc20.getAddress();
  console.log("ERC-20 deployed:", erc20Address);

  const wrapperFactory = await hre.ethers.getContractFactory("MacetzConfidentialWrapper");
  const wrapper = await wrapperFactory.deploy(
    erc20Address,
    WRAPPER_NAME,
    WRAPPER_SYMBOL,
    WRAPPER_URI
  );
  await wrapper.waitForDeployment();
  const wrapperAddress = await wrapper.getAddress();
  console.log("ERC-7984 wrapper deployed:", wrapperAddress);

  const output = {
    chainId,
    network: chainId === 1 ? "mainnet" : chainId === 11155111 ? "sepolia" : "unknown",
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    erc20: {
      address: erc20Address,
      name: TOKEN_NAME,
      symbol: TOKEN_SYMBOL,
      decimals: TOKEN_DECIMALS,
    },
    wrapper: {
      address: wrapperAddress,
      name: WRAPPER_NAME,
      symbol: WRAPPER_SYMBOL,
      uri: WRAPPER_URI,
    },
  };

  const outPath = path.join(__dirname, "..", "deployed-addresses.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log("Wrote", outPath);
  console.log("\nNext: add to Macetz via Registry → Add a Pair, or custom-pairs.json:");
  console.log(
    JSON.stringify(
      {
        [String(chainId)]: [
          {
            erc20: erc20Address,
            erc7984: wrapperAddress,
            symbol: WRAPPER_SYMBOL,
            decimals: TOKEN_DECIMALS,
            source: "local-dev",
          },
        ],
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
