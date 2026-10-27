import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartProvider from './CartProvider.jsx';
import { useCart } from './CartContext.js';

const CART_KEY = 'cart';

// Component chỉ dùng trong test: hiển thị state của giỏ thành chữ
// và có 3 nút gọi 3 hàm của context với giá trị cố định.
function CartStatus() {
  const { items, itemCount, addItem, changeQuantity, removeItem } = useCart();
  const itemsText =
    items.map((item) => `${item.variantId}x${item.quantity}`).join(', ') ||
    'none';

  return (
    <div>
      <p>{`Count: ${itemCount}`}</p>
      <p>{`Items: ${itemsText}`}</p>
      <button type="button" onClick={() => addItem(12, 2)}>
        Add
      </button>
      <button type="button" onClick={() => changeQuantity(5, 4)}>
        Change
      </button>
      <button type="button" onClick={() => removeItem(5)}>
        Remove
      </button>
    </div>
  );
}

function renderCart() {
  render(
    <CartProvider>
      <CartStatus />
    </CartProvider>
  );
}

function storeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function readStoredCart() {
  return JSON.parse(localStorage.getItem(CART_KEY));
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('initial state', () => {
  it('starts with an empty cart when storage is empty', () => {
    renderCart();

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Items: none')).toBeInTheDocument();
  });

  it('restores the cart from storage', () => {
    storeCart([
      { variantId: 5, quantity: 1 },
      { variantId: 7, quantity: 3 },
    ]);
    renderCart();

    expect(screen.getByText('Items: 5x1, 7x3')).toBeInTheDocument();
  });

  it('starts with an empty cart when storage is corrupted', () => {
    localStorage.setItem(CART_KEY, 'not json');
    renderCart();

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Items: none')).toBeInTheDocument();
  });

  it('counts the total quantity, not the number of items', () => {
    storeCart([
      { variantId: 5, quantity: 1 },
      { variantId: 7, quantity: 3 },
    ]);
    renderCart();

    expect(screen.getByText('Count: 4')).toBeInTheDocument();
  });
});

describe('cart actions', () => {
  it('adds an item and saves it to storage', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('Items: 12x2')).toBeInTheDocument();
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
    expect(readStoredCart()).toEqual([{ variantId: 12, quantity: 2 }]);
  });

  it('changes the quantity and saves it to storage', async () => {
    const user = userEvent.setup();
    storeCart([
      { variantId: 5, quantity: 1 },
      { variantId: 7, quantity: 3 },
    ]);
    renderCart();
    expect(screen.getByText('Items: 5x1, 7x3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Change' }));

    expect(screen.getByText('Items: 5x4, 7x3')).toBeInTheDocument();
    expect(readStoredCart()).toEqual([
      { variantId: 5, quantity: 4 },
      { variantId: 7, quantity: 3 },
    ]);
  });

  it('removes an item and saves it to storage', async () => {
    const user = userEvent.setup();
    storeCart([
      { variantId: 5, quantity: 1 },
      { variantId: 7, quantity: 3 },
    ]);
    renderCart();
    expect(screen.getByText('Items: 5x1, 7x3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.getByText('Items: 7x3')).toBeInTheDocument();
    expect(readStoredCart()).toEqual([{ variantId: 7, quantity: 3 }]);
  });
});

describe('useCart', () => {
  it('throws an error when used outside CartProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<CartStatus />)).toThrow(
      'useCart must be used inside CartProvider'
    );
  });
});
