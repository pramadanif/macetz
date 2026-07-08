# Security Policy

Macetz is a community project built for the Zama Developer Program. It is
**unaudited** and intended for testnet use — do not use it with real funds you
cannot afford to lose. That said, we take security seriously and appreciate
responsible disclosure.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, report privately using GitHub's
[Private Vulnerability Reporting](https://github.com/pramadanif/macetz/security/advisories/new)
("Report a vulnerability" under the repository's **Security** tab). Include:

- a description of the issue and its impact,
- steps to reproduce (network, addresses, transaction hashes if relevant),
- and, if possible, a suggested fix.

We aim to acknowledge reports within a few days and to address confirmed issues
as quickly as is practical for a community project.

## Scope

In scope:

- The Macetz frontend and its on-chain interactions (`src/`).
- The relayer proxy route (`src/app/api/relayer/[...path]/route.ts`).
- The example contracts and scripts in `dev-guide/`.

Out of scope (report upstream instead):

- The Zama FHEVM protocol, relayers, and the `@zama-fhe/*` SDKs — see
  [Zama's security policy](https://github.com/zama-ai).
- The official Zama Wrappers Registry contract and the official cTokenMock /
  wrapper contracts.
- The TokenOps `@tokenops/sdk` and its DisperseConfidential singleton.

## Handling of keys and secrets

- Macetz never asks for or stores private keys or seed phrases. All signing
  happens in the user's wallet.
- FHE decryption is authorized by an EIP-712 signature that can only ever
  decrypt the **signing user's own** balance.
- The relayer proxy forwards requests only and injects no API keys.
- `dev-guide/.env` (deployer key for the optional Hardhat guide) is git-ignored;
  never commit it, and rotate any key that has touched a shared machine.

## Known limitations

See [Known Limitations](./README.md#known-limitations) in the README: the app is
unaudited, mainnet FHE operations depend on Zama's mainnet relayer being
provisioned, and TokenOps Distribute processes one confidential token per batch.
