import landingBanners from '../data/landingBanners.js';
import { simulateRequest } from './mockApi.js';

/**
 * Lấy các banner landing của một category gốc, sắp theo position tăng dần.
 * Tương ứng với API: GET /api/landing-banners?categoryId=:categoryId
 *
 * @param {number} categoryId - id của category gốc (Women, Men, Kids, Baby).
 *   Phải là số; giá trị lấy từ URL là chuỗi, nơi gọi phải chuyển sang số trước.
 * @returns {Promise<object[]>} Mảng banner đã sắp theo position,
 *   mảng rỗng nếu category không có banner.
 */
export function getLandingBanners(categoryId) {
  const result = landingBanners
    .filter((banner) => banner.categoryId === categoryId)
    .sort((a, b) => a.position - b.position);

  return simulateRequest(result);
}
