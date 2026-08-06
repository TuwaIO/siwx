import '@testing-library/jest-dom';

import { beforeEach } from 'vitest';

import { useSiwxSessionStore } from '../sessionStore';

beforeEach(() => {
  sessionStorage.clear();
  useSiwxSessionStore.getState().reset();
});
