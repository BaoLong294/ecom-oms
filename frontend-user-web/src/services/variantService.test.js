import { describe, it, expect, vi } from 'vitest';
import { getVariantsByIds } from './variantService.js';
import variants from '../data/variants.js';

vi.mock('../data/products.js', () => ({
  default: [
    {
      id: 1,
      name: 'First item',
      categoryId: 7,
      gender: 'Unisex',
      price: 15,
      discountPercent: null,
      discountInfo: null,
      sizes: ['S'],
      detailImages: ['/images/test/first-detail.avif'],
      colors: [
        {
          code: '01',
          name: '01 Black',
          swatch: '/images/test/swatch-black.avif',
          image: '/images/test/black.avif',
        },
        {
          code: '02',
          name: '02 Blue',
          swatch: '/images/test/swatch-blue.avif',
          image: '/images/test/blue.avif',
        },
      ],
      features: [],
    },
    {
      id: 2,
      name: 'Second item',
      categoryId: 8,
      gender: 'Women',
      price: 30,
      discountPercent: 50,
      discountInfo: 'New Year Sale',
      sizes: ['M'],
      detailImages: ['/images/test/second-detail.avif'],
      colors: [
        {
          code: '10',
          name: '10 Green',
          swatch: '/images/test/swatch-green.avif',
          image: '/images/test/green.avif',
        },
        {
          code: '02',
          name: '02 Navy',
          swatch: '/images/test/swatch-navy.avif',
          image: '/images/test/navy.avif',
        },
      ],
      features: [],
    },
  ],
}));

vi.mock('../data/variants.js', () => ({
  default: [
    { id: 1, productId: 1, colorCode: '01', size: 'S', stockQuantity: 10 },
    { id: 2, productId: 1, colorCode: '02', size: 'S', stockQuantity: 10 },
    { id: 3, productId: 2, colorCode: '10', size: 'M', stockQuantity: 10 },
    { id: 4, productId: 2, colorCode: '02', size: 'M', stockQuantity: 10 },
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
      size: 'S',
      stockQuantity: 10,
      productName: 'First item',
      gender: 'Unisex',
      price: 15,
      discountPercent: null,
      discountInfo: null,
      colorName: '01 Black',
      colorImage: '/images/test/black.avif',
    });
    expect(result[1]).toMatchObject({
      id: 4,
      productId: 2,
      colorCode: '02',
      size: 'M',
      stockQuantity: 10,
      productName: 'Second item',
      gender: 'Women',
      price: 30,
      discountPercent: 50,
      discountInfo: 'New Year Sale',
      colorName: '02 Navy',
      colorImage: '/images/test/navy.avif',
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
    await getVariantsByIds([1]);

    expect(variants[0]).not.toHaveProperty('productName');
  });
});
