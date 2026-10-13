import products from '../data/products.js';
import variants from '../data/variants.js';

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
export async function getProductById(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  const productVariants = variants.filter(
    (variant) => variant.productId === productId
  );

  return { ...product, variants: productVariants };
}
