import { createContext, useContext } from 'react';

export const CartContext = createContext(null);

/**
 * Đọc giỏ hàng và các hàm thao tác giỏ hàng từ CartProvider gần nhất phía trên trong cây.
 * Ném lỗi khi không có Provider, vì context khi đó trả null và lỗi destructure khó đoán nguyên nhân.
 * @returns {{
 *   items: Array<{ variantId: number, quantity: number }>,
 *   itemCount: number,
 *   addItem: function(number, number): void,
 *   changeQuantity: function(number, number): void,
 *   removeItem: function(number): void
 * }}
 * @throws {Error} Khi được gọi bên ngoài CartProvider
 */
export function useCart() {
  const value = useContext(CartContext);

  if (value === null) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return value;
}
