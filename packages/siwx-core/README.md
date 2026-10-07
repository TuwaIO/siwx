# @tuwaio/siwx-core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-core.svg)](https://www.npmjs.com/package/@tuwaio/siwx-core)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-core.svg)](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/LICENSE)

`@tuwaio/siwx-core` is the Layer 1 (L1) package of **SIWX** (Sign-In With X), the authentication project of TUWA Stage 1 ("Core Auth & Primitives", next to Orbit Utils). It implements the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) message format: it builds, parses and validates chain-agnostic sign-in messages for EVM (`eip155`) and Solana accounts, and defines the types and errors that the SIWX L2 packages share.

Its only dependency is the peer [`@tuwaio/orbit-core`](https://orbit.docs.tuwa.io/packages/orbit-core), which has no dependencies of its own and reads the CAIP-2 chain and CAIP-10 account IDs and the Solana genesis-hash chain IDs. The package imports no Web3 SDK. It runs in browsers, Node.js 20+ and edge runtimes; only `generateNonce` needs the Web Crypto API.

---

## 🏛️ Core Capabilities

- **Message format:** `buildMessage` formats CAIP-122 fields into the text the wallet signs (the EIP-4361 layout used by CAIP-122); `parseMessage` reads the text back and throws `SiwxParseError` when it is malformed.
- **Validation:** `validateMessage` checks field formats (CAIP-10 address, CAIP-2 chain ID, `http(s)` URI, nonce, ISO 8601 timestamps) and expiration, and reports every failure at once. Addresses and chain IDs are read with the parsers of `@tuwaio/orbit-core`, so an EVM or Solana account must be a valid address of its chain.
- **Verification policy:** `validatePolicy` and `SiwxVerificationPolicy` bind a message to your domain, URI, allowed chains and time windows (`issuedAt` age, `notBefore`, maximum lifetime, clock skew).
- **Session matching:** `isSessionMatchingTarget` checks that a session belongs to a given address and chain, case-insensitively for EVM and case-sensitively for Solana.
- **Nonces and errors:** `generateNonce` returns 32 random hex characters; `SiwxError` and its subclasses carry machine-readable `code`s.

Signatures are verified by the chain packages ([`@tuwaio/siwx-evm`](https://siwx.docs.tuwa.io/packages/siwx-evm), [`@tuwaio/siwx-solana`](https://siwx.docs.tuwa.io/packages/siwx-solana)) and on the server by [`@tuwaio/siwx-server`](https://siwx.docs.tuwa.io/packages/siwx-server).

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-core @tuwaio/orbit-core
```

---

## 🚀 Usage

### Building and parsing a message

```typescript
import { buildMessage, generateNonce, parseMessage } from '@tuwaio/siwx-core';

const message = buildMessage({
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  statement: 'Sign in to TUWA.',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: generateNonce(),
  issuedAt: new Date().toISOString(),
  expirationTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
});

// Throws SiwxParseError if the text is not a CAIP-122 message.
const fields = parseMessage(message);
```

The message the wallet shows and signs:

```text
app.tuwa.io wants you to sign in with your blockchain account:
eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B

Sign in to TUWA.

URI: https://app.tuwa.io
Version: 1
Chain ID: eip155:1
Nonce: 3f9c1e2a7b4d8f6051c2e9a0d7b3f418
Issued At: 2026-09-26T10:00:00.000Z
Expiration Time: 2026-09-26T10:10:00.000Z
```

`buildMessage` does not validate its input; run `validateMessage` on untrusted fields.

### Validating fields and a policy

```typescript
import { parseMessage, validateMessage } from '@tuwaio/siwx-core';

declare const message: string;

const result = validateMessage(parseMessage(message), {
  policy: {
    expectedDomain: 'app.tuwa.io',
    expectedUri: 'https://app.tuwa.io',
    allowedChainIds: ['eip155:1', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'],
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 24 * 60 * 60,
  },
});

if (!result.valid) {
  console.error(result.errors); // one human-readable string per failed check
}
```

- `validateMessage` checks formats and timing only. It does not verify the signature.
- Policy rules run only for the fields you set; `maxIssuedAtAgeSeconds` has no default. `clockSkewSeconds` defaults to 60 seconds.
- Two timing rules always apply, even without a policy: `issuedAt` must not be in the future and `notBefore` must have been reached (turn the latter off with `enforceNotBefore: false`).
- `allowedChainIds` entries are full CAIP-2 IDs matched exactly: `eip155:1` does not allow `solana:1`, and a bare `1` matches nothing. The one exception is a Solana cluster: its Wallet Standard name and its genesis-hash ID match each other (`solana:devnet` and `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`), so sessions signed before the switch to genesis-hash IDs stay valid. `normalizeSolanaChainId` and `isChainIdAllowed` apply this rule.
- `validatePolicy(fields, policy, now?)` runs the policy rules alone and returns the list of violations.

### Matching a session to a wallet

```typescript
import { isSessionMatchingTarget } from '@tuwaio/siwx-core';

const session = { address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', chainId: 'eip155:1' };

isSessionMatchingTarget(session, '0xab5801a7d398351b8be11c439e05c5b3259aec9b'); // true: EVM addresses ignore case
isSessionMatchingTarget(session, 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 'eip155:1'); // true
isSessionMatchingTarget(session, '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 10); // false: other chain
```

### Handling errors

```typescript
import { parseMessage, SiwxParseError } from '@tuwaio/siwx-core';

try {
  parseMessage('not a CAIP-122 message');
} catch (error) {
  if (error instanceof SiwxParseError) {
    console.error(error.code, error.message); // "SIWX_PARSE_ERROR", "Message is too short to be a valid CAIP-122 message."
  }
}
```

`parseMessage` and `generateNonce` are the only functions of this package that throw. The verifiers of the L2 packages return `{ success: false, error }` instead of throwing. The policy error classes (`SiwxPolicyViolationError` and its subclasses) are never thrown by SIWX; they are available for your own checks.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[siwx.docs.tuwa.io/packages/siwx-core](https://siwx.docs.tuwa.io/packages/siwx-core)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/LICENSE) file for details.
