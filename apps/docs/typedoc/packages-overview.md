# Packages

SIWX ships one chain-agnostic core package (**L1**) and four **L2** packages built on it: one adapter per chain platform (EVM, Solana), React bindings and server utilities. Install the core and only the L2 packages your app needs. The L2 packages declare `@tuwaio/siwx-core` and their Web3 or framework libraries as peer dependencies, so your app keeps a single copy of `viem`, `@wagmi/core`, `@solana/kit`, `react` or `zustand`.

Each package page starts with the package README (the same text that is published to npm), followed by the full list of its exports. Every function, class, type and constant page is generated from the TypeScript source and its JSDoc, so the reference always matches the released code.
