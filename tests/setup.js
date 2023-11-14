import {afterEach, vi } from 'vitest';

import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom/vitest';


afterEach(() => { 
  cleanup() ;
});

/**
 * Mock para matchMedia function.
 * 
 * De <<https://jestjs.io/docs/manual-mocks>> em 12.11.2023.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});