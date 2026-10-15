import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon.jsx';

/**
 * Header dùng chung cho mọi trang, có 2 biến thể:
 * 'landing' (trong suốt, có menu WOMEN/MEN/KIDS/BABY) và 'default' (nền trắng, có viền dưới, không có menu).
 * Skip link được đặt làm phần tử con đầu tiên của <header>: header có position: fixed nên là
 * containing block của skip link, nhờ vậy lớp phủ (position: absolute; inset: 0) luôn khớp đúng
 * kích thước header ở mọi biến thể. Không chuyển skip link ra AppLayout, nếu không lớp phủ sẽ che toàn trang.
 * @param {{ headerVariant?: 'landing' | 'default' }} props
 * @param props.headerVariant - biến thể header, mặc định 'default'
 */
function Header({ headerVariant = 'default' }) {
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
          <Link to="/login" aria-label="Account">
            <Icon name="account-icon" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist">
            <Icon name="heart-icon" />
          </Link>
          <Link to="/cart" aria-label="Cart">
            <Icon name="cart-icon" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
