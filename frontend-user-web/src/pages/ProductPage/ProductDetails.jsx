import styles from './ProductDetails.module.css';
import { useState, useRef } from 'react';
import { formatToUSD, getEffectivePrice } from '../../utils/price';
import Icon from '../../components/Icon/Icon';

/**
 * Phần nội dung của trang chi tiết khi đã có dữ liệu: gallery ảnh, khối thông tin
 * (tên, chọn màu, chọn size, giá, số lượng, ADD TO CART) và phần mô tả.
 * Tách khỏi ProductPage để các state chọn màu, size khởi tạo được từ product:
 * component chỉ được render khi product đã có, nên useState nhận ngay phần tử đầu.
 * Nút tim và ADD TO CART tạm disabled cho tới Phần 10 và Phần 9.
 * @param {object} props
 * @param {object} props.product - sản phẩm từ getProductById (gồm colors, sizes, detailImages, features, variants)
 */
function ProductDetails({ product }) {
  const {
    id,
    name,
    gender,
    price,
    discountPercent,
    discountInfo,
    sizes,
    detailImages,
    colors,
    features,
  } = product;

  // Ref tới khung cuộn của gallery để cuộn về ảnh đầu khi đổi màu (xem handleColorChange).
  const galleryRef = useRef(null);

  // ==================================== STATE ====================================
  // Lưu code của màu thay vì object hay index: code ổn định, không trùng lặp dữ liệu
  // với product.colors, và khớp variants.colorCode để Phần 9 tìm đúng variant.
  const [selectedColorCode, setSelectedColorCode] = useState(colors[0].code);
  // Lưu đúng chuỗi size vì nó khớp variants.size.
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);

  // =============================== GIÁ TRỊ DẪN XUẤT ===============================
  // Tính lại mỗi lần render thay vì lưu thành state, để ảnh chính và nhãn màu
  // luôn đi theo selectedColorCode mà không phải đồng bộ thủ công.
  const selectedColor = colors.find(
    (color) => color.code === selectedColorCode
  );

  const isDiscounted = discountPercent !== null;
  const originalPrice = formatToUSD(price);
  const finalPrice = formatToUSD(getEffectivePrice(product));
  const isMinQuantity = quantity === 1;

  // ================================ EVENT HANDLERS ================================
  const handleColorChange = (code) => {
    setSelectedColorCode(code);
    // Trên mobile gallery là dải cuộn ngang: nếu người dùng đang xem ảnh phía sau
    // thì sẽ không thấy ảnh đầu đổi màu, nên cuộn về đầu. Gọi trong handler (không
    // dùng effect) vì đây là phản ứng trực tiếp với thao tác bấm, và lúc này DOM
    // đã có nên galleryRef.current chắc chắn khác null. Trên desktop lưới không
    // cuộn được nên lệnh này không có tác dụng.
    galleryRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    // Nút giảm dùng aria-disabled (không dùng disabled) nên trình duyệt không chặn
    // click; việc giữ số lượng tối thiểu là 1 phải nằm ở đây.
    if (isMinQuantity) return;
    setQuantity((prev) => prev - 1);
  };

  return (
    <div className={styles.page}>
      {/* ================================ GALLERY ================================ */}
      {/* Đặt đầu tiên trong DOM để khớp thứ tự hiển thị trên mobile; desktop dùng grid để xếp lại. */}
      <div ref={galleryRef} className={styles.gallery}>
        {/* Ảnh chính là ảnh của màu đang chọn nên có alt riêng; ảnh chi tiết không
            có mô tả trong dữ liệu nên alt rỗng để screen reader không đọc lặp tên. */}
        <img
          src={selectedColor.image}
          alt={`${name}, ${selectedColor.name}`}
          className={styles.galleryImage}
        />
        {detailImages.map((image) => (
          <img key={image} src={image} alt="" className={styles.galleryImage} />
        ))}
      </div>

      {/* ============================ KHỐI THÔNG TIN ============================ */}
      <div className={styles.info}>
        {/* Nút tim là anh em của <h1>, không nằm trong <h1>, để tên của heading chỉ là tên sản phẩm. */}
        <div className={styles.title}>
          <h1 className={styles.name}>{name}</h1>
          <button
            type="button"
            className={styles.wishlist}
            aria-label={`Add ${name} to wishlist`}
            disabled
          >
            <Icon name="heart-icon" />
          </button>
        </div>

        {/* Màu và size dùng radio thật (ẩn input, hiển thị label) để có sẵn trạng thái
            checked, phím mũi tên và "chỉ chọn 1" mà không cần tự viết ARIA.
            fieldset + legend cho screen reader biết đang ở nhóm nào. Trạng thái chọn và 
            focus được vẽ lên label qua :has(), vì input bị ẩn. */}
        <fieldset className={styles.options}>
          <legend className="visually-hidden">Color</legend>
          <div className={styles.swatches}>
            {colors.map((color) => {
              const isChecked = color.code === selectedColorCode;

              return (
                <label key={color.code} className={styles.colorLabel}>
                  <input
                    type="radio"
                    name="color"
                    value={color.code}
                    checked={isChecked}
                    onChange={() => handleColorChange(color.code)}
                    className="visually-hidden"
                  />
                  {/* alt là tên màu, cũng chính là tên của radio. */}
                  <img
                    src={color.swatch}
                    alt={color.name}
                    className={styles.swatchImage}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>
        <p className={styles.selectionText}>
          Color: {selectedColor.name.toUpperCase()}
        </p>

        <fieldset className={styles.options}>
          <legend className="visually-hidden">Size</legend>
          <div className={styles.sizes}>
            {sizes.map((size) => {
              const isChecked = size === selectedSize;

              return (
                <label key={size} className={styles.sizeLabel}>
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={isChecked}
                    onChange={() => handleSizeChange(size)}
                    className="visually-hidden"
                  />
                  {size}
                </label>
              );
            })}
          </div>
        </fieldset>
        {/* Viết hoa gender bằng JS thay vì bọc <span> + CSS, để cả dòng là một chuỗi
            chữ duy nhất trong <p> (getByText không ghép chữ của phần tử con). */}
        <p className={styles.selectionText}>
          Size: {gender.toUpperCase()} {selectedSize}
        </p>

        {/* Thứ tự giá gốc → giá giảm → discountInfo giữ đúng bản vanilla của trang chi tiết. */}
        <div className={styles.price}>
          {isDiscounted ? (
            <>
              <p className={styles.originalPrice}>{originalPrice}</p>
              <p className={styles.discountPrice}>{finalPrice}</p>
              {discountInfo && (
                <p className={styles.discountInfo}>{discountInfo}</p>
              )}
            </>
          ) : (
            <p className={styles.regularPrice}>{originalPrice}</p>
          )}
        </div>

        {/* aria-disabled thay cho disabled: nút vẫn giữ focus khi chạm mức 1, người
            dùng bàn phím không bị mất vị trí. <output> có sẵn role status nên
            screen reader tự đọc số mới sau mỗi lần bấm. */}
        <div className={styles.quantity}>
          <button
            type="button"
            aria-label="Decrease quantity"
            aria-disabled={isMinQuantity}
            onClick={handleDecrease}
            className={styles.decrease}
          >
            -
          </button>
          <output aria-label="Quantity" className={styles.quantityValue}>
            {quantity}
          </output>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={handleIncrease}
            className={styles.increase}
          >
            +
          </button>
        </div>

        <button type="button" className={styles.addToCart} disabled>
          ADD TO CART
        </button>
      </div>

      {/* ================================= MÔ TẢ ================================= */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.description}>Description</h2>
        <p className={styles.id}>Product ID: {id}</p>
        {/* So sánh > 0 thay vì dùng thẳng features.length: nếu là 0, React sẽ render số 0 ra màn hình. */}
        {features.length > 0 && (
          <>
            <h3 className={styles.feature}>Feature</h3>
            <div className={styles.featureGrid}>
              {/* Dùng index làm key: feature không có id, ảnh có thể trùng giữa các
                  feature, và danh sách tĩnh, không bị thêm/xóa/sắp xếp. */}
              {features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  {/* alt rỗng vì chữ mô tả ngay cạnh đã nói đủ nội dung của ảnh. */}
                  <img
                    src={feature.img}
                    alt=""
                    className={styles.featureImage}
                  />
                  <p className={styles.featureText}>{feature.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
