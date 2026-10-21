import styles from './StatusMessage.module.css';

/**
 * Hiển thị thông báo khi trang đang fetch dữ liệu hoặc dữ liệu trả về gặp lỗi.
 * @param {{ variant: 'loading' | 'error', message?: string }} props
 * @param props.variant - biến thể của trạng thái cần hiển thị: 'loading' cho trạng thái chờ và 'error' cho trạng thái lỗi.
 * @param props.message - thông báo hiển thị lên trình duyệt, với giá trị mặc định là 'Loading...'.
 */
function StatusMessage({ variant, message = 'Loading...' }) {
  const isLoading = variant === 'loading';
  const textClassName = isLoading
    ? styles.message
    : `${styles.message} ${styles.error}`;

  return (
    <p className={textClassName}>
      {isLoading && <span className={styles.loadingIcon} aria-hidden="true" />}
      {message}
    </p>
  );
}

export default StatusMessage;
