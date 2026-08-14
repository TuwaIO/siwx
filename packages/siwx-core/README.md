# `@tuwaio/siwx-core`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-core.svg)](https://www.npmjs.com/package/@tuwaio/siwx-core)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-core.svg)](./LICENSE)
[![CAIP-122](https://img.shields.io/badge/standard-CAIP--122-purple.svg)](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md)

> Chain-agnostic CAIP-122 message building, parsing, policy validation, and error definitions. The L1 foundational engine of the `@tuwaio/siwx` ecosystem. **Zero dependencies.**

---

## 🏛️ Core Capabilities

This package is the **L1 core foundation** implementing the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) standard.

- **Build**: Format compliant CAIP-122 messages from structured fields.
- **Parse**: Parse raw CAIP-122 message strings into typed objects.
- **Validate Fields**: Validate format, CAIP-10 addresses, CAIP-2 chain identifiers, nonces, ISO 8601 timestamps, and expiration.
- **Enforce Security Policies**: Validate messages against strict domain, URI, allowed chain, max age, and max session lifetime policies via `validatePolicy()`.
- **Match Sessions**: Compare active sessions with target addresses and chains handling EVM/Solana casing and CAIP-10 formats.
- **Generate Nonces**: Cryptographically secure 32-character hex nonce generator using Web Crypto API.
- **Typed Error Hierarchy**: Comprehensive set of typed errors with machine-readable error codes.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-core
```

---

## 🚀 API Reference

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
  expirationTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
});
```

### `parseMessage(message: string): ParsedSiwxMessage`

Parses a raw CAIP-122 message string back into structured fields.

```ts
import { parseMessage } from '@tuwaio/siwx-core';

const parsed = parseMessage(rawMessage);
console.log(parsed.address); // "eip155:1:0xAb5801..."
console.log(parsed.chainId); // "eip155:1"
console.log(parsed.nonce); // "a4f3b2c1..."
```

### `validateMessage(fields: SiwxMessageFields, options?: ValidateMessageOptions): SiwxValidationResult`

Validates all fields and optionally enforces a `SiwxVerificationPolicy`. Returns `{ valid: boolean, errors: string[] }`.

```ts
import { validateMessage } from '@tuwaio/siwx-core';

const result = validateMessage(parsedMessage, {
  policy: {
    expectedDomain: 'app.tuwa.io',
    expectedUri: 'https://app.tuwa.io',
    allowedChainIds: ['eip155:1', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK'],
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 1800,
  },
});

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### `validatePolicy(fields: SiwxMessageFields, policy?: SiwxVerificationPolicy, now?: Date): string[]`

Dedicated helper for validating message fields against a verification policy.

```ts
import { validatePolicy } from '@tuwaio/siwx-core';

const errors = validatePolicy(fields, {
  expectedDomain: ['app.tuwa.io', 'auth.tuwa.io'],
  allowedChainIds: ['eip155:1'],
  maxIssuedAtAgeSeconds: 300,
});
```

### `isSessionMatchingTarget(session: SiwxSessionLike | null | undefined, targetAddress: string, targetChainId?: string | number): boolean`

Validates whether a SIWX session matches a target wallet address and optional chainId. Handles EVM case-insensitivity, Solana case-sensitivity, and CAIP-10 / CAIP-2 normalization.

```ts
import { isSessionMatchingTarget } from '@tuwaio/siwx-core';

const isMatch = isSessionMatchingTarget(session, '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 'eip155:1');
```

### `generateNonce(): string`

Generates a 32-character cryptographically secure hex nonce using `globalThis.crypto.getRandomValues`.

```ts
import { generateNonce } from '@tuwaio/siwx-core';

const nonce = generateNonce(); // e.g. "9a2f64c8d1b3e570..."
```

---

## 🛡️ `SiwxVerificationPolicy` Interface

```ts
export interface SiwxVerificationPolicy {
  /** Expected domain(s) requesting sign-in (e.g. "tuwa.io" or ["tuwa.io", "auth.tuwa.io"]). */
  expectedDomain?: string | string[];

  /** Expected RFC 3986 URI(s) subject of sign-in (e.g. "https://tuwa.io"). */
  expectedUri?: string | string[];

  /** List of allowed CAIP-2 chain IDs (e.g. ["eip155:1", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK"]). */
  allowedChainIds?: string[];

  /** Whether the message MUST include an expirationTime. */
  requireExpirationTime?: boolean;

  /** Maximum allowed age of issuedAt in seconds (default 300s). */
  maxIssuedAtAgeSeconds?: number;

  /** Maximum session lifetime in seconds (expirationTime - issuedAt). */
  maxSessionLifetimeSeconds?: number;

  /** Allowed clock skew in seconds (default 60s). */
  clockSkewSeconds?: number;

  /** Whether to enforce notBefore timestamp (default true). */
  enforceNotBefore?: boolean;
}
```

---

## 🛑 Typed Error Classes

All errors extend `SiwxError` and carry a machine-readable `code` property.

| Class                              | Code                             | Description                                   |
| ---------------------------------- | -------------------------------- | --------------------------------------------- |
| `SiwxError`                        | `SIWX_ERROR`                     | Base class for all SIWX errors                |
| `SiwxParseError`                   | `SIWX_PARSE_ERROR`               | Malformed CAIP-122 message string             |
| `SiwxValidationError`              | `SIWX_VALIDATION_ERROR`          | Field validation failed                       |
| `SiwxVerificationError`            | `SIWX_VERIFICATION_ERROR`        | Cryptographic signature mismatch              |
| `SiwxExpiredSessionError`          | `SIWX_EXPIRED_SESSION`           | Session has expired                           |
| `SiwxNonceReplayError`             | `SIWX_NONCE_REPLAY`              | Nonce already consumed                        |
| `SiwxUnsupportedNamespaceError`    | `SIWX_UNSUPPORTED_NAMESPACE`     | Unsupported CAIP-2 namespace                  |
| `SiwxPolicyViolationError`         | `SIWX_POLICY_VIOLATION`          | Generic policy rule violated                  |
| `SiwxDomainMismatchError`          | `SIWX_DOMAIN_MISMATCH`           | Message domain does not match expected domain |
| `SiwxUriMismatchError`             | `SIWX_URI_MISMATCH`              | Message URI does not match expected URI       |
| `SiwxChainNotAllowedError`         | `SIWX_CHAIN_NOT_ALLOWED`         | Chain ID not present in allowed list          |
| `SiwxIssuedAtStaleError`           | `SIWX_ISSUED_AT_STALE`           | `issuedAt` is older than max allowed age      |
| `SiwxIssuedAtFutureError`          | `SIWX_ISSUED_AT_FUTURE`          | `issuedAt` is in the future beyond clock skew |
| `SiwxNotBeforeError`               | `SIWX_NOT_BEFORE`                | `notBefore` timestamp has not been reached    |
| `SiwxSessionLifetimeExceededError` | `SIWX_SESSION_LIFETIME_EXCEEDED` | Session duration exceeds maximum lifetime     |

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
