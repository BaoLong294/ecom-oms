import { useReducer, useEffect } from 'react';
import { cartReducer } from './cartReducer.js';
import { CartContext } from './CartContext.js';

const CART_STORAGE_KEY = 'cart';

/**
 * Đọc giỏ hàng đã lưu trong localStorage để khôi phục khi tải lại trang.
 * Không có dữ liệu hoặc dữ liệu hỏng (không parse được) thì coi như giỏ rỗng.
 * @returns {Array<{ variantId: number, quantity: number }>} Giỏ hàng đã lưu, hoặc [] nếu không có hoặc dữ liệu hỏng
 */
function readStoredCart() {
  try {
    const value = localStorage.getItem(CART_STORAGE_KEY);
    // JSON.parse(null) trả null khi chưa có key, nên đổi về [] để giỏ hàng luôn là mảng.
    return JSON.parse(value) ?? [];
  } catch {
    return [];
  }
}

/**
 * Giữ giỏ hàng (chỉ gồm variantId và quantity) và cung cấp cho toàn bộ cây con qua CartContext.
 * Mọi thay đổi giỏ hàng đi qua cartReducer; value chỉ lộ các hàm thao tác, không lộ dispatch.
 * Giỏ hàng được lưu vào localStorage để giữ nguyên sau khi tải lại trang.
 * @param {{ children: React.ReactNode }} props
 * @param {React.ReactNode} props.children Phần app được bọc, có thể đọc context bằng useCart
 */
function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, readStoredCart);

  // Ghi storage bằng effect thay vì trong từng hàm thao tác (khác AuthProvider): state mới
  // chỉ được tính bên trong cartReducer, mà reducer phải pure nên không ghi storage được,
  // còn các hàm bên dưới chỉ gọi dispatch nên không cầm được state mới. Effect chạy sau khi
  // state đã đổi, nên storage luôn khớp với items dù items đổi bằng action nào.
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Tổng số lượng (không phải số dòng), dùng cho badge giỏ hàng.
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  function addItem(variantId, quantity) {
    dispatch({ type: 'added', variantId, quantity });
  }

  function changeQuantity(variantId, quantity) {
    dispatch({ type: 'quantity_changed', variantId, quantity });
  }

  function removeItem(variantId) {
    dispatch({ type: 'removed', variantId });
  }

  return (
    <CartContext
      value={{ items, itemCount, addItem, changeQuantity, removeItem }}
    >
      {children}
    </CartContext>
  );
}

export default CartProvider;
