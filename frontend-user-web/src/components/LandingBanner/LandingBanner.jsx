import { Link } from 'react-router-dom';
import { formatToUSD, getEffectivePrice } from '../../utils/price';
import styles from './LandingBanner.module.css';

/**
 * Banner toàn màn hình trên trang chủ, bấm vào dẫn tới trang danh sách của category đích.
 * @param {object} props
 * @param {object} props.banner - Một banner lấy từ getLandingBanners
 *   ({ targetCategoryId, title, subtitle, description, price, discountPercent, discountInfo, image, alt }).
 */
function LandingBanner({ banner }) {
  const {
    targetCategoryId,
    title,
    subtitle,
    description,
    price,
    discountPercent,
    discountInfo,
    image,
    alt,
  } = banner;

  const isDiscounted = discountPercent !== null;
  const originalPrice = formatToUSD(price);
  const finalPrice = formatToUSD(getEffectivePrice(banner));

  return (
    <Link to={`/categories/${targetCategoryId}`} className={styles.link}>
      <div className={styles.banner}>
        <img className={styles.image} src={image} alt={alt} />

        <div className={styles.info}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <p className={styles.description}>{description}</p>

          <div>
            {isDiscounted ? (
              <>
                <p className={styles.discountPrice}>{finalPrice}</p>
                <p className={styles.originalPrice}>{originalPrice}</p>
                {discountInfo && (
                  <p className={styles.discountInfo}>{discountInfo}</p>
                )}
              </>
            ) : (
              <p className={styles.regularPrice}>{originalPrice}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default LandingBanner;
