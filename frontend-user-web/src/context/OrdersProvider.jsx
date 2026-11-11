import { useState } from 'react';
import { OrdersContext } from './OrdersContext';

const ORDERS_STORAGE_KEY = 'orders';

/**
 * Một món trong đơn: bản chụp thông tin lúc đặt, kèm variantId và productId để tham chiếu.
 * @typedef {object} OrderItem
 * @property {number} variantId - variant đã mua
 * @property {number} productId - sản phẩm của variant, dùng cho link tới trang sản phẩm
 * @property {string} image - ảnh của màu đã chọn
 * @property {string} productName - tên sản phẩm lúc đặt
 * @property {string} colorName - tên màu lúc đặt
 * @property {string} size - size đã chọn
 * @property {number} quantity - số lượng
 * @property {number} unitPrice - giá một món lúc đặt, đã trừ giảm giá
 */

/**
 * Thông tin người nhận hàng (người mua là tài khoản ở trường email của đơn).
 * @typedef {object} Shipping
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} address
 * @property {string} phone
 */

/**
 * Một đơn hàng đã lưu.
 * @typedef {object} Order
 * @property {number} id - id lớn nhất hiện có + 1, do Provider gán
 * @property {string} email - email tài khoản đặt đơn, dùng để lọc đơn theo người dùng
 * @property {string} status - trạng thái đơn ('placed', 'shipped', 'delivered'), khởi tạo 'placed'
 * @property {string} createdAt - thời điểm tạo dạng ISO 8601
 * @property {Shipping} shipping - người nhận
 * @property {OrderItem[]} items - các món theo thứ tự giỏ hàng lúc đặt
 * @property {number} total - tổng tiền lúc đặt (số, chưa định dạng)
 */

/**
 * Đọc các đơn hàng đã lưu để làm state ban đầu. Không có dữ liệu hoặc dữ liệu hỏng
 * thì coi như chưa có đơn nào.
 * @returns {Order[]} danh sách đơn theo thứ tự tạo
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
 * Giữ danh sách đơn hàng đã đặt cho toàn app và lưu lại vào localStorage mỗi khi
 * có đơn mới. Mỗi đơn chụp lại sản phẩm, ảnh, tên, màu, size và giá lúc đặt, nên
 * đơn cũ không đổi theo dữ liệu cửa hàng sau này. Đơn của mọi tài khoản trên trình
 * duyệt nằm chung một danh sách; lọc theo email là việc của nơi hiển thị.
 * @param {object} props
 * @param {React.ReactNode} props.children - phần app được dùng đơn hàng
 * @returns {JSX.Element}
 */
function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(readStoredOrders);

  /**
   * Tạo đơn mới ở cuối danh sách. Provider tự gán id, trạng thái và thời điểm tạo.
   * @param {{ email: string, shipping: Shipping, items: OrderItem[], total: number }} orderInput
   *   - dữ liệu đơn do trang Checkout dựng
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
