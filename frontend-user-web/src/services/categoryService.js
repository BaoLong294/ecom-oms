import categories from '../data/categories.js';
import categoryBanners from '../data/categoryBanners.js';
import products from '../data/products.js';
import { simulateRequest } from './mockApi.js';

/**
 * Lấy dữ liệu cho trang danh sách của một category: thông tin category
 * kèm các nhóm là category con trực tiếp, sắp theo position tăng dần.
 * Mỗi nhóm gồm banner (sắp theo position) và sản phẩm thuộc nhóm đó.
 * Tương ứng với API: GET /api/categories/:id/listing
 *
 * @param {number} categoryId - id của category cần lấy, ví dụ 5 (Casual Pants Collection).
 *   Phải là số; giá trị lấy từ URL là chuỗi, nơi gọi phải chuyển sang số trước.
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   groups: Array<{ id: number, name: string, banners: object[], products: object[] }>
 * } | null>} Object category kèm mảng groups; groups là mảng rỗng nếu category
 *   không có con. Trả null nếu category không tồn tại.
 */
export function getCategoryListing(categoryId) {
  const category = categories.find((category) => category.id === categoryId);

  if (!category) return simulateRequest(null);

  const childrenCategories = categories
    .filter((category) => category.parentId === categoryId)
    .sort((a, b) => a.position - b.position);

  const groups = childrenCategories.map((child) => {
    const groupBanners = categoryBanners
      .filter((b) => b.categoryId === child.id)
      .sort((a, b) => a.position - b.position);
    const groupProducts = products.filter((p) => p.categoryId === child.id);
    return {
      id: child.id,
      name: child.name,
      banners: groupBanners,
      products: groupProducts,
    };
  });

  return simulateRequest({ id: category.id, name: category.name, groups });
}
