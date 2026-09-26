// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'siwx-react:session';

const SESSION = {
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  chainId: 'eip155:1',
  domain: 'app.tuwa.io',
  issuedAt: '2026-08-06T08:00:00.000Z',
  expirationTime: '2099-01-01T00:00:00.000Z',
};

/** Loads a fresh copy of the store module, as after a page reload. */
async function loadStore() {
  vi.resetModules();
  return (await import('./sessionStore')).useSiwxSessionStore;
}

function storeSession(session: object | null) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { session }, version: 0 }));
}

function readStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as { state: { session: unknown } }).state.session : undefined;
}

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe('useSiwxSessionStore persistence', () => {
  it('does not read storage before it is rehydrated', async () => {
    storeSession(SESSION);
    const store = await loadStore();

    expect(store.getState().status).toBe('idle');
    expect(store.getState().session).toBeNull();
  });

  it('restores a stored session that has not expired', async () => {
    storeSession(SESSION);
    const store = await loadStore();

    await store.persist.rehydrate();

    expect(store.getState().status).toBe('authenticated');
    expect(store.getState().session).toEqual(SESSION);
  });

  it('does not restore an expired session', async () => {
    storeSession({ ...SESSION, expirationTime: '2020-01-01T00:00:00.000Z' });
    const store = await loadStore();

    await store.persist.rehydrate();

    expect(store.getState().status).toBe('idle');
    expect(store.getState().session).toBeNull();
  });

  it('keeps the stored session when the store is reset before rehydration', async () => {
    storeSession(SESSION);
    const store = await loadStore();

    store.getState().reset();
    expect(readStoredSession()).toEqual(SESSION);

    await store.persist.rehydrate();
    expect(store.getState().status).toBe('authenticated');
  });

  it('saves only an authenticated session and clears it on reset', async () => {
    const store = await loadStore();
    await store.persist.rehydrate();

    store.getState().setBuilding();
    expect(readStoredSession()).toBeNull();

    store.getState().setAuthenticated({
      ...SESSION,
      chainId: 'eip155:1',
      uri: 'https://app.tuwa.io',
      version: '1',
      nonce: 'a4f3b2c1d0e5f678',
    });
    expect(readStoredSession()).toEqual(SESSION);

    store.getState().reset();
    expect(readStoredSession()).toBeNull();
  });
});
