/*
  Page hiển thị toàn bộ sản phẩm của Casual Pants.
  Lấy sản phẩm từ data sau đó render toàn bộ sản phẩm theo từng category,
  và điều hướng sang trang chi tiết sản phẩm khi người dùng click vào card sản phẩm.
*/

// ============================================= IMPORTS =============================================
import { fetchProducts } from "./data/products.js";
import { renderProductCard } from "./ui/render-product-card.js";

// =========================================== DOM QUERIES ===========================================
const mainContent = document.querySelector(".main-content");
const allProductsContainer = mainContent.querySelector(".all-products");

// ====================================== CASUAL PANTS CATEGORY ======================================
const categories = ["cotton", "flannel", "knit", "sweat", "others"];

// ======================================= TẢI DỮ LIỆU SẢN PHẨM =======================================
const loadingElement = document.createElement("div");

async function loadingProduct() {
  try {
    loadingElement.innerHTML =
      '<p class="loading"><span class="icon"></span> Loading product ...</p>';
    mainContent.appendChild(loadingElement);

    const products = await fetchProducts();

    // Nếu ferchProducts trả về thành công
    // thì ta sẽ xóa thông báo loading đi và hiển thị banner cùng các sản phẩm
    loadingElement.remove();
    allProductsContainer.classList.remove("hidden");

    categories.forEach((category) => {
      const grid = allProductsContainer.querySelector(
        `.${category}.product-grid`,
      );
      const productsFiltered = products.filter((p) => p.category === category);
      productsFiltered.forEach((p) => grid.appendChild(renderProductCard(p)));
    });
  } catch (error) {
    console.error(error);
    loadingElement.innerHTML = `<p class="loading-error">${error.message}</p>`;
  }
}

loadingProduct();
