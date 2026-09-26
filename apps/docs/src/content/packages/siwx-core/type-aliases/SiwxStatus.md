# SiwxStatus

> **SiwxStatus** = `"idle"` \| `"building"` \| `"signing"` \| `"verifying"` \| `"authenticated"` \| `"error"`

Defined in: [types.ts:27](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L27)

Lifecycle status of a client-side sign-in.

`@tuwaio/siwx-react` moves through `idle` → `building` (nonce and message) → `signing` (wallet prompt) →
`verifying` (backend) → `authenticated` or `error`.
