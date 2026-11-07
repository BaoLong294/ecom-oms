import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from './Header.jsx';
import CartProvider from '../../context/CartProvider.jsx';
import { getCategoryMenu } from '../../services/categoryService';
import AuthProvider from '../../context/AuthProvider.jsx';

vi.mock('../../services/categoryService', () => ({
  getCategoryMenu: vi.fn(),
}));

// Men đứng trước Women để bắt lỗi lấy children theo vị trí thay vì theo id.
// Women có 2 con (một có ảnh, một không) để kiểm tra thứ tự và href.
const MENU = [
  {
    id: 2,
    name: 'Men',
    children: [{ id: 61, name: 'Men Shirts', image: null }],
  },
  {
    id: 1,
    name: 'Women',
    children: [
      { id: 51, name: 'Women Pants', image: '/images/women-pants.avif' },
      { id: 52, name: 'Women Knit', image: null },
    ],
  },
  { id: 3, name: 'Kids', children: [] },
  { id: 4, name: 'Baby', children: [] },
];

/**
 * Render Header trong layout route (Header + Outlet) để Header không bị remount
 * khi điều hướng giữa /women, /men và /categories/:id.
 * @param {'landing' | 'default'} [headerVariant='landing'] - biến thể header
 * @returns {object} router để kiểm tra URL sau khi điều hướng
 */
function renderHeader(headerVariant = 'landing') {
  const router = createMemoryRouter(
    [
      {
        element: (
          <>
            <Header headerVariant={headerVariant} />
            <Outlet />
          </>
        ),
        children: [
          { path: '/women', element: <h1>Women page</h1> },
          { path: '/men', element: <h1>Men page</h1> },
          { path: '/categories/:id', element: <h1>Category page</h1> },
        ],
      },
    ],
    { initialEntries: ['/women'] }
  );

  render(
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );

  return router;
}

afterEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

describe('Header mega menu', () => {
  it('should show the loading message in the menu while fetching', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockReturnValue(new Promise(() => {}));
    renderHeader();

    await user.hover(screen.getByRole('link', { name: 'WOMEN' }));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show the error message in the menu when the request fails', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockRejectedValue(new Error('Loading error!'));
    renderHeader();

    await user.hover(screen.getByRole('link', { name: 'WOMEN' }));

    expect(await screen.findByText('Loading error!')).toBeInTheDocument();
  });

  it('should open the subcategories of the hovered category in order', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockResolvedValue(MENU);
    renderHeader();

    expect(
      screen.queryByRole('list', { name: 'Women categories' })
    ).not.toBeInTheDocument();

    await user.hover(screen.getByRole('link', { name: 'WOMEN' }));
    const list = await screen.findByRole('list', { name: 'Women categories' });
    const hrefs = within(list)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual(['/categories/51', '/categories/52']);
  });

  it('should switch to the menu of another category on hover', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockResolvedValue(MENU);
    renderHeader();

    await user.hover(screen.getByRole('link', { name: 'WOMEN' }));
    await screen.findByRole('list', { name: 'Women categories' });
    await user.hover(screen.getByRole('link', { name: 'MEN' }));

    expect(
      screen.queryByRole('list', { name: 'Women categories' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Men Shirts' })).toHaveAttribute(
      'href',
      '/categories/61'
    );
  });

  it('should close the menu when the mouse leaves', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockResolvedValue(MENU);
    renderHeader();
    const womenLink = screen.getByRole('link', { name: 'WOMEN' });

    await user.hover(womenLink);
    await screen.findByRole('list', { name: 'Women categories' });
    await user.unhover(womenLink);

    expect(
      screen.queryByRole('list', { name: 'Women categories' })
    ).not.toBeInTheDocument();
  });

  it('should open the menu when the category link receives focus', async () => {
    getCategoryMenu.mockResolvedValue(MENU);
    renderHeader();

    act(() => screen.getByRole('link', { name: 'WOMEN' }).focus());

    expect(
      await screen.findByRole('list', { name: 'Women categories' })
    ).toBeInTheDocument();
  });

  it('should close with Escape and move focus back to the category link', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockResolvedValue(MENU);
    renderHeader();
    const womenLink = screen.getByRole('link', { name: 'WOMEN' });

    act(() => womenLink.focus());
    await screen.findByRole('list', { name: 'Women categories' });
    await user.tab();

    expect(screen.getByRole('link', { name: 'Women Pants' })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('list', { name: 'Women categories' })
    ).not.toBeInTheDocument();
    expect(womenLink).toHaveFocus();
  });

  it('should close the menu when focus moves out of the category', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockResolvedValue(MENU);
    renderHeader();

    act(() => screen.getByRole('link', { name: 'WOMEN' }).focus());
    await screen.findByRole('list', { name: 'Women categories' });
    await user.tab(); // Women Pants
    await user.tab(); // Women Knit
    await user.tab(); // MEN

    expect(screen.getByRole('link', { name: 'MEN' })).toHaveFocus();
    expect(
      screen.queryByRole('list', { name: 'Women categories' })
    ).not.toBeInTheDocument();
  });

  it('should navigate to the subcategory and close the menu when it is clicked', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockResolvedValue(MENU);
    const router = renderHeader();

    act(() => screen.getByRole('link', { name: 'WOMEN' }).focus());
    await screen.findByRole('list', { name: 'Women categories' });
    await user.tab(); // Women Pants
    await user.keyboard('{Enter}');

    expect(router.state.location.pathname).toBe('/categories/51');
    expect(
      screen.queryByRole('list', { name: 'Women categories' })
    ).not.toBeInTheDocument();
  });

  it('should close the menu when the category link is clicked', async () => {
    const user = userEvent.setup();
    getCategoryMenu.mockResolvedValue(MENU);
    const router = renderHeader();
    const menLink = screen.getByRole('link', { name: 'MEN' });

    await user.hover(menLink);
    await screen.findByRole('list', { name: 'Men categories' });
    await user.click(menLink);

    expect(router.state.location.pathname).toBe('/men');
    expect(
      screen.queryByRole('list', { name: 'Men categories' })
    ).not.toBeInTheDocument();
  });

  it('should not fetch the menu on the default header', () => {
    getCategoryMenu.mockResolvedValue(MENU);
    renderHeader('default');

    expect(getCategoryMenu).not.toHaveBeenCalled();
  });
});
