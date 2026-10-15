import styles from './BottomNav.module.css';
import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon.jsx';

/**
 * Bottom navigation cho một số trang.
 */
function BottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="Shortcuts">
      <div className={styles.bottomInner}>
        <Link to="/" aria-label="Home">
          <Icon name="home-icon" />
        </Link>

        <button type="button" aria-label="Search">
          <Icon name="search-icon" />
        </button>

        <Link to="/login" aria-label="Account">
          <Icon name="user-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default BottomNav;
