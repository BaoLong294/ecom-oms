import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import WishlistPage from './WishlistPage';
import { getVariantsByIds } from '../../services/variantService';
import CartProvider from '../../context/CartProvider.jsx';
import WishlistProvider from '../../context/WishlistProvider.jsx';

vi.mock('../../services/variantService', () => ({
  getVariantsByIds: vi.fn(),
}));

const variant101 = {
  id: 101,
  productId: 1,
  colorCode: '09',
  size: 'M',
  stockQuantity: 10,
  productName: 'Product A',
  gender: 'Unisex',
  price: 50,
  discountPercent: null,
  discountInfo: null,
  colorName: '09 BLACK',
  colorImage: '/images/product-a/09-black.avif',
};

const variant203 = {
  id: 203,
  productId: 2,
  colorCode: '10',
  size: 'S',
  stockQuantity: 10,
  productName: 'Product B',
  gender: 'Women',
  price: 40,
  discountPercent: 50,
  discountInfo: 'Happy New Year',
  colorName: '10 WHITE',
  colorImage: '/images/product-b/10-white.avif',
};

const EMPTY_MESSAGE = 'Your wishlist is currently empty.';

function renderWishlistPage() {
  const router = createMemoryRouter(
    [
      { path: '/wishlist', element: <WishlistPage /> },
      { path: '/', element: <h1>Home page</h1> },
      { path: '/cart', element: <h1>Cart page</h1> },
    ],
    { initialEntries: ['/wishlist'] }
  );

  render(
    <CartProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </CartProvider>
  );
}

function storeWishlist(ids) {
  localStorage.setItem('wishlist', JSON.stringify(ids));
}

function readStoredWishlist() {
  return JSON.parse(localStorage.getItem('wishlist'));
}

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

// jsdom chưa cài đặt showModal/close của <dialog>; trang có popup thêm vào giỏ nên cần hàm giả.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function () {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

afterEach(() => {
  vi.resetAllMocks();
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
  localStorage.clear();
});

describe('WishlistPage states', () => {
  it('shows the empty message and a link back home when the wishlist is empty', () => {
    getVariantsByIds.mockResolvedValue([]);
    renderWishlistPage();

    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'CONTINUE SHOPPING' })
    ).toHaveAttribute('href', '/');
  });

  it('shows loading while fetching the variants', () => {
    storeWishlist([203, 101]);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderWishlistPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows the error message when the request fails', async () => {
    storeWishlist([203, 101]);
    getVariantsByIds.mockRejectedValue(new Error('Loading error!'));
    renderWishlistPage();

    expect(await screen.findByText('Loading error!')).toBeInTheDocument();
  });

  it('calls getVariantsByIds with the ids in wishlist order', () => {
    storeWishlist([203, 101]);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderWishlistPage();

    expect(getVariantsByIds).toHaveBeenCalledWith([203, 101]);
  });
});

describe('WishlistPage items', () => {
  it('shows the items in wishlist order', async () => {
    storeWishlist([203, 101]);
    // Service trả ngược thứ tự để bắt lỗi hiển thị theo thứ tự của service.
    getVariantsByIds.mockResolvedValue([variant101, variant203]);
    renderWishlistPage();
    const listItems = await screen.findAllByRole('listitem');

    expect(
      listItems.map((item) => within(item).getByRole('heading').textContent)
    ).toEqual(['Product B', 'Product A']);
  });

  it('shows color, size and price of each item', async () => {
    storeWishlist([203, 101]);
    getVariantsByIds.mockResolvedValue([variant101, variant203]);
    renderWishlistPage();
    const [productB] = await screen.findAllByRole('listitem');
    const item = within(productB);

    expect(item.getByText('Color: 10 WHITE')).toBeInTheDocument();
    expect(item.getByText('Size: Women S')).toBeInTheDocument();
    expect(item.getByText('$20.00')).toBeInTheDocument();
    expect(item.getByText('Happy New Year')).toBeInTheDocument();
  });

  it('shows the number of items in the summary', async () => {
    storeWishlist([203, 101]);
    getVariantsByIds.mockResolvedValue([variant101, variant203]);
    renderWishlistPage();
    const summary = await screen.findByRole('region', {
      name: 'Wishlist summary',
    });

    expect(within(summary).getByText('2 item(s)')).toBeInTheDocument();
  });
});

describe('WishlistPage actions', () => {
  function readStoredCart() {
    return JSON.parse(localStorage.getItem('cart'));
  }

  it('removes an item with the heart button', async () => {
    const user = userEvent.setup();
    storeWishlist([203, 101]);
    getVariantsByIds.mockResolvedValue([variant101, variant203]);
    renderWishlistPage();
    const listItems = await screen.findAllByRole('listitem');

    expect(listItems).toHaveLength(2);

    await user.click(
      screen.getByRole('button', { name: 'Remove Product B from wishlist' })
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(
      screen.queryByRole('heading', { name: 'Product B' })
    ).not.toBeInTheDocument();
    expect(readStoredWishlist()).toEqual([101]);
  });

  it('shows the empty message after removing the last item', async () => {
    const user = userEvent.setup();
    storeWishlist([101]);
    getVariantsByIds.mockResolvedValue([variant101]);
    renderWishlistPage();
    const removeButton = await screen.findByRole('button', {
      name: 'Remove Product A from wishlist',
    });

    await user.click(removeButton);

    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
  });

  it('adds the item to the cart with quantity 1 and keeps it in the wishlist', async () => {
    const user = userEvent.setup();
    storeWishlist([203, 101]);
    getVariantsByIds.mockResolvedValue([variant101, variant203]);
    renderWishlistPage();
    const addToCart = await screen.findByRole('button', {
      name: 'ADD TO CART, Product B',
    });

    await user.click(addToCart);

    expect(readStoredCart()).toEqual([{ variantId: 203, quantity: 1 }]);
    expect(readStoredWishlist()).toEqual([203, 101]);
  });

  it('opens the add to cart popup for one item', async () => {
    const user = userEvent.setup();
    storeWishlist([203, 101]);
    getVariantsByIds.mockResolvedValue([variant101, variant203]);
    renderWishlistPage();
    const addToCart = await screen.findByRole('button', {
      name: 'ADD TO CART, Product B',
    });
    const dialog = screen.getByRole('dialog', { hidden: true });

    expect(dialog).not.toHaveAttribute('open');

    await user.click(addToCart);

    expect(
      screen.getByRole('dialog', {
        name: '1 item(s) added to your cart',
        hidden: true,
      })
    ).toHaveAttribute('open');
  });
});
