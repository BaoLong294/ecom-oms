import { getVariantsByIds } from '../services/variantService';
import { useFetch } from './useFetch';

/**
 * Đổi khóa chuỗi id về mảng số rồi gọi service. Khóa rỗng phải xử lý riêng
 * vì ''.split(',') cho [''] và Number('') là 0.
 * @param {string} idsKey - danh sách variantId nối bằng dấu phẩy, ví dụ '12,7'
 * @returns {Promise<object[]>} thông tin các variant theo đúng thứ tự id
 */
function fetchVariantsByKey(idsKey) {
  const ids = idsKey === '' ? [] : idsKey.split(',').map(Number);

  return getVariantsByIds(ids);
}

/**
 * Lấy thông tin variant theo một danh sách variantId. Mảng truyền vào là tham chiếu
 * mới mỗi lần render nên được đổi thành khóa chuỗi trước khi đưa vào useFetch,
 * nhờ đó chỉ fetch lại khi danh sách id thật sự thay đổi.
 * @param {number[]} variantIds - danh sách variantId cần lấy
 * @returns {{ variants: object[] | null, isLoading: boolean, errorMessage: string | null }}
 */
export function useVariants(variantIds) {
  const idsKey = variantIds.join(',');

  const {
    data: variants,
    isLoading,
    errorMessage,
  } = useFetch(fetchVariantsByKey, idsKey);

  return { variants, isLoading, errorMessage };
}
