import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from '../../context/AuthProvider.jsx';
import AccountPage from './AccountPage.jsx';

/**
 * Render trang Account trong router tối thiểu tại /account.
 * Router tối thiểu không có RequireAuth, nên mọi test phải đăng nhập trước khi render.
 */
function renderAccountPage() {
  const router = createMemoryRouter(
    [{ path: '/account', element: <AccountPage /> }],
    { initialEntries: ['/account'] }
  );
  render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

// AuthProvider chỉ đọc storage một lần lúc khởi tạo nên phải ghi trước render.
function logIn() {
  localStorage.setItem('user', JSON.stringify({ email: 'long@example.com' }));
}

afterEach(() => {
  localStorage.clear();
});

describe('AccountPage', () => {
  it('sets the page title', () => {
    logIn();
    renderAccountPage();

    expect(document.title).toBe('Membership | UNIQLO');
  });

  it('shows the email of the logged-in user', () => {
    logIn();
    renderAccountPage();

    expect(
      screen.getByText('Logged in as long@example.com')
    ).toBeInTheDocument();
  });

  it('links to the wishlist page', () => {
    logIn();
    renderAccountPage();

    expect(screen.getByRole('link', { name: 'Wishlist' })).toHaveAttribute(
      'href',
      '/wishlist'
    );
  });
});
