import styles from './AccountPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Trang tài khoản của người đã đăng nhập, chỉ vào được qua `RequireAuth`
 * nên luôn có `user`.
 *
 * Hiện email đang đăng nhập, link tới Wishlist và nút LOG OUT.
 * LOG OUT chờ chuyển về trang chủ (thay mục lịch sử, Back không quay lại
 * trang tài khoản) rồi mới đăng xuất.
 *
 * @returns {JSX.Element} Trang tài khoản.
 */
function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // navigate của data router là bất đồng bộ: đăng xuất trước khi URL rời /account
  // thì RequireAuth thấy khách và chuyển sang /login thay vì về trang chủ.
  async function handleLogout() {
    await navigate('/', { replace: true });
    logout();
  }

  return (
    <div className={styles.page}>
      <title>Membership | UNIQLO</title>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbsLink}>
          UNIQLO
        </Link>{' '}
        / MEMBERSHIP
      </nav>
      <h1 className={styles.title}>MEMBERSHIP</h1>
      <p className={styles.email}>Logged in as {user.email}</p>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link to="/wishlist" className={styles.menuLink}>
            Wishlist
          </Link>
        </li>
      </ul>
      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        LOG OUT
      </button>
    </div>
  );
}

export default AccountPage;
