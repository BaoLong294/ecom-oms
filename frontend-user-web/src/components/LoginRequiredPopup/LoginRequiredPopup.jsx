import styles from './LoginRequiredPopup.module.css';
import Modal from '../Modal/Modal';
import { Link, useLocation } from 'react-router-dom';

/**
 * Popup báo cần đăng nhập khi khách chưa đăng nhập bấm tim wishlist.
 * LOG IN dẫn tới trang login kèm trang hiện tại để đăng nhập xong quay về đúng chỗ;
 * CANCEL hoặc Escape chỉ đóng popup.
 * @param {object} props
 * @param {boolean} props.isOpen - popup đang mở hay không
 * @param {function(): void} props.onClose - gọi khi popup cần đóng (CANCEL, Escape)
 * @returns {JSX.Element}
 */
function LoginRequiredPopup({ isOpen, onClose }) {
  // Popup tự đọc trang hiện tại thay vì nhận qua prop: trang nào mở popup thì pathname
  // chính là trang đó, nên mọi nơi dùng (trang chi tiết, card ở Phần 11) không phải truyền thêm.
  const location = useLocation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="login-required-title">
      <div className={styles.popup}>
        <h2 id="login-required-title" className={styles.title}>
          Login
        </h2>
        <p className={styles.message}>
          You must be logged in to add to your wishlist.
        </p>
        <div className={styles.buttons}>
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className={styles.loginLink}
          >
            LOG IN
          </Link>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default LoginRequiredPopup;
