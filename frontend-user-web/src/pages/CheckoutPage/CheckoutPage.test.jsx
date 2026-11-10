import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import CartProvider from '../../context/CartProvider';
import { getVariantsByIds } from '../../services/variantService';

vi.mock('../../services/variantService', () => ({
  getVariantsByIds: vi.fn(),
}));

const regularVariant = {
  id: 12,
  productId: 3,
  colorCode: '09',
  size: 'M',
  stockQuantity: 10,
  productName: 'Regular Pants',
  gender: 'Women',
  price: 30,
  discountPercent: null,
  discountInfo: null,
  colorName: '09 BLACK',
  colorImage: '/images/regular-pants/09-black.avif',
};

const discountedVariant = {
  id: 7,
  productId: 5,
  colorCode: '31',
  size: 'L',
  stockQuantity: 10,
  productName: 'Discounted Pants',
  gender: 'Unisex',
  price: 50,
  discountPercent: 20,
  discountInfo: 'Sale',
  colorName: '31 BEIGE',
  colorImage: '/images/discounted-pants/31-beige.avif',
};

// Regular 30 × 2 = 60, Discounted (50 giảm 20% = 40) × 3 = 120.
// Tổng số lượng 5, tổng tiền 180.
const TWO_ITEMS_CART = [
  { variantId: 12, quantity: 2 },
  { variantId: 7, quantity: 3 },
];

function storeCart(items) {
  localStorage.setItem('cart', JSON.stringify(items));
}

function renderCheckoutPage() {
  const router = createMemoryRouter(
    [
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/', element: <h1>Home page</h1> },
    ],
    { initialEntries: ['/checkout'] }
  );

  render(
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

afterEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

describe('CheckoutPage states', () => {
  it('shows the empty cart message without a summary', () => {
    getVariantsByIds.mockResolvedValue([]);
    renderCheckoutPage();

    expect(document.title).toBe('Checkout | UNIQLO');
    expect(
      screen.getByRole('heading', { level: 1, name: 'CHECKOUT' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your cart is currently empty.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'CONTINUE SHOPPING' })
    ).toHaveAttribute('href', '/');
    expect(
      screen.queryByRole('region', { name: 'Order summary' })
    ).not.toBeInTheDocument();
  });

  it('shows loading while fetching the cart items', () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderCheckoutPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockRejectedValue(new Error('Loading error!'));
    renderCheckoutPage();

    expect(await screen.findByText('Loading error!')).toBeInTheDocument();
  });
});

describe('CheckoutPage summary', () => {
  it('shows the item count, free shipping and totals', async () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCheckoutPage();
    const summary = within(
      await screen.findByRole('region', { name: 'Order summary' })
    );

    expect(summary.getByText('5 ITEM(S)')).toBeInTheDocument();
    expect(summary.getByText('Free')).toBeInTheDocument();
    // Một lần ở Subtotal, một lần ở ORDER TOTAL.
    expect(summary.getAllByText('$180.00')).toHaveLength(2);
  });
});
