import { useCart } from './CartContext';
import { useVariants } from '../hooks/useVariants';
/** @import { CartEntry } from './cartReducer' */
/** @import { VariantDetails } from '../services/variantService' */

/**
 * Ghép giỏ hàng từ CartContext với thông tin variant của các món trong giỏ.
 * Đổi số lượng không làm danh sách id thay đổi nên không gọi lại service.
 * @returns {{ items: CartEntry[], itemCount: number,
 *   variants: VariantDetails[] | null, isLoading: boolean, errorMessage: string | null }}
 */
export function useCartVariants() {
  const { items, itemCount } = useCart();

  const { variants, isLoading, errorMessage } = useVariants(
    items.map((item) => item.variantId)
  );

  return { items, itemCount, variants, isLoading, errorMessage };
}
