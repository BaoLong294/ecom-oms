// Generator variable for id
let globalId = 1;

// Generator function for image color swatches array
const createColorSwatches = (swatchImages) => {
  return (
    swatchImages
      ?.map(
        (imgPath) => `
        <img class="color-swatch-img" src="${imgPath}" alt="Color Swatch">
    `
      )
      .join("") || ""
  );
};

// Cotton

const cottonGrid = document.querySelector(".cotton.product-grid");

const cottonProducts = [
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Cotton Relaxed Ankle Pants | Denim",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/cotton/ankle-denim.avif",
    colorSwatches: [
      "./images/color-swatches/cotton/08-dark-gray.avif",
      "./images/color-swatches/cotton/65-blue.avif",
      "./images/color-swatches/cotton/67-blue.avif",
    ],
  },
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Cotton Relaxed Ankle Pants",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/cotton/ankle-pants.avif",
    colorSwatches: [
      "./images/color-swatches/cotton/09-black.avif",
      "./images/color-swatches/cotton/30-natural.avif",
      "./images/color-swatches/cotton/31-beige.avif",
      "./images/color-swatches/cotton/57-olive.avif",
    ],
  },
  {
    id: globalId++,
    gender: "UNISEX",
    size: "XS-XXL",
    name: "Jersey Easy Cargo Pants",
    price: 49.9,
    discount: 29.9,
    description: "Sale",
    img: "./images/all-products/women/casual-pants/cotton/cargo-pants.avif",
    colorSwatches: [
      "./images/color-swatches/cotton/01-off-white.avif",
      "./images/color-swatches/cotton/09-black.avif",
      "./images/color-swatches/cotton/56-olive.avif",
      "./images/color-swatches/cotton/69-navy.avif",
    ],
  },
];

cottonProducts.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const originalPrice = product.price.toFixed(2);
  const discountedPrice = product.discount ? product.discount.toFixed(2) : null;
  const colorSwatches = createColorSwatches(product.colorSwatches);

  let priceHTML;
  if (product.discount) {
    priceHTML = `
      <p class="price-discount">$${discountedPrice}</p>
      <p class="discount-description">${product.description}</p>
    `;
  } else {
    priceHTML = `<p class="price-original">$${originalPrice}</p>`;
  }

  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">

    <div class="product-color-options">
        <div class="color-swatches-group">
            ${colorSwatches}
        </div>
        <svg>
            <use href="./assets/icons/landing-page-icons.svg#heart-icon"></use>
        </svg>
    </div>

    <div class="product-details">
        <div class="product-meta">
            <p class="product-gender">${product.gender}</p>
            <p class="product-size">${product.size}</p>
        </div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${priceHTML}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  cottonGrid.appendChild(card);
});

// Flannel

const flannelGrid = document.querySelector(".flannel.product-grid");

const flannelProducts = [
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Flannel Pants | Gingham",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/flannel/gingham.avif",
    colorSwatches: [
      "./images/color-swatches/flannel/66-blue.avif",
      "./images/color-swatches/flannel/69-navy.avif",
    ],
  },
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Flannel Pants | Check",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/flannel/check.avif",
    colorSwatches: [
      "./images/color-swatches/flannel/37-brown.avif",
      "./images/color-swatches/flannel/38-dark-brown.avif",
    ],
  },
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Flannel Pants | Solid",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/flannel/solid.avif",
    colorSwatches: [
      "./images/color-swatches/flannel/02-light-gray.avif",
      "./images/color-swatches/flannel/08-dark-gray.avif",
      "./images/color-swatches/flannel/09-black.avif",
    ],
  },
];

flannelProducts.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const originalPrice = product.price.toFixed(2);
  const discountedPrice = product.discount ? product.discount.toFixed(2) : null;
  const colorSwatches = createColorSwatches(product.colorSwatches);

  let priceHTML;
  if (product.discount) {
    priceHTML = `
      <p class="price-discount">$${discountedPrice}</p>
      <p class="discount-description">${product.description}</p>
    `;
  } else {
    priceHTML = `<p class="price-original">$${originalPrice}</p>`;
  }

  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">

    <div class="product-color-options">
        <div class="color-swatches-group">
            ${colorSwatches}
        </div>
        <svg>
            <use href="./assets/icons/landing-page-icons.svg#heart-icon"></use>
        </svg>
    </div>

    <div class="product-details">
        <div class="product-meta">
            <p class="product-gender">${product.gender}</p>
            <p class="product-size">${product.size}</p>
        </div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${priceHTML}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  flannelGrid.appendChild(card);
});

// Knit

const knitGrid = document.querySelector(".knit.product-grid");

const knitProducts = [
  {
    id: globalId++,
    gender: "WOMEN",
    size: "S-XL",
    name: "Washable Knit Cable Pants",
    price: 59.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/knit/cable.avif",
    colorSwatches: [
      "./images/color-swatches/knit-cable/01-off-white.avif",
      "./images/color-swatches/knit-cable/06-gray.avif",
      "./images/color-swatches/knit-cable/33-khaki.avif",
      "./images/color-swatches/knit-cable/68-blue.avif",
    ],
  },
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Washable Knit Ribbed Pants",
    price: 59.9,
    discount: 29.9,
    description: "Online + App-Only Offer",
    img: "./images/all-products/women/casual-pants/knit/ribbed.avif",
    colorSwatches: [
      "./images/color-swatches/knit-ribbed/07-gray.avif",
      "./images/color-swatches/knit-ribbed/08-dark-gray.avif",
      "./images/color-swatches/knit-ribbed/09-black.avif",
      "./images/color-swatches/knit-ribbed/19-wine.avif",
      "./images/color-swatches/knit-ribbed/30-natural.avif",
      "./images/color-swatches/knit-ribbed/33-khaki.avif",
      "./images/color-swatches/knit-ribbed/35-brown.avif",
    ],
  },
];

knitProducts.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const originalPrice = product.price.toFixed(2);
  const discountedPrice = product.discount ? product.discount.toFixed(2) : null;
  const colorSwatches = createColorSwatches(product.colorSwatches);

  let priceHTML;
  if (product.discount) {
    priceHTML = `
      <p class="price-discount">$${discountedPrice}</p>
      <p class="discount-description">${product.description}</p>
    `;
  } else {
    priceHTML = `<p class="price-original">$${originalPrice}</p>`;
  }

  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">

    <div class="product-color-options">
        <div class="color-swatches-group">
            ${colorSwatches}
        </div>
        <svg>
            <use href="./assets/icons/landing-page-icons.svg#heart-icon"></use>
        </svg>
    </div>

    <div class="product-details">
        <div class="product-meta">
            <p class="product-gender">${product.gender}</p>
            <p class="product-size">${product.size}</p>
        </div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${priceHTML}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  knitGrid.appendChild(card);
});

// Sweat

const sweatGrid = document.querySelector(".sweat.product-grid");

const sweatProducts = [
  {
    id: globalId++,
    gender: "WOMEN",
    size: "S-XXL",
    name: "Dry Sweat Curve Pants",
    price: 29.9,
    discount: 14.9,
    description: "Sale",
    img: "./images/all-products/women/casual-pants/sweat/curve-pants.avif",
    colorSwatches: [
      "./images/color-swatches/sweat/09-black.avif",
      "./images/color-swatches/sweat/30-natural.avif",
      "./images/color-swatches/sweat/36-brown.avif",
      "./images/color-swatches/sweat/58-dark-green.avif",
      "./images/color-swatches/sweat/69-navy.avif",
    ],
  },
];

sweatProducts.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const originalPrice = product.price.toFixed(2);
  const discountedPrice = product.discount ? product.discount.toFixed(2) : null;
  const colorSwatches = createColorSwatches(product.colorSwatches);

  let priceHTML;
  if (product.discount) {
    priceHTML = `
      <p class="price-discount">$${discountedPrice}</p>
      <p class="discount-description">${product.description}</p>
    `;
  } else {
    priceHTML = `<p class="price-original">$${originalPrice}</p>`;
  }

  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">

    <div class="product-color-options">
        <div class="color-swatches-group">
            ${colorSwatches}
        </div>
        <svg>
            <use href="./assets/icons/landing-page-icons.svg#heart-icon"></use>
        </svg>
    </div>

    <div class="product-details">
        <div class="product-meta">
            <p class="product-gender">${product.gender}</p>
            <p class="product-size">${product.size}</p>
        </div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${priceHTML}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  sweatGrid.appendChild(card);
});

// Others

const othersGrid = document.querySelector(".others.product-grid");

const othersProducts = [
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Linen Blend Easy Pants | Striped | Short",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/others/striped.avif",
    colorSwatches: [
      "./images/color-swatches/linen-blend-short/55-green.avif",
      "./images/color-swatches/linen-blend-short/61-blue.avif",
    ],
  },
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Linen Blend Easy Pants | Striped",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/others/blend-easy.avif",
    colorSwatches: [
      "./images/color-swatches/linen-blend/01-off-white.avif",
      "./images/color-swatches/linen-blend/56-olive.avif",
      "./images/color-swatches/linen-blend/69-navy.avif",
    ],
  },
  {
    id: globalId++,
    gender: "UNISEX",
    size: "XS-XXL",
    name: "Culottes",
    price: 49.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/others/culottes.avif",
    colorSwatches: [
      "./images/color-swatches/culottes/08-dark-gray.avif",
      "./images/color-swatches/culottes/09-black.avif",
      "./images/color-swatches/culottes/38-dark-brown.avif",
    ],
  },
  {
    id: globalId++,
    gender: "WOMEN",
    size: "XS-XXL",
    name: "Nylon Culottes",
    price: 49.9,
    discount: 39.9,
    description: "Sale",
    img: "./images/all-products/women/casual-pants/others/nylon-culottes.avif",
    colorSwatches: [
      "./images/color-swatches/nylon-culottes/09-black.avif",
      "./images/color-swatches/nylon-culottes/38-dark-brown.avif",
      "./images/color-swatches/nylon-culottes/56-olive.avif",
    ],
  },
  {
    id: globalId++,
    gender: "UNISEX",
    size: "XS-XXL",
    name: "Cotton Relaxed Ankle Pants | Denim",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/others/relaxed.avif",
    colorSwatches: [
      "./images/color-swatches/cotton-relaxed/07-gray.avif",
      "./images/color-swatches/cotton-relaxed/63-blue.avif",
      "./images/color-swatches/cotton-relaxed/68-blue.avif",
    ],
  },
  {
    id: globalId++,
    gender: "UNISEX",
    size: "S-M",
    name: "Corduroy Easy Ankle Pants",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/others/corduroy.avif",
    colorSwatches: [
      "./images/color-swatches/corduroy/01-off-white.avif",
      "./images/color-swatches/corduroy/09-black.avif",
      "./images/color-swatches/corduroy/35-brown.avif",
      "./images/color-swatches/corduroy/56-olive.avif",
      "./images/color-swatches/corduroy/68-blue.avif",
    ],
  },

  {
    id: globalId++,
    gender: "UNISEX",
    size: "XL",
    name: "Knitted Fleece Easy Ankle Pants",
    price: 39.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/others/fleece-easy.avif",
    colorSwatches: [
      "./images/color-swatches/knitted-fleece/09-black.avif",
      "./images/color-swatches/knitted-fleece/04-gray.avif",
      "./images/color-swatches/knitted-fleece/68-blue.avif",
    ],
  },
  {
    id: globalId++,
    gender: "UNISEX",
    size: "XS-XXL",
    name: "Geared Pants",
    price: 49.9,
    discount: null,
    description: null,
    img: "./images/all-products/women/casual-pants/others/geared.avif",
    colorSwatches: [
      "./images/color-swatches/geared-pants/09-black.avif",
      "./images/color-swatches/geared-pants/31-beige.avif",
      "./images/color-swatches/geared-pants/38-dark-brown.avif",
    ],
  },
];

othersProducts.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const originalPrice = product.price.toFixed(2);
  const discountedPrice = product.discount ? product.discount.toFixed(2) : null;
  const colorSwatches = createColorSwatches(product.colorSwatches);

  let priceHTML;
  if (product.discount) {
    priceHTML = `
      <p class="price-discount">$${discountedPrice}</p>
      <p class="discount-description">${product.description}</p>
    `;
  } else {
    priceHTML = `<p class="price-original">$${originalPrice}</p>`;
  }

  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">

    <div class="product-color-options">
        <div class="color-swatches-group">
            ${colorSwatches}
        </div>
        <svg>
            <use href="./assets/icons/landing-page-icons.svg#heart-icon"></use>
        </svg>
    </div>

    <div class="product-details">
        <div class="product-meta">
            <p class="product-gender">${product.gender}</p>
            <p class="product-size">${product.size}</p>
        </div>
        <p class="product-name">${product.name}</p>
        <p class="product-price">${priceHTML}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  othersGrid.appendChild(card);
});
