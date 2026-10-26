import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AuthProvider from '../../context/AuthProvider';
import LoginPage from './LoginPage';

const EMAIL_EMPTY = 'Please enter an email address.';
const EMAIL_INVALID = 'Please enter a valid email address.';
const PASSWORD_EMPTY = 'Please enter a password.';
const PASSWORD_INVALID = 'Please input valid password.';

function renderLoginPage(entry = '/login') {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <h1>Home page</h1> },
      { path: '/products/29', element: <h1>Product page</h1> },
    ],
    { initialEntries: [entry] }
  );

  render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

afterEach(() => localStorage.clear());

describe('Validation on blur', () => {
  it('does not flag an empty email on blur before submit', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const emailInput = screen.getByLabelText(/^email address/i);

    await user.click(emailInput);
    await user.tab();

    expect(emailInput).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText(EMAIL_EMPTY)).not.toBeInTheDocument();
  });

  it('flags an invalid email on blur without a message before submit', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const emailInput = screen.getByLabelText(/^email address/i);

    await user.type(emailInput, 'john.doe');
    await user.tab();

    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText(EMAIL_INVALID)).not.toBeInTheDocument();
  });

  it('flags a password without digits on blur before submit', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const passwordInput = screen.getByLabelText(/^password/i);

    await user.type(passwordInput, 'abcdefgh');
    await user.tab();

    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText(PASSWORD_INVALID)).not.toBeInTheDocument();
  });
});

describe('Validation on submit', () => {
  it('shows both empty messages when submitting an empty form', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(screen.getByText(EMAIL_EMPTY)).toBeInTheDocument();
    expect(screen.getByText(PASSWORD_EMPTY)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email address/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText(/^password/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('shows both invalid messages for malformed values', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/^email address/i), 'john.doe');
    await user.type(screen.getByLabelText(/^password/i), 'abcdefgh');
    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(screen.getByText(EMAIL_INVALID)).toBeInTheDocument();
    expect(screen.getByText(PASSWORD_INVALID)).toBeInTheDocument();
  });

  it('keeps the email message while typing until blur', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const emailInput = screen.getByLabelText(/^email address/i);

    await user.click(screen.getByRole('button', { name: 'LOG IN' }));
    await user.type(emailInput, 'john.doe@gmail.com');

    expect(screen.getByText(EMAIL_EMPTY)).toBeInTheDocument();
  });

  it('clears the email message on blur after a valid value', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const emailInput = screen.getByLabelText(/^email address/i);

    await user.click(screen.getByRole('button', { name: 'LOG IN' }));
    await user.type(emailInput, 'john.doe@gmail.com');
    await user.tab();

    expect(screen.queryByText(EMAIL_EMPTY)).not.toBeInTheDocument();
    expect(emailInput).not.toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Show password', () => {
  it('toggles the password visibility', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const passwordInput = screen.getByLabelText(/^password/i);
    const showPassword = screen.getByRole('checkbox', {
      name: 'Show my password',
    });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(showPassword);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(showPassword);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

describe('Login', () => {
  it('saves the trimmed email and goes to the home page by default', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(
      screen.getByLabelText(/^email address/i),
      '  john.doe@gmail.com  '
    );
    await user.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(
      screen.getByRole('heading', { name: 'Home page' })
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      email: 'john.doe@gmail.com',
    });
  });

  it('returns to the page the user came from', async () => {
    const user = userEvent.setup();
    renderLoginPage({ pathname: '/login', state: { from: '/products/29' } });

    await user.type(
      screen.getByLabelText(/^email address/i),
      'john.doe@gmail.com'
    );
    await user.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(
      screen.getByRole('heading', { name: 'Product page' })
    ).toBeInTheDocument();
  });

  it('stays on the login page when the form is invalid', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/^email address/i), 'john.doe');
    await user.type(screen.getByLabelText(/^password/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: 'LOG IN' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'LOGIN' })
    ).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
