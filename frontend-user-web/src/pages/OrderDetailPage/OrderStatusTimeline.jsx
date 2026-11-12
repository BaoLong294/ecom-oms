import styles from './OrderStatusTimeline.module.css';
import { ORDER_STATUSES } from '../../config/orderStatuses';

/**
 * Timeline trạng thái của một đơn: các chặng lấy từ ORDER_STATUSES theo đúng thứ tự.
 * Chặng hiện tại có aria-current="step" để screen reader đọc "current step";
 * các chặng đã qua và chặng hiện tại được tô màu, các chặng sau để xám.
 * @param {object} props
 * @param {string} props.status - status của đơn ('placed', 'shipped' hoặc 'delivered')
 * @returns {React.JSX.Element}
 */
function OrderStatusTimeline({ status }) {
  // Vị trí của chặng hiện tại: chặng có index nhỏ hơn hoặc bằng là đã tới.
  const currentIndex = ORDER_STATUSES.findIndex(
    (entry) => entry.value === status
  );

  return (
    // <ol> vì các chặng có thứ tự; màu chỉ để nhìn, trạng thái cho screen reader
    // nằm ở aria-current.
    <ol aria-label="Order status" className={styles.timeline}>
      {ORDER_STATUSES.map((entry, index) => (
        <li
          key={entry.value}
          aria-current={index === currentIndex ? 'step' : undefined}
          className={
            index <= currentIndex
              ? `${styles.step} ${styles.done}`
              : styles.step
          }
        >
          {entry.label}
        </li>
      ))}
    </ol>
  );
}

export default OrderStatusTimeline;
