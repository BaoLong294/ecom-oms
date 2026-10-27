import products from '../data/products.js';
import variants from '../data/variants.js';
import { simulateRequest } from './mockApi.js';

/**
 * Lấy thông tin hiển thị của các variant theo danh sách id, dùng cho trang Cart
 * và Wishlist. Mỗi phần tử là variant kèm thông tin product và màu tương ứng.
 * Kết quả giữ đúng thứ tự variantIds; id không tồn tại bị bỏ qua.
 * Tương ứng với API: GET /api/variants?ids=1,2,3
 *
 * @param {number[]} variantIds - Danh sách variant id lấy từ giỏ hàng hoặc wishlist.
 * @returns {Promise<Array<{
 *   id: number,
 *   productId: number,
 *   colorCode: string,
 *   size: string,
 *   stockQuantity: number,
 *   productName: string,
 *   gender: string,
 *   price: number,
 *   discountPercent: number | null,
 *   discountInfo: string | null,
 *   colorName: string,
 *   colorImage: string
 * }>>} Mảng thông tin variant; mảng rỗng nếu variantIds rỗng
 *   hoặc không id nào tồn tại.
 */
export function getVariantsByIds(variantIds) {
  const result = variantIds.flatMap((id) => {
    const variant = variants.find((v) => v.id === id);

    if (!variant) return [];

    const product = products.find((p) => p.id === variant.productId);
    const color = product.colors.find((c) => c.code === variant.colorCode);

    return {
      ...variant,
      productName: product.name,
      gender: product.gender,
      price: product.price,
      discountPercent: product.discountPercent,
      discountInfo: product.discountInfo,
      colorName: color.name,
      colorImage: color.image,
    };
  });

  return simulateRequest(result);
}
