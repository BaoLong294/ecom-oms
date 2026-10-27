import styles from './Header.module.css';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon/Icon.jsx';
import { useCart } from '../../context/CartContext.js';

/**
 * Header dùng chung cho mọi trang, có 2 biến thể:
 * 'landing' (trong suốt, có menu WOMEN/MEN/KIDS/BABY) và 'default' (nền trắng, có viền dưới, không có menu).
 * Skip link được đặt làm phần tử con đầu tiên của <header>: header có position: fixed nên là
 * containing block của skip link, nhờ vậy lớp phủ (position: absolute; inset: 0) luôn khớp đúng
 * kích thước header ở mọi biến thể. Không chuyển skip link ra AppLayout, nếu không lớp phủ sẽ che toàn trang.
 * Link Cart hiện badge tổng số lượng trong giỏ; badge có aria-hidden nên số lượng được đưa
 * vào tên của link (ví dụ 'Cart, 4 items') để screen reader vẫn đọc được.
 * @param {{ headerVariant?: 'landing' | 'default' }} props
 * @param props.headerVariant - biến thể header, mặc định 'default'
 */
function Header({ headerVariant = 'default' }) {
  const location = useLocation();

  const { itemCount } = useCart();
  let cartLabel;

  if (itemCount < 1) {
    cartLabel = 'Cart';
  } else if (itemCount === 1) {
    cartLabel = 'Cart, 1 item';
  } else {
    cartLabel = `Cart, ${itemCount} items`;
  }

  const isLanding = headerVariant === 'landing';
  const headerClassName = isLanding
    ? `${styles.header} ${styles.landing}`
    : styles.header;

  return (
    <header className={headerClassName}>
      <a href="#main-content" className={styles.skipLink}>
        <span>Skip to main content</span>
      </a>

      <div className={styles.headerInner}>
        <div className={styles.uniqloIcon}>
          <Link to="/" aria-label="UNIQLO home">
            <Icon name="uniqlo-icon" />
          </Link>
        </div>

        {isLanding && (
          <nav className={styles.menu} aria-label="Categories">
            <ul>
              <li>WOMEN</li>
              <li>MEN</li>
              <li>KIDS</li>
              <li>BABY</li>
            </ul>
          </nav>
        )}

        <div className={styles.userActions}>
          {/* Gửi trang hiện tại để LoginPage quay về đây sau khi đăng nhập. */}
          <Link
            to="/login"
            state={{ from: location.pathname }}
            aria-label="Account"
          >
            <Icon name="account-icon" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist">
            <Icon name="heart-icon" />
          </Link>
          <Link to="/cart" aria-label={cartLabel} className={styles.cartLink}>
            <Icon name="cart-icon" />
            {itemCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
