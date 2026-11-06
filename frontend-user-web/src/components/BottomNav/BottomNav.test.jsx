import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import BottomNav from './BottomNav.jsx';

/**
 * Render BottomNav trong router tối thiểu (BottomNav dùng Link và useLocation).
 */
function renderBottomNav() {
  const router = createMemoryRouter([{ path: '/', element: <BottomNav /> }], {
    initialEntries: ['/'],
  });
  render(<RouterProvider router={router} />);
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
