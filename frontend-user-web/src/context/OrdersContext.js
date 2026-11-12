import { createContext, useContext } from 'react';
/** @import { Order, OrderItem, Shipping } from './OrdersProvider' */

export const OrdersContext = createContext(null);

/**
 * Đọc hook này để dùng danh sách đơn hàng trong mọi component nằm dưới OrdersProvider.
 * @returns {{ orders: Order[], addOrder: function({ email: string, shipping: Shipping,
 *   items: OrderItem[], total: number }): number }}
 *   orders là các đơn đã đặt theo thứ tự tạo; addOrder tạo đơn mới và trả về id của nó
 * @throws {Error} khi được gọi bên ngoài OrdersProvider
 */
export function useOrders() {
  const value = useContext(OrdersContext);

  if (value === null) {
    throw new Error('useOrders must be used inside OrdersProvider');
  }

  return value;
}
