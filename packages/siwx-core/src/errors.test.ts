import { describe, expect, it } from 'vitest';

import {
  SiwxError,
  SiwxParseError,
  SiwxUnsupportedNamespaceError,
  SiwxValidationError,
  SiwxVerificationError,
} from './errors';

describe('SiwxError classes', () => {
  it('instantiates SiwxError with correct name and message', () => {
    const err = new SiwxError('Base error');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(SiwxError);
    expect(err.name).toBe('SiwxError');
    expect(err.message).toBe('Base error');
  });

  it('instantiates SiwxParseError with code and message', () => {
    const err = new SiwxParseError('Malformed header');
    expect(err).toBeInstanceOf(SiwxError);
    expect(err).toBeInstanceOf(SiwxParseError);
    expect(err.name).toBe('SiwxParseError');
    expect(err.code).toBe('SIWX_PARSE_ERROR');
    expect(err.message).toBe('Malformed header');
  });

  it('instantiates SiwxValidationError with errors list', () => {
    const err = new SiwxValidationError(['domain is invalid', 'nonce is too short']);
    expect(err).toBeInstanceOf(SiwxError);
    expect(err).toBeInstanceOf(SiwxValidationError);
    expect(err.name).toBe('SiwxValidationError');
    expect(err.code).toBe('SIWX_VALIDATION_ERROR');
    expect(err.errors).toEqual(['domain is invalid', 'nonce is too short']);
    expect(err.message).toContain('domain is invalid');
  });

  it('instantiates SiwxUnsupportedNamespaceError with namespace', () => {
    const err = new SiwxUnsupportedNamespaceError('cosmos');
    expect(err).toBeInstanceOf(SiwxError);
    expect(err).toBeInstanceOf(SiwxUnsupportedNamespaceError);
    expect(err.name).toBe('SiwxUnsupportedNamespaceError');
    expect(err.code).toBe('SIWX_UNSUPPORTED_NAMESPACE');
    expect(err.namespace).toBe('cosmos');
    expect(err.message).toContain('Unsupported CAIP-2 namespace: "cosmos"');
  });

  it('instantiates SiwxVerificationError', () => {
    const err = new SiwxVerificationError('Signature mismatch');
    expect(err).toBeInstanceOf(SiwxError);
    expect(err).toBeInstanceOf(SiwxVerificationError);
    expect(err.name).toBe('SiwxVerificationError');
    expect(err.message).toBe('Signature mismatch');
  });
});
