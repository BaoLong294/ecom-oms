function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");
  const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

  const totalQuantity = currentCart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  if (currentCart.length === 0) {
    cartBadge.style.display = "none";
  } else {
    cartBadge.style.display = "block";
    cartBadge.textContent = totalQuantity;
  }
}

// Call function when page loads to display initial quantity
document.addEventListener("DOMContentLoaded", updateCartBadge);
