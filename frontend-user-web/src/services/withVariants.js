import variants from '../data/variants.js';

/**
 * Ghép một product với mọi variant của nó, trả về đúng hình dạng mà API trả cho
 * một product (product kèm mảng variants). Dùng chung cho các service cần trả
 * product kèm variants (chi tiết sản phẩm, danh sách theo category).
 * Luôn tạo object mới, không gán thêm trường vào product lấy từ data/products,
 * vì object đó được mọi service khác đọc lại.
 *
 * @param {object} product - product lấy từ data/products.
 * @returns {object & {
 *   variants: Array<{
 *     id: number,
 *     productId: number,
 *     colorCode: string,
 *     size: string,
 *     stockQuantity: number
 *   }>
 * }} Object mới gồm mọi trường của product, thêm mảng variants có productId
 *   bằng id của product (mảng rỗng nếu product không có variant nào).
 */
export function withVariants(product) {
  const productVariants = variants.filter(
    (variant) => variant.productId === product.id
  );

  return { ...product, variants: productVariants };
}
