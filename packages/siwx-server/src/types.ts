/**
 * @file Server-side types for the @tuwaio/siwx-server package.
 */

import type { ParsedSiwxMessage, SiwxVerificationPolicy, SiwxVerifyResult } from '@tuwaio/siwx-core';
import type { EvmPublicClientSource } from '@tuwaio/siwx-evm';

/**
 * Options of {@link verifySiwxPayload}.
 */
export interface ServerVerifyOptions {
  /**
   * Nonces that must be rejected. Verification fails when the message nonce is in the set. The set is only read:
   * record used nonces yourself, or use a {@link SiwxNonceStore} (as `createSiwxApiHandler` does) for
   * multi-instance deployments.
   */
  usedNonces?: Set<string>;

  /**
   * Skips the check that the message `expirationTime` has not passed. Not recommended in production.
   * @default false
   */
  skipExpiration?: boolean;

  /**
   * Verification policy enforced on the message fields (domain, URI, chains, timing). See
   * {@link SiwxVerificationPolicy}.
   */
  policy?: SiwxVerificationPolicy;

  /**
   * Enables the smart contract wallet fallback for `eip155` messages (deployed wallets through EIP-1271, wallets not
   * deployed yet through ERC-6492): a viem client, used only for messages of its own chain, or a function that
   * returns the client of a chain number, for sign-ins on several chains. See `EvmPublicClientSource` from
   * `@tuwaio/siwx-evm`. Ignored for Solana.
   */
  publicClient?: EvmPublicClientSource;
}

/**
 * How a signature was verified:
 *
 * - `eip191`: by the key of an EVM account, which controls the address on every chain;
 * - `eip1271`: by a deployed EVM smart contract wallet, on the chain it signed on;
 * - `erc6492`: by an EVM smart contract wallet that is not deployed yet, on the chain it signed on;
 * - `ed25519`: by the key of a Solana account.
 *
 * A smart contract wallet is controlled on each chain separately: the same address can have other owners on another
 * network.
 */
export type SiwxVerificationMethod = 'eip191' | 'eip1271' | 'erc6492' | 'ed25519';

/**
 * Result of {@link verifySiwxPayload}.
 */
export interface ServerVerifyResult extends SiwxVerifyResult {
  /**
   * The CAIP-2 namespace whose verifier checked the signature: `eip155` or `solana`. Absent when verification
   * failed before the signature check.
   */
  namespace?: 'eip155' | 'solana';
  /** How the signature was verified. Present only when `success` is `true`; pass it to {@link toSession}. */
  method?: SiwxVerificationMethod;
}

/**
 * Serializable session derived from a verified CAIP-122 message (see {@link toSession}). Returned as JSON by the
 * `verify` and `session` endpoints of `@tuwaio/siwx-server/next`.
 */
export interface SiwxSession {
  /** The verified CAIP-10 blockchain address. */
  address: string;
  /** The CAIP-2 chain ID the session is bound to. */
  chainId: string;
  /** The domain that issued the session. */
  domain: string;
  /** The nonce of the signed message. It must be single-use: consume it in a {@link SiwxNonceStore}. */
  nonce: string;
  /** ISO 8601 timestamp when the session was issued. */
  issuedAt: string;
  /** ISO 8601 timestamp when the session expires, if set. */
  expirationTime?: string;
  /**
   * How the signature was verified (see {@link SiwxVerificationMethod}). Set by `createSiwxApiHandler`; in your own
   * handlers, pass `result.method` of {@link verifySiwxPayload} to {@link toSession}. {@link siwxJwtSubject} reads
   * it: without it, the subject of an EVM session keeps its chain.
   */
  verificationMethod?: SiwxVerificationMethod;
}

/**
 * A session stored in a {@link SiwxSessionStore}.
 */
export interface SiwxSessionRecord {
  /** Opaque, unguessable session ID. It is the value of the session cookie. */
  id: string;
  /** The verified SIWX session data. */
  session: SiwxSession;
  /** Optional ID of your own user record (for example a database user ID), set with `bindSubject`. */
  subjectId?: string;
  /** Timestamp in milliseconds when the session record was created. */
  createdAt: number;
  /** Timestamp in milliseconds when the session record expires. */
  expiresAt: number;
}

/**
 * Storage contract for durable sessions (Redis, SQL, KV…), used by `createSiwxApiHandler` and
 * {@link getSiwxServerSession}. Implementations must be shared by every server instance.
 * {@link MemorySiwxSessionStore} is an in-memory implementation for development and tests.
 */
export interface SiwxSessionStore {
  /**
   * Creates and stores a new session record.
   * @param input - The session to store.
   * @param input.session - The verified session data.
   * @param input.ttlSeconds - Time-to-live in seconds.
   * @returns The created record. Its `id` must be unguessable, because it becomes the session cookie value.
   */
  create(input: { session: SiwxSession; ttlSeconds: number }): Promise<SiwxSessionRecord>;

  /**
   * Retrieves a session record by its ID. Session expiry is enforced here: SIWX does not compare `expiresAt` itself.
   * @param id - The session ID.
   * @returns The session record, or `null` if it does not exist or has expired.
   */
  get(id: string): Promise<SiwxSessionRecord | null>;

  /**
   * Binds one of your user IDs to the session. Not called by SIWX; use it after sign-in to link the wallet session to
   * your own user record.
   * @param id - The session ID.
   * @param subjectId - The user or subject ID.
   * @returns `true` if the session exists and was updated, `false` otherwise.
   */
  bindSubject(id: string, subjectId: string): Promise<boolean>;

  /**
   * Revokes a session. Must succeed when the session does not exist.
   * @param id - The session ID.
   * @returns A promise that resolves once the session is removed.
   */
  revoke(id: string): Promise<void>;
}

/**
 * Storage contract for single-use challenge nonces, used by `createSiwxApiHandler`. Implementations must be shared
 * by every server instance and `consume` must be atomic (for example Redis `GETDEL`).
 * {@link MemorySiwxNonceStore} is an in-memory implementation for development and tests.
 */
export interface SiwxNonceStore {
  /**
   * Stores a newly issued nonce.
   * @param input - The nonce to store.
   * @param input.nonce - The nonce string.
   * @param input.ttlSeconds - Time-to-live in seconds. `createSiwxApiHandler` uses 300.
   * @returns A promise that resolves once the nonce is stored.
   */
  issue(input: { nonce: string; ttlSeconds: number }): Promise<void>;

  /**
   * Atomically removes a nonce, so that each nonce is accepted once.
   * @param input - The nonce to consume.
   * @param input.nonce - The nonce string to consume.
   * @returns `true` if the nonce was issued, not expired and not consumed before; otherwise `false`.
   */
  consume(input: { nonce: string }): Promise<boolean>;
}

/**
 * JSON payload of a stateless demo session token (see {@link signStatelessDemoSession}). The token is signed, not
 * encrypted: anyone holding it can read these fields.
 */
export interface StatelessDemoTokenPayload {
  /** Token format version. */
  version: 1;
  /** CAIP-10 account ID of the session. */
  address: string;
  /** CAIP-2 chain ID of the session. */
  chainId: string;
  /** Domain of the signed message. */
  domain: string;
  /** Nonce of the signed message. */
  nonce: string;
  /** `issuedAt` of the signed message. */
  issuedAt: string;
  /** Expiry of the token: the message `expirationTime`, or the issuing time plus the token TTL. */
  expirationTime?: string;
  /** Random ID of the token. */
  sessionId: string;
  /** Token mode. */
  mode: 'demo';
}

/**
 * Request limits of `createStatelessDemoSiwxHandler`. Only the body size is limited; rate limiting is not part of
 * SIWX.
 */
export interface StatelessDemoLimits {
  /**
   * Maximum body size of `POST /verify`. Larger requests are rejected with HTTP 413. The durable handler always
   * uses 65536.
   * @default 65536 (64 KB)
   */
  maxTransactionPayloadBytes?: number;
}

/**
 * Attributes of the session cookie, used by {@link createSessionCookie}, {@link createClearCookie} and the
 * `@tuwaio/siwx-server/next` handlers. The cookie is always `HttpOnly`.
 */
export interface CookieOptions {
  /**
   * The name of the cookie.
   * @default "siwx-session-v2"
   */
  name?: string;
  /**
   * `Max-Age` in seconds. {@link createSessionCookie} defaults to 604800 (7 days). The handlers use their
   * `ttlSeconds` instead, and fall back to this value when `ttlSeconds` is not set.
   * @default 604800
   */
  maxAge?: number;
  /**
   * The cookie path.
   * @default "/"
   */
  path?: string;
  /**
   * The cookie domain.
   */
  domain?: string;
  /**
   * Whether to set the Secure flag.
   * @default true
   */
  secure?: boolean;
  /**
   * The SameSite policy.
   * @default "Strict"
   */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Options of {@link getSiwxServerSession}.
 */
export interface GetSiwxServerSessionOptions {
  /**
   * Where to read the session cookie from:
   * - a `Cookie` header string (`"siwx-session-v2=…; other=…"`) or the bare cookie value;
   * - a Web API `Request`;
   * - the Next.js cookie store (`await cookies()`) or any object with `get(name)` returning `{ value }` or a string;
   * - a Web API `Headers` object.
   *
   * `null` and `undefined` resolve to no session.
   */
  cookieSource:
    | string
    | Request
    | Headers
    | { get(name: string): { value: string } | string | undefined | null }
    | null
    | undefined;

  /**
   * The name of the cookie.
   * @default "siwx-session-v2"
   */
  cookieName?: string;

  /**
   * Store of the durable profile. The cookie value is looked up with `sessionStore.get`. Takes precedence over
   * `signingSecret`.
   */
  sessionStore?: SiwxSessionStore;

  /**
   * HMAC secret of the stateless demo profile. The cookie value is verified with
   * {@link verifyStatelessDemoSession}.
   */
  signingSecret?: string;

  /**
   * Policy checked against the stored session. Only a subset applies: `expectedDomain`, `allowedChainIds` (exact
   * match, except that a Solana cluster matches under its name and its genesis-hash chain ID, so sessions signed for
   * `solana:devnet` stay valid) and, for durable sessions, `requireExpirationTime`; for demo tokens, expiry with
   * `clockSkewSeconds`.
   */
  policy?: SiwxVerificationPolicy;
}

/**
 * JWS algorithm of the JWTs issued for SIWX sessions: `ES256` (ECDSA with P-256 and SHA-256) or `RS256`
 * (RSASSA-PKCS1-v1_5 with SHA-256). Both are accepted by embedded wallet providers with custom authentication, such
 * as Coinbase CDP.
 */
export type SiwxJwtAlgorithm = 'ES256' | 'RS256';

/**
 * Public JSON Web Key of a JWT signing key, as published in a JWKS (see {@link SiwxJwks}). Holds no private members.
 */
export interface SiwxPublicJwk {
  /** Key type: `EC` for ES256, `RSA` for RS256. */
  kty: 'EC' | 'RSA';
  /** Curve of an EC key. Always `P-256`. */
  crv?: 'P-256';
  /** x coordinate of an EC key, base64url. */
  x?: string;
  /** y coordinate of an EC key, base64url. */
  y?: string;
  /** Modulus of an RSA key, base64url. */
  n?: string;
  /** Public exponent of an RSA key, base64url. */
  e?: string;
  /** The algorithm the key signs with. */
  alg: SiwxJwtAlgorithm;
  /** Key ID: the RFC 7638 thumbprint of the key. Written into the `kid` header of every token the key signs. */
  kid: string;
  /** Public key use. Always `sig`. */
  use: 'sig';
}

/**
 * A JWT signing key, created by `importSiwxJwtKey`.
 */
export interface SiwxJwtKey {
  /** The algorithm the key signs with. */
  alg: SiwxJwtAlgorithm;
  /** Key ID: the RFC 7638 thumbprint of the key. */
  kid: string;
  /** The private key. Not extractable, usable only to sign. */
  privateKey: CryptoKey;
  /** The public key to publish in the JWKS. */
  publicJwk: SiwxPublicJwk;
}

/**
 * JSON Web Key Set (RFC 7517) with the public keys that verify the JWTs of SIWX sessions. Serve it at a public HTTPS
 * URL and give that URL to the services that accept the tokens.
 */
export interface SiwxJwks {
  /** The public keys. */
  keys: SiwxPublicJwk[];
}

/**
 * The `jwt` option of `createSiwxApiHandler` (`@tuwaio/siwx-server/next`): enables `GET …/token` (a fresh JWT for
 * the session cookie) and `GET …/jwks` (the public keys).
 */
export interface SiwxJwtOptions {
  /**
   * The key that signs the tokens, from `importSiwxJwtKey`. A promise is accepted, so the route file needs no
   * top-level `await`; an import error then surfaces as a 500 on the first `/token` or `/jwks` request.
   */
  signingKey: SiwxJwtKey | Promise<SiwxJwtKey>;
  /**
   * Keys replaced by `signingKey`, published in the JWKS so that tokens they signed keep verifying until they
   * expire. Signing keys or public JWKs.
   */
  previousKeys?: ReadonlyArray<SiwxJwtKey | SiwxPublicJwk>;
  /** The `iss` claim: the URL of your app. */
  issuer: string;
  /** The `aud` claim, when the receiving service expects one. */
  audience?: string | string[];
  /**
   * Token lifetime in seconds, from 1 to 604800 (7 days). A token never outlives its session.
   * @default 600
   */
  ttlSeconds?: number;
  /**
   * Builds the `sub` claim from the session record. Defaults to the bound `subjectId`, otherwise the account: without
   * its chain for a wallet that signed with its own key, with its chain for a smart contract wallet (see
   * `siwxJwtSubject`).
   */
  subject?: (record: SiwxSessionRecord) => string | Promise<string>;
  /** Extra claims from the session record. Reserved claims cannot be set. */
  claims?: (record: SiwxSessionRecord) => Record<string, unknown> | Promise<Record<string, unknown>>;
}

/**
 * Claims of a JWT issued for a SIWX session. Times are Unix seconds.
 */
export interface SiwxJwtPayload {
  /** Issuer: the URL of your app. */
  iss: string;
  /**
   * Subject: a stable ID of the user. By default the user ID bound with `bindSubject`, otherwise the account: without
   * its chain for a wallet that signed with its own key (`eip155:0x…` in lowercase, `solana:<address>`), with its
   * chain for an EVM smart contract wallet (`eip155:<chain>:0x…` in lowercase), whose owners are set on each chain.
   */
  sub: string;
  /** Audience, when one was set. */
  aud?: string | string[];
  /** Issued at. */
  iat: number;
  /** Expiration time. */
  exp: number;
  /** Unique token ID: 16 random bytes, base64url. */
  jti: string;
  /** The signed-in CAIP-10 account as it was signed, with Solana chain IDs in their genesis-hash form. */
  caip10: string;
  /** The CAIP-2 chain ID of the sign-in, with Solana chain IDs in their genesis-hash form. */
  chain_id: string;
  /** Custom claims added when the token was signed. */
  [claim: string]: unknown;
}

/**
 * Converts a verified CAIP-122 message into a {@link SiwxSession}: keeps `address`, `chainId`, `domain`, `nonce`,
 * `issuedAt` and `expirationTime`, plus `verificationMethod` when given. Pure function.
 *
 * @param parsed - The verified message, for example `result.data` of {@link verifySiwxPayload}.
 * @param verificationMethod - How the signature was verified: `result.method` of {@link verifySiwxPayload}. Without
 * it, {@link siwxJwtSubject} keeps the chain in the subject of an EVM session.
 * @returns The session object to store or sign.
 *
 * @example
 * ```ts
 * const result = await verifySiwxPayload(payload, { policy });
 * if (result.success && result.data) {
 *   const session = toSession(result.data, result.method);
 * }
 * ```
 */
export function toSession(parsed: ParsedSiwxMessage, verificationMethod?: SiwxVerificationMethod): SiwxSession {
  return {
    address: parsed.address,
    chainId: parsed.chainId,
    domain: parsed.domain,
    nonce: parsed.nonce,
    issuedAt: parsed.issuedAt,
    expirationTime: parsed.expirationTime,
    ...(verificationMethod === undefined ? {} : { verificationMethod }),
  };
}
