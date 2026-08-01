// Module quản lý toàn bộ state wishlist (đọc, thêm, xóa, kiểm tra tồn tại sản phẩm)
// Mọi trang cần thao tác với wishlist đều gọi qua module này, không tự ý đụng localStorage

/**
 * Ta cần lấy mảng wishlist từ localStorage để vẽ ra sanh sách sản phẩm
 * @returns {array} mảng các sản phẩm trong wishlist hoặc mảng rỗng nếu không có
 */
export function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

/**
 * Ta cần môt hàm để lưu lại mảng wishlist vào localStorage mỗi khi có thay đổi
 * Hàm này sẽ được tái sử dụng cho các hàm có thực hiện sửa đổi state wishlist
 * @param {array} wishlist - mảng wishlist mới để lưu vào localStorage
 * @returns {array} mảng wishlist chứa các sản phẩm
 */
function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  return wishlist;
}

/**
 * Khi người dùng tick icon tim vào màu và size của sản phẩm họ yêu thích
 * gọi hàm để thêm sản phẩm vào mảng wishlist và lưu lại mảng mới này
 * @param {object} item - đối tượng sản phẩm chứa  {id, name, price, discount, color, image, size}
 * @returns {array} mảng wishlist đã được thêm sản phẩm mới
 */
export function addToWishlist(item) {
  const currentWishlist = getWishlist();
  const findItem = currentWishlist.find(
    (i) => i.id === item.id && i.color === item.color && i.size === item.size,
  );

  if (findItem) return currentWishlist;

  currentWishlist.push(item);

  return saveWishlist(currentWishlist);
}

/**
 * Nguời dùng bỏ tim sản phẩm ta sẽ xóa sản phẩm khỏi mảng wishlist
 * Sau khi xóa sẽ cập nhật wishlist mới không còn sản phẩm đó nữa
 * @param {number} index - chỉ mục của phần tử trong mảng để biết phần tử nào cần xóa
 * @returns {array} mảng wishlist mới đã xóa sản phẩm
 */
export function removeFromWishlist(index) {
  const currentWishlist = getWishlist();
  currentWishlist.splice(index, 1);

  return saveWishlist(currentWishlist);
}
