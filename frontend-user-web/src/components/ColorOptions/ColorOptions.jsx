import styles from './ColorOptions.module.css';

/**
 * Nhóm radio chọn màu của một sản phẩm, dùng ở trang chi tiết và popup wishlist.
 * Dùng radio thật (input ẩn, hiển thị ảnh swatch trong label) để có sẵn trạng thái
 * checked, phím mũi tên và "chỉ chọn 1" mà không cần tự viết ARIA; fieldset + legend
 * ẩn cho screen reader biết đang ở nhóm Color. Trạng thái chọn, hover và focus được
 * vẽ lên label qua :has(), vì input bị ẩn.
 * Controlled: không giữ state, nhận màu đang chọn qua prop và báo màu mới lên cha.
 * Kích thước swatch mặc định 36px; nơi dùng đặt biến CSS --swatch-size trên thẻ bọc
 * để đổi. Component không tự đặt margin ngoài, khoảng cách do cha quyết định.
 * @param {object} props
 * @param {string} props.name - name của các radio trong nhóm. Bắt buộc và phải khác
 *   nhau giữa các nhóm cùng trang, vì radio cùng name trong cùng document bị trình
 *   duyệt gộp thành một nhóm.
 * @param {Array<{ code: string, name: string, swatch: string }>} props.colors - các màu
 *   của sản phẩm (product.colors); name của màu là alt của swatch, cũng là tên của radio.
 * @param {string} props.selectedColorCode - code của màu đang chọn.
 * @param {function(string): void} props.onColorChange - gọi với code của màu vừa chọn.
 */
function ColorOptions({ name, colors, selectedColorCode, onColorChange }) {
  return (
    <fieldset className={styles.group}>
      <legend className="visually-hidden">Color</legend>
      <div className={styles.swatches}>
        {colors.map((color) => {
          const isChecked = color.code === selectedColorCode;

          return (
            <label key={color.code} className={styles.label}>
              <input
                type="radio"
                name={name}
                value={color.code}
                checked={isChecked}
                onChange={() => onColorChange(color.code)}
                className="visually-hidden"
              />
              {/* alt là tên màu, cũng chính là tên của radio. */}
              <img
                src={color.swatch}
                alt={color.name}
                className={styles.swatch}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default ColorOptions;
