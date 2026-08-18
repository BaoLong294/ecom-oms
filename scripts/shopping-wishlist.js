/*
  Page controller cho trang wishlist.html.
  Hiển thị toàn bộ sản phẩm với đúng màu và size đang có trong wishlist,
  cho phép xóa khỏi wishlist bằng qua icon tim và thêm vào giỏ hàng bằng nút ADD TO CART.
*/

// ============================================= IMPORTS =============================================
import { getWishlist, removeFromWishlist } from "./wishlist/wishlist.js";
import {
  getCart,
  addToCart,
  getCartTotal,
  getCartItemCount,
} from "./cart/cart.js";
import { updateCartBadge } from "./header-cart.js";
import { formatToUSD, getEffectivePrice } from "./utils/price.js";
import { HEART_FILLED } from "./ui/wishlist-icons.js";
import { trapFocusOutside, releaseFocusTrap } from "./ui/focus-trap.js";

// =========================================== DOM QUERIES ===========================================
const emptyState = document.querySelector(".wishlist-empty");
const filledState = document.querySelector(".wishlist-filled");
const itemsContainer = document.querySelector(".wishlist-items");
const countLabel = document.querySelector(".wishlist-count");

const popupOverlay = document.querySelector(".product-popup-overlay");
const popupItem = popupOverlay.querySelector(".popup-item");
const subtotalItem = popupOverlay.querySelector(".subtotal-item");
const subtotalPrice = popupOverlay.querySelector(".subtotal-price");
const popupClose = popupOverlay.querySelector(".popup-close");
const viewCart = popupOverlay.querySelector(".view-cart");
const continueShopping = popupOverlay.querySelector(".continue-shopping");

// ================================= HIỂN THỊ SẢN PHẨM TRONG WISHLIST ================================
const currentWishlist = getWishlist();

if (currentWishlist.length === 0) {
  emptyState.style.display = "block";
  filledState.style.display = "none";
} else {
  emptyState.style.display = "none";
  filledState.style.display = "grid";
  renderWishlistItems(currentWishlist);
  countLabel.textContent = `${currentWishlist.length} item(s)`;
}

// ========================================= RENDER FUNCTIONS =========================================

/**
 * Vẽ toàn bộ danh sách sản phẩm trong wishlist ra DOM, gắn sự kiện cho từng card.
 * @param {array} wishlist - mảng các sản phẩm hiện có trong wishlist
 */
function renderWishlistItems(wishlist) {
  wishlist.forEach((item, index) => {
    const card = createWishlistItemCard(item);

    setupItemHeart(card, index);
    setupItemAddToCart(card, item);

    itemsContainer.appendChild(card);
  });
}

// ========================================= HELPER FUNCTIONS =========================================

/**
 * Dựng HTML tĩnh cho 1 item gồm ảnh, tên, icon tim, giá, size, color, nút ADD TO CART.
 * @param {object} item - đối tượng sản phẩm chứa các thông tin về sản phẩm để hiển thị
 * @returns {HTMLDivElement} trả về phần tử card chứa HTML để hiển thị sản phẩm
 */
function createWishlistItemCard(item) {
  const card = document.createElement("div");
  card.classList.add("item-card");

  const price = getEffectivePrice(item);
  const priceToUSD = formatToUSD(price);

  let priceHTML = null;
  if (item.discountPercent === null) {
    priceHTML = `<p class="price-original">${priceToUSD}</p>`;
  } else {
    priceHTML = `
        <p class="price-discount">${priceToUSD}</p>
        <p class="discount-description">${item.description}</p>
    `;
  }

  card.innerHTML = `
    <div class="item-image">
        <img src="${item.image}" alt="${item.name}">
    </div>

    <div class="item-info">
        <div class="item-title">
            <h2>${item.name}</h2>
            <button type="button" class="heart-button">
              <svg class="item-heart">
                  <use href="${HEART_FILLED}"></use>
              </svg>
            </button>
        </div>

        <p>Color: ${item.color}</p>
        <p>Size: ${item.gender} ${item.size}</p>

        <div class="item-price">${priceHTML}</div>

        <button class="item-add-cart">ADD TO CART</button>
    </div>
  `;

  return card;
}

/**
 * Gắn sự kiện cho icon tim trong card để người dùng xóa sản phẩm khỏi wishlist.
 * @param {HTMLDivElement} card - phần tử html card
 * @param {number} index - vị trí của sản phẩm trong mảng wishlist
 */
function setupItemHeart(card, index) {
  const heartIcon = card.querySelector(".heart-button");

  heartIcon.addEventListener("click", () => {
    const wishlistAfterRemove = removeFromWishlist(index);

    itemsContainer.innerHTML = "";

    if (wishlistAfterRemove.length === 0) {
      emptyState.style.display = "block";
      filledState.style.display = "none";
    } else {
      renderWishlistItems(wishlistAfterRemove);
      countLabel.textContent = `${wishlistAfterRemove.length} item(s)`;
    }
  });
}

/**
 * Gắn sự kiện cho nút ADD TO CART trong card để thêm sản phẩm vào giỏ hàng
 * với quantity mặc định là 1, sản phẩm vẫn giữ nguyên trong wishlist sau đó.
 * @param {HTMLDivElement} card - phần tử html card
 * @param {object} item - sản phẩm được thêm vào giỏ hàng
 */
function setupItemAddToCart(card, item) {
  const addButton = card.querySelector(".item-add-cart");

  addButton.addEventListener("click", () => {
    addToCart({ ...item, quantity: 1 });
    updateCartBadge();
    displayAddToCartPopup();
  });
}

// =============================== POPUP XÁC NHẬN "ĐÃ THÊM VÀO GIỎ HÀNG" ===============================

/**
 * Hiển thị popup xác nhận đã thêm sản phẩm vào giỏ hàng, quantity luôn hard-code
 * là 1 vì trang wishlist không có ô nhập số lượng như product-details.
 */
function displayAddToCartPopup() {
  const currentCart = getCart();
  const totalItem = getCartItemCount(currentCart);
  const totalPrice = getCartTotal(currentCart);

  popupItem.textContent = "1 item(s) added to your cart";
  subtotalItem.textContent = `${totalItem} item(s)`;
  subtotalPrice.textContent = `${formatToUSD(totalPrice)}`;

  popupOverlay.classList.remove("hidden");
  trapFocusOutside(popupOverlay);
}

popupClose.addEventListener("click", () => {
  popupOverlay.classList.add("hidden");
  releaseFocusTrap();
});

viewCart.addEventListener("click", () => {
  window.location.href = "./shopping-cart.html";
});

continueShopping.addEventListener("click", () => {
  popupOverlay.classList.add("hidden");
  releaseFocusTrap();
});
