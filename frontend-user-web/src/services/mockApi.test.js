import { afterEach, describe, it, expect } from 'vitest';
import { setMockError, simulateRequest } from './mockApi.js';

describe('simulateRequest', () => {
  afterEach(() => {
    setMockError(false);
  });

  it('should resolve with the result when mock error is off', async () => {
    await expect(simulateRequest('data')).resolves.toBe('data');
  });

  it('should reject when mock error is on', async () => {
    setMockError(true);

    await expect(simulateRequest('data')).rejects.toThrow('Loading error!');
  });
});
