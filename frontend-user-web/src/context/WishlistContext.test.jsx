import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WishlistProvider from './WishlistProvider';
import { useWishlist } from './WishlistContext';

// Component chỉ dùng trong test: in state của context thành chữ và gọi các hàm của nó.
function WishlistStatus() {
  const { items, isInWishlist, addItem, removeItem } = useWishlist();

  return (
    <>
      <p>{items.join(', ') || 'none'}</p>
      <p>{isInWishlist(12) ? 'Has 12: yes' : 'Has 12: no'}</p>
      <button type="button" onClick={() => addItem(12)}>
        Add 12
      </button>
      <button type="button" onClick={() => addItem(7)}>
        Add 7
      </button>
      <button type="button" onClick={() => removeItem(12)}>
        Remove 12
      </button>
    </>
  );
}

function renderWishlist() {
  render(
    <WishlistProvider>
      <WishlistStatus />
    </WishlistProvider>
  );
}

function storeWishlist(ids) {
  localStorage.setItem('wishlist', JSON.stringify(ids));
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useWishlist', () => {
  it('throws when used outside WishlistProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<WishlistStatus />)).toThrow(
      'useWishlist must be used inside WishlistProvider'
    );
  });
});

describe('initial state', () => {
  it('starts empty when nothing is stored', () => {
    renderWishlist();

    expect(screen.getByText('none')).toBeInTheDocument();
    expect(screen.getByText('Has 12: no')).toBeInTheDocument();
  });

  it('reads the stored wishlist', () => {
    storeWishlist([12, 7]);
    renderWishlist();

    expect(screen.getByText('12, 7')).toBeInTheDocument();
    expect(screen.getByText('Has 12: yes')).toBeInTheDocument();
  });

  it('starts empty when the stored value is not valid JSON', () => {
    localStorage.setItem('wishlist', 'not json');
    renderWishlist();

    expect(screen.getByText('none')).toBeInTheDocument();
  });
});

describe('actions', () => {
  function readStoredWishlist() {
    return JSON.parse(localStorage.getItem('wishlist'));
  }

  it('adds an item to the end and stores it', async () => {
    const user = userEvent.setup();
    storeWishlist([7]);
    renderWishlist();

    expect(screen.getByText('7')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add 12' }));

    expect(screen.getByText('7, 12')).toBeInTheDocument();
    expect(readStoredWishlist()).toEqual([7, 12]);
  });

  it('does not add an item that is already in the wishlist', async () => {
    const user = userEvent.setup();
    storeWishlist([12]);
    renderWishlist();

    await user.click(screen.getByRole('button', { name: 'Add 12' }));

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(readStoredWishlist()).toEqual([12]);
  });

  it('removes an item and stores the result', async () => {
    const user = userEvent.setup();
    storeWishlist([12, 7]);
    renderWishlist();

    expect(screen.getByText('12, 7')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove 12' }));

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(readStoredWishlist()).toEqual([7]);
  });

  it('updates isInWishlist after adding an item', async () => {
    const user = userEvent.setup();
    renderWishlist();

    expect(screen.getByText('Has 12: no')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add 12' }));

    expect(screen.getByText('Has 12: yes')).toBeInTheDocument();
  });
});
