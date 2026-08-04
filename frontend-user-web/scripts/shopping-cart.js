/*
 * Page controller cho trang shopping-cart.
 * Hiển thị toàn bộ card các sản phẩm hiện đang có trong giỏ hàng,
   cho phép người dùng coi toàn bộ thông tin cũng như có thể tăng/giảm số lượng.
 * Hiển thị tổng số lượng sản phẩm và tổng tiền tất cả sản phẩm trong giỏ hàng
   để người dùng có thể tiến hành thanh toán hoặc tiếp tục mua sắm tiếp.
*/

// ============================================= IMPORTS =============================================
import {
  getCart,
  removeFromCart,
  updateQuantity,
  getCartTotal,
  getCartItemCount,
} from "./cart/cart.js";
import { formatToUSD, getEffectivePrice } from "./utils/price.js";

// =========================================== DOM QUERIES ===========================================
const emptyState = document.querySelector(".cart-empty");
const filledState = document.querySelector(".cart-filled");
const itemsContainer = document.querySelector(".cart-items");
const summaryContainer = document.querySelector(".cart-summary");

// ================================= HIỂN THỊ SẢN PHẨM TRONG GIỎ HÀNG ================================
const currentCart = getCart();

if (currentCart.length === 0) {
  emptyState.style.display = "block";
  filledState.style.display = "none";
} else {
  emptyState.style.display = "none";
  filledState.style.display = "grid";

  renderCartItems(currentCart);
  renderCartSummary(currentCart);
}

// ========================================= SETUP FUNCTIONS ==========================================
/**
 * Dựng HTML tĩnh cho 1 item (ảnh, tên, giá, size, color, khung số lượng và khung subtotal)
 * @param {object} item - đối tượng sản phẩm chứa các thông tin về sản phẩm để hiển thị
 * @returns {HTMLDivElement} trả về phần tử card chứa HTML để hiển thị sản phẩm
 */
function createCartItemCard(item) {
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

  const itemSubtotal = item.quantity * price;
  const itemSubtotalToUSD = formatToUSD(itemSubtotal);

  card.innerHTML = `
    <div class="item-image">
      <img src="${item.image}" alt="${item.name}">
    </div>
      
    <div class="item-info">
      <div class="item-title">
          <h2>${item.name}</h2>
          <button class="item-remove">&times;</button>
      </div>
        
      <p>Color: ${item.color}</p>
      <p>Size: ${item.gender} ${item.size}</p>
      
      <div class="item-price">${priceHTML}</div>

      <div class="item-quantity">
          <h2>QUANTITY</h2>
          <div class="quantity-button">
              <button type="button" class="minus-button">-</button>
              <p class="quantity-value"></p>
              <button type="button" class="plus-button">+</button>  
          </div>
      </div>
      
      <div class="item-subtotal ${item.discountPercent ? "price-discount" : ""}">
        <p>SUBTOTAL: 
          <span class="item-subtotal-price">
            ${itemSubtotalToUSD}
          </span>
        </p>
      </div>
    </div>
  `;

  return card;
}

/**
 * Gắn sự kiện cho nút remove 'X' trong card item để người dùng xóa sản phẩm khỏi giỏ hàng
 * @param {HTMLDivElement} card - phẩn tử html card
 * @param {number} index - vị trí của sản phẩm trong mảng cart
 */
function setupItemRemove(card, index) {
  const removeButton = card.querySelector(".item-remove");

  removeButton.addEventListener("click", () => {
    const cartAfterRemove = removeFromCart(index);

    itemsContainer.innerHTML = "";

    if (cartAfterRemove.length === 0) {
      emptyState.style.display = "block";
      filledState.style.display = "none";
    } else {
      renderCartItems(cartAfterRemove);
      renderCartSummary(cartAfterRemove);
    }
  });
}

/**
 * Gắn sự kiện cho nút '+/-' để người dùng tăng giảm số lượng sản phẩm,
 * khi tăng/giảm số lượng ta sẽ cập nhật lại số lượng và giá thành hiển thị trên UI
 * @param {HTMLDivElement} card - phẩn tử html card
 * @param {object} item - để lấy giá và số lượng hiện tại của sản phẩm
 * @param {number} index - vị trí của sản phẩm trong mảng cart
 */
function setupItemQuantity(card, item, index) {
  const minusButton = card.querySelector(".minus-button");
  const plusButton = card.querySelector(".plus-button");
  const quantityValue = card.querySelector(".quantity-value");
  const subtotalPrice = card.querySelector(".item-subtotal-price");

  const price = getEffectivePrice(item);
  let currentQuantity = Number(item.quantity);

  function updateQuantityUI() {
    quantityValue.textContent = currentQuantity;

    if (currentQuantity <= 1) {
      minusButton.classList.add("disabled");
    } else {
      minusButton.classList.remove("disabled");
    }

    const cartAfterUpdate = updateQuantity(index, currentQuantity);

    const newSubtotal = currentQuantity * price;
    const newSubtotalToUSD = formatToUSD(newSubtotal);
    subtotalPrice.textContent = `${newSubtotalToUSD}`;

    renderCartSummary(cartAfterUpdate);
  }

  updateQuantityUI();

  minusButton.addEventListener("click", () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      updateQuantityUI();
    }
  });

  plusButton.addEventListener("click", () => {
    currentQuantity++;
    updateQuantityUI();
  });
}

// Khi người dùng ấn nút thanh toán nếu chưa đăng nhập thì điều hướng đến trang đăng nhập,
// nếu người dùng đã đăng nhập từ trước  thì điều hướng đến trang thanh toán và vận chuyển
function setupCheckoutButton() {
  const checkoutButton = document.querySelector(".checkout-button");

  checkoutButton.addEventListener("click", () => {
    window.location.href = "./login.html";
  });
}

// Nếu người dùng ấn nút tiếp tục mua sắm thì điều hướng về trang chủ
function setupContinueButton() {
  const continueButton = document.querySelector(".continue-button");

  continueButton.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}

// ========================================= RENDER FUNCTIONS =========================================
function renderCartItems(cart) {
  cart.forEach((item, index) => {
    const itemCard = createCartItemCard(item, index);
    setupItemRemove(itemCard, index);
    setupItemQuantity(itemCard, item, index);
    itemsContainer.appendChild(itemCard);
  });
}

function renderCartSummary(cart) {
  summaryContainer.innerHTML = `
    <div class="order-summary">
        <p>ORDER SUMMARY</p>
        <p class="summary-items"></p>
    </div>
        
    <div class="order-total">
        <p>ORDER TOTAL</p>
        <p class="total-price"></p>
    </div>

    <button class="checkout-button">CHECKOUT</button>
    <button class="continue-button">CONTINUE SHOPPING</button>
    `;

  // Hiển thị tổng số lượng tất cả sản phẩm trong giỏ hàng
  const summaryItems = document.querySelector(".summary-items");
  summaryItems.textContent = `${getCartItemCount(cart)} ITEM(S)`;

  // Hiển thị tổng giá tiền tất cả sản phẩm trong giỏ hàng
  const totalPrice = document.querySelector(".total-price");
  totalPrice.textContent = `${formatToUSD(getCartTotal(cart))}`;

  // Gắn sự kiện cho 2 nút bên trong cart summary
  setupCheckoutButton();
  setupContinueButton();
}
