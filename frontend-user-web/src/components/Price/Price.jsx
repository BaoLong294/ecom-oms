import styles from './Price.module.css';
import { formatToUSD, getEffectivePrice } from '../../utils/price';

/**
 * Hiển thị giá dạng không có giá gốc, dùng chung cho card sản phẩm, giỏ hàng và wishlist.
 * Không giảm giá thì hiện giá thường; có giảm giá thì hiện giá sau giảm màu đỏ,
 * kèm discountInfo nếu có.
 * Component không đặt cỡ chữ cho giá: giá kế thừa font-size từ thẻ bọc của component cha.
 * Cha muốn discountInfo có cỡ khác giá thì đặt biến CSS --discount-info-size trên thẻ bọc,
 * không đặt thì discountInfo bằng cỡ chữ của giá.
 * @param {object} props
 * @param {object} props.item - đối tượng có price, discountPercent (number|null)
 *   và discountInfo (string|null), ví dụ product hoặc variant trả về từ service
 */
function Price({ item }) {
  const { discountPercent, discountInfo } = item;

  const isDiscounted = discountPercent !== null;
  const priceClassName = isDiscounted
    ? styles.discountPrice
    : styles.regularPrice;
  const finalPrice = formatToUSD(getEffectivePrice(item));

  return (
    <>
      <p className={priceClassName}>{finalPrice}</p>
      {isDiscounted && discountInfo && (
        <p className={styles.discountInfo}>{discountInfo}</p>
      )}
    </>
  );
}

export default Price;
