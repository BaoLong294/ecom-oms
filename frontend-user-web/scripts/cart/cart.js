// Module quản lý toàn bộ state giỏ hàng (đọc, thêm, xóa, sửa số lượng, tính tổng)
// Mọi trang cần thao tác với giỏ hàng đều gọi qua đây, không tự ý đụng localStorage trực tiếp

// ta cần tính tổng toàn bộ sản phẩm có trong giỏ hàng
// vậy nên ta cần tính ra giá thành của từng sản phẩm
import { getEffectivePrice } from "../utils/price.js";

/**
 * Mọi trang cần biết "trong giỏ hàng hiện có gì"
 * Header load để hiện badge, trang giỏ hàng load để vẽ danh sách các sản phẩm được thêm vào
 * @returns {array} chuỗi các sản phẩm nếu có hoặc mảng rỗng nếu chưa thêm sản phẩm nào vào giỏ
 */
export function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

/**
 * Cần một hàm để lưu lại giỏ hàng mỗi khi thực hiện sửa đổi sản phẩm
 * Tránh lặp lại code mỗi khi cần lưu trữ giỏ hàng và để cho các hàm sửa đổi sử dụng
 * @param {array} cart - mảng các sản phẩm sau khi đã sửa đổi
 * @returns {array} mảng các sản phẩm trong giỏ hàng
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

/**
 * Nguời dùng sau khi ấn nút "ADD TO CART" để thêm sản phẩm vào giỏ ở bất kỳ đâu
 * Ta sẽ thêm sản phẩm vào giỏ hàng hoặc tăng số lượng sản phẩm lên nếu đã có trong giỏ hàng
 * @param {object} item - Sản phẩm cùng các thông tin của sản phẩm {id, name, price, discount, color, image, size, quantity}
 * @returns {array} Mảng mới chứa sản phẩm vừa thêm hoặc số lượng đã tăng lên
 */
export function addToCart(item) {
  const currentCart = getCart();
  const itemIndex = currentCart.findIndex(
    (i) => i.id === item.id && i.color === item.color && i.size === item.size,
  );
  if (itemIndex !== -1) {
    currentCart[itemIndex].quantity += item.quantity;
  } else {
    currentCart.push(item);
  }

  return saveCart(currentCart);
}

/**
 * Nguời dùng sẽ muốn xóa sản phẩm họ không muốn mua nữa khỏi giỏ hàng
 * Nên ta cần xóa bỏ sản phẩm đó khỏi giỏ hàng hiện tại và cập nhật lại giỏ hàng mới
 * Người dùng sẽ ấn "X" để xóa sản phẩm vậy nên ta sẽ nhận được index của sản phẩm đó
 * @param {number} index - chỉ mục của sản phẩm trong mảng giỏ hàng ví dụ 1 hay 2 hay 3...
 * @returns {array} mảng giỏ hàng đã xóa bỏ sản phẩm tại chỉ mục được cung cấp
 */
export function removeFromCart(index) {
  const currentCart = getCart();
  currentCart.splice(index, 1);

  return saveCart(currentCart);
}

/**
 * Trường hợp người dùng đang xem giỏ hàng và muốn tăng hay giảm số lượng sản phẩm
 * Họ không cần quay trở lại trang sản phẩm để thêm sản phẩm hoặc xóa sản phẩm đi rồi thêm mới
 * Mà hoàn toàn có thể tăng hoặc giảm số lượng sản phẩm bằng "+" hoặc "-" ngay tại giỏ hàng
 * @param {number} index - chỉ mục của sản phẩm trong mảng giỏ hàng
 * @param {number} quantity - số lượng mới của sản phẩm sau khi tăng/giảm
 * @returns {array} mảng giỏ hàng mới đã được cập nhật số lượng sản phẩm
 */
export function updateQuantity(index, quantity) {
  const currentCart = getCart();
  currentCart[index].quantity = quantity;

  return saveCart(currentCart);
}

/**
 * Người dùng cần được biết tổng giá tiền của tất cả các sản phẩm đã được thêm vào giỏ hàng
 * Họ sẽ được thông báo mỗi khi bấm "ADD TO CART" sản phẩm hoặc trong "ORDER TOTAL" của giỏ hàng
 * @param {array} cart - giỏ hàng hiện tại để duyệt qua giá thành các sản phẩm
 * @returns {number} tổng giá thành tất cả sản phẩm có trong giỏ hàng
 */
export function getCartTotal(cart) {
  return cart.reduce(
    (totalPrice, item) => totalPrice + getEffectivePrice(item) * item.quantity,
    0,
  );
}

/**
 * Người dùng cần được biết hiện có bao nhiêu sản phẩm đã được thêm vào giỏ hàng
 * Họ sẽ được nhìn thấy trên badge cạnh icon giỏ hàng ở header của tất cả mọi trang
 * @param {array} cart - giỏ hàng hiện tại để duyệt qua số lượng các sản phẩm
 * @returns {number} tổng số lượng tất cả sản phẩm có trong giỏ hàng
 */
export function getCartItemCount(cart) {
  return cart.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
}
