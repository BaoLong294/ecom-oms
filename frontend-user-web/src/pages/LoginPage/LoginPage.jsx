import styles from './LoginPage.module.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';

// Viết bằng nháy kép vì câu chứa cả nháy đơn, backtick và {}: đặt thẳng trong JSX
// thì {} bị hiểu là biểu thức, đặt trong template literal thì backtick kết thúc chuỗi.
const PASSWORD_HINT =
  "Password must be 8-20 letters and contain both letters and numbers. The following symbols can be used !#$%&()'*+,-./:;<=?>@[]^_`{|}~";

const NO_ERROR = { isInvalid: false, message: '' };

/**
 * Quyết định cách hiển thị lỗi của một ô theo quy tắc của bản vanilla:
 * trước lần submit đầu, ô rỗng không bị báo lỗi và ô sai định dạng chỉ tô viền đỏ;
 * sau khi submit, mọi lỗi đều hiện đủ thông báo.
 * Cần value vì trước khi submit, ô rỗng và ô sai định dạng đều có message khác ''
 * nhưng hiển thị khác nhau.
 * @param {string} value Giá trị hiện tại của ô
 * @param {string} message Kết quả của validateEmail/validatePassword, '' nếu hợp lệ
 * @param {boolean} isSubmitted Form đã được submit ít nhất một lần chưa
 * @returns {{ isInvalid: boolean, message: string }} isInvalid quyết định viền đỏ
 *   (aria-invalid), message là chữ hiển thị ('' nếu không hiện chữ)
 */
function getFieldError(value, message, isSubmitted) {
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

/**
 * Trang đăng nhập giả lập. Lỗi chỉ cập nhật khi rời ô (blur) và khi submit,
 * không cập nhật khi gõ, nên kết quả hiển thị được lưu vào state tại hai thời điểm đó.
 * Đăng nhập thành công thì quay về trang đã dẫn tới đây (location.state.from),
 * hoặc trang chủ nếu người dùng vào thẳng /login.
 * @returns {JSX.Element}
 */
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(NO_ERROR);
  const [passwordError, setPasswordError] = useState(NO_ERROR);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from ?? '/';

  // Chỉ trỏ tới thông báo lỗi khi phần tử đó đang được render.
  const emailDescribedBy = emailError.message ? 'login-email-error' : undefined;

  // Lỗi đứng trước gợi ý để screen reader đọc vấn đề trước, gợi ý dài đọc sau.
  const passwordDescribedBy = passwordError.message
    ? 'login-password-error login-password-hint'
    : 'login-password-hint';

  function handleEmailBlur() {
    setEmailError(getFieldError(email, validateEmail(email), isSubmitted));
  }

  function handlePasswordBlur() {
    setPasswordError(
      getFieldError(password, validatePassword(password), isSubmitted)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);

    // Validate lại từ giá trị hiện tại thay vì đọc emailError/passwordError:
    // message rỗng trong state chỉ có nghĩa "không hiện chữ", không có nghĩa "hợp lệ".
    const emailMessage = validateEmail(email);
    const passwordMessage = validatePassword(password);

    // Truyền thẳng true vì isSubmitted trong lần chạy này vẫn là snapshot cũ (false).
    setEmailError(getFieldError(email, emailMessage, true));
    setPasswordError(getFieldError(password, passwordMessage, true));

    if (emailMessage === '' && passwordMessage === '') {
      login(email.trim());
      // replace để nút Back không quay lại form login sau khi đã đăng nhập.
      navigate(from, { replace: true });
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.login}>
        <div className={styles.header}>
          <h1 className={styles.loginTitle}>LOGIN</h1>
          <p className={styles.required}>* Required</p>
        </div>

        <p className={styles.loginDescription}>
          Log in with your email address and password.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.group}>
            {emailError.message && (
              <p id="login-email-error" className={styles.errorMessage}>
                {emailError.message}
              </p>
            )}
            <label htmlFor="login-email" className={styles.label}>
              EMAIL ADDRESS <span className={styles.symbol}>*</span>
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={email}
              placeholder="Enter a valid email"
              className={styles.input}
              aria-invalid={emailError.isInvalid}
              aria-describedby={emailDescribedBy}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={handleEmailBlur}
              required
            />
          </div>

          <div className={styles.group}>
            {passwordError.message && (
              <p id="login-password-error" className={styles.errorMessage}>
                {passwordError.message}
              </p>
            )}
            <label htmlFor="login-password" className={styles.label}>
              PASSWORD <span className={styles.symbol}>*</span>
            </label>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              className={styles.input}
              aria-invalid={passwordError.isInvalid}
              aria-describedby={passwordDescribedBy}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={handlePasswordBlur}
              required
            />
            <p id="login-password-hint" className={styles.hint}>
              {PASSWORD_HINT}
            </p>
          </div>

          <div className={styles.checkboxWrapper}>
            <input
              id="show-password"
              type="checkbox"
              className={styles.checkboxInput}
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            <label htmlFor="show-password" className={styles.checkboxLabel}>
              Show my password
            </label>
          </div>

          <button type="submit" className={styles.loginButton}>
            LOG IN
          </button>
        </form>
      </div>

      <div className={styles.createAccount}>
        <h2 className={styles.createTitle}>CREATE AN ACCOUNT</h2>
        <p className={styles.createDescription}>
          If you create an account, you can get personalized services like
          checking purchase history and getting discount coupons with your
          membership. Register today for free!
        </p>
        {/* Chưa có trang đăng ký: disabled để không tạo nút bấm không có hành vi. */}
        <button type="button" className={styles.createButton} disabled>
          CREATE AN ACCOUNT
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
