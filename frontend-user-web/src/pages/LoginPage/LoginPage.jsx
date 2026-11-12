import styles from './LoginPage.module.css';
import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  NO_ERROR,
  getFieldError,
} from '../../utils/validation';
import FormField from '../../components/FormField/FormField';

// Viết bằng nháy kép vì câu chứa cả nháy đơn, backtick và {}: đặt thẳng trong JSX
// thì {} bị hiểu là biểu thức, đặt trong template literal thì backtick kết thúc chuỗi.
const PASSWORD_HINT =
  "Password must be 8-20 letters and contain both letters and numbers. The following symbols can be used !#$%&()'*+,-./:;<=?>@[]^_`{|}~";

/**
 * Trang đăng nhập giả lập. Lỗi chỉ cập nhật khi rời ô (blur) và khi submit,
 * không cập nhật khi gõ, nên kết quả hiển thị được lưu vào state tại hai thời điểm đó.
 * Đăng nhập thành công thì quay về trang đã dẫn tới đây (location.state.from),
 * hoặc trang chủ nếu người dùng vào thẳng /login.
 * Submit thất bại thì focus vào ô lỗi đầu tiên.
 * Hai ô nhập dùng FormField; quy tắc hiển thị lỗi nằm ở getFieldError (utils/validation).
 * @returns {React.JSX.Element}
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
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Nơi dẫn tới /login gửi pathname của trang đó qua state.from để đăng nhập xong quay về đúng chỗ.
  // Vào thẳng /login thì không có state, nên quay về trang chủ.
  const from = location.state?.from ?? '/';

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

    // Đưa focus vào ô lỗi đầu tiên để screen reader đọc ngay ô đó kèm thông báo lỗi
    // (aria-invalid + aria-describedby), và người dùng bàn phím sửa được luôn.
    if (emailMessage !== '') {
      emailInputRef.current.focus();
    } else if (passwordMessage !== '') {
      passwordInputRef.current.focus();
    } else {
      login(email.trim());
      // replace để nút Back không quay lại form login sau khi đã đăng nhập.
      navigate(from, { replace: true });
    }
  }

  return (
    <div className={styles.page}>
      <title>Login | UNIQLO</title>
      <div className={styles.login}>
        <div className={styles.header}>
          <h1 className={styles.loginTitle}>LOGIN</h1>
          <p className={styles.required}>* Required</p>
        </div>

        <p className={styles.loginDescription}>
          Log in with your email address and password.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-email"
            label="EMAIL ADDRESS"
            type="email"
            name="email"
            value={email}
            placeholder="Enter a valid email"
            ref={emailInputRef}
            error={emailError}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={handleEmailBlur}
          />

          <FormField
            id="login-password"
            label="PASSWORD"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            hint={PASSWORD_HINT}
            ref={passwordInputRef}
            error={passwordError}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={handlePasswordBlur}
          />

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
