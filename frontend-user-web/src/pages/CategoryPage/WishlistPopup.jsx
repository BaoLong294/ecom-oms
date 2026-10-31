import styles from './WishlistPopup.module.css';
import { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import ColorOptions from '../../components/ColorOptions/ColorOptions';
import Icon from '../../components/Icon/Icon';
import Modal from '../../components/Modal/Modal';

/**
 * Nội dung popup wishlist của một sản phẩm: ảnh và tên màu đang chọn, nhóm radio
 * chọn màu, mỗi size một nút tim bật/tắt variant (màu đang chọn + size đó) trong
 * wishlist, nút × và CLOSE để đóng.
 * Chỉ được render khi popup mở, nên mỗi lần mở là một lần mount mới và màu đang
 * chọn luôn bắt đầu từ màu đầu tiên. Trạng thái tim là giá trị dẫn xuất từ
 * selectedColorCode và wishlist, nên đổi màu thì mọi tim tự đúng theo màu mới.
 * @param {object} props
 * @param {object} props.product - sản phẩm từ getCategoryListing (gồm name, sizes,
 *   colors, variants)
 * @param {function(): void} props.onClose - gọi khi bấm × hoặc CLOSE
 */
function WishlistOptions({ product, onClose }) {
  const { name, sizes, colors, variants } = product;

  const [selectedColorCode, setSelectedColorCode] = useState(colors[0].code);
  const { isInWishlist, addItem, removeItem } = useWishlist();

  const selectedColor = colors.find(
    (color) => color.code === selectedColorCode
  );

  function handleHeartClick(variantId) {
    if (isInWishlist(variantId)) {
      removeItem(variantId);
    } else {
      addItem(variantId);
    }
  }

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <h2 id="wishlist-popup-title" className={styles.title}>
          Add to wishlist
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={styles.closeIcon}
        >
          &times;
        </button>
      </div>

      <div className={styles.colorPreview}>
        <img
          src={selectedColor.image}
          alt={`${name}, ${selectedColor.name}`}
          className={styles.image}
        />
        <p className={styles.colorName}>Color: {selectedColor.name}</p>
      </div>

      <div className={styles.swatches}>
        <ColorOptions
          name="wishlist-color"
          colors={colors}
          selectedColorCode={selectedColorCode}
          onColorChange={setSelectedColorCode}
        />
      </div>

      <ul className={styles.sizes}>
        {sizes.map((size) => {
          const sizeVariant = variants.find(
            (variant) =>
              variant.colorCode === selectedColorCode && variant.size === size
          );
          const isWishlisted = isInWishlist(sizeVariant.id);

          return (
            <li key={size} className={styles.sizeItem}>
              <p className={styles.sizeLabel}>{size}</p>
              <button
                type="button"
                aria-label={`Add ${name} size ${size} to wishlist`}
                aria-pressed={isWishlisted}
                onClick={() => handleHeartClick(sizeVariant.id)}
                className={styles.heart}
              >
                <Icon
                  name={isWishlisted ? 'heart-icon-filled' : 'heart-icon'}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <button type="button" onClick={onClose} className={styles.closeButton}>
        CLOSE
      </button>
    </div>
  );
}

/**
 * Popup thêm vào wishlist mở từ nút tim trên ProductCard (chỉ khi đã đăng nhập).
 * Modal luôn được render để đóng bằng close() và trả focus về nút tim; mở khi
 * product khác null, nên nơi dùng chỉ cần một state (id sản phẩm đang mở).
 * @param {object} props
 * @param {object | null} props.product - sản phẩm đang mở popup, null khi đóng
 * @param {function(): void} props.onClose - gọi khi popup cần đóng (×, CLOSE, Escape)
 */
function WishlistPopup({ product, onClose }) {
  return (
    <Modal
      isOpen={product !== null}
      onClose={onClose}
      labelledBy="wishlist-popup-title"
      placement="bottom"
    >
      {product && <WishlistOptions product={product} onClose={onClose} />}
    </Modal>
  );
}

export default WishlistPopup;
