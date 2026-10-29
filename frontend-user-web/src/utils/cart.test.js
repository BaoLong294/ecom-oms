import { describe, it, expect } from 'vitest';
import { getCartTotal } from './cart.js';

// Dữ liệu giống kết quả thật của getVariantsByIds.
const REGULAR_VARIANT = {
  id: 12,
  productId: 3,
  colorCode: '09',
  size: 'M',
  stockQuantity: 10,
  productName: 'Regular Pants',
  gender: 'Women',
  price: 30,
  discountPercent: null,
  discountInfo: null,
  colorName: '09 BLACK',
  colorImage: '/images/regular-pants/09-black.avif',
};

const DISCOUNTED_VARIANT = {
  id: 7,
  productId: 5,
  colorCode: '31',
  size: 'L',
  stockQuantity: 10,
  productName: 'Discounted Pants',
  gender: 'Unisex',
  price: 50,
  discountPercent: 20,
  discountInfo: 'Sale',
  colorName: '31 BEIGE',
  colorImage: '/images/discounted-pants/31-beige.avif',
};

describe('getCartTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(getCartTotal([], [])).toBe(0);
  });

  it('multiplies the regular price by the quantity', () => {
    const items = [{ variantId: 12, quantity: 2 }];

    expect(getCartTotal(items, [REGULAR_VARIANT])).toBe(60);
  });

  it('uses the discounted price when the variant is on sale', () => {
    const items = [{ variantId: 7, quantity: 3 }];

    expect(getCartTotal(items, [DISCOUNTED_VARIANT])).toBe(120);
  });

  it('sums all items, matching each item to its variant by id', () => {
    const items = [
      { variantId: 12, quantity: 2 },
      { variantId: 7, quantity: 3 },
    ];

    expect(getCartTotal(items, [DISCOUNTED_VARIANT, REGULAR_VARIANT])).toBe(
      180
    );
  });

  it('skips items whose variant was not found', () => {
    const items = [
      { variantId: 12, quantity: 2 },
      { variantId: 999, quantity: 5 },
    ];

    expect(getCartTotal(items, [REGULAR_VARIANT])).toBe(60);
  });
});
