import styles from './QuantityStepper.module.css';

/**
 * Bộ tăng giảm số lượng (nút -, số lượng, nút +), dùng chung cho trang chi tiết
 * và từng item trong giỏ hàng. Là controlled component: không giữ state, số lượng
 * do component cha truyền vào và cha tự cập nhật khi nhận onQuantityChange.
 * Số lượng tối thiểu là 1: ở mức 1, nút - có aria-disabled và bấm không có tác dụng.
 * @param {object} props
 * @param {number} props.quantity - số lượng đang hiển thị
 * @param {function(number): void} props.onQuantityChange - nhận số lượng mới sau khi bấm + hoặc -
 * @param {string} [props.itemName] - tên sản phẩm, thêm vào tên của các nút và số lượng
 *   (ví dụ 'Decrease quantity of Culottes') để không trùng khi trang có nhiều stepper
 */
function QuantityStepper({ quantity, onQuantityChange, itemName }) {
  const isMinQuantity = quantity === 1;
  const labelSuffix = itemName ? ` of ${itemName}` : '';

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    // Nút giảm dùng aria-disabled (không dùng disabled) nên trình duyệt không chặn
    // click; việc giữ số lượng tối thiểu là 1 phải nằm ở đây.
    if (isMinQuantity) return;
    onQuantityChange(quantity - 1);
  };

  return (
    <div className={styles.quantity}>
      {/* aria-disabled thay cho disabled: nút vẫn giữ focus khi chạm mức 1,
      người dùng bàn phím không bị mất vị trí. */}
      <button
        type="button"
        aria-label={`Decrease quantity${labelSuffix}`}
        aria-disabled={isMinQuantity}
        onClick={handleDecrease}
        className={styles.decrease}
      >
        -
      </button>
      {/* <output> có sẵn role status nên screen reader tự đọc số mới sau mỗi lần bấm. */}
      <output
        aria-label={`Quantity${labelSuffix}`}
        className={styles.quantityValue}
      >
        {quantity}
      </output>
      <button
        type="button"
        aria-label={`Increase quantity${labelSuffix}`}
        onClick={handleIncrease}
        className={styles.increase}
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
