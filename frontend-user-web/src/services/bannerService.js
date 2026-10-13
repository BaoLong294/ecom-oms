import landingBanners from '../data/landingBanners';

/**
 * Lấy các banner landing của 1 category gốc, sắp xếp theo thứ tự position tăng dần.
 * Tương ứng với việc request API bằng /api/landing-banners?categoryId=:categoryId
 * @param {number} categoryId - id của category gốc như Women, Men, Kids và Baby
 * Tham số này phải là kiểu Number, nếu lấy giá trị từ URL phải chuyển từ string sang number
 * @returns {Promise<object[]>} mảng banner đã sắp xếp theo position tăng dần hoặc
 * mảng rỗng nếu tham số category không có banner.
 */
export async function getLandingBanners(categoryId) {
  return landingBanners
    .filter((banner) => banner.categoryId === categoryId)
    .sort((a, b) => a.position - b.position);
}
