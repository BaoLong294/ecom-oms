import styles from './CartItem.module.css';
import { formatToUSD, getEffectivePrice } from '../../utils/price';
import Price from '../../components/Price/Price';
import QuantityStepper from '../../components/QuantityStepper/QuantityStepper';

/**
 * Một món trong trang giỏ hàng: ảnh màu, tên, nút xóa, màu, size, giá,
 * bộ chỉnh số lượng và subtotal (giá sau giảm × số lượng).
 * Không đọc giỏ hàng trực tiếp: CartPage truyền sẵn dữ liệu đã ghép và các hàm thao tác.
 * @param {object} props
 * @param {object} props.item - variant từ getVariantsByIds đã ghép thêm quantity từ giỏ hàng
 * @param {function(number): void} props.onQuantityChange - nhận số lượng mới của món này
 * @param {function(): void} props.onRemove - xóa món này khỏi giỏ
 */
function CartItem({ item, onQuantityChange, onRemove }) {
  const {
    colorImage,
    productName,
    colorName,
    gender,
    size,
    discountPercent,
    quantity,
  } = item;

  const subtotal = formatToUSD(getEffectivePrice(item) * quantity);

  const isDiscounted = discountPercent !== null;
  const subtotalClassName = isDiscounted
    ? `${styles.subtotal} ${styles.discounted}`
    : styles.subtotal;

  return (
    <li className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={colorImage} alt="" className={styles.image} />
      </div>

      <div className={styles.information}>
        <div className={styles.header}>
          <h2 className={styles.title}>{productName}</h2>
          <button
            type="button"
            aria-label={`Remove ${productName} from cart`}
            onClick={onRemove}
            className={styles.remove}
          >
            &times;
          </button>
        </div>

        <p className={styles.detail}>Color: {colorName}</p>
        <p className={styles.detail}>
          Size: {gender} {size}
        </p>

        <div className={styles.price}>
          <Price item={item} />
        </div>

        <div className={styles.quantity}>
          <p className={styles.quantityLabel}>QUANTITY</p>
          <QuantityStepper
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            itemName={productName}
          />
        </div>

        <p className={subtotalClassName}>
          SUBTOTAL: <span className={styles.subtotalPrice}>{subtotal}</span>
        </p>
      </div>
    </li>
  );
}

export default CartItem;
