import styles from './ProductCard.module.css';
import Icon from '../Icon/Icon.jsx';
import { Link } from 'react-router-dom';
import Price from '../Price/Price.jsx';

/**
 * Card sản phẩm trong trang danh sách: ảnh màu đầu tiên, các swatch màu, nút tim,
 * giới tính, dải size, tên và giá. Tên sản phẩm là link tới trang chi tiết; lớp phủ
 * ::after của link phủ kín card (stretched link) nên bấm vào bất kỳ đâu trên card
 * cũng điều hướng. Nút tim nằm trên lớp phủ, chỉ báo lên cha qua onWishlistClick;
 * cha quyết định mở popup nào (đăng nhập hoặc wishlist), nên card không đọc context.
 * Có giảm giá thì hiện giá sau giảm màu đỏ kèm discountInfo, không hiện giá gốc.
 * @param {object} props
 * @param {object} props.product - sản phẩm trả về từ service, gồm id, name, gender,
 *   sizes, price, discountPercent, discountInfo và colors ({ code, name, swatch, image })
 * @param {function(object): void} props.onWishlistClick - gọi với product khi bấm nút tim.
 */
function ProductCard({ product, onWishlistClick }) {
  const { id, name, gender, sizes, colors } = product;

  const sizeRange = `${sizes[0]}-${sizes.at(-1)}`;

  return (
    <div className={styles.card}>
      <img src={colors[0].image} alt="" className={styles.image} />

      <div className={styles.colorOptions}>
        <div className={styles.swatches}>
          {colors.map((color) => (
            <img
              key={color.code}
              src={color.swatch}
              alt={color.name}
              className={styles.swatch}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.wishlist}
          aria-label={`Add ${name} to wishlist`}
          aria-haspopup="dialog"
          onClick={() => onWishlistClick(product)}
        >
          <Icon name="heart-icon" />
        </button>
      </div>

      <div className={styles.details}>
        <div className={styles.meta}>
          <p className={styles.gender}>{gender}</p>
          <p className={styles.sizes}>{sizeRange}</p>
        </div>
        <h3 className={styles.name}>
          <Link to={`/products/${id}`} className={styles.link}>
            {name}
          </Link>
        </h3>
        <div className={styles.price}>
          <Price item={product} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
