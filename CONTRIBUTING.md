# Contributing to Macetz

Thanks for your interest in Macetz — the canonical dApp for the
[Zama Wrappers Registry](https://docs.zama.ai). This project was built for the
**Zama Developer Program — Season 3 (Wrappers Registry Bounty Track)**, and
contributions that make the official registry easier and more trustworthy to
use are very welcome.

## Ways to contribute

- **Report a bug** — open an issue with steps to reproduce, the network
  (Sepolia / mainnet), and any console or transaction error.
- **Suggest a feature** — open an issue describing the use case first, so we can
  agree on scope before code is written.
- **Add a registry pair** — see the four documented paths in the
  [README](./README.md#how-to-add-a-new-erc-20--erc-7984-pair) and the in-app
  Docs tab. Official pairs belong on-chain in the Zama registry; local/dev pairs
  go through `config/custom-pairs.json`.
- **Improve the code or docs** — open a pull request (see below).

## Development setup

```bash
git clone https://github.com/pramadanif/macetz.git
cd macetz
npm install            # repo .npmrc sets legacy-peer-deps for the TokenOps SDK
npm run dev            # http://localhost:3000/app
```

Requirements: Node.js 20+, an EIP-1193 wallet (MetaMask), and a little Sepolia
ETH for gas.

## Before you open a pull request

Run the same checks CI runs — the PR will be blocked until they pass:

```bash
npm run verify         # tsc --noEmit + next build + smoke tests
```

- `npm run lint` — TypeScript strict mode, zero type errors.
- `npm run build` — production build must succeed.
- `npm run verify:distribute` — registry / distribute / error-handling smoke
  tests (currently 21 assertions) run against the **real** app modules. If you
  change behaviour in `src/lib/registry.ts`, `src/lib/pair-utils.ts`,
  `src/lib/disperse.ts`, or `src/lib/errors.ts`, add or update an assertion in
  `scripts/verify-distribute.ts`.

## Pull request guidelines

- Branch off `main`; keep each PR focused on one change.
- Write a clear title and description: what changed, why, and how you verified
  it (a transaction hash for on-chain flows is ideal).
- Match the surrounding code style — this repo has no custom app contracts; FHE
  logic is delegated to the official `@zama-fhe/*` SDKs and the TokenOps SDK.
- Never commit secrets. `dev-guide/.env` (deployer private key) is git-ignored
  and must stay that way.
- Keep the README and in-app Docs (`src/lib/docs-content.ts`) in sync with any
  behaviour change — divergence between docs and code is treated as a bug.

## Code of conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).
Be respectful and constructive, assume good faith, and keep discussions
technical.

## License

By contributing, you agree that your contributions are licensed under the
[BSD 3-Clause Clear License](./LICENSE) that covers this repository.
