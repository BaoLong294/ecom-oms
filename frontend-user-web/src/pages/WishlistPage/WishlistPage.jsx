import styles from './WishlistPage.module.css';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useVariants } from '../../hooks/useVariants';
import { useState } from 'react';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { Link } from 'react-router-dom';
import WishlistItem from './WishlistItem';
import AddToCartPopup from '../../components/AddToCartPopup/AddToCartPopup';

// Trang wishlist không có stepper nên mỗi lần ADD TO CART luôn thêm 1 cái (giống vanilla).
const WISHLIST_ADD_QUANTITY = 1;

/**
 * Trang Wishlist: hiện các variant đã thêm vào wishlist theo thứ tự thêm, kèm số món.
 * Mỗi món có nút tim để xóa khỏi wishlist và nút ADD TO CART thêm 1 cái vào giỏ hàng
 * rồi mở popup xác nhận; món vẫn giữ trong wishlist sau khi thêm vào giỏ.
 * Wishlist rỗng được xét trước loading vì biết ngay từ storage, không cần chờ fetch.
 * @returns {JSX.Element}
 */
function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { variants, isLoading, errorMessage } = useVariants(items);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  function handleAddToCart(variantId) {
    addItem(variantId, WISHLIST_ADD_QUANTITY);
    setIsPopupOpen(true);
  }

  let content;
  if (items.length === 0) {
    content = (
      <div>
        <p className={styles.emptyText}>Your wishlist is currently empty.</p>
        <Link to="/" className={styles.emptyContinue}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  } else if (isLoading) {
    content = <StatusMessage variant="loading" />;
  } else if (errorMessage) {
    content = <StatusMessage variant="error" message={errorMessage} />;
  } else {
    const wishlistRows = items.flatMap((variantId) => {
      const variant = variants.find((item) => item.id === variantId);

      if (!variant) return [];

      return [variant];
    });

    content = (
      <div className={styles.filled}>
        <section aria-label="Wishlist summary">
          <p className={styles.count}>{wishlistRows.length} item(s)</p>
        </section>

        <ul className={styles.rows}>
          {wishlistRows.map((row) => (
            <WishlistItem
              key={row.id}
              item={row}
              onRemove={() => removeItem(row.id)}
              onAddToCart={() => handleAddToCart(row.id)}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbsLink}>
          UNIQLO
        </Link>{' '}
        / WISHLIST
      </nav>

      <h1 className={styles.title}>WISHLIST</h1>

      {content}

      <AddToCartPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        addedQuantity={WISHLIST_ADD_QUANTITY}
      />
    </div>
  );
}

export default WishlistPage;
