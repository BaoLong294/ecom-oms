import categories from '../data/categories.js';
import categoryBanners from '../data/categoryBanners.js';
import products from '../data/products.js';
import { withVariants } from './withVariants.js';
import { simulateRequest } from './mockApi.js';

/**
 * Lấy dữ liệu cho trang danh sách của một category: thông tin category
 * kèm các nhóm là category con trực tiếp, sắp theo position tăng dần.
 * Mỗi nhóm gồm banner (sắp theo position) cùng sản phẩm thuộc nhóm đó,
 * và ở mỗi sản phẩm có kèm theo mảng variants của nó.
 * Tương ứng với API: GET /api/categories/:id/listing
 *
 * @param {number} categoryId - ID của category cần lấy, ví dụ 5 (Casual Pants Collection).
 *   Phải là số; giá trị lấy từ URL là chuỗi, nơi gọi phải chuyển sang số trước.
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   groups: Array<{
 *     id: number,
 *     name: string,
 *     banners: object[],
 *     products: Array<object & { variants: object[] }>
 *   }>
 * } | null>} Object category kèm mảng groups; groups là mảng rỗng nếu category
 *   không có con. Trả null nếu category không tồn tại.
 */
export function getCategoryListing(categoryId) {
  const category = categories.find((item) => item.id === categoryId);

  if (!category) return simulateRequest(null);

  const childrenCategories = categories
    .filter((item) => item.parentId === categoryId)
    .sort((a, b) => a.position - b.position);

  const groups = childrenCategories.map((child) => {
    const groupBanners = categoryBanners
      .filter((banner) => banner.categoryId === child.id)
      .sort((a, b) => a.position - b.position);
    const groupProducts = products
      .filter((product) => product.categoryId === child.id)
      .map((product) => withVariants(product));

    return {
      id: child.id,
      name: child.name,
      banners: groupBanners,
      products: groupProducts,
    };
  });

  return simulateRequest({ id: category.id, name: category.name, groups });
}

/**
 * Lấy dữ liệu cho mega-menu: mọi category gốc, sắp theo position tăng dần,
 * mỗi gốc kèm các category con trực tiếp (cũng sắp theo position).
 * Chỉ lấy id, tên và ảnh, không kèm sản phẩm.
 * Tương ứng với API: GET /api/categories/menu
 *
 * @returns {Promise<Array<{
 *   id: number,
 *   name: string,
 *   children: Array<{ id: number, name: string, image: string | null }>
 * }>>} Mảng category gốc; children là mảng rỗng nếu gốc không có con.
 */
export function getCategoryMenu() {
  const rootCategories = categories
    .filter((category) => category.parentId === null)
    .sort((a, b) => a.position - b.position);

  const menu = rootCategories.map((rootCategory) => {
    const children = categories
      .filter((category) => category.parentId === rootCategory.id)
      .sort((a, b) => a.position - b.position)
      .map(({ id, name, image }) => ({ id, name, image }));
    return { id: rootCategory.id, name: rootCategory.name, children };
  });

  return simulateRequest(menu);
}
