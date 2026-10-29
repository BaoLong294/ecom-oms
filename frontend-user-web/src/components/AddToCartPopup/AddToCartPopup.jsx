import styles from './AddToCartPopup.module.css';
import { getVariantsByIds } from '../../services/variantService';
import { useCart } from '../../context/CartContext';
import { useFetch } from '../../hooks/useFetch';
import { formatToUSD } from '../../utils/price';
import { getCartTotal } from '../../utils/cart';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';

/**
 * Nhận khóa chuỗi id ('203,101'), đổi lại thành mảng số rồi gọi getVariantsByIds.
 * useFetch cần tham số là giá trị nguyên thủy: mảng id tạo mới ở mỗi lần render
 * sẽ khiến effect chạy lại liên tục, còn chuỗi so sánh theo nội dung nên ổn định.
 * Hàm đặt ở cấp module để tham chiếu không đổi giữa các lần render.
 * @param {string} idsKey - các variantId nối bằng dấu phẩy
 * @returns {Promise<Array<object>>} thông tin các variant, giữ thứ tự theo idsKey
 */
function fetchVariantsByKey(idsKey) {
  const ids = idsKey.split(',').map(Number);
  return getVariantsByIds(ids);
}

/**
 * Nội dung popup "đã thêm vào giỏ": số lượng vừa thêm, tổng số lượng và tổng tiền
 * của cả giỏ, nút đóng, VIEW CART và CONTINUE SHOPPING.
 * Giỏ hàng chỉ lưu variantId và quantity nên phải lấy giá các variant qua service
 * rồi tính tổng bằng getCartTotal.
 * @param {object} props
 * @param {function(): void} props.onClose - đóng popup
 * @param {number} props.addedQuantity - số lượng vừa được thêm vào giỏ
 */
function CartSummary({ onClose, addedQuantity }) {
  const { items, itemCount } = useCart();

  const idsKey = items.map((item) => item.variantId).join(',');

  const {
    data: variants,
    isLoading,
    errorMessage,
  } = useFetch(fetchVariantsByKey, idsKey);

  let totalPrice;
  if (isLoading) {
    totalPrice = 'Loading...';
  } else if (errorMessage) {
    totalPrice = errorMessage;
  } else {
    totalPrice = formatToUSD(getCartTotal(items, variants));
  }

  return (
    <div className={styles.popup}>
      <div className={styles.title}>
        <h2 id="add-to-cart-title" className={styles.heading}>
          {addedQuantity} item(s) added to your cart
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={styles.close}
        >
          x
        </button>
      </div>

      <div className={styles.subtotal}>
        <p className={styles.subtotalLabel}>
          Subtotal <span className={styles.itemCount}>{itemCount} item(s)</span>
        </p>
        <p className={styles.totalPrice}>{totalPrice}</p>
      </div>

      <div className={styles.buttons}>
        <Link to="/cart" className={styles.viewCart}>
          VIEW CART
        </Link>
        <button
          type="button"
          onClick={onClose}
          className={styles.continueShopping}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}

/**
 * Popup xác nhận đã thêm vào giỏ, dùng ở trang chi tiết và trang Wishlist.
 * Modal luôn được render để effect của nó gọi close() khi isOpen chuyển về false
 * (đóng đúng cách và trả focus về nút đã mở). Riêng CartSummary chỉ render khi mở:
 * mỗi lần mở là một lần mount mới, nên giá được lấy lại theo giỏ hàng hiện tại.
 * @param {object} props
 * @param {boolean} props.isOpen - true thì mở popup
 * @param {function(): void} props.onClose - cha đặt isOpen về false
 * @param {number} props.addedQuantity - số lượng vừa được thêm vào giỏ
 */
function AddToCartPopup({ isOpen, onClose, addedQuantity }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="add-to-cart-title">
      {isOpen && (
        <CartSummary onClose={onClose} addedQuantity={addedQuantity} />
      )}
    </Modal>
  );
}

export default AddToCartPopup;
