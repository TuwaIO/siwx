import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSiwx, useSiwxSession } from '../hooks';
import { useSiwxSessionStore } from '../sessionStore';

describe('useSiwxSession()', () => {
  it('returns default unauthenticated session state initially', () => {
    const { result } = renderHook(() => useSiwxSession());

    expect(result.current.status).toBe('idle');
    expect(result.current.session).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns isAuthenticated: true when session is authenticated', () => {
    act(() => {
      useSiwxSessionStore.getState().setAuthenticated({
        domain: 'app.tuwa.io',
        address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        uri: 'https://app.tuwa.io',
        version: '1',
        chainId: 'eip155:1',
        nonce: 'a4f3b2c1d0e5f678',
        issuedAt: '2026-08-06T08:00:00.000Z',
      });
    });

    const { result } = renderHook(() => useSiwxSession());

    expect(result.current.status).toBe('authenticated');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.session?.address).toBe('eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
  });
});

describe('useSiwx()', () => {
  it('orchestrates complete sign-in flow successfully: build -> sign -> verify -> setAuthenticated', async () => {
    const mockSigner = vi.fn().mockResolvedValue('0xsignature123');
    const mockVerifier = vi.fn().mockResolvedValue({
      domain: 'app.tuwa.io',
      address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      chainId: 'eip155:1',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const { result: siwxHook } = renderHook(() => useSiwx());
    const { result: sessionHook } = renderHook(() => useSiwxSession());

    await act(async () => {
      await siwxHook.current.signIn({
        signer: mockSigner,
        verifier: mockVerifier,
        fields: {
          domain: 'app.tuwa.io',
          address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
          uri: 'https://app.tuwa.io',
          chainId: 'eip155:1',
        },
      });
    });

    expect(mockSigner).toHaveBeenCalledTimes(1);
    expect(mockVerifier).toHaveBeenCalledTimes(1);

    expect(sessionHook.current.status).toBe('authenticated');
    expect(sessionHook.current.isAuthenticated).toBe(true);
    expect(sessionHook.current.session?.address).toBe('eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
  });

  it('sets error state when signer fails', async () => {
    const mockSigner = vi.fn().mockRejectedValue(new Error('User rejected request'));
    const mockVerifier = vi.fn();

    const { result: siwxHook } = renderHook(() => useSiwx());
    const { result: sessionHook } = renderHook(() => useSiwxSession());

    await act(async () => {
      await siwxHook.current.signIn({
        signer: mockSigner,
        verifier: mockVerifier,
        fields: {
          domain: 'app.tuwa.io',
          address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
          uri: 'https://app.tuwa.io',
          chainId: 'eip155:1',
        },
      });
    });

    expect(mockVerifier).not.toHaveBeenCalled();
    expect(sessionHook.current.status).toBe('error');
    expect(sessionHook.current.error).toBe('User rejected request');
  });

  it('sets error state when verifier returns null', async () => {
    const mockSigner = vi.fn().mockResolvedValue('0xsignature123');
    const mockVerifier = vi.fn().mockResolvedValue(null);

    const { result: siwxHook } = renderHook(() => useSiwx());
    const { result: sessionHook } = renderHook(() => useSiwxSession());

    await act(async () => {
      await siwxHook.current.signIn({
        signer: mockSigner,
        verifier: mockVerifier,
        fields: {
          domain: 'app.tuwa.io',
          address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
          uri: 'https://app.tuwa.io',
          chainId: 'eip155:1',
        },
      });
    });

    expect(sessionHook.current.status).toBe('error');
    expect(sessionHook.current.error).toContain('Backend verification failed');
  });

  it('clears session state when signOut is called', async () => {
    act(() => {
      useSiwxSessionStore.getState().setAuthenticated({
        domain: 'app.tuwa.io',
        address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        uri: 'https://app.tuwa.io',
        version: '1',
        chainId: 'eip155:1',
        nonce: 'a4f3b2c1d0e5f678',
        issuedAt: '2026-08-06T08:00:00.000Z',
      });
    });

    const { result: siwxHook } = renderHook(() => useSiwx());
    const { result: sessionHook } = renderHook(() => useSiwxSession());

    act(() => {
      siwxHook.current.signOut();
    });

    expect(sessionHook.current.status).toBe('idle');
    expect(sessionHook.current.isAuthenticated).toBe(false);
    expect(sessionHook.current.session).toBeNull();
  });
});
