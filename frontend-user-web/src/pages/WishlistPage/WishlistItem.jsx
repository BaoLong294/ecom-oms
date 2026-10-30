import styles from './WishlistItem.module.css';
import Icon from '../../components/Icon/Icon';
import Price from '../../components/Price/Price';

/**
 * Một món trong trang Wishlist: ảnh màu, tên, nút tim xóa khỏi wishlist, màu, size,
 * giá và nút ADD TO CART. Không đọc context: dữ liệu và hành động do WishlistPage truyền vào.
 * @param {object} props
 * @param {object} props.item - variant từ getVariantsByIds (productName, colorName, colorImage, gender, size, price...)
 * @param {function(): void} props.onRemove - gọi khi bấm nút tim để xóa món khỏi wishlist
 * @param {function(): void} props.onAddToCart - gọi khi bấm ADD TO CART
 * @returns {JSX.Element}
 */
function WishlistItem({ item, onRemove, onAddToCart }) {
  const { colorImage, productName, colorName, gender, size } = item;

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
            aria-label={`Remove ${productName} from wishlist`}
            onClick={onRemove}
            className={styles.remove}
          >
            <Icon name="heart-icon-filled" />
          </button>
        </div>

        <p className={styles.detail}>Color: {colorName}</p>
        <p className={styles.detail}>
          Size: {gender} {size}
        </p>

        <div className={styles.price}>
          <Price item={item} />
        </div>

        {/* Tên bắt đầu bằng đúng chữ hiển thị (để điều khiển bằng giọng nói vẫn khớp)
            và kèm tên món, vì nút này lặp lại ở mọi món trong danh sách. */}
        <button
          type="button"
          className={styles.addToCart}
          aria-label={`ADD TO CART, ${productName}`}
          onClick={onAddToCart}
        >
          ADD TO CART
        </button>
      </div>
    </li>
  );
}

export default WishlistItem;
