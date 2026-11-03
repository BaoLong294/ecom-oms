import styles from './NotFoundPage.module.css';
import { Link } from 'react-router-dom';

/**
 * Trang 404 cho mọi đường dẫn không khớp route nào: tiêu đề, một câu mô tả
 * và link về trang chủ, style theo trạng thái giỏ rỗng của trang Cart.
 */
function NotFoundPage() {
  return (
    <div className={styles.page}>
      <title>404 - Page not found | UNIQLO</title>
      <h1 className={styles.title}>404 - Page not found</h1>
      <p className={styles.message}>This page doesn't exist.</p>
      <Link to="/" className={styles.homeLink}>
        Back to Homepage
      </Link>
    </div>
  );
}

export default NotFoundPage;
