import styles from './OrderItem.module.css';
import { Link } from 'react-router-dom';
import { formatToUSD } from '../../utils/price';

/**
 * Một món trong trang chi tiết đơn, chỉ để xem (không có nút xóa hay stepper
 * như CartItem). Thông tin là bản chụp lúc đặt nên giá là unitPrice đã trừ
 * giảm giá. Cả khối là stretched link tới trang sản phẩm (chỉ tên là link).
 * @param {object} props
 * @param {{ productId: number, image: string, productName: string,
 *   colorName: string, size: string, quantity: number, unitPrice: number }} props.item
 *   - một món trong đơn đã lưu
 * @returns {JSX.Element}
 */
function OrderItem({ item }) {
  const {
    productId,
    image,
    productName,
    colorName,
    size,
    quantity,
    unitPrice,
  } = item;

  return (
    <li className={styles.item}>
      <div className={styles.imageWrapper}>
        <img src={image} alt="" className={styles.image} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link to={`/products/${productId}`} className={styles.link}>
            {productName}
          </Link>
        </h3>
        <p className={styles.detail}>Color: {colorName}</p>
        <p className={styles.detail}>Size: {size}</p>
        <p className={styles.price}>{formatToUSD(unitPrice)}</p>
        <p className={styles.detail}>Quantity: {quantity}</p>
        <p className={styles.subtotal}>
          SUBTOTAL: <span>{formatToUSD(unitPrice * quantity)}</span>
        </p>
      </div>
    </li>
  );
}

export default OrderItem;
