import products from '../data/products.js';
import { simulateRequest } from './mockApi.js';
import { withVariants } from './withVariants.js';

/**
 * Lấy dữ liệu cho trang chi tiết của một sản phẩm theo id: toàn bộ thông tin
 * của sản phẩm để hiển thị, kèm mảng variants chứa mọi biến thể của sản phẩm đó.
 * Tương ứng với API: GET /api/products/:id
 *
 * @param {number} productId - id của product cần lấy, ví dụ 4 (Flannel Pants | Gingham).
 *   Phải là số; giá trị lấy từ URL là chuỗi, nơi gọi phải chuyển sang số trước.
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   categoryId: number,
 *   gender: string,
 *   price: number,
 *   discountPercent: number | null,
 *   discountInfo: string | null,
 *   sizes: Array<string>,
 *   detailImages: Array<string>,
 *   colors: Array<{ code: string, name: string, swatch: string, image: string }>,
 *   features: Array<{ img: string, text: string }>,
 *   variants: Array<{
 *     id: number,
 *     productId: number,
 *     colorCode: string,
 *     size: string,
 *     stockQuantity: number
 *   }>
 * } | null>} Object product kèm mảng variants, trả null nếu product không tồn tại.
 */
export function getProductById(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) return simulateRequest(null);

  return simulateRequest(withVariants(product));
}

/**
 * Tìm sản phẩm theo từ khóa trong tên, dùng cho ô tìm kiếm.
 * Từ khóa được bỏ khoảng trắng hai đầu; so khớp không phân biệt hoa thường
 * và khớp ở bất kỳ vị trí nào trong tên. Kết quả giữ thứ tự của dữ liệu.
 * Nơi gọi tự bỏ qua từ khóa rỗng (từ khóa rỗng khớp mọi sản phẩm).
 * Tương ứng với API: GET /api/products?search=:query
 *
 * @param {string} query - từ khóa người dùng nhập, ví dụ 'pants'.
 * @returns {Promise<{ id: number, name: string }[]>} Mảng sản phẩm khớp, mỗi phần tử
 *   chỉ có id và name; trả mảng rỗng nếu không có sản phẩm nào khớp.
 */
export function searchProducts(query) {
  const normalizedQuery = query.trim().toLowerCase();

  return simulateRequest(
    products
      .filter((product) => product.name.toLowerCase().includes(normalizedQuery))
      .map(({ id, name }) => ({ id, name }))
  );
}
