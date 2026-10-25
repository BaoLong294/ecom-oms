import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth } from './AuthContext';
import AuthProvider from './AuthProvider';

// Chưa có component thật nào đọc trạng thái đăng nhập,
// nên dùng component này để hiển thị trạng thái và gọi login/logout.
function AuthStatus() {
  const { user, isLoggedIn, login, logout } = useAuth();

  return (
    <div>
      <p>{isLoggedIn ? `Logged in as ${user.email}` : 'Logged out'}</p>
      <button type="button" onClick={() => login('john.doe@gmail.com')}>
        Log in
      </button>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

function renderWithProvider() {
  render(
    <AuthProvider>
      <AuthStatus />
    </AuthProvider>
  );
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('AuthProvider', () => {
  it('shows logged out when storage is empty', () => {
    renderWithProvider();

    expect(screen.getByText('Logged out')).toBeInTheDocument();
  });

  it('restores the user saved in storage', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'jane@gmail.com' }));
    renderWithProvider();

    expect(screen.getByText('Logged in as jane@gmail.com')).toBeInTheDocument();
  });

  it('treats corrupted storage as logged out', () => {
    localStorage.setItem('user', 'not-json');
    renderWithProvider();

    expect(screen.getByText('Logged out')).toBeInTheDocument();
  });

  it('logs in, shows the email and saves it to storage', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(
      screen.getByText('Logged in as john.doe@gmail.com')
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      email: 'john.doe@gmail.com',
    });
  });

  it('logs out and removes the user from storage', async () => {
    const user = userEvent.setup();
    localStorage.setItem('user', JSON.stringify({ email: 'jane@gmail.com' }));
    renderWithProvider();
    expect(screen.getByText('Logged in as jane@gmail.com')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Log out' }));

    expect(screen.getByText('Logged out')).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull();
  });
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<AuthStatus />)).toThrow(
      'useAuth must be used inside AuthProvider'
    );
  });
});
