import { getEffectivePrice } from './price';

/**
 * Tính tổng tiền của giỏ hàng. Giỏ hàng chỉ lưu variantId và quantity nên phải ghép
 * với thông tin variant (có giá) theo id: mỗi item lấy giá sau giảm của variant khớp id
 * nhân với số lượng. Item không tìm thấy variant (đã bị xóa khỏi cửa hàng, dữ liệu cũ
 * trong storage) được bỏ qua thay vì làm hỏng cả phép tính.
 * @param {Array<{ variantId: number, quantity: number }>} items - giỏ hàng từ useCart
 * @param {Array<{ id: number, price: number, discountPercent: number | null }>} variants -
 *   thông tin variant trả về từ getVariantsByIds, không cần cùng thứ tự với items
 * @returns {number} tổng tiền chưa format, 0 nếu giỏ rỗng
 */
export function getCartTotal(items, variants) {
  return items.reduce((total, item) => {
    const variant = variants.find((v) => v.id === item.variantId);

    if (!variant) return total;

    return total + getEffectivePrice(variant) * item.quantity;
  }, 0);
}
