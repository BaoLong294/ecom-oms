import { describe, it, expect, vi } from 'vitest';
import { getProductById } from './productService.js';
import products from '../data/products.js';

vi.mock('../data/products.js', () => ({
  default: [
    {
      id: 1,
      name: 'First item',
      categoryId: 10,
      gender: 'Men',
      price: 50,
    },
    {
      id: 2,
      name: 'Second item',
      categoryId: 20,
      gender: 'Women',
      price: 35,
    },
  ],
}));

vi.mock('../data/variants.js', () => ({
  default: [
    { id: 1, productId: 1, colorCode: '09', size: 'S', stockQuantity: 10 },
    { id: 2, productId: 1, colorCode: '09', size: 'M', stockQuantity: 10 },
    { id: 3, productId: 1, colorCode: '20', size: 'S', stockQuantity: 10 },
    { id: 4, productId: 2, colorCode: '60', size: 'S', stockQuantity: 10 },
    { id: 5, productId: 2, colorCode: '60', size: 'M', stockQuantity: 10 },
  ],
}));

describe('getProductById', () => {
  it('should return null if the productId passed as a parameter is not found', async () => {
    const product = await getProductById(9999);

    expect(product).toBeNull();
  });

  it('should return correct product with productId passed as parameter', async () => {
    const product = await getProductById(2);

    expect(product).toMatchObject({
      id: 2,
      name: 'Second item',
      categoryId: 20,
      gender: 'Women',
      price: 35,
    });
  });

  it('should only contain variants with productId matching the productId passed as parameter', async () => {
    const product = await getProductById(1);

    expect(product.variants.every((variant) => variant.productId === 1)).toBe(
      true
    );
  });

  it('should contain all variants of the product', async () => {
    const product = await getProductById(1);
    const productVariantIds = product.variants.map((variant) => variant.id);

    expect(productVariantIds).toHaveLength(3);
    expect(productVariantIds).toEqual(expect.arrayContaining([1, 2, 3]));
  });

  it('should not modify the original data', async () => {
    await getProductById(1);

    expect(products[0]).not.toHaveProperty('variants');
  });
});
