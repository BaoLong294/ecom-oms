// Tách khỏi LoginPage để blur và submit dùng chung 1 hàm,
// tránh lặp lỗi của bản vanilla (blur thiếu kiểm tra chữ + số).

const emailRegex =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const passwordRegex = /^[A-Za-z0-9!#$%&()'*+,-./:;<=?>@[\]^_`{|}~]{8,20}$/;

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
  } else if (!emailRegex.test(input)) {
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
    !passwordRegex.test(input) ||
    !/[A-Za-z]/.test(input) ||
    !/[0-9]/.test(input)
  ) {
    message = 'Please input valid password.';
  }

  return message;
}
