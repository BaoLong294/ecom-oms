import styles from './AppLayout.module.css';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import BottomNav from '../BottomNav/BottomNav.jsx';

/**
 * Khung bọc mọi trang: Header, vùng nội dung chính (Outlet) và BottomNav.
 * Mỗi layout route trong routes.jsx truyền prop khác nhau để chọn biến thể header
 * và quyết định có hiện BottomNav hay không.
 * @param {{ headerVariant: 'landing' | 'default', hasBottomNav: boolean }} props
 * @param props.headerVariant - biến thể header truyền xuống Header: 'landing' cho trang chủ, 'default' cho các trang còn lại
 * @param props.hasBottomNav - true thì render BottomNav ở đáy màn hình, false thì ẩn (Cart, Wishlist, Login, 404)
 */
function AppLayout({ headerVariant, hasBottomNav }) {
  const isDefault = headerVariant === 'default';

  return (
    <>
      <Header headerVariant={headerVariant} />

      <main
        id="main-content"
        tabIndex={-1}
        className={isDefault ? styles.belowFixedHeader : undefined}
      >
        <Outlet />
      </main>

      {hasBottomNav && <BottomNav />}
    </>
  );
}

export default AppLayout;
