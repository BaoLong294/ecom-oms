const imagesContainer = document.querySelector(".product-images");
const infoContainer = document.querySelector(".product-info");
const descriptionContainer = document.querySelector(".product-description");

// Get Id from URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// Product details
const products = [
  {
    id: 1,
    name: "Cotton Relaxed Ankle Pants | Denim",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,

    galleryImages: [
      "./images/product-details/cotton-relaxed-denim/08-dark-gray.avif",
      "./images/product-details/cotton-relaxed-denim/detail-1.avif",
      "./images/product-details/cotton-relaxed-denim/detail-2.avif",
      "./images/product-details/cotton-relaxed-denim/detail-3.avif",
      "./images/product-details/cotton-relaxed-denim/detail-4.avif",
    ],

    color: [
      {
        name: "08 DARK GRAY",
        swatch: "./images/color-swatches/cotton/08-dark-gray.avif",
        image:
          "./images/product-details/cotton-relaxed-denim/08-dark-gray.avif",
      },
      {
        name: "65 BLUE",
        swatch: "./images/color-swatches/cotton/65-blue.avif",
        image: "./images/product-details/cotton-relaxed-denim/65-blue.avif",
      },
      {
        name: "67 BLUE",
        swatch: "./images/color-swatches/cotton/67-blue.avif",
        image: "./images/product-details/cotton-relaxed-denim/67-blue.avif",
      },
    ],

    size: ["XS", "S", "M", "L", "XL", "XXL"],

    features: [
      {
        img: "./images/product-details/cotton-relaxed-denim/feature-1.avif",
        text: "Made from soft and comfortable 100% cotton.",
      },
      {
        img: "./images/product-details/cotton-relaxed-denim/feature-2.avif",
        text: "Elastic waistband makes for easy outfit changes. Versatile relaxed silhouette.",
      },
      {
        img: "./images/product-details/cotton-relaxed-denim/feature-3.avif",
        text: "Designed to look like jeans with a classic denim color and a comfortable fit.",
      },
    ],
  },
];

// Find current product
const currentProduct = products.find((item) => item.id === productId);

if (!currentProduct) {
  imagesContainer.innerHTML = "<p>Product not found.</p>";
  infoContainer.innerHTML = "";
  descriptionContainer.innerHTML = "";
} else {
  renderProductPage(currentProduct);
}

// Render functions
function renderProductPage(product) {
  renderImages(product);
  renderInfo(product);
  renderDescription(product);
}

function renderImages(product) {
  const html = product.galleryImages
    .map(
      (src) => `
        <img src="${src}" alt="${product.name}">
      `
    )
    .join("");

  imagesContainer.innerHTML = html;
}

function renderInfo(product) {
  const originalPrice = product.price.toFixed(2);
  const discountedPrice = product.discount ? product.discount.toFixed(2) : null;
  const selectedColorName = product.color[0]?.name || "";
  const selectedSizeDescription = product.size[0] || "";

  const colorsHTML = product.color
    .map(
      (color, index) => `
      <button 
        class="color-button" 
        type="button"
        data-color="${color.name}"
        data-image="${color.image}">
        <img src="${color.swatch}" alt="${color.name}">
    </button>`
    )
    .join("");

  const sizesHTML = product.size
    .map(
      (size, index) => `
      <button 
        class="size"
        type="button"
        data-size="${size}">${size}
       </button>`
    )
    .join("");

  let priceHTML;
  if (product.discount) {
    priceHTML = `
        <p class="price original">$${originalPrice}</p>
        <p class="price discount">$${discountedPrice}</p> 
        <p class="discount-description">${product.description}</p>
    `;
  } else {
    priceHTML = `<p class="price">$${originalPrice}</p>`;
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
        <p class="size-description">Size: <span class="gender">${product.gender}</span> ${selectedSizeDescription}</p>
    </div>

    <div class="product-price">${priceHTML}</div>

    <div class="product-quantity">
        <button type="button" class="quantity-button minus-button">-</button>
        <p class="quantity-value">1</p>
        <button type="button" class="quantity-button plus-button">+</button>
    </div>

    <button class="product-add">ADD TO CART</button>
    `;

  //   Handle all color buttons
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

      const name = btn.dataset.color;
      colorLabel.textContent = `Color: ${name}`;

      const image = btn.dataset.image;
      productImage.src = image;
    });
  });

  // Handle all size buttons
  const sizeButtons = infoContainer.querySelectorAll(".size");
  const sizeDescription = infoContainer.querySelector(".size-description");

  if (sizeButtons[0]) {
    sizeButtons[0].classList.add("is-active");
  }

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("is-active"));

      btn.classList.add("is-active");

      const description = btn.dataset.size;
      sizeDescription.textContent = `Size: ${product.gender} ${description}`;
    });
  });

  // HANDLE INCREASE AND DECREASE QUANTITY VALUE
  const minusButton = infoContainer.querySelector(".minus-button");
  const plusButton = infoContainer.querySelector(".plus-button");
  const quantityValue = infoContainer.querySelector(".quantity-value");

  let currentQuantity = 1;
  function updateQuantityUI() {
    quantityValue.textContent = currentQuantity;

    if (currentQuantity <= 1) {
      minusButton.classList.add("disabled");
    } else {
      minusButton.classList.remove("disabled");
    }
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

  // HANDLE ADD TO CART BUTTON
  const addButton = infoContainer.querySelector(".product-add");

  addButton.addEventListener("click", () => {
    const activeColorBtn = infoContainer.querySelector(
      ".color-button.is-active"
    );
    const colorName = activeColorBtn?.dataset.color;
    const colorImage = activeColorBtn?.dataset.image;

    const activeSizeBtn = infoContainer.querySelector(".size.is-active");
    const sizeValue = activeSizeBtn?.dataset.size;

    const quantity = currentQuantity;

    const newItem = {
      id: product.id,
      name: product.name,
      gender: product.gender,
      price: product.price,
      discount: product.discount,
      description: product.description,
      color: colorName,
      image: colorImage,
      size: sizeValue,
      quantity: quantity,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.color === newItem.color &&
        item.size === newItem.size
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += newItem.quantity;
    } else {
      cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  });
}

function renderDescription(product) {
  const featuresHTML = product.features
    .map(
      (feature) => `
        <div class="feature-item">
            <img src="${feature.img}" alt="${product.name}">
            <p>${feature.text}</p>
        </div>
        `
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
