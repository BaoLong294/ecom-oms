import styles from './BottomNav.module.css';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon/Icon';
import SearchPanel from './SearchPanel';
import { useAuth } from '../../context/AuthContext';

/**
 * Thanh điều hướng nổi ở đáy màn hình (Home, Search, Account), chỉ hiện ở các trang
 * landing, danh sách và chi tiết sản phẩm.
 * Nút Search mở khung tìm kiếm (SearchPanel) dạng dialog modal ngay trên thanh này.
 * SearchPanel đặt ngoài <nav>: nav có pointer-events: none (thuộc tính kế thừa) để chỉ
 * các nút nhận click, nằm bên trong thì dialog cũng không bấm được.
 * Link Account đổi đích theo trạng thái đăng nhập: đã đăng nhập thì tới /account, khách thì tới
 * /login kèm state.from là trang hiện tại để quay lại sau khi đăng nhập.
 */
function BottomNav() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <>
      <nav className={styles.bottomNav} aria-label="Shortcuts">
        <div className={styles.bottomInner}>
          <Link to="/" aria-label="Home">
            <Icon name="home-icon" />
          </Link>

          <button
            type="button"
            aria-label="Search"
            aria-haspopup="dialog"
            onClick={() => setIsSearchOpen(true)}
          >
            <Icon name="search-icon" />
          </button>

          {/* Gửi trang hiện tại để LoginPage quay về đây sau khi đăng nhập. */}
          <Link
            to={isLoggedIn ? '/account' : '/login'}
            state={isLoggedIn ? undefined : { from: location.pathname }}
            aria-label="Account"
          >
            <Icon name="user-icon" />
          </Link>
        </div>
      </nav>
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default BottomNav;
