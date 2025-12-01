const emptyState = document.querySelector(".cart-empty");
const filledState = document.querySelector(".cart-filled");
const itemsContainer = document.querySelector(".cart-items");
const summaryContainer = document.querySelector(".cart-summary");

const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

if (currentCart.length === 0) {
  emptyState.style.display = "block";
  filledState.style.display = "none";
} else {
  emptyState.style.display = "none";
  filledState.style.display = "grid";

  renderCartItems(currentCart);
  renderCartSummary(currentCart);
}

// RENDER CART ITEMS
function renderCartItems(cart) {
  cart.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("item-card");

    const originalPrice = item.price.toFixed(2);
    const discountedPrice = item.discount ? item.discount.toFixed(2) : null;

    let priceHTML;
    if (item.discount) {
      priceHTML = `
      <p class="price-discount">$${discountedPrice}</p>
      <p class="discount-description">${item.description}</p>
    `;
    } else {
      priceHTML = `<p class="price-original">$${originalPrice}</p>`;
    }

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
      
        <div class="item-subtotal">
            <p>SUBTOTAL: <span class="item-subtotal-price">$${(
              item.quantity * item.price
            ).toFixed(2)}</span></p>
        </div>
      </div>
    `;

    // HANDLE REMOVE BUTTON
    const removeButton = card.querySelector(".item-remove");
    removeButton.addEventListener("click", () => {
      currentCart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(currentCart));

      itemsContainer.innerHTML = "";
      if (currentCart.length === 0) {
        emptyState.style.display = "block";
        filledState.style.display = "none";
      } else {
        renderCartItems(currentCart);
        renderCartSummary(currentCart);
      }
    });

    // HANDLE HANDLE INCREASE AND DECREASE QUANTITY VALUE
    const minusButton = card.querySelector(".minus-button");
    const plusButton = card.querySelector(".plus-button");
    const quantityValue = card.querySelector(".quantity-value");
    const subtotalPrice = card.querySelector(".item-subtotal-price");

    let currentQuantity = Number(item.quantity);
    function updateQuantityUI() {
      quantityValue.textContent = currentQuantity;

      if (currentQuantity <= 1) {
        minusButton.classList.add("disabled");
      } else {
        minusButton.classList.remove("disabled");
      }

      currentCart[index].quantity = Number(currentQuantity);
      localStorage.setItem("cart", JSON.stringify(currentCart));

      const newSubtotal = (currentQuantity * item.price).toFixed(2);
      subtotalPrice.textContent = `$${newSubtotal}`;

      renderCartSummary(currentCart);
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

    itemsContainer.appendChild(card);
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
        <p class="total-price"</p>
    </div>

    <button class="checkout-button">CHECKOUT</button>
    <button class="continue-button">CONTINUE SHOPPING</button>
    `;

  // CALCULATE ORDER SUMMARY
  const summaryItems = document.querySelector(".summary-items");
  const quantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  summaryItems.textContent = `${quantity} ITEM(S)`;

  // CALCULATE ORDER TOTAL
  const totalPrice = document.querySelector(".total-price");
  const price = cart.reduce((total, item) => {
    const itemPrice = item.quantity * item.price;
    return total + itemPrice;
  }, 0);
  totalPrice.textContent = `$${price.toFixed(2)}`;

  //   HANDLE CONTINUE SHOPPING BUTTON
  const continueButton = document.querySelector(".continue-button");
  continueButton.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}
