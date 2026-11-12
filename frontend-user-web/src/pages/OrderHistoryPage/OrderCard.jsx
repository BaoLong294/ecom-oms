import styles from './OrderCard.module.css';
import { Link } from 'react-router-dom';
import { formatOrderDate } from '../../utils/date';
import { formatToUSD } from '../../utils/price';
import { ORDER_STATUSES } from '../../config/orderStatuses';
/** @import { Order } from '../../context/OrdersProvider' */

/**
 * Một thẻ đơn trong trang lịch sử đơn hàng: số đơn, ngày đặt, số món,
 * tổng tiền và trạng thái. Cả thẻ bấm được nhờ stretched link (chỉ số đơn
 * là link tới trang chi tiết). Không đọc context, chỉ hiển thị đơn nhận qua prop.
 * @param {object} props
 * @param {Order} props.order - đơn đã lưu trong OrdersContext
 * @returns {React.JSX.Element}
 */
function OrderCard({ order }) {
  const { id, createdAt, items, total, status } = order;

  // Tổng số lượng chứ không phải số dòng món, cùng cách đếm với giỏ hàng.
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const statusLabel = ORDER_STATUSES.find(
    (entry) => entry.value === status
  ).label;

  return (
    <li className={styles.card}>
      <h2 className={styles.number}>
        <Link to={`/orders/${id}`} className={styles.link}>
          Order #{id}
        </Link>
      </h2>
      <p className={styles.date}>Placed on {formatOrderDate(createdAt)}</p>
      <p className={styles.itemCount}>{itemCount} item(s)</p>
      <p className={styles.total}>{formatToUSD(total)}</p>
      <p className={styles.status}>{statusLabel}</p>
    </li>
  );
}

export default OrderCard;
