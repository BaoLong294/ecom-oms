import { describe, it, expect, vi } from 'vitest';
import { getLandingBanners } from './bannerService';
import landingBanners from '../data/landingBanners';

// Thay thế dữ liệu thật bằng một mảng nhỏ có position xáo trộn
// để có thể kiếm tra xem hàm getLandingBanners có lọc và sắp xếp đúng không
vi.mock('../data/landingBanners', () => ({
  default: [
    { id: 1, categoryId: 1, position: 2 },
    { id: 2, categoryId: 2, position: 1 },
    { id: 3, categoryId: 1, position: 1 },
  ],
}));

describe('getLandingBanners', () => {
  it('returns only banners of the given category', async () => {
    const banners = await getLandingBanners(1);

    expect(banners).toHaveLength(2);
    expect(banners.every((banner) => banner.categoryId === 1)).toBe(true);
  });

  it('sorts banners by position in ascending order', async () => {
    const banners = await getLandingBanners(1);

    expect(banners.map((banner) => banner.position)).toEqual([1, 2]);
  });

  it('returns an empty array when the category has no banners', async () => {
    const banners = await getLandingBanners(999);

    expect(banners).toEqual([]);
  });

  it('does not reorder the source data', async () => {
    await getLandingBanners(1);

    expect(landingBanners.map((banner) => banner.id)).toEqual([1, 2, 3]);
  });
});
