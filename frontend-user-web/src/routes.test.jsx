import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes.jsx';

function renderWithRouter(url) {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  render(<RouterProvider router={router} />);
}

describe('routes', () => {
  it('should render the home page at /', () => {
    renderWithRouter('/');

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
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
      screen.getByRole('heading', { name: 'Wishlist' })
    ).toBeInTheDocument();
  });

  it('should render the cart page at /cart', () => {
    renderWithRouter('/cart');

    expect(screen.getByRole('heading', { name: 'Cart' })).toBeInTheDocument();
  });

  it('should render the login page at /login', () => {
    renderWithRouter('/login');

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
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
