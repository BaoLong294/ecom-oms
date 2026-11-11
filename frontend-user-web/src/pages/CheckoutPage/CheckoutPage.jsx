import styles from './CheckoutPage.module.css';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCartVariants } from '../../context/useCartVariants';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import FormField from '../../components/FormField/FormField';
import { getCartTotal } from '../../utils/cart';
import { formatToUSD, getEffectivePrice } from '../../utils/price';
import {
  NO_ERROR,
  getFieldError,
  validateRequired,
  validatePhone,
} from '../../utils/validation';

// Thứ tự các ô trên trang: submit duyệt theo thứ tự này để validate mọi ô
// và tìm ô lỗi đầu tiên để focus.
const FIELD_ORDER = ['firstName', 'lastName', 'address', 'phone'];

// Giá trị ban đầu của form: mọi ô đều trống.
const EMPTY_VALUES = { firstName: '', lastName: '', address: '', phone: '' };

// Lỗi ban đầu của form: không ô nào hiện lỗi.
const EMPTY_ERRORS = {
  firstName: NO_ERROR,
  lastName: NO_ERROR,
  address: NO_ERROR,
  phone: NO_ERROR,
};

// Hàm validate của từng ô, tra theo name của input: FIELD_VALIDATORS[name](value).
// Blur và submit dùng chung bảng này nên quy tắc của mỗi ô chỉ viết một lần.
const FIELD_VALIDATORS = {
  firstName: (value) => validateRequired(value, 'first name'),
  lastName: (value) => validateRequired(value, 'last name'),
  address: (value) => validateRequired(value, 'address details'),
  phone: validatePhone,
};

/**
 * Trang thanh toán, chỉ người đã đăng nhập vào được nhờ RequireAuth.
 * Chỉ đọc giỏ hàng qua useCartVariants để hiện khối tóm tắt đơn:
 * số lượng món, tạm tính, phí vận chuyển (miễn phí) và tổng tiền.
 * Giỏ rỗng hiện thông báo ngay, xét trước loading vì không cần chờ giá.
 * Form giao hàng (FormField) báo lỗi khi blur và submit như trang Login;
 * submit lỗi thì focus ô lỗi đầu tiên và giỏ không đổi.
 * Submit hợp lệ thì tạo đơn từ giỏ (chụp lại sản phẩm, ảnh, tên, màu, size, giá lúc đặt),
 * xóa giỏ và hiện xác nhận ngay trong trang, kèm link tới trang chi tiết đơn vừa đặt.
 * @returns {JSX.Element}
 */
function CheckoutPage() {
  const { items, itemCount, variants, isLoading, errorMessage } =
    useCartVariants();
  const { clearItems } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const addressRef = useRef(null);
  const phoneRef = useRef(null);

  // Bảng tra từ name của ô sang ref của ô đó, để handleSubmit focus được ô lỗi đầu tiên.
  const inputRefs = {
    firstName: firstNameRef,
    lastName: lastNameRef,
    address: addressRef,
    phone: phoneRef,
  };

  let content;
  // Xét đơn đã đặt trước giỏ rỗng: đặt xong thì giỏ cũng rỗng.
  if (placedOrderId !== null) {
    content = (
      <div>
        <p className={styles.confirmText}>
          Your order #{placedOrderId} has been placed.
        </p>
        <div className={styles.confirmActions}>
          <Link to={`/orders/${placedOrderId}`} className={styles.viewOrder}>
            VIEW ORDER
          </Link>
          <Link to="/" className={styles.emptyContinue}>
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <div>
        <p className={styles.emptyText}>Your cart is currently empty.</p>
        <Link to="/" className={styles.emptyContinue}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  } else if (isLoading) {
    content = <StatusMessage variant="loading" />;
  } else if (errorMessage) {
    content = <StatusMessage variant="error" message={errorMessage} />;
  } else {
    const total = formatToUSD(getCartTotal(items, variants));

    content = (
      <div className={styles.filled}>
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>DELIVERY ADDRESS</h2>
          <p className={styles.detailsText}>
            Please make sure the delivery address is correct. Orders with an
            incorrect address may be cancelled or delayed.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <p className={styles.required}>* Required</p>

            <FormField
              id="checkout-first-name"
              label="FIRST NAME"
              name="firstName"
              value={values.firstName}
              ref={firstNameRef}
              error={errors.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              id="checkout-last-name"
              label="LAST NAME"
              name="lastName"
              value={values.lastName}
              ref={lastNameRef}
              error={errors.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              id="checkout-address"
              label="ADDRESS DETAILS"
              name="address"
              value={values.address}
              placeholder="Building, street, ward, city"
              ref={addressRef}
              error={errors.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              id="checkout-phone"
              label="MOBILE PHONE"
              type="tel"
              name="phone"
              value={values.phone}
              ref={phoneRef}
              error={errors.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <p className={styles.payment}>Payment method: Cash on delivery</p>

            <button type="submit" className={styles.placeOrder}>
              PLACE ORDER
            </button>
          </form>
        </div>

        <section aria-label="Order summary" className={styles.summary}>
          <div className={`${styles.summaryRow} ${styles.strong}`}>
            <p>ORDER SUMMARY</p>
            <p>{itemCount} ITEM(S)</p>
          </div>

          <div className={styles.summaryRow}>
            <p>Subtotal</p>
            <p>{total}</p>
          </div>

          <div className={styles.summaryRow}>
            <p>Shipping</p>
            <p>Free</p>
          </div>

          <div className={`${styles.summaryRow} ${styles.strong}`}>
            <p>ORDER TOTAL</p>
            <p>{total}</p>
          </div>
        </section>
      </div>
    );
  }

  // Một handler cho cả 4 ô: name của input cho biết ô nào vừa đổi.
  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setErrors({
      ...errors,
      [name]: getFieldError(value, FIELD_VALIDATORS[name](value), isSubmitted),
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);

    // Validate lại mọi ô từ giá trị hiện tại; truyền thẳng true vì isSubmitted
    // trong lần chạy này vẫn là snapshot cũ. Ô hợp lệ cũng được gán (NO_ERROR)
    // để xóa lỗi cũ của ô đã sửa đúng.
    const nextErrors = {};
    FIELD_ORDER.forEach((name) => {
      nextErrors[name] = getFieldError(
        values[name],
        FIELD_VALIDATORS[name](values[name]),
        true
      );
    });
    setErrors(nextErrors);

    // Đọc nextErrors chứ không đọc state errors: setErrors chưa có hiệu lực trong lần chạy này.
    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name].isInvalid);
    if (firstInvalid) {
      inputRefs[firstInvalid].current.focus();
      return;
    }

    // Chụp lại thông tin của từng món lúc đặt, để đơn cũ không đổi khi giá
    // hay tên sản phẩm đổi sau này. Bỏ món không còn variant như trang Cart.
    const orderItems = items.flatMap((item) => {
      const variant = variants.find((entry) => entry.id === item.variantId);

      if (!variant) return [];

      return [
        {
          variantId: item.variantId,
          productId: variant.productId,
          image: variant.colorImage,
          productName: variant.productName,
          colorName: variant.colorName,
          size: variant.size,
          quantity: item.quantity,
          unitPrice: getEffectivePrice(variant),
        },
      ];
    });

    const shipping = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      address: values.address.trim(),
      phone: values.phone.trim(),
    };

    // Tạo đơn trước rồi mới xóa giỏ: orderItems và tổng tiền lấy từ giỏ hiện tại.
    const orderId = addOrder({
      email: user.email,
      shipping,
      items: orderItems,
      total: getCartTotal(items, variants),
    });
    clearItems();
    setPlacedOrderId(orderId);
  }

  return (
    <div className={styles.page}>
      <title>Checkout | UNIQLO</title>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbsLink}>
          UNIQLO
        </Link>{' '}
        / CHECKOUT
      </nav>

      <h1 className={styles.title}>CHECKOUT</h1>

      {content}
    </div>
  );
}

export default CheckoutPage;
