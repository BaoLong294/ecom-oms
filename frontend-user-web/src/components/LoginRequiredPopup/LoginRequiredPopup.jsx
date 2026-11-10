import styles from './LoginRequiredPopup.module.css';
import Modal from '../Modal/Modal';
import { Link, useLocation } from 'react-router-dom';

/**
 * Popup báo cần đăng nhập khi khách chưa đăng nhập thực hiện thao tác yêu cầu tài khoản
 * (thêm vào wishlist, thanh toán); câu giải thích do nơi dùng truyền qua message.
 * LOG IN dẫn tới trang login kèm trang hiện tại để đăng nhập xong quay về đúng chỗ;
 * CANCEL hoặc Escape chỉ đóng popup.
 * @param {object} props
 * @param {boolean} props.isOpen - popup đang mở hay không
 * @param {function(): void} props.onClose - gọi khi popup cần đóng (CANCEL, Escape)
 * @param {string} props.message - Câu giải thích vì sao cần đăng nhập
 * @returns {JSX.Element}
 */
function LoginRequiredPopup({ isOpen, onClose, message }) {
  // Popup tự đọc trang hiện tại thay vì nhận qua prop: trang nào mở popup thì pathname
  // chính là trang đó, nên mọi nơi dùng không phải truyền thêm.
  const location = useLocation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="login-required-title">
      <div className={styles.popup}>
        <h2 id="login-required-title" className={styles.title}>
          Login
        </h2>
        <p className={styles.message}>{message}</p>
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
