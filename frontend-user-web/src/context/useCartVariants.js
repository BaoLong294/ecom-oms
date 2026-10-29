import { getVariantsByIds } from '../services/variantService';
import { useCart } from './CartContext';
import { useFetch } from '../hooks/useFetch';

/**
 * Nhận khóa chuỗi id ('203,101'), đổi lại thành mảng số rồi gọi getVariantsByIds.
 * useFetch cần tham số là giá trị nguyên thủy: mảng id tạo mới ở mỗi lần render
 * sẽ khiến effect chạy lại liên tục, còn chuỗi so sánh theo nội dung nên ổn định.
 * Khóa rỗng (giỏ trống) cho ra mảng rỗng, vì ''.split(',') là [''] và Number('') là 0.
 * Hàm đặt ở cấp module để tham chiếu không đổi giữa các lần render.
 * @param {string} idsKey - các variantId nối bằng dấu phẩy, '' khi giỏ trống
 * @returns {Promise<Array<object>>} thông tin các variant, giữ thứ tự theo idsKey
 */
function fetchVariantsByKey(idsKey) {
  const ids = idsKey === '' ? [] : idsKey.split(',').map(Number);

  return getVariantsByIds(ids);
}

/**
 * Đọc giỏ hàng từ CartContext và lấy thông tin (tên, ảnh, giá...) của mọi variant trong giỏ.
 * Giỏ hàng chỉ lưu variantId và quantity, nên nơi cần hiển thị hoặc tính tiền
 * (popup thêm vào giỏ, trang Cart) dùng hook này thay vì tự ghép useCart với useFetch.
 * Chỉ fetch lại khi danh sách id trong giỏ đổi; đổi số lượng không gọi lại service.
 * @returns {{
 *   items: Array<{ variantId: number, quantity: number }>,
 *   itemCount: number,
 *   variants: Array<object> | null,
 *   isLoading: boolean,
 *   errorMessage: string | null
 * }}
 */
export function useCartVariants() {
  const { items, itemCount } = useCart();

  const idsKey = items.map((item) => item.variantId).join(',');

  const {
    data: variants,
    isLoading,
    errorMessage,
  } = useFetch(fetchVariantsByKey, idsKey);

  return { items, itemCount, variants, isLoading, errorMessage };
}
