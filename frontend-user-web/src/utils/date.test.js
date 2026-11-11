import { describe, it, expect } from 'vitest';
import { formatOrderDate } from './date';

// Giờ giữa ngày (12:00 UTC) để ở múi giờ nào cũng ra cùng một ngày.
describe('formatOrderDate', () => {
  it('formats an ISO date as a short month, day and year', () => {
    expect(formatOrderDate('2026-11-10T12:00:00.000Z')).toBe('Nov 10, 2026');
  });

  it('does not pad a single-digit day', () => {
    expect(formatOrderDate('2026-03-05T12:00:00.000Z')).toBe('Mar 5, 2026');
  });
});
