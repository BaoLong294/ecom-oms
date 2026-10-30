import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { routes } from './routes.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import CartProvider from './context/CartProvider.jsx';
import WishlistProvider from './context/WishlistProvider.jsx';

function renderWithRouter(url) {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  render(
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );

  return router;
}

afterEach(() => {
  localStorage.clear();
});

describe('routes', () => {
  it('should render the home page at /', () => {
    renderWithRouter('/');

    expect(screen.getByRole('heading', { name: 'UNIQLO' })).toBeInTheDocument();
  });

  it('should render the category page at /categories/5', () => {
    renderWithRouter('/categories/5');

    expect(
      screen.getByRole('heading', { name: 'Category' })
    ).toBeInTheDocument();
  });

  it('should render the product page at /products/1', () => {
    renderWithRouter('/products/1');

    expect(
      screen.getByRole('heading', { name: 'Product' })
    ).toBeInTheDocument();
  });

  it('should render the wishlist page at /wishlist', () => {
    renderWithRouter('/wishlist');

    expect(
      screen.getByRole('heading', { name: 'WISHLIST' })
    ).toBeInTheDocument();
  });

  it('should render the cart page at /cart', () => {
    renderWithRouter('/cart');

    expect(
      screen.getByRole('heading', { name: 'SHOPPING CART' })
    ).toBeInTheDocument();
  });

  it('should render the login page at /login', () => {
    renderWithRouter('/login');

    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument();
  });

  it('should render 404 - Page not found heading for non-existent routes', () => {
    renderWithRouter('/random-not-found-url');

    expect(
      screen.getByRole('heading', { name: '404 - Page not found' })
    ).toBeInTheDocument();
  });

  it('should have a link to home page for non-existent routes', () => {
    renderWithRouter('/random-not-found-url');
    const homeLink = screen.getByRole('link', { name: 'Back to Homepage' });

    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render a skip link that targets the main content', () => {
    renderWithRouter('/');
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    const mainContent = screen.getByRole('main');

    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(mainContent).toHaveAttribute('id', 'main-content');
    expect(mainContent).toHaveAttribute('tabindex', '-1');
  });
});

describe('Header', () => {
  it('shows the Categories menu on the landing page', () => {
    renderWithRouter('/');

    expect(
      screen.getByRole('navigation', { name: 'Categories' })
    ).toBeInTheDocument();
  });

  it('hides the Categories menu on the category page', () => {
    renderWithRouter('/categories/5');

    expect(
      screen.queryByRole('navigation', { name: 'Categories' })
    ).not.toBeInTheDocument();
  });

  it('hides the Categories menu on the cart page', () => {
    renderWithRouter('/cart');

    expect(
      screen.queryByRole('navigation', { name: 'Categories' })
    ).not.toBeInTheDocument();
  });

  it('shows logo, Account, Wishlist and Cart links on the login page', () => {
    renderWithRouter('/login');
    const links = ['UNIQLO home', 'Account', 'Wishlist', 'Cart'];

    links.forEach((link) => {
      expect(screen.getByRole('link', { name: link })).toBeInTheDocument();
    });
  });

  it('navigates to the landing page when the logo is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter('/categories/5');
    const logoLink = screen.getByRole('link', { name: 'UNIQLO home' });
    await user.click(logoLink);

    expect(screen.getByRole('heading', { name: 'UNIQLO' })).toBeInTheDocument();
  });

  it('navigates to the login page when Account is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter('/categories/5');
    const header = screen.getByRole('banner');
    const accountLink = within(header).getByRole('link', { name: 'Account' });
    await user.click(accountLink);

    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument();
  });

  it('navigates to the wishlist page when Wishlist is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter('/categories/5');
    const wishlistLink = screen.getByRole('link', { name: 'Wishlist' });
    await user.click(wishlistLink);

    expect(
      screen.getByRole('heading', { name: 'WISHLIST' })
    ).toBeInTheDocument();
  });

  it('navigates to the cart page when Cart is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter('/categories/5');
    const cartLink = screen.getByRole('link', { name: 'Cart' });
    await user.click(cartLink);

    expect(
      screen.getByRole('heading', { name: 'SHOPPING CART' })
    ).toBeInTheDocument();
  });

  it('returns to the current page after logging in from Account', async () => {
    const user = userEvent.setup();
    renderWithRouter('/cart');
    const header = screen.getByRole('banner');

    await user.click(within(header).getByRole('link', { name: 'Account' }));
    await user.type(
      screen.getByLabelText(/^email address/i),
      'john.doe@gmail.com'
    );
    await user.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(
      screen.getByRole('heading', { name: 'SHOPPING CART' })
    ).toBeInTheDocument();
  });

  it('shows the total cart quantity in the cart link name and badge', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([
        { variantId: 5, quantity: 1 },
        { variantId: 7, quantity: 3 },
      ])
    );
    renderWithRouter('/cart');
    const header = within(screen.getByRole('banner'));

    expect(
      header.getByRole('link', { name: 'Cart, 4 items' })
    ).toBeInTheDocument();
    expect(header.getByText('4')).toBeInTheDocument();
  });

  it('uses the singular item in the cart link name for one item', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ variantId: 5, quantity: 1 }])
    );
    renderWithRouter('/cart');

    expect(
      within(screen.getByRole('banner')).getByRole('link', {
        name: 'Cart, 1 item',
      })
    ).toBeInTheDocument();
  });
});

describe('BottomNav', () => {
  it('shows the Shortcuts nav on the landing page', () => {
    renderWithRouter('/');

    expect(
      screen.getByRole('navigation', { name: 'Shortcuts' })
    ).toBeInTheDocument();
  });

  it('shows the Shortcuts nav on the product page', () => {
    renderWithRouter('/products/1');

    expect(
      screen.getByRole('navigation', { name: 'Shortcuts' })
    ).toBeInTheDocument();
  });

  it('hides the Shortcuts nav on the cart page', () => {
    renderWithRouter('/cart');

    expect(
      screen.queryByRole('navigation', { name: 'Shortcuts' })
    ).not.toBeInTheDocument();
  });

  it('hides the Shortcuts nav on the not found page', () => {
    renderWithRouter('/does-not-exist');

    expect(
      screen.queryByRole('navigation', { name: 'Shortcuts' })
    ).not.toBeInTheDocument();
  });

  it('navigates to the landing page when Home is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter('/products/1');
    const homeLink = screen.getByRole('link', { name: 'Home' });
    await user.click(homeLink);

    expect(screen.getByRole('heading', { name: 'UNIQLO' })).toBeInTheDocument();
  });

  it('navigates to the login page when Account is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter('/products/1');
    const bottomNav = screen.getByRole('navigation', { name: 'Shortcuts' });
    const accountLink = within(bottomNav).getByRole('link', {
      name: 'Account',
    });
    await user.click(accountLink);

    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument();
  });

  it('returns to the current page after logging in from Account', async () => {
    const user = userEvent.setup();
    const router = renderWithRouter('/products/1');
    const bottomNav = screen.getByRole('navigation', { name: 'Shortcuts' });

    await user.click(within(bottomNav).getByRole('link', { name: 'Account' }));
    await user.type(
      screen.getByLabelText(/^email address/i),
      'john.doe@gmail.com'
    );
    await user.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(router.state.location.pathname).toBe('/products/1');
  });
});

describe('Login required popup', () => {
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  // jsdom chưa cài đặt showModal/close của <dialog>; test này mở popup thật nên cần hàm giả.
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
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
  });

  it('returns to the product page after logging in from the popup', async () => {
    const user = userEvent.setup();
    const router = renderWithRouter('/products/1');
    // Dữ liệu thật nên không gõ cứng tên sản phẩm, chỉ khớp phần đuôi của aria-label.
    const wishlist = await screen.findByRole('button', {
      name: /to wishlist$/,
    });

    await user.click(wishlist);
    await user.click(screen.getByRole('link', { name: 'LOG IN' }));
    await user.type(
      screen.getByLabelText(/^email address/i),
      'john.doe@gmail.com'
    );
    await user.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(router.state.location.pathname).toBe('/products/1');
  });
});
