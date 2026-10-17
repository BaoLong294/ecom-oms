import { describe, it, expect } from 'vitest';
import { formatToUSD, getEffectivePrice } from './price.js';

describe('formatToUSD', () => {
  it('should return the dollar price', () => {
    const dollar = formatToUSD(30);

    expect(dollar).toBe('$30.00');
  });

  it('should return a result rounded to two decimal places', () => {
    const dollar = formatToUSD(29.9999);

    expect(dollar).toBe('$30.00');
  });
});

describe('getEffectivePrice', () => {
  it('should return the original price if the item does not have discount percent', () => {
    const item = { price: 20, discountPercent: null };
    const effectivePrice = getEffectivePrice(item);

    expect(effectivePrice).toBe(20);
  });

  it('should return the price after discount if the item has discount percent', () => {
    const item = { price: 20, discountPercent: 50 };
    const effectivePrice = getEffectivePrice(item);

    expect(effectivePrice).toBe(10);
  });
});
