import { createContext, useContext } from 'react';

export const WishlistContext = createContext(null);

/**
 * Đọc hook này để dùng wishlist trong mọi component nằm dưới WishlistProvider.
 * @returns {{ items: number[], isInWishlist: function(number): boolean,
 *   addItem: function(number): void, removeItem: function(number): void }}
 * @throws {Error} khi được gọi bên ngoài WishlistProvider
 */
export function useWishlist() {
  const value = useContext(WishlistContext);

  if (value === null) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }

  return value;
}
