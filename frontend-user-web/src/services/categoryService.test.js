import { describe, it, expect, vi } from 'vitest';
import { getCategoryListing } from './categoryService.js';
import categories from '../data/categories.js';
import categoryBanners from '../data/categoryBanners.js';
import products from '../data/products.js';

vi.mock('../data/categories.js', () => ({
  default: [
    { id: 1, name: 'Grandparent', position: 1, parentId: null },
    { id: 2, name: 'Second parent', position: 2, parentId: 1 },
    { id: 3, name: 'First parent', position: 1, parentId: 1 },
    { id: 4, name: 'Third child', position: 3, parentId: 3 },
    { id: 5, name: 'First child', position: 1, parentId: 3 },
    { id: 6, name: 'Second child', position: 2, parentId: 3 },
  ],
}));

vi.mock('../data/categoryBanners.js', () => ({
  default: [
    { id: 1, categoryId: 6, position: 1 },
    { id: 2, categoryId: 5, position: 2 },
    { id: 3, categoryId: 5, position: 1 },
    { id: 4, categoryId: 4, position: 1 },
  ],
}));

vi.mock('../data/products.js', () => ({
  default: [
    { id: 1, categoryId: 5, name: 'Second Item' },
    { id: 2, categoryId: 5, name: 'First Item' },
    { id: 3, categoryId: 6, name: 'Third Item' },
    { id: 4, categoryId: 4, name: 'Fourth Item' },
    { id: 5, categoryId: 7, name: 'Fifth Item' },
  ],
}));

vi.mock('../data/variants.js', () => ({
  default: [
    { id: 11, productId: 1, colorCode: 'C1', size: 'S', stockQuantity: 10 },
    { id: 12, productId: 2, colorCode: 'C2', size: 'M', stockQuantity: 10 },
    { id: 13, productId: 1, colorCode: 'C3', size: 'L', stockQuantity: 10 },
    { id: 14, productId: 4, colorCode: 'C4', size: 'S', stockQuantity: 10 },
  ],
}));

describe('getCategoryListing', () => {
  it('should return null when category does not exist', async () => {
    const categoryListing = await getCategoryListing(999);
    expect(categoryListing).toBeNull();
  });

  it('should return groups as an empty array if category does not have any children', async () => {
    const categoryListing = await getCategoryListing(2);
    expect(categoryListing.groups).toEqual([]);
  });

  it('should return correct id and name of the requested category', async () => {
    const categoryListing = await getCategoryListing(3);

    expect(categoryListing.id).toBe(3);
    expect(categoryListing.name).toBe('First parent');
  });

  it('should include the direct children of the requested category inside group', async () => {
    const categoryListing = await getCategoryListing(3);

    expect(categoryListing.groups).toHaveLength(3);
    expect(categoryListing.groups.map((group) => group.id)).toEqual(
      expect.arrayContaining([4, 5, 6])
    );
  });

  it('should have groups arranged by position in ascending order', async () => {
    const categoryListing = await getCategoryListing(3);
    const groupListing = categoryListing.groups.map((group) => group.id);

    expect(groupListing).toEqual([5, 6, 4]);
  });

  it('should have correct id and name for each group', async () => {
    const categoryListing = await getCategoryListing(3);
    const group = categoryListing.groups.find((item) => item.id === 5);

    expect(group.name).toBe('First child');
  });

  it('should only have banner with correct categoryId in banners array', async () => {
    const categoryListing = await getCategoryListing(3);
    const group = categoryListing.groups.find((item) => item.id === 5);
    const ids = group.banners.map((banner) => banner.id);
    const isCorrectCategoryId = categoryListing.groups.every((listingGroup) =>
      listingGroup.banners.every(
        (banner) => banner.categoryId === listingGroup.id
      )
    );

    expect(ids).toHaveLength(2);
    expect(ids).toEqual(expect.arrayContaining([2, 3]));
    expect(isCorrectCategoryId).toBe(true);
  });

  it('should have banner arranged by position in banners array', async () => {
    const categoryListing = await getCategoryListing(3);
    const group = categoryListing.groups.find((item) => item.id === 5);

    expect(group.banners.map((banner) => banner.position)).toEqual([1, 2]);
  });

  it('should only have product with correct categoryId in products array', async () => {
    const categoryListing = await getCategoryListing(3);
    const group = categoryListing.groups.find((item) => item.id === 5);
    const isCorrectCategoryId = categoryListing.groups.every((listingGroup) =>
      listingGroup.products.every(
        (product) => product.categoryId === listingGroup.id
      )
    );

    expect(group.products.map((product) => product.id)).toEqual([1, 2]);
    expect(isCorrectCategoryId).toBe(true);
  });

  it('should not reorder the source data', async () => {
    await getCategoryListing(3);
    expect(categories.map((category) => category.id)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(categoryBanners.map((banner) => banner.id)).toEqual([1, 2, 3, 4]);
  });

  it('should attach the variants of each product', async () => {
    const categoryListing = await getCategoryListing(3);
    const firstGroup = categoryListing.groups.find((item) => item.id === 5);
    const secondGroup = categoryListing.groups.find((item) => item.id === 6);
    const [secondItem, firstItem] = firstGroup.products;

    expect(secondItem.variants.map((variant) => variant.id)).toEqual([11, 13]);
    expect(firstItem.variants.map((variant) => variant.id)).toEqual([12]);
    expect(secondGroup.products[0].variants).toEqual([]);
  });

  it('should not add variants to the source products', async () => {
    await getCategoryListing(3);

    products.forEach((product) => {
      expect(product).not.toHaveProperty('variants');
    });
  });
});
