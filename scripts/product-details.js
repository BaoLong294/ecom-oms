/*
  Page controller cho trang product-details.html.
  Lấy id sản phẩm từ URL, lấy dữ liệu sản phẩm, và render toàn bộ giao diện
  chi tiết sản phẩm (ảnh, thông tin, mô tả, popup xác nhận thêm giỏ hàng) ra DOM.
*/

// ============================================= IMPORTS =============================================
import { fetchProducts } from "./data/products.js";
import {
  getCart,
  addToCart,
  getCartTotal,
  getCartItemCount,
} from "./cart/cart.js";
import { updateCartBadge } from "./header-cart.js";
import { formatToUSD, getEffectivePrice } from "./utils/price.js";
import { addToWishlist } from "./wishlist/wishlist.js";

// =========================================== DOM QUERIES ===========================================
const imagesContainer = document.querySelector(".product-images");
const infoContainer = document.querySelector(".product-info");
const descriptionContainer = document.querySelector(".product-description");

const popupOverlay = document.querySelector(".product-popup-overlay");
const popupItem = popupOverlay.querySelector(".popup-item");
const subtotalItem = popupOverlay.querySelector(".subtotal-item");
const subtotalPrice = popupOverlay.querySelector(".subtotal-price");
const popupClose = popupOverlay.querySelector(".popup-close");
const viewCart = popupOverlay.querySelector(".view-cart");
const continueShopping = popupOverlay.querySelector(".continue-shopping");

// ====================================== LẤY ID SẢN PHẨM TỪ URL ======================================
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// ======================================= TẢI DỮ LIỆU SẢN PHẨM =======================================
async function loadingProductDetails(id) {
  try {
    imagesContainer.innerHTML =
      '<p class="loading"><span class="icon"></span> Loading product ...</p>';

    const products = await fetchProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      throw new Error("Product not found!");
    }

    renderProductPage(product);
  } catch (error) {
    console.error(error);
    imagesContainer.innerHTML = `<p class="loading-error">${error.message}</p>`;
  }
}

loadingProductDetails(productId);

// ========================================= RENDER FUNCTIONS =========================================

/**
 * Điều phối việc vẽ toàn bộ trang chi tiết sản phẩm — gọi lần lượt 3 hàm con
 * phụ trách 3 khu vực UI tách biệt (ảnh, thông tin mua hàng, mô tả).
 * @param {object} product - Sản phẩm cần hiển thị, lấy từ mảng data.
 */
function renderProductPage(product) {
  renderImages(product);
  renderInfo(product);
  renderDescription(product);
}

/**
 * Vẽ lưới ảnh gallery của sản phẩm vào khu vực bên trái trang.
 * @param {object} product - Sản phẩm đang xem, cần field galleryImages.
 */
function renderImages(product) {
  const html = product.galleryImages
    .map(
      (src) => `
        <img src="${src}" alt="${product.name}">
      `,
    )
    .join("");

  imagesContainer.innerHTML = html;
}

/**
 * Vẽ toàn bộ khối thông tin bên phải: tên, chọn màu, chọn size, giá, số lượng,
 * nút thêm giỏ hàng — và gắn sự kiện tương tác cho từng phần ngay sau khi vẽ.
 * @param {object} product - Sản phẩm đang xem.
 */
function renderInfo(product) {
  const price = getEffectivePrice(product);
  const priceToUSD = formatToUSD(price);

  const selectedColorName = product.color[0]?.name || "";

  const selectedSizeDescription = product.size[0] || "";

  const colorsHTML = product.color
    .map(
      (color) => `
      <button 
        class="color-button" 
        type="button"
        data-color="${color.name}"
        data-image="${color.image}">
        <img src="${color.swatch}" alt="${color.name}">
    </button>`,
    )
    .join("");

  const sizesHTML = product.size
    .map(
      (size) => `
      <button 
        class="size"
        type="button"
        data-size="${size}">${size}
       </button>`,
    )
    .join("");

  let priceHTML = null;
  if (product.discountPercent === null) {
    priceHTML = `<p class="price">${priceToUSD}</p>`;
  } else {
    priceHTML = `
        <p class="price original">${formatToUSD(product.price)}</p>
        <p class="price discount">${priceToUSD}</p> 
        <p class="discount-description">${product.description}</p>
    `;
  }

  infoContainer.innerHTML = `
    <div class="product-title">
        <h1>${product.name}</h1>
        <svg>
            <use href="./assets/icons/landing-page-icons.svg#heart-icon"></use>
        </svg>
    </div>

    <div class="product-colors">
        <div class="color-swatches">${colorsHTML}</div>
        <p class="color-label">Color: ${selectedColorName}</p>
    </div>

    <div class="product-sizes">
        <div class="size-buttons">${sizesHTML}</div>
        <p class="size-description">Size: <span class="gender">${product.gender}</span> <span class="selected-size">${selectedSizeDescription}</span></p>
    </div>

    <div class="product-price">${priceHTML}</div>

    <div class="product-quantity">
        <button type="button" class="quantity-button minus-button">-</button>
        <p class="quantity-value">1</p>
        <button type="button" class="quantity-button plus-button">+</button>
    </div>

    <button class="product-add">ADD TO CART</button>
    `;

  // --- Xử lý nút chọn màu ---
  const colorButtons = infoContainer.querySelectorAll(".color-button");
  const colorLabel = infoContainer.querySelector(".color-label");
  const productImage = imagesContainer.querySelector("img");

  if (colorButtons[0]) {
    colorButtons[0].classList.add("is-active");
  }

  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      colorButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      colorLabel.textContent = `Color: ${btn.dataset.color}`;
      productImage.src = btn.dataset.image;
    });
  });

  // --- Xử lý nút chọn size ---
  const sizeButtons = infoContainer.querySelectorAll(".size");
  const selectedSizeSpan = infoContainer.querySelector(".selected-size");

  if (sizeButtons[0]) {
    sizeButtons[0].classList.add("is-active");
  }

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedSizeSpan.textContent = btn.dataset.size;
    });
  });

  // --- Xử lý tăng/giảm số lượng ---
  const minusButton = infoContainer.querySelector(".minus-button");
  const plusButton = infoContainer.querySelector(".plus-button");
  const quantityValue = infoContainer.querySelector(".quantity-value");

  let currentQuantity = 1;
  function updateQuantityUI() {
    quantityValue.textContent = currentQuantity;
    minusButton.classList.toggle("disabled", currentQuantity <= 1);
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

  // --- Xử lý nút ADD TO CART ---
  const addButton = infoContainer.querySelector(".product-add");

  addButton.addEventListener("click", () => {
    const activeColorBtn = infoContainer.querySelector(
      ".color-button.is-active",
    );
    const activeSizeBtn = infoContainer.querySelector(".size.is-active");

    const newItem = {
      id: product.id,
      name: product.name,
      gender: product.gender,
      price: product.price,
      discountPercent: product.discountPercent,
      description: product.description,
      color: activeColorBtn?.dataset.color,
      image: activeColorBtn?.dataset.image,
      size: activeSizeBtn?.dataset.size,
      quantity: currentQuantity,
    };

    addToCart(newItem);
    updateCartBadge();
    displayProductPopup();
  });

  // TODO: icon trái tim (heart-icon) trong .product-title hiện CHƯA gắn sự kiện gì cả.
  // Theo luồng UNIQLO đã thống nhất: click vào -> mở popup chọn size muốn lưu wishlist
  // (không cần đăng nhập check ở đây vì đã ở trang chi tiết, hoặc vẫn check tùy quyết định) ->
  // gọi addToWishlist() cho từng size được tick. Đây là việc làm sau, không phải bây giờ.
}

/**
 * Vẽ phần mô tả sản phẩm (mã sản phẩm + danh sách feature) ở cuối trang.
 * @param {object} product - Sản phẩm đang xem, cần field features (mảng, có thể rỗng).
 */
function renderDescription(product) {
  const featuresHTML = product.features
    .map(
      (feature) => `
        <div class="feature-item">
            <img src="${feature.img}" alt="${product.name}">
            <p>${feature.text}</p>
        </div>
        `,
    )
    .join("");

  descriptionContainer.innerHTML = `
    <h2>Description</h2>
    <p class="product-code">Product ID: ${product.id}</p>
    
    <h3>Feature</h3>
    <div class="feature-grid">
        ${featuresHTML}
    </div>
  `;
}

// =============================== POPUP XÁC NHẬN "ĐÃ THÊM VÀO GIỎ HÀNG" ===============================
function displayProductPopup() {
  const quantityElement = infoContainer.querySelector(".quantity-value");
  const quantity = quantityElement.textContent;

  const currentCart = getCart();
  const totalItem = getCartItemCount(currentCart);
  const totalPrice = getCartTotal(currentCart);

  popupItem.textContent = `${quantity} Items added to your cart`;
  subtotalItem.textContent = `${totalItem} item(s)`;
  subtotalPrice.textContent = `${formatToUSD(totalPrice)}`;

  popupOverlay.classList.remove("hidden");
}

popupClose.addEventListener("click", () => {
  popupOverlay.classList.add("hidden");
});

viewCart.addEventListener("click", () => {
  window.location.href = "./shopping-cart.html";
});

continueShopping.addEventListener("click", () => {
  popupOverlay.classList.add("hidden");
});
