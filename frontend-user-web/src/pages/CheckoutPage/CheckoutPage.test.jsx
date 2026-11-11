import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import AuthProvider from '../../context/AuthProvider';
import CartProvider from '../../context/CartProvider';
import OrdersProvider from '../../context/OrdersProvider';
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
    <AuthProvider>
      <CartProvider>
        <OrdersProvider>
          <RouterProvider router={router} />
        </OrdersProvider>
      </CartProvider>
    </AuthProvider>
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

describe('CheckoutPage form', () => {
  // Gõ đủ 4 ô; phone có thể đổi để thử từng trường hợp.
  async function fillForm(user, { phone = '0912345678' } = {}) {
    await user.type(screen.getByLabelText(/^first name/i), '  Long  ');
    await user.type(screen.getByLabelText(/^last name/i), 'Nguyen');
    await user.type(
      screen.getByLabelText(/^address details/i),
      '1 Le Loi Street'
    );
    await user.type(screen.getByLabelText(/^mobile phone/i), phone);
  }

  function readStoredOrders() {
    return JSON.parse(localStorage.getItem('orders'));
  }

  it('marks an invalid phone on blur without a message', async () => {
    const user = userEvent.setup();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCheckoutPage();
    const phone = await screen.findByLabelText(/^mobile phone/i);

    await user.type(phone, '123');
    await user.tab();

    expect(phone).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.queryByText('Please enter a valid mobile phone number.')
    ).not.toBeInTheDocument();
  });

  it('shows every error and focuses the first field when submitted empty', async () => {
    const user = userEvent.setup();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCheckoutPage();

    await user.click(
      await screen.findByRole('button', { name: 'PLACE ORDER' })
    );

    expect(
      screen.getByText('Please enter your first name.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your last name.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your address details.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Please enter your mobile phone number.')
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^first name/i)).toHaveFocus();
  });

  it('focuses the phone when it is the only invalid field', async () => {
    const user = userEvent.setup();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCheckoutPage();
    await screen.findByRole('button', { name: 'PLACE ORDER' });

    await fillForm(user, { phone: '12345' });
    await user.click(screen.getByRole('button', { name: 'PLACE ORDER' }));

    expect(
      screen.getByText('Please enter a valid mobile phone number.')
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^mobile phone/i)).toHaveFocus();
  });

  it('keeps the cart and saves no order when the form is invalid', async () => {
    const user = userEvent.setup();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCheckoutPage();

    await user.click(
      await screen.findByRole('button', { name: 'PLACE ORDER' })
    );

    expect(JSON.parse(localStorage.getItem('cart'))).toEqual(TWO_ITEMS_CART);
    expect(readStoredOrders()).toBeNull();
  });
});

describe('CheckoutPage place order', () => {
  // AuthProvider chỉ đọc storage một lần lúc khởi tạo nên phải ghi trước render.
  function logIn() {
    localStorage.setItem('user', JSON.stringify({ email: 'long@example.com' }));
  }

  async function placeValidOrder(user) {
    await screen.findByRole('button', { name: 'PLACE ORDER' });
    await user.type(screen.getByLabelText(/^first name/i), '  Long  ');
    await user.type(screen.getByLabelText(/^last name/i), 'Nguyen');
    await user.type(
      screen.getByLabelText(/^address details/i),
      '1 Le Loi Street'
    );
    await user.type(screen.getByLabelText(/^mobile phone/i), '0912345678');
    await user.click(screen.getByRole('button', { name: 'PLACE ORDER' }));
  }

  it('saves the order with a snapshot of the items', async () => {
    const user = userEvent.setup();
    logIn();
    storeCart(TWO_ITEMS_CART);
    // Service trả ngược thứ tự giỏ: món trong đơn vẫn phải theo thứ tự giỏ.
    getVariantsByIds.mockResolvedValue([discountedVariant, regularVariant]);
    renderCheckoutPage();

    await placeValidOrder(user);

    expect(JSON.parse(localStorage.getItem('orders'))).toEqual([
      {
        email: 'long@example.com',
        shipping: {
          firstName: 'Long',
          lastName: 'Nguyen',
          address: '1 Le Loi Street',
          phone: '0912345678',
        },
        items: [
          {
            variantId: 12,
            productId: regularVariant.productId,
            image: regularVariant.colorImage,
            productName: 'Regular Pants',
            colorName: '09 BLACK',
            size: 'M',
            quantity: 2,
            unitPrice: 30,
          },
          {
            variantId: 7,
            productId: discountedVariant.productId,
            image: discountedVariant.colorImage,
            productName: 'Discounted Pants',
            colorName: '31 BEIGE',
            size: 'L',
            quantity: 3,
            unitPrice: 40,
          },
        ],
        total: 180,
        id: 1,
        status: 'placed',
        createdAt: expect.any(String),
      },
    ]);
  });

  it('clears the cart and shows the confirmation', async () => {
    const user = userEvent.setup();
    logIn();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCheckoutPage();

    await placeValidOrder(user);

    expect(JSON.parse(localStorage.getItem('cart'))).toEqual([]);
    expect(
      screen.getByText('Your order #1 has been placed.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'CONTINUE SHOPPING' })
    ).toHaveAttribute('href', '/');
    expect(
      screen.queryByText('Your cart is currently empty.')
    ).not.toBeInTheDocument();
  });
});
