// Cần tái sử dụng thao tác format/tính giá ở nhiều module khác nhau
// nên gom về 1 file duy nhất để tránh lặp lại code và có thể tái sử dụng ở nhiều nơi khác nhau

/**
 * Chuyển giá trị số thành chuỗi tiền tệ USD chuẩn định dạng (có dấu phẩy ngăn cách hàng nghìn, ký hiệu $) để hiển thị ra UI.
 * Dùng Intl.NumberFormat thay vì tự ghép "$" + amount.toFixed(2) vì nó xử lý đúng chuẩn locale (dấu phẩy hàng nghìn, làm tròn) mà không cần tự viết lại.
 * @param {number} amount - Giá trị gốc dạng số, ví dụ 39.9
 * @returns {string} Chuỗi đã format, ví dụ "$39.90"
 */
export function formatToUSD(amount) {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(amount);
}

/**
 * Chuyển 1 chuỗi bất kỳ (ví dụ input người dùng tự gõ vào ô lọc giá) về dạng số.
 * Hàm này chỉ cần khi dữ liệu đến từ nguồn không kiểm soát được kiểu (form input, API bên ngoài).
 * @param {string} string - Chuỗi cần làm sạch, ví dụ "$50.00"
 * @returns {number} Số đã chuyển đổi, trả về 0 nếu không parse được, ví dụ 50
 */
export function convertToNumber(string) {
  let cleaned = String(string).replace(/[^0-9.]/g, "");
  let num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Sản phẩm có thể giảm giá theo phần trăm (discount là số %, ví dụ 30 nghĩa là giảm 30%) hoặc không giảm (discount là null).
 * Gom logic "giá nào mới là giá thật sự tính tiền" về 1 chỗ, tránh mỗi file tự viết lại công thức và hiểu sai ý nghĩa discount
 * @param {{price: number, discount: number|null}} item - Object sản phẩm, ví dụ {price: 29.9, discount: 50}
 * @returns {number} Giá thực tế sau giảm giá (nếu có), ví dụ 14.95
 */
export function getEffectivePrice(item) {
  if (item.discount === null) return item.price;

  return item.price - (item.price * item.discount) / 100;
}
