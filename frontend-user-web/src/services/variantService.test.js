import { describe, it, expect, vi } from 'vitest';
import { getVariantsByIds } from './variantService.js';
import variants from '../data/variants.js';

vi.mock('../data/products.js', () => ({
  default: [
    {
      id: 1,
      name: 'First item',
      gender: 'Men',
      price: 15,
      discountPercent: null,
      colors: [
        { code: '01', name: '01 Black', image: 'black.jpg' },
        { code: '02', name: '02 Blue', image: 'blue.jpg' },
      ],
    },
    {
      id: 2,
      name: 'Second item',
      gender: 'Women',
      price: 30,
      discountPercent: 50,
      colors: [
        { code: '10', name: '10 Green', image: 'green.jpg' },
        { code: '02', name: '02 Navy', image: 'navy.jpg' },
      ],
    },
  ],
}));

vi.mock('../data/variants.js', () => ({
  default: [
    { id: 1, productId: 1, colorCode: '01' },
    { id: 2, productId: 1, colorCode: '02' },
    { id: 3, productId: 2, colorCode: '10' },
    { id: 4, productId: 2, colorCode: '02' },
  ],
}));

describe('getVariantsByIds', () => {
  it('should return empty array if received empty array', async () => {
    const result = await getVariantsByIds([]);

    expect(result).toEqual([]);
  });

  it('should skip non-existent id', async () => {
    const result = await getVariantsByIds([1, 999]);
    const ids = result.map((variant) => variant.id);

    expect(ids).toHaveLength(1);
    expect(ids).toEqual([1]);
  });

  it('should have each element with the correct id and the fields', async () => {
    const result = await getVariantsByIds([1, 4]);

    expect(result[0]).toMatchObject({
      id: 1,
      productId: 1,
      colorCode: '01',
      productName: 'First item',
      gender: 'Men',
      price: 15,
      discountPercent: null,
      colorName: '01 Black',
      colorImage: 'black.jpg',
    });
    expect(result[1]).toMatchObject({
      id: 4,
      productId: 2,
      colorCode: '02',
      productName: 'Second item',
      gender: 'Women',
      price: 30,
      discountPercent: 50,
      colorName: '02 Navy',
      colorImage: 'navy.jpg',
    });
  });

  it('should return correct number of elements when all ids are valid', async () => {
    const result = await getVariantsByIds([1, 3, 4]);
    const ids = result.map((variant) => variant.id);

    expect(ids).toHaveLength(3);
    expect(ids).toEqual([1, 3, 4]);
  });

  it('should return the correct results in the order of the ids passed in', async () => {
    const result = await getVariantsByIds([4, 2, 1, 3]);

    expect(result.map((variant) => variant.id)).toEqual([4, 2, 1, 3]);
  });

  it('should not modify the original data', async () => {
    const result = await getVariantsByIds([1]);

    expect(variants[0]).not.toHaveProperty('productName');
  });
});
