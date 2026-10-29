import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CartPage from './CartPage';
import CartProvider from '../../context/CartProvider.jsx';
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

// Giỏ có 2 món: Regular 30 × 2 = 60, Discounted (50 giảm 20% = 40) × 3 = 120.
// Tổng số lượng 5, tổng tiền 180.
const TWO_ITEMS_CART = [
  { variantId: 12, quantity: 2 },
  { variantId: 7, quantity: 3 },
];

function storeCart(items) {
  localStorage.setItem('cart', JSON.stringify(items));
}

function readStoredCart() {
  return JSON.parse(localStorage.getItem('cart'));
}

function renderCartPage() {
  const router = createMemoryRouter(
    [
      { path: '/cart', element: <CartPage /> },
      { path: '/', element: <h1>Home page</h1> },
      { path: '/login', element: <h1>Login page</h1> },
    ],
    { initialEntries: ['/cart'] }
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

describe('CartPage states', () => {
  it('shows the empty cart message and a link back home', () => {
    getVariantsByIds.mockResolvedValue([]);
    renderCartPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'SHOPPING CART' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your cart is currently empty.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'CONTINUE SHOPPING' })
    ).toHaveAttribute('href', '/');
  });

  it('shows loading while fetching the cart items', () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderCartPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockRejectedValue(new Error('Loading error!'));
    renderCartPage();

    expect(await screen.findByText('Loading error!')).toBeInTheDocument();
  });

  it('requests the variants of the cart items in cart order', () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderCartPage();

    expect(getVariantsByIds).toHaveBeenCalledWith([12, 7]);
  });
});

describe('CartPage items', () => {
  it('lists the items in cart order', async () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([discountedVariant, regularVariant]);
    renderCartPage();

    const names = await screen.findAllByRole('heading', { level: 2 });

    expect(names.map((name) => name.textContent)).toEqual([
      'Regular Pants',
      'Discounted Pants',
    ]);
  });

  it('shows the details, quantity and subtotal of each item', async () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCartPage();
    const [regularItem, discountedItem] =
      await screen.findAllByRole('listitem');

    const regular = within(regularItem);
    expect(regular.getByText('Color: 09 BLACK')).toBeInTheDocument();
    expect(regular.getByText('Size: Women M')).toBeInTheDocument();
    expect(regular.getByText('$30.00')).toBeInTheDocument();
    expect(
      regular.getByRole('status', { name: 'Quantity of Regular Pants' })
    ).toHaveTextContent('2');
    expect(regular.getByText('$60.00')).toBeInTheDocument();

    const discounted = within(discountedItem);
    expect(discounted.getByText('Size: Unisex L')).toBeInTheDocument();
    expect(discounted.getByText('$40.00')).toBeInTheDocument();
    expect(discounted.getByText('Sale')).toBeInTheDocument();
    expect(discounted.getByText('$120.00')).toBeInTheDocument();
  });

  it('shows the total quantity and total price in the summary', async () => {
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCartPage();
    const summary = within(
      await screen.findByRole('region', { name: 'Order summary' })
    );

    expect(summary.getByText('$180.00')).toBeInTheDocument();
    expect(summary.getByText('5 ITEM(S)')).toBeInTheDocument();
  });
});

describe('CartPage actions', () => {
  it('increases the quantity without fetching again', async () => {
    const user = userEvent.setup();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCartPage();
    const increase = await screen.findByRole('button', {
      name: 'Increase quantity of Regular Pants',
    });

    await user.click(increase);

    const summary = within(
      screen.getByRole('region', { name: 'Order summary' })
    );
    expect(
      screen.getByRole('status', { name: 'Quantity of Regular Pants' })
    ).toHaveTextContent('3');
    expect(screen.getByText('$90.00')).toBeInTheDocument();
    expect(summary.getByText('6 ITEM(S)')).toBeInTheDocument();
    expect(summary.getByText('$210.00')).toBeInTheDocument();
    expect(readStoredCart()).toEqual([
      { variantId: 12, quantity: 3 },
      { variantId: 7, quantity: 3 },
    ]);
    expect(getVariantsByIds).toHaveBeenCalledTimes(1);
  });

  it('removes an item and updates the summary', async () => {
    const user = userEvent.setup();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCartPage();
    const remove = await screen.findByRole('button', {
      name: 'Remove Regular Pants from cart',
    });

    await user.click(remove);

    const summary = within(
      screen.getByRole('region', { name: 'Order summary' })
    );
    expect(
      screen.queryByRole('heading', { name: 'Regular Pants' })
    ).not.toBeInTheDocument();
    expect(summary.getByText('3 ITEM(S)')).toBeInTheDocument();
    expect(summary.getByText('$120.00')).toBeInTheDocument();
    expect(readStoredCart()).toEqual([{ variantId: 7, quantity: 3 }]);
  });

  it('shows the empty cart message after removing the last item', async () => {
    const user = userEvent.setup();
    storeCart([{ variantId: 12, quantity: 2 }]);
    getVariantsByIds.mockResolvedValue([regularVariant]);
    renderCartPage();
    const remove = await screen.findByRole('button', {
      name: 'Remove Regular Pants from cart',
    });

    await user.click(remove);

    expect(
      screen.getByText('Your cart is currently empty.')
    ).toBeInTheDocument();
  });

  it('goes to the login page with CHECKOUT', async () => {
    const user = userEvent.setup();
    storeCart(TWO_ITEMS_CART);
    getVariantsByIds.mockResolvedValue([regularVariant, discountedVariant]);
    renderCartPage();
    const checkout = await screen.findByRole('link', { name: 'CHECKOUT' });

    await user.click(checkout);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Login page' })
    ).toBeInTheDocument();
  });
});
