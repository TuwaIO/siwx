/**
 * @fileoverview Public API barrel for @tuwaio/siwx-solana.
 *
 * @packageDocumentation
 * @module @tuwaio/siwx-solana
 *
 * Solana adapter for the TUWA Sign-In With X (SIWX) ecosystem.
 * Provides CAIP-122 signature verification for Solana using ed25519 cryptography.
 *
 * @see {@link https://docs.solana.com/developing/programming-model/transactions Solana Transactions}
 * @see {@link https://github.com/TuwaIO/siwx Repository}
 */

export { verifyEd25519 } from './verify';
