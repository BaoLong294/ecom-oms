import { useState } from 'react';
import { WishlistContext } from './WishlistContext';

const WISHLIST_STORAGE_KEY = 'wishlist';

/**
 * Đọc wishlist đã lưu để làm state ban đầu. Không có dữ liệu hoặc dữ liệu hỏng
 * thì coi như wishlist rỗng.
 * @returns {number[]} danh sách variantId theo thứ tự đã thêm
 */
function readStoredWishlist() {
  try {
    const value = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return JSON.parse(value) ?? [];
  } catch {
    return [];
  }
}

/**
 * Giữ wishlist (danh sách variantId) cho toàn app và lưu lại vào localStorage
 * mỗi khi thêm hoặc xóa.
 * @param {object} props
 * @param {React.ReactNode} props.children - phần app được dùng wishlist
 * @returns {JSX.Element}
 */
function WishlistProvider({ children }) {
  const [items, setItems] = useState(readStoredWishlist);

  /**
   * @param {number} variantId
   * @returns {boolean} true nếu variant đã có trong wishlist
   */
  function isInWishlist(variantId) {
    return items.includes(variantId);
  }

  /**
   * Thêm variant vào cuối wishlist, bỏ qua nếu đã có.
   * @param {number} variantId
   */
  function addItem(variantId) {
    if (isInWishlist(variantId)) return;

    const newItems = [...items, variantId];
    setItems(newItems);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
  }

  /**
   * Xóa variant khỏi wishlist.
   * @param {number} variantId
   */
  function removeItem(variantId) {
    const newItems = items.filter((item) => item !== variantId);
    setItems(newItems);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
  }

  return (
    <WishlistContext value={{ items, isInWishlist, addItem, removeItem }}>
      {children}
    </WishlistContext>
  );
}

export default WishlistProvider;
