# validatePolicy()

> **validatePolicy**(`fields`, `policy?`, `now?`): `string`[]

Defined in: [validateMessage.ts:142](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L142)

Checks message fields against a [SiwxVerificationPolicy](/packages/siwx-core/interfaces/SiwxVerificationPolicy.md): domain, URI, allowed chains, required
`expirationTime`, `issuedAt` age and future skew, `notBefore` and maximum session lifetime. See the policy fields
for the exact matching rules.

Pure function; it reports violations instead of throwing and does not check field formats (see
[validateMessage](/packages/siwx-core/functions/validateMessage.md), which always runs this function).

## Parameters

### fields

[`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

The message fields to check.

### policy?

[`SiwxVerificationPolicy`](/packages/siwx-core/interfaces/SiwxVerificationPolicy.md)

The policy to enforce. When omitted, no check runs and an empty array is returned; an empty
object still applies the `issuedAt` future skew and `notBefore` checks.

### now?

`Date` = `...`

Reference time for the timing checks. Defaults to the current time.

## Returns

`string`[]

A human-readable description of every violation; empty when the fields satisfy the policy.
