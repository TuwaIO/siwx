import { describe, expect, it } from 'vitest';

import { useSiwxSessionStore } from '../sessionStore';

describe('useSiwxSessionStore', () => {
  it('starts in idle state with null session and null error', () => {
    const state = useSiwxSessionStore.getState();

    expect(state.status).toBe('idle');
    expect(state.session).toBeNull();
    expect(state.error).toBeNull();
  });

  it('updates state to signing when setSigning is called', () => {
    useSiwxSessionStore.getState().setSigning();

    const state = useSiwxSessionStore.getState();
    expect(state.status).toBe('signing');
    expect(state.error).toBeNull();
  });

  it('updates state to verifying when setVerifying is called', () => {
    useSiwxSessionStore.getState().setVerifying();

    const state = useSiwxSessionStore.getState();
    expect(state.status).toBe('verifying');
    expect(state.error).toBeNull();
  });

  it('updates state to authenticated and sets session data when setAuthenticated is called', () => {
    useSiwxSessionStore.getState().setAuthenticated({
      domain: 'app.tuwa.io',
      address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const state = useSiwxSessionStore.getState();
    expect(state.status).toBe('authenticated');
    expect(state.error).toBeNull();
    expect(state.session).toEqual({
      domain: 'app.tuwa.io',
      address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      chainId: 'eip155:1',
      issuedAt: '2026-08-06T08:00:00.000Z',
      expirationTime: undefined,
    });
  });

  it('updates state to error and sets error message when setError is called', () => {
    useSiwxSessionStore.getState().setError('User rejected signature request');

    const state = useSiwxSessionStore.getState();
    expect(state.status).toBe('error');
    expect(state.error).toBe('User rejected signature request');
  });

  it('resets state back to idle when reset is called', () => {
    useSiwxSessionStore.getState().setAuthenticated({
      domain: 'app.tuwa.io',
      address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    useSiwxSessionStore.getState().reset();

    const state = useSiwxSessionStore.getState();
    expect(state.status).toBe('idle');
    expect(state.session).toBeNull();
    expect(state.error).toBeNull();
  });
});
