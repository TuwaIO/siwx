# `@tuwaio/siwx-core`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-core.svg)](https://www.npmjs.com/package/@tuwaio/siwx-core)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-core.svg)](./LICENSE)
[![CAIP-122](https://img.shields.io/badge/standard-CAIP--122-purple.svg)](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md)

> Chain-agnostic CAIP-122 message building, parsing, and validation. The L1 foundational engine of the `@tuwaio/siwx` ecosystem. **Zero dependencies.**

---

## Responsibility

This package is the **core foundation**. It has one job: implementing the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) message standard faithfully.

- **Build** compliant CAIP-122 messages from structured fields.
- **Parse** raw CAIP-122 message strings back into structured objects.
- **Validate** all fields (domain, CAIP-10 address, CAIP-2 chainId, nonce strength, ISO 8601 dates, expiration checks).
- **Generate** cryptographically secure nonces.
- Define all **types** and **error classes** used across the siwx ecosystem.

---

## Installation

```bash
pnpm add @tuwaio/siwx-core
```

---

## API

### `buildMessage(fields: SiwxMessageFields): string`

Builds a CAIP-122 compliant sign-in message string.

```ts
import { buildMessage, generateNonce } from '@tuwaio/siwx-core';

const message = buildMessage({
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  statement: 'Sign in to TUWA.',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: generateNonce(),
  issuedAt: new Date().toISOString(),
});
```

### `parseMessage(message: string): ParsedSiwxMessage`

Parses a raw CAIP-122 message string back into structured fields.

```ts
import { parseMessage } from '@tuwaio/siwx-core';

const parsed = parseMessage(rawMessage);
console.log(parsed.address); // "eip155:1:0xAb5801..."
console.log(parsed.chainId); // "eip155:1"
```

### `validateMessage(fields: SiwxMessageFields, options?: { skipExpiration?: boolean }): SiwxValidationResult`

Validates all fields (domain, CAIP-10 address, URI, version, CAIP-2 chainId, nonce, ISO dates, expiration). Returns `{ valid: boolean, errors: string[] }`.

```ts
import { validateMessage } from '@tuwaio/siwx-core';

const { valid, errors } = validateMessage(parsedMessage);
if (!valid) console.error(errors);

// Optionally skip expiration checking (useful for custom server flows)
const { valid: isValidExpired } = validateMessage(parsedMessage, { skipExpiration: true });
```

### `isSessionMatchingTarget(session: SiwxSessionLike | null | undefined, targetAddress: string, targetChainId?: string | number): boolean`

Validates whether a SIWX session matches a target wallet address and optional chainId. Handles EVM case-insensitivity, Solana case-sensitivity, and CAIP-10/CAIP-2 normalization.

```ts
import { isSessionMatchingTarget } from '@tuwaio/siwx-core';

const isMatch = isSessionMatchingTarget(session, '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 1);
// Handles cross-chain namespace checks (EVM vs Solana) and optional chainId matching
```

### `generateNonce(): string`

Generates a 32-character cryptographically secure hex nonce using the Web Crypto API (`globalThis.crypto.getRandomValues`). Native in Node 20+, browsers, and Edge runtimes.

```ts
import { generateNonce } from '@tuwaio/siwx-core';
const nonce = generateNonce(); // "a4f3b2c1d0e5f6..."
```

---

## Error Classes

All errors extend `SiwxError` with a typed `code` property.

| Class                           | Code                         | Description                            |
| ------------------------------- | ---------------------------- | -------------------------------------- |
| `SiwxParseError`                | `SIWX_PARSE_ERROR`           | Malformed CAIP-122 message string      |
| `SiwxValidationError`           | `SIWX_VALIDATION_ERROR`      | One or more field validations failed   |
| `SiwxVerificationError`         | `SIWX_VERIFICATION_ERROR`    | Signature mismatch or recovery failure |
| `SiwxExpiredSessionError`       | `SIWX_EXPIRED_SESSION`       | Session past its `expirationTime`      |
| `SiwxNonceReplayError`          | `SIWX_NONCE_REPLAY`          | Nonce already consumed                 |
| `SiwxUnsupportedNamespaceError` | `SIWX_UNSUPPORTED_NAMESPACE` | Chain namespace not supported          |

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
