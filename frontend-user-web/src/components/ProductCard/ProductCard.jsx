import styles from './ProductCard.module.css';
import Icon from '../Icon/Icon.jsx';
import { Link } from 'react-router-dom';
import { formatToUSD, getEffectivePrice } from '../../utils/price';

/**
 * Card sản phẩm trong trang danh sách: ảnh màu đầu tiên, các swatch màu,
 * nút tim (tạm vô hiệu, gắn hành vi ở Phần 11), giới tính, dải size, tên và giá.
 * Tên sản phẩm là link tới trang chi tiết; lớp phủ ::after của link phủ kín card
 * (stretched link) nên bấm vào bất kỳ đâu trên card cũng điều hướng.
 * Có giảm giá thì hiện giá sau giảm màu đỏ kèm discountInfo, không hiện giá gốc.
 * @param {object} props
 * @param {object} props.product - sản phẩm trả về từ service, gồm id, name, gender,
 *   sizes, price, discountPercent, discountInfo và colors ({ code, name, swatch, image })
 */
function ProductCard({ product }) {
  const { id, name, gender, discountPercent, discountInfo, sizes, colors } =
    product;

  const sizeRange = `${sizes[0]}-${sizes.at(-1)}`;

  const isDiscounted = discountPercent !== null;
  const priceClassName = isDiscounted
    ? styles.discountPrice
    : styles.regularPrice;
  const finalPrice = formatToUSD(getEffectivePrice(product));

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
          disabled
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
        <div>
          <p className={priceClassName}>{finalPrice}</p>
          {isDiscounted && discountInfo && (
            <p className={styles.discountInfo}>{discountInfo}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
