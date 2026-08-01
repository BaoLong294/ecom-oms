import { getCart, getCartItemCount } from "./cart/cart.js";

function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");

  const currentCart = getCart();
  const totalCartItems = getCartItemCount(currentCart);

  if (totalCartItems === 0) {
    cartBadge.style.display = "none";
  } else {
    cartBadge.style.display = "block";
    cartBadge.textContent = totalCartItems;
  }
}

// Ta cẩn gọi hàm updateCartBadge mỗi lần các trang được load lại từ đầu
// để hiển thị cho người dùng số sản phẩm hiện đang có trong giỏ hàng
document.addEventListener("DOMContentLoaded", updateCartBadge);
