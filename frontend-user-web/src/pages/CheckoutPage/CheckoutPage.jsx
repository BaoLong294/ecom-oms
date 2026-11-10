import styles from './CheckoutPage.module.css';
import { Link } from 'react-router-dom';
import { useCartVariants } from '../../context/useCartVariants';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { getCartTotal } from '../../utils/cart';
import { formatToUSD } from '../../utils/price';

/**
 * Trang thanh toán, chỉ người đã đăng nhập vào được nhờ RequireAuth.
 * Chỉ đọc giỏ hàng (không sửa) qua useCartVariants để hiện khối tóm tắt đơn:
 * số lượng món, tạm tính, phí vận chuyển (miễn phí) và tổng tiền.
 * Giỏ rỗng hiện thông báo ngay, xét trước loading vì không cần chờ giá.
 * Bên trái là phần giao hàng; form giao hàng và đặt hàng thêm ở bước sau.
 * @returns {JSX.Element}
 */
function CheckoutPage() {
  const { items, itemCount, variants, isLoading, errorMessage } =
    useCartVariants();

  let content;
  if (items.length === 0) {
    content = (
      <div>
        <p className={styles.emptyText}>Your cart is currently empty.</p>
        <Link to="/" className={styles.emptyContinue}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  } else if (isLoading) {
    content = <StatusMessage variant="loading" />;
  } else if (errorMessage) {
    content = <StatusMessage variant="error" message={errorMessage} />;
  } else {
    const total = formatToUSD(getCartTotal(items, variants));

    content = (
      <div className={styles.filled}>
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>DELIVERY ADDRESS</h2>
          <p className={styles.detailsText}>
            Please make sure the delivery address is correct. Orders with an
            incorrect address may be cancelled or delayed.
          </p>
        </div>

        <section aria-label="Order summary" className={styles.summary}>
          <div className={styles.summaryRow}>
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

          <div className={styles.summaryRow}>
            <p>ORDER TOTAL</p>
            <p>{total}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <title>Checkout | UNIQLO</title>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbsLink}>
          UNIQLO
        </Link>{' '}
        / CHECKOUT
      </nav>

      <h1 className={styles.title}>CHECKOUT</h1>

      {content}
    </div>
  );
}

export default CheckoutPage;
