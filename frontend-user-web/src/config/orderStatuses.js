/**
 * Các chặng trạng thái của đơn hàng theo đúng thứ tự xử lý (COD).
 * value khớp trường status lưu trong đơn; label là chữ hiển thị.
 * Danh sách đơn (badge) và chi tiết đơn (timeline) dùng chung hằng này.
 * @type {{ value: string, label: string }[]}
 */
export const ORDER_STATUSES = [
  { value: 'placed', label: 'Placed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];
