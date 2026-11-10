import styles from './CartPage.module.css';
import { useCartVariants } from '../../context/useCartVariants';
import { useCart } from '../../context/CartContext';
import { getCartTotal } from '../../utils/cart';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import CartItem from './CartItem';
import { formatToUSD } from '../../utils/price';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import LoginRequiredPopup from '../../components/LoginRequiredPopup/LoginRequiredPopup';

/**
 * Trang giỏ hàng. Giỏ hàng chỉ lưu variantId và quantity, nên trang lấy thông tin
 * các variant qua useCartVariants rồi ghép với số lượng thành từng dòng (cartRows),
 * giữ đúng thứ tự trong giỏ và bỏ qua món không còn variant (đã ngừng bán, id cũ).
 * Giỏ rỗng hiện thông báo ngay, xét trước trạng thái loading vì không cần chờ giá.
 * Đổi số lượng và xóa món đi qua CartContext; đổi số lượng không gọi lại service
 * vì danh sách id không đổi. CHECKOUT: đã đăng nhập thì sang /checkout; khách thì
 * mở popup yêu cầu đăng nhập (LOG IN dẫn tới login, đăng nhập xong quay về giỏ).
 */
function CartPage() {
  const { items, itemCount, variants, isLoading, errorMessage } =
    useCartVariants();
  const { changeQuantity, removeItem } = useCart();
  const { isLoggedIn } = useAuth();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  let content;
  if (items.length === 0) {
    content = (
      <div>
        <p className={styles.emptyText}>Your cart is currently empty.</p>
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
    const cartRows = items.flatMap((item) => {
      const variant = variants.find((v) => v.id === item.variantId);

      if (!variant) return [];

      return [{ ...variant, quantity: item.quantity }];
    });

    const total = formatToUSD(getCartTotal(items, variants));
    content = (
      <div className={styles.filled}>
        <ul className={styles.rows}>
          {cartRows.map((row) => (
            <CartItem
              key={row.id}
              item={row}
              onQuantityChange={(quantity) => changeQuantity(row.id, quantity)}
              onRemove={() => removeItem(row.id)}
            />
          ))}
        </ul>

        <section aria-label="Order summary" className={styles.summary}>
          <div className={styles.summaryRow}>
            <p>ORDER SUMMARY</p>
            <p>{itemCount} ITEM(S)</p>
          </div>

          <div className={styles.summaryRow}>
            <p>ORDER TOTAL</p>
            <p>{total}</p>
          </div>

          {isLoggedIn ? (
            <Link to="/checkout" className={styles.checkout}>
              CHECKOUT
            </Link>
          ) : (
            <button
              type="button"
              className={styles.checkout}
              aria-haspopup="dialog"
              onClick={() => setIsLoginPopupOpen(true)}
            >
              CHECKOUT
            </button>
          )}

          <Link to="/" className={styles.continue}>
            CONTINUE SHOPPING
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <title>Shopping Cart | UNIQLO</title>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbsLink}>
          UNIQLO
        </Link>{' '}
        / SHOPPING CART
      </nav>

      <h1 className={styles.title}>SHOPPING CART</h1>

      {content}

      <LoginRequiredPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
        message="You must be logged in to check out."
      />
    </div>
  );
}

export default CartPage;
