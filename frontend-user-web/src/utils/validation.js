// Hàm validate dùng chung cho form Login và Checkout. Blur và submit gọi cùng một hàm
// để không lặp lỗi của bản vanilla (blur thiếu kiểm tra chữ + số).

// Số di động Việt Nam: đúng 10 chữ số, bắt đầu bằng 0.
// ^ và $ bắt buộc khớp cả chuỗi, không khớp một đoạn 10 số nằm trong chuỗi dài hơn.
const PHONEREGEX = /^0\d{9}$/;

// Chỉ kiểm tra độ dài 8-20 và tập ký tự cho phép (không có dấu cách và \).
// Điều kiện "có cả chữ và số" kiểm tra riêng trong validatePassword.
const PASSWORDREGEX = /^[A-Za-z0-9!#$%&()'*+,-./:;<=?>@[\]^_`{|}~]{8,20}$/;

// Phần trước @ cho phép chữ, số và . _ % + -; domain có thể nhiều cấp (a@b.co.uk);
// đuôi cuối ít nhất 2 chữ cái. Bản đã sửa ở Phần 0 (bản vanilla từ chối email có dấu chấm).
const EMAILREGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

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
  } else if (!EMAILREGEX.test(input)) {
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
    !PASSWORDREGEX.test(input) ||
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
  } else if (!PHONEREGEX.test(input)) {
    message = 'Please enter a valid mobile phone number.';
  }

  return message;
}
