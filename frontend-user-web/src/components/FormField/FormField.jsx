import styles from './FormField.module.css';
/** @import { FieldError } from '../../utils/validation' */

/**
 * Một ô nhập bắt buộc của form: thông báo lỗi (nếu có), label có dấu *, input và gợi ý (nếu có).
 * Thông báo lỗi và gợi ý được nối với input qua aria-describedby; id của chúng dựng từ id
 * của input (`${id}-error`, `${id}-hint`) nên mỗi ô chỉ cần truyền một id.
 * Không giữ state: giá trị, lỗi và các handler do form cha quản lý.
 * @param {object} props
 * @param {string} props.id - id của input, đồng thời là tiền tố của id lỗi và id gợi ý
 * @param {string} props.label - Chữ của label
 * @param {string} [props.type='text'] - type của input
 * @param {string} props.name - name của input, form cha đọc được qua event.target.name
 * @param {string} props.value - Giá trị hiện tại (controlled)
 * @param {string} [props.placeholder] - Chữ gợi ý trong ô khi chưa nhập
 * @param {string} [props.hint] - Gợi ý hiển thị dưới input
 * @param {FieldError} props.error - Kết quả của getFieldError
 * @param {function(Event): void} props.onChange - Gọi mỗi lần gõ
 * @param {function(Event): void} props.onBlur - Gọi khi rời ô
 * @param {React.Ref<HTMLInputElement>} [props.ref] - Gắn vào input để form cha gọi focus()
 *   (React 19 nhận ref như một prop thường)
 * @returns {React.JSX.Element}
 */
function FormField({
  id,
  label,
  type = 'text',
  name,
  value,
  placeholder,
  hint,
  error,
  onChange,
  onBlur,
  ref,
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Chỉ trỏ tới phần tử đang được render. Lỗi đứng trước gợi ý để screen reader
  // đọc vấn đề trước, gợi ý dài đọc sau.
  const describedBy =
    [error.message && errorId, hint && hintId].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={styles.group}>
      {error.message && (
        <p id={errorId} className={styles.errorMessage}>
          {error.message}
        </p>
      )}
      <label htmlFor={id} className={styles.label}>
        {label} <span className={styles.symbol}>*</span>
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        ref={ref}
        placeholder={placeholder}
        className={styles.input}
        aria-invalid={error.isInvalid}
        aria-describedby={describedBy}
        onChange={onChange}
        onBlur={onBlur}
        required
      />
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default FormField;
