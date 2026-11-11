// Tạo một lần ở cấp module: mọi lần gọi dùng chung, không dựng lại formatter mỗi lần.
const ORDER_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/**
 * Định dạng chuỗi ngày ISO của đơn hàng thành ngày đọc được (ví dụ 'Nov 10, 2026').
 * Ngày hiển thị theo múi giờ của máy người xem, nên đơn đặt lúc 23:00 UTC
 * có thể hiện thành ngày hôm sau ở Việt Nam.
 * @param {string} isoString - thời điểm đặt hàng dạng ISO 8601 (createdAt của đơn)
 * @returns {string} ngày đã định dạng
 */
export function formatOrderDate(isoString) {
  return ORDER_DATE_FORMATTER.format(new Date(isoString));
}
