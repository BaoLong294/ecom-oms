// Hàm validate và quy tắc hiển thị lỗi dùng chung cho form Login và Checkout.
// Blur và submit gọi cùng một hàm để không lặp lỗi của bản vanilla
// (blur thiếu kiểm tra chữ + số).

// Phần trước @ cho phép chữ, số và . _ % + -; domain có thể nhiều cấp (a@b.co.uk);
// đuôi cuối ít nhất 2 chữ cái. Bản đã sửa ở Phần 0 (bản vanilla từ chối email có dấu chấm).
const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Chỉ kiểm tra độ dài 8-20 và tập ký tự cho phép (không có dấu cách và \).
// Điều kiện "có cả chữ và số" kiểm tra riêng trong validatePassword.
const PASSWORD_REGEX = /^[A-Za-z0-9!#$%&()'*+,-./:;<=?>@[\]^_`{|}~]{8,20}$/;

// Số di động Việt Nam: đúng 10 chữ số, bắt đầu bằng 0.
// ^ và $ bắt buộc khớp cả chuỗi, không khớp một đoạn 10 số nằm trong chuỗi dài hơn.
const PHONE_REGEX = /^0\d{9}$/;

/**
 * Cách hiển thị lỗi của một ô: isInvalid quyết định viền đỏ (aria-invalid),
 * message là chữ hiển thị ('' nếu không hiện chữ).
 * @typedef {object} FieldError
 * @property {boolean} isInvalid
 * @property {string} message
 */

// Kết quả "không hiển thị lỗi" của getFieldError, cũng là giá trị khởi tạo của state lỗi
// trong các form. Dùng chung một object được vì state chỉ bị thay bằng object mới,
// không bao giờ bị sửa trực tiếp.
/** @type {FieldError} */
export const NO_ERROR = { isInvalid: false, message: '' };

/**
 * Kiểm tra email hợp lệ: không rỗng và đúng định dạng email cơ bản.
 * @param {string} value - Giá trị nhập vào input
 * @returns {string} là thông báo lỗi, '' nếu hợp lệ
 */
export function validateEmail(value) {
  const input = value.trim();
  let message = '';

  if (input === '') {
    message = 'Please enter an email address.';
  } else if (!EMAIL_REGEX.test(input)) {
    message = 'Please enter a valid email address.';
  }

  return message;
}

/**
 * Kiểm tra password hợp lệ: không rỗng, đúng độ dài 8-20 ký tự,
 * và phải chứa cả chữ lẫn số.
 * @param {string} value - Giá trị nhập vào input
 * @returns {string} là thông báo lỗi, '' nếu hợp lệ
 */
export function validatePassword(value) {
  const input = value.trim();
  let message = '';

  if (input === '') {
    message = 'Please enter a password.';
  } else if (
    !PASSWORD_REGEX.test(input) ||
    !/[A-Za-z]/.test(input) ||
    !/[0-9]/.test(input)
  ) {
    message = 'Please input valid password.';
  }

  return message;
}

/**
 * Kiểm tra một ô bắt buộc: không rỗng sau khi bỏ khoảng trắng hai đầu.
 * Dùng chung cho các ô chữ của form Checkout (first name, last name, address details).
 * @param {string} value - Giá trị nhập vào input
 * @param {string} fieldName - Tên ô viết thường, chèn vào câu thông báo
 * @returns {string} là thông báo lỗi, '' nếu hợp lệ
 */
export function validateRequired(value, fieldName) {
  const input = value.trim();
  let message = '';

  if (input === '') {
    message = `Please enter your ${fieldName}.`;
  }

  return message;
}

/**
 * Kiểm tra số di động hợp lệ: không rỗng và đúng 10 chữ số bắt đầu bằng 0.
 * @param {string} value - Giá trị nhập vào input
 * @returns {string} là thông báo lỗi, '' nếu hợp lệ
 */
export function validatePhone(value) {
  const input = value.trim();
  let message = '';

  if (input === '') {
    message = 'Please enter your mobile phone number.';
  } else if (!PHONE_REGEX.test(input)) {
    message = 'Please enter a valid mobile phone number.';
  }

  return message;
}

/**
 * Quyết định cách hiển thị lỗi của một ô theo quy tắc của bản vanilla:
 * trước lần submit đầu, ô rỗng không bị báo lỗi và ô sai định dạng chỉ tô viền đỏ;
 * sau khi submit, mọi lỗi đều hiện đủ thông báo.
 * Cần value vì trước khi submit, ô rỗng và ô sai định dạng đều có message khác ''
 * nhưng hiển thị khác nhau.
 * @param {string} value - Giá trị hiện tại của ô
 * @param {string} message - Kết quả của một hàm validate ở trên, '' nếu hợp lệ
 * @param {boolean} isSubmitted - Form đã được submit ít nhất một lần chưa
 * @returns {FieldError}
 */
export function getFieldError(value, message, isSubmitted) {
  if (message === '') {
    return NO_ERROR;
  }

  if (isSubmitted) {
    return { isInvalid: true, message };
  }

  if (value.trim() === '') {
    return NO_ERROR;
  }

  return { isInvalid: true, message: '' };
}
