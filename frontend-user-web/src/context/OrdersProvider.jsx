import { useState } from 'react';
import { OrdersContext } from './OrdersContext';

const ORDERS_STORAGE_KEY = 'orders';

/**
 * Đọc các đơn hàng đã lưu để làm state ban đầu. Không có dữ liệu hoặc dữ liệu hỏng
 * thì coi như chưa có đơn nào.
 * @returns {object[]} danh sách đơn theo thứ tự tạo
 */
function readStoredOrders() {
  try {
    const value = localStorage.getItem(ORDERS_STORAGE_KEY);
    return JSON.parse(value) ?? [];
  } catch {
    return [];
  }
}

/**
 * Giữ danh sách đơn hàng đã đặt cho toàn app và lưu lại vào localStorage
 * mỗi khi có đơn mới. Mỗi đơn chụp lại sản phẩm, ảnh, tên, màu, size và
 * giá lúc đặt, nên đơn cũ không đổi theo dữ liệu cửa hàng sau này.
 * @param {object} props
 * @param {React.ReactNode} props.children - phần app được dùng đơn hàng
 * @returns {JSX.Element}
 */
function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(readStoredOrders);

  /**
   * Tạo đơn mới ở cuối danh sách. Provider tự gán id, trạng thái và thời điểm tạo.
   * @param {{ email: string,
   *   shipping: { firstName: string, lastName: string, address: string, phone: string },
   *   items: { variantId: number, productId: number, image: string, productName: string,
   *   colorName: string, size: string, quantity: number, unitPrice: number }[],
   *   total: number }} orderInput - dữ liệu đơn do trang Checkout dựng
   * @returns {number} id của đơn vừa tạo
   */
  function addOrder(orderInput) {
    // Id lớn nhất + 1 thay vì số đơn + 1: số đơn không luôn bằng id lớn nhất
    // (storage sửa tay, sau này có xóa đơn), dùng số đơn có thể sinh id trùng.
    const nextId =
      orders.reduce((maxId, order) => Math.max(maxId, order.id), 0) + 1;

    const newOrder = {
      ...orderInput,
      id: nextId,
      status: 'placed',
      createdAt: new Date().toISOString(),
    };

    const nextOrders = [...orders, newOrder];
    setOrders(nextOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));

    return newOrder.id;
  }

  return <OrdersContext value={{ orders, addOrder }}>{children}</OrdersContext>;
}

export default OrdersProvider;
