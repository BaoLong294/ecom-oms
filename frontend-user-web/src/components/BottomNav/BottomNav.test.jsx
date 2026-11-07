import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, fireEvent, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import BottomNav from './BottomNav.jsx';
import { searchProducts } from '../../services/productService.js';
import AuthProvider from '../../context/AuthProvider.jsx';

vi.mock('../../services/productService.js', () => ({
  searchProducts: vi.fn(),
}));

// id 7 đứng trước id 3 để bắt lỗi sắp xếp lại; id khác hẳn số lượng kết quả.
const SWEAT_PANTS = { id: 7, name: 'Sweat Wide Pants' };
const COTTON_PANTS = { id: 3, name: 'Cotton Pants' };

/**
 * Render BottomNav trong layout route (BottomNav + Outlet) để nó vẫn còn sau khi
 * chuyển trang; trang đích là trang giữ chỗ chỉ có <h1>.
 * @returns {object} router để kiểm tra URL
 */
function renderBottomNav() {
  const router = createMemoryRouter(
    [
      {
        element: (
          <>
            <Outlet />
            <BottomNav />
          </>
        ),
        children: [
          { path: '/', element: <h1>Home page</h1> },
          { path: '/products/:id', element: <h1>Product page</h1> },
        ],
      },
    ],
    { initialEntries: ['/'] }
  );
  render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );

  return router;
}

/**
 * Bấm Search để mở khung, trả về ô nhập.
 */
async function openSearch(user) {
  await user.click(screen.getByRole('button', { name: 'Search' }));

  return screen.getByRole('searchbox', { name: 'Search products' });
}

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

// jsdom chưa cài đặt showModal/close của <dialog>.
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
  vi.resetAllMocks();
});

describe('BottomNav search panel', () => {
  it('should mark the Search button as a dialog trigger', () => {
    renderBottomNav();

    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute(
      'aria-haspopup',
      'dialog'
    );
  });

  it('should open the search panel when Search is clicked', async () => {
    const user = userEvent.setup();
    renderBottomNav();

    expect(
      screen.queryByRole('dialog', { name: 'Search' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    const dialog = screen.getByRole('dialog', { name: 'Search', hidden: true });
    expect(dialog).toHaveAttribute('open');
    expect(
      within(dialog).getByRole('searchbox', { name: 'Search products' })
    ).toBeInTheDocument();
  });

  it('should close the search panel with the close button', async () => {
    const user = userEvent.setup();
    renderBottomNav();

    await user.click(screen.getByRole('button', { name: 'Search' }));
    const dialog = screen.getByRole('dialog', { name: 'Search', hidden: true });
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(dialog).not.toHaveAttribute('open');
  });

  it('should close the search panel when the browser closes the dialog', async () => {
    const user = userEvent.setup();
    renderBottomNav();

    await user.click(screen.getByRole('button', { name: 'Search' }));
    const dialog = screen.getByRole('dialog', { name: 'Search', hidden: true });
    // Giống Escape: trình duyệt tự gỡ open rồi bắn sự kiện close.
    dialog.removeAttribute('open');
    fireEvent(dialog, new Event('close'));

    expect(
      screen.queryByRole('searchbox', { name: 'Search products' })
    ).not.toBeInTheDocument();
  });

  it('should start with an empty search box when reopened', async () => {
    searchProducts.mockResolvedValue([]);
    const user = userEvent.setup();
    renderBottomNav();
    const searchButton = screen.getByRole('button', { name: 'Search' });

    await user.click(searchButton);
    const searchBox = screen.getByRole('searchbox', {
      name: 'Search products',
    });
    await user.type(searchBox, 'pants');
    expect(searchBox).toHaveValue('pants');

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(searchButton);

    expect(
      screen.getByRole('searchbox', { name: 'Search products' })
    ).toHaveValue('');
  });
});

describe('BottomNav search results', () => {
  it('should not search while the keyword is empty or only spaces', async () => {
    const user = userEvent.setup();
    renderBottomNav();

    const searchBox = await openSearch(user);
    await user.type(searchBox, '   ');

    expect(searchProducts).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should show loading while searching', async () => {
    searchProducts.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    renderBottomNav();

    await user.type(await openSearch(user), 'p');

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('should search with the trimmed keyword', async () => {
    searchProducts.mockResolvedValue([]);
    const user = userEvent.setup();
    renderBottomNav();

    await user.type(await openSearch(user), ' pants ');

    expect(searchProducts).toHaveBeenLastCalledWith('pants');
  });

  it('should list matching products as links in the returned order', async () => {
    searchProducts.mockResolvedValue([SWEAT_PANTS, COTTON_PANTS]);
    const user = userEvent.setup();
    renderBottomNav();

    await user.type(await openSearch(user), 'pants');
    const list = await screen.findByRole('list', { name: 'Search results' });
    const links = within(list).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([
      'Sweat Wide Pants',
      'Cotton Pants',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/products/7',
      '/products/3',
    ]);
  });

  it('should show the number of results', async () => {
    searchProducts.mockResolvedValue([SWEAT_PANTS, COTTON_PANTS]);
    const user = userEvent.setup();
    renderBottomNav();

    await user.type(await openSearch(user), 'pants');
    await screen.findByRole('list', { name: 'Search results' });

    expect(screen.getByRole('status')).toHaveTextContent('2 result(s)');
  });

  it('should show a message when no product matches', async () => {
    searchProducts.mockResolvedValue([]);
    const user = userEvent.setup();
    renderBottomNav();

    await user.type(await openSearch(user), 'jacket');

    expect(
      await screen.findByText('No products match "jacket".')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('list', { name: 'Search results' })
    ).not.toBeInTheDocument();
  });

  it('should show the error message when searching fails', async () => {
    searchProducts.mockRejectedValue(new Error('Loading error!'));
    const user = userEvent.setup();
    renderBottomNav();

    await user.type(await openSearch(user), 'p');

    expect(await screen.findByText('Loading error!')).toBeInTheDocument();
  });

  it('should go to the product page and close the panel when a result is clicked', async () => {
    searchProducts.mockResolvedValue([SWEAT_PANTS, COTTON_PANTS]);
    const user = userEvent.setup();
    const router = renderBottomNav();

    await user.type(await openSearch(user), 'pants');
    const list = await screen.findByRole('list', { name: 'Search results' });
    await user.click(within(list).getByRole('link', { name: 'Cotton Pants' }));

    expect(router.state.location.pathname).toBe('/products/3');
    expect(
      screen.getByRole('heading', { name: 'Product page' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('searchbox', { name: 'Search products' })
    ).not.toBeInTheDocument();
  });

  it('should hide the results when the keyword is cleared', async () => {
    searchProducts.mockResolvedValue([SWEAT_PANTS, COTTON_PANTS]);
    const user = userEvent.setup();
    renderBottomNav();

    const searchBox = await openSearch(user);
    await user.type(searchBox, 'pants');
    await screen.findByRole('list', { name: 'Search results' });
    await user.clear(searchBox);

    expect(
      screen.queryByRole('list', { name: 'Search results' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should ignore results of an older keyword that arrive late', async () => {
    const pSearch = Promise.withResolvers();
    const paSearch = Promise.withResolvers();
    searchProducts.mockImplementation((keyword) =>
      keyword === 'p' ? pSearch.promise : paSearch.promise
    );
    const user = userEvent.setup();
    renderBottomNav();

    await user.type(await openSearch(user), 'pa');
    // Kết quả của 'pa' về trước, kết quả của 'p' (gửi trước) về sau.
    await act(async () => {
      paSearch.resolve([SWEAT_PANTS]);
    });
    await act(async () => {
      pSearch.resolve([SWEAT_PANTS, COTTON_PANTS]);
    });

    const list = screen.getByRole('list', { name: 'Search results' });
    expect(
      within(list)
        .getAllByRole('link')
        .map((link) => link.textContent)
    ).toEqual(['Sweat Wide Pants']);
  });
});
