// Cần tái sử dụng việc tạo ra các thẻ sản phẩm để hiển thị trên trang web
// nên tạo ra module dành riêng cho việc này để các module khác gọi mỗi khi cần tạo thẻ hiển thị lên UI

// Ta cần hiển thị giá của sản phẩm trong card sản phẩm
import { formatToUSD, getEffectivePrice } from "../utils/price.js";
import { openWishlistPopup } from "./render-wishlist-popup.js";

/**
 * Ta sẽ tạo ra một phần tử HTML đã dựng sẵn một sản phẩm,
 * chứa ảnh, swatches màu, gender, size, giá và gắn sẵn sự kiện click
 * để khi người dùng click vào card sản phẩm thì sẽ điều hướng sang product-details
 * @param {object} product - đối tượng sản phẩm cần hiển thị lên UI
 * @returns {HTMLElement} đối tượng HTML đã được dựng sẵn để nơi gọi hàm appendChild()
 */
export function renderProductCard(product) {
  // Hiển thị hình ảnh sản phẩm là ảnh sản phẩm có màu đầu tiên trong mảng color
  const productImg = product.color[0].image;

  // Hiển thị tất cả các vòng tròn màu của sản phẩm
  const colorSwatches = product.color
    ?.map(
      (c) =>
        `<img class="color-swatch-img" src="${c.swatch}" alt="Color Swatch"></img>`,
    )
    .join("");
  const colorSwatchesHTML = colorSwatches || "";

  // Hiển thị size của sản phẩm từ nhỏ nhất đến lớn nhất
  const sizeHTML = `${product.size[0]}-${product.size.at(-1)}`;

  // Hiển thị giá hiện tại của sản phẩm
  const price = getEffectivePrice(product);
  const priceToUSD = formatToUSD(price);
  let priceHTML = null;

  if (product.discountPercent === null) {
    priceHTML = `<p class="price">${priceToUSD}</p>`;
  } else {
    priceHTML = `
         <p class="price discount">${priceToUSD}</p> 
         <p class="discount-description">${product.description}</p>
     `;
  }

  // Chuyển tất cả thông tin của sản phẩm thành HTML để hiển thị lên UI
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${productImg}" alt="${product.name}">

    <div class="product-color-options">
        <div class="color-swatches-group">
            ${colorSwatchesHTML}
        </div>
        <svg>
            <use href="./assets/icons/landing-page-icons.svg#heart-icon"></use>
        </svg>
    </div>

    <div class="product-details">
        <div class="product-meta">
            <p class="product-gender">${product.gender}</p>
            <p class="product-size">${sizeHTML}</p>
        </div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${priceHTML}</p>
    </div>
  `;

  // Gắn sự kiện riêng cho icon tim, chặn nổi bọt lên card để tránh
  // vừa mở popup wishlist vừa bị điều hướng sang trang chi tiết sản phẩm.
  const heartIcon = card.querySelector(".product-color-options svg");
  heartIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    openWishlistPopup(product);
  });

  // Sau khi đã có card sản phẩm ta sẽ gắn eventListener
  // để khi người dùng click vào sản phẩm sẽ điều hướng đến trang chi tiết sản phẩm
  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  return card;
}
