import styles from './OrderDetailPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { formatOrderDate } from '../../utils/date';
import { formatToUSD } from '../../utils/price';
import OrderItem from './OrderItem';
import OrderStatusTimeline from './OrderStatusTimeline';

/**
 * Trang chi tiết một đơn hàng, chỉ vào được qua RequireAuth nên luôn có user.
 * Hiện ngày đặt, timeline trạng thái, các món (mỗi món dẫn tới trang sản phẩm),
 * địa chỉ giao hàng và khối tổng tiền. Đơn không tồn tại, thuộc tài khoản khác,
 * hoặc id trên URL không phải số đều hiện chung một màn not found.
 * Không có loading/lỗi vì đơn đọc đồng bộ từ OrdersContext.
 * @returns {JSX.Element}
 */
function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { orders } = useOrders();

  // id trên URL là chuỗi nên phải Number(); 'abc' thành NaN, không khớp đơn nào.
  // Kiểm tra cả email: đơn của người khác cũng coi như không tồn tại, không tiết lộ
  // là đơn đó có thật. find không khớp trả undefined nên đổi về null.
  const order =
    orders.find(
      (entry) => entry.id === Number(id) && entry.email === user.email
    ) ?? null;

  let pageTitle;
  let content;

  if (order === null) {
    pageTitle = 'Order not found';
    content = (
      <>
        <p className={styles.notFoundText}>This order doesn't exist.</p>
        <Link to="/orders" className={styles.backLink}>
          BACK TO ORDER HISTORY
        </Link>
      </>
    );
  } else {
    const { firstName, lastName, address, phone } = order.shipping;
    // Tổng số lượng chứ không phải số dòng món, cùng cách đếm với giỏ hàng.
    const itemCount = order.items.reduce(
      (count, item) => count + item.quantity,
      0
    );
    const total = formatToUSD(order.total);

    pageTitle = `Order #${order.id}`;
    content = (
      <div className={styles.filled}>
        <div className={styles.details}>
          <p className={styles.date}>
            Placed on {formatOrderDate(order.createdAt)}
          </p>

          <OrderStatusTimeline status={order.status} />

          <section aria-labelledby="order-items-title">
            <h2 id="order-items-title" className={styles.sectionTitle}>
              ITEMS
            </h2>
            <ul className={styles.items}>
              {order.items.map((item) => (
                <OrderItem key={item.variantId} item={item} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="order-shipping-title">
            <h2 id="order-shipping-title" className={styles.sectionTitle}>
              DELIVERY ADDRESS
            </h2>
            <p className={styles.shippingText}>
              {firstName} {lastName}
            </p>
            <p className={styles.shippingText}>{address}</p>
            <p className={styles.shippingText}>{phone}</p>
          </section>
        </div>

        <section aria-label="Order summary" className={styles.summary}>
          <div className={`${styles.summaryRow} ${styles.strong}`}>
            <p>ORDER SUMMARY</p>
            <p>{itemCount} ITEM(S)</p>
          </div>

          <div className={styles.summaryRow}>
            <p>Subtotal</p>
            <p>{total}</p>
          </div>

          <div className={styles.summaryRow}>
            <p>Shipping</p>
            <p>Free</p>
          </div>

          <div className={`${styles.summaryRow} ${styles.strong}`}>
            <p>ORDER TOTAL</p>
            <p>{total}</p>
          </div>

          <p className={styles.payment}>Payment method: Cash on delivery</p>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <title>{`${pageTitle} | UNIQLO`}</title>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbsLink}>
          UNIQLO
        </Link>{' '}
        /{' '}
        <Link to="/account" className={styles.breadcrumbsLink}>
          MEMBERSHIP
        </Link>{' '}
        /{' '}
        <Link to="/orders" className={styles.breadcrumbsLink}>
          ORDER HISTORY
        </Link>{' '}
        / {pageTitle.toUpperCase()}
      </nav>

      <h1 className={styles.title}>{pageTitle.toUpperCase()}</h1>

      {content}
    </div>
  );
}

export default OrderDetailPage;
