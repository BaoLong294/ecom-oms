import styles from './BottomNav.module.css';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon/Icon.jsx';

/**
 * Bottom navigation cho một số trang.
 */
function BottomNav() {
  const location = useLocation();

  return (
    <nav className={styles.bottomNav} aria-label="Shortcuts">
      <div className={styles.bottomInner}>
        <Link to="/" aria-label="Home">
          <Icon name="home-icon" />
        </Link>

        <button type="button" aria-label="Search">
          <Icon name="search-icon" />
        </button>

        {/* Gửi trang hiện tại để LoginPage quay về đây sau khi đăng nhập. */}
        <Link
          to="/login"
          state={{ from: location.pathname }}
          aria-label="Account"
        >
          <Icon name="user-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default BottomNav;
