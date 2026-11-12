import styles from './OrderHistoryPage.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import OrderCard from './OrderCard';

/**
 * Trang lịch sử đơn hàng, chỉ vào được qua RequireAuth nên luôn có user.
 * Chỉ hiện đơn của người đang đăng nhập, đơn mới nhất đứng đầu; mỗi đơn là
 * một thẻ dẫn tới trang chi tiết. Chưa có đơn thì hiện thông báo trống.
 * Không có loading/lỗi vì đơn đọc đồng bộ từ OrdersContext.
 * @returns {React.JSX.Element}
 */
function OrderHistoryPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  // Đơn của mọi tài khoản trên trình duyệt lưu chung một chỗ nên phải lọc theo email.
  // filter trả mảng mới nên sort không sắp lại state; sắp theo createdAt vì
  // "mới nhất" là thời điểm đặt, không phải id.
  const userOrders = orders
    .filter((order) => order.email === user.email)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  let content;
  if (userOrders.length === 0) {
    content = (
      <div>
        <p className={styles.emptyText}>You have no orders yet.</p>
        <Link to="/" className={styles.emptyContinue}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  } else {
    content = (
      <>
        <p className={styles.count}>{userOrders.length} order(s)</p>
        <ul aria-label="Orders" className={styles.list}>
          {userOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      </>
    );
  }

  return (
    <div className={styles.page}>
      <title>Order History | UNIQLO</title>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbsLink}>
          UNIQLO
        </Link>{' '}
        /{' '}
        <Link to="/account" className={styles.breadcrumbsLink}>
          MEMBERSHIP
        </Link>{' '}
        / ORDER HISTORY
      </nav>

      <h1 className={styles.title}>ORDER HISTORY</h1>

      {content}
    </div>
  );
}

export default OrderHistoryPage;
