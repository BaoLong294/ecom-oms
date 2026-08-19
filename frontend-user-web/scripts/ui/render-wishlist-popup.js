// Module này được sử dụng để hiển thị popup mỗi khi
// người dùng click vào icon trái tim để thêm sản phẩm vào danh sách ưu thích.

// ============================================= IMPORTS =============================================
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
} from "../wishlist/wishlist.js";
import { HEART_EMPTY, HEART_FILLED } from "./wishlist-icons.js";
import { trapFocusOutside, releaseFocusTrap } from "./focus-trap.js";

// ============================================== STATE ================================================
// Ta sẽ tạo ra popup 1 lần duy nhất trong body HTML,
// sau đó mỗi lần được gọi sẽ hiển thị popup chứa nội dung dành riêng cho sản phẩm.
let popupElement = null;

// ========================================= RENDER FUNCTIONS =========================================

/**
 * Ta sẽ tạo popup và thêm khung HTML tĩnh vào body trong lần đầu tiên người dùng click vào icon trái tim,
 * ở những lần sau đó ta không cần tạo lại mà chỉ cần điền thông tin sản phẩm vào bên trong khung HTML đã được tạo.
 * @returns {HTMLElement} là phần tử DOM div popup
 */
function getOrCreatePopup() {
  if (popupElement === null) {
    popupElement = document.createElement("div");
    popupElement.className = "wishlist-popup-overlay hidden";

    popupElement.innerHTML = `
        <div class="wishlist-popup">
            <div class="wishlist-popup-header">
                <p>Add to wishlist</p>
                <button class="wishlist-popup-close">&times;</button>
            </div>
            <div class="wishlist-popup-top-section">
                <img src="" alt="" class="wishlist-popup-img">
                <p class="wishlist-popup-color-label"></p>
            </div>
            <div class="wishlist-popup-color-swatches"></div>
            <div class="wishlist-popup-sizes"></div>
            <button class="wishlist-popup-close-button">CLOSE</button>
        </div>
    `;

    document.body.appendChild(popupElement);

    setupPopupClose();
  }

  return popupElement;
}

/**
 * Ta cần render và hiển thị thông tin của sản phẩm trên khung popup đã có sẵn HTML tĩnh.
 * @param {object} product - đối tượng sản phẩm để ta sử dụng các thuộc tính bên trong
 */
function renderWishlistPopup(product) {
  const popupImage = popupElement.querySelector(".wishlist-popup-img");
  const popupColorLabel = popupElement.querySelector(
    ".wishlist-popup-color-label",
  );
  const popupColorSwatches = popupElement.querySelector(
    ".wishlist-popup-color-swatches",
  );
  const popupSizeList = popupElement.querySelector(".wishlist-popup-sizes");

  popupImage.src = `${product.color[0].image}`;
  popupImage.alt = `${product.color[0].name}`;

  popupColorLabel.textContent = `Color: ${product.color[0].name}`;

  const colorsHTML = product.color
    .map(
      (color, index) => `
    <button
        class="color-button ${index === 0 ? "is-active" : ""}" 
        type="button" 
        data-color="${color.name}" 
        data-image="${color.image}">
        <img src="${color.swatch}" alt="${color.name}">
    </button>`,
    )
    .join("");

  popupColorSwatches.innerHTML = `${colorsHTML}`;

  const sizesHTML = product.size
    .map(
      (size) => `
    <div class="product-size">
      <p>${size}</p>
      <button type="button" class="heart-button" data-size="${size}">
        <svg class="${isInWishlist(product.id, product.color[0].name, size) ? "is-active" : ""}">
          <use href="${isInWishlist(product.id, product.color[0].name, size) ? HEART_FILLED : HEART_EMPTY}"></use>
        </svg>
      </button>
    </div>
  `,
    )
    .join("");

  popupSizeList.innerHTML = `${sizesHTML}`;

  setupColorSwatches(product);
  setupSizeHearts(product);
}

// ======================================= EXPORTED ENTRY POINT =======================================

/**
 * Ta cần hiển thị popup chứa thông tin về tất cả các màu và size của sản phẩm
 * mỗi khi người dùng click vào một sản phẩm cụ thể để người dùng chọn size và màu sau đó thêm vào wishlist.
 * @param {object} product - đối tượng sản phẩm khi người dùng click vào icon trái tim
 */
export function openWishlistPopup(product) {
  getOrCreatePopup();
  renderWishlistPopup(product);
  requestAnimationFrame(() => {
    popupElement.classList.remove("hidden");
    trapFocusOutside(popupElement);
  });
}

// ========================================= HELPER FUNCTIONS =========================================

/**
 * Mỗi khi người dùng click vào nút màu sản phẩm trong wishlist popup,
 * hình ảnh và label của color sẽ tự động thay đổi theo đúng màu sản phẩm đó,
 * và icon hình trái tim của mỗi size cũng sẽ được reset lại để đảm bảo UX.
 */
function setupColorSwatches(product) {
  const colorButtons = popupElement.querySelectorAll(".color-button");
  const colorImage = popupElement.querySelector(".wishlist-popup-img");
  const colorLabel = popupElement.querySelector(".wishlist-popup-color-label");
  const heartButtons = popupElement.querySelectorAll(
    ".heart-button[data-size]",
  );

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;

      colorButtons.forEach((b) => {
        b.classList.remove("is-active");
      });

      heartButtons.forEach((heartBtn) => {
        const icon = heartBtn.querySelector("svg");
        const useTag = icon.querySelector("use");

        if (
          isInWishlist(product.id, button.dataset.color, heartBtn.dataset.size)
        ) {
          useTag.setAttribute("href", HEART_FILLED);
          icon.classList.add("is-active");
        } else {
          useTag.setAttribute("href", HEART_EMPTY);
          icon.classList.remove("is-active");
        }
      });

      button.classList.add("is-active");
      colorImage.src = button.dataset.image;
      colorImage.alt = button.dataset.color;
      colorLabel.textContent = `Color: ${button.dataset.color}`;
    });
  });
}

/**
 * Mỗi khi người dùng click vào icon trái tim để chọn size trong wishlist popup,
 * sản phẩm đó sẽ được thêm vào localStorage để có thể hiển thị trong trang wishlist.
 * Còn nếu người dùng click vào icon trái tim đã được chọn trước đó,
 * thì sản phẩm đó sẽ được xóa khỏi localStorage và không hiển thị trong trang wishlist.
 * @param {object} product - đối tượng sản phẩm để lấy các thuộc tính của sản phẩm
 */
function setupSizeHearts(product) {
  const heartButtons = popupElement.querySelectorAll(
    ".heart-button[data-size]",
  );

  heartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("svg");
      const isNowActive = icon.classList.toggle("is-active");
      const useTag = icon.querySelector("use");

      useTag.setAttribute("href", isNowActive ? HEART_FILLED : HEART_EMPTY);

      const activeColorBtn = popupElement.querySelector(
        ".color-button.is-active",
      );

      if (isNowActive) {
        const newItem = {
          id: product.id,
          name: product.name,
          gender: product.gender,
          price: product.price,
          discountPercent: product.discountPercent,
          description: product.description,
          color: activeColorBtn?.dataset.color,
          image: activeColorBtn?.dataset.image,
          size: button.dataset.size,
        };

        addToWishlist(newItem);
      } else {
        const currentWishlist = getWishlist();
        const itemIndex = currentWishlist.findIndex(
          (item) =>
            item.id === product.id &&
            item.color === activeColorBtn?.dataset.color &&
            item.size === button.dataset.size,
        );

        removeFromWishlist(itemIndex);
      }
    });
  });
}

/**
 * Người dùng có thể đóng wishlist popup bằng nút "X" hoặc "CLOSE",
 * và để tránh tạo lại sự kiện nhiều lần mỗi khi người dùng mở wishlist popup
 * thì ta sẽ gọi hàm này bên trong logic tạo popup để sự kiện chỉ tạo 1 lần duy nhất.
 */
function setupPopupClose() {
  const closePopupX = popupElement.querySelector(".wishlist-popup-close");
  const closePopupButton = popupElement.querySelector(
    ".wishlist-popup-close-button",
  );

  closePopupX.addEventListener("click", () => {
    popupElement.classList.add("hidden");
    releaseFocusTrap();
  });

  closePopupButton.addEventListener("click", () => {
    popupElement.classList.add("hidden");
    releaseFocusTrap();
  });
}
