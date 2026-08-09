// Module quản lý trạng thái đăng nhập giả lập (không có backend thật).
// Mọi trang cần biết người dùng đã đăng nhập hay chưa đều gọi qua module này.

/**
 * Ta cần kiểm tra người dùng hiện tại đã đăng nhập hay chưa,
 * dùng để quyết định có cho phép thao tác với wishlist hoặc checkout hay không.
 * @returns {boolean} true nếu đã đăng nhập, false nếu chưa
 */
export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

/**
 * Ta cần đánh dấu người dùng đã đăng nhập sau khi submit form login thành công,
 * lưu lại vào localStorage để trạng thái này giữ nguyên qua các trang khác nhau.
 */
export function login() {
  localStorage.setItem("isLoggedIn", "true");
}

/**
 * Ta cần một hàm để đăng xuất, xóa cờ isLoggedIn khỏi localStorage,
 * dùng cho nút logout sau này (nếu có) trong dự án.
 */
export function logout() {
  localStorage.removeItem("isLoggedIn");
}
