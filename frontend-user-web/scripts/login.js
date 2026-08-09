/*
  Page controller cho trang login.html.
  Validate email/password, và khi hợp lệ thì đánh dấu người dùng đã đăng nhập
  (giả lập, không có backend thật) rồi điều hướng về trang chủ.
*/

// ============================================= IMPORTS =============================================
import { login } from "./auth/auth.js";

// =========================================== DOM QUERIES ===========================================
const emailInput = document.querySelector("#user-email");
const emailGroup = emailInput.closest(".input-group");
const emailErrorText = document.querySelector(".email-error");

const passwordInput = document.querySelector("#user-password");
const passwordGroup = passwordInput.closest(".input-group");
const passwordErrorText = document.querySelector(".password-error");

const showPassword = document.querySelector("#show-password");
const loginForm = document.querySelector(".login-form");

// ============================================ CONSTANTS =============================================
const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
const passwordRegex = /^[A-Za-z0-9!#$%&()'*+,-./:;<=?>@[\]^_`{|}~]{8,20}$/;

// ============================================== STATE ================================================
let isFormSubmitted = false;

// ========================================= VALIDATE FUNCTIONS ========================================

/**
 * Kiểm tra email hợp lệ: không rỗng và đúng định dạng email cơ bản.
 * @returns {boolean} true nếu email hợp lệ, false nếu không
 */
function validateEmail() {
  const input = emailInput.value.trim();
  let message = "";

  if (input === "") {
    message = "Please enter an email address.";
  } else if (!emailRegex.test(input)) {
    message = "Please enter a valid email address.";
  }

  if (message) {
    emailGroup.classList.add("error");
    emailErrorText.textContent = message;
    return false;
  } else {
    emailGroup.classList.remove("error");
    emailErrorText.textContent = "";
    return true;
  }
}

/**
 * Kiểm tra password hợp lệ: không rỗng, đúng độ dài 8-20 ký tự,
 * và phải chứa cả chữ lẫn số.
 * @returns {boolean} true nếu password hợp lệ, false nếu không
 */
function validatePassword() {
  const input = passwordInput.value.trim();
  let message = "";

  if (input === "") {
    message = "Please enter a password.";
  } else if (
    !passwordRegex.test(input) ||
    !/[A-Za-z]/.test(input) ||
    !/[0-9]/.test(input)
  ) {
    message = "Please input valid password.";
  }

  if (message) {
    passwordGroup.classList.add("error");
    passwordErrorText.textContent = message;
    return false;
  } else {
    passwordGroup.classList.remove("error");
    passwordErrorText.textContent = "";
    return true;
  }
}

// ========================================= HELPER FUNCTIONS =========================================

/**
 * Gắn sự kiện blur cho ô email: chỉ hiển thị lỗi ngay khi rời ô nếu sai định dạng,
 * còn nếu để trống thì chỉ hiển thị lỗi sau khi người dùng đã từng bấm submit.
 */
function setupEmailValidation() {
  emailInput.addEventListener("blur", () => {
    const input = emailInput.value.trim();

    if (input === "") {
      if (isFormSubmitted) {
        validateEmail();
      } else {
        emailGroup.classList.remove("error");
        emailErrorText.textContent = "";
      }
    } else if (!emailRegex.test(input)) {
      emailGroup.classList.add("error");

      if (isFormSubmitted) {
        emailErrorText.textContent = "Please enter a valid email address.";
      } else {
        emailErrorText.textContent = "";
      }
    } else {
      emailGroup.classList.remove("error");
      emailErrorText.textContent = "";
    }
  });
}

/**
 * Gắn sự kiện blur cho ô password, cùng logic hiển thị lỗi như setupEmailValidation.
 */
function setupPasswordValidation() {
  passwordInput.addEventListener("blur", () => {
    const input = passwordInput.value.trim();

    if (input === "") {
      if (isFormSubmitted) {
        validatePassword();
      } else {
        passwordGroup.classList.remove("error");
        passwordErrorText.textContent = "";
      }
    } else if (!passwordRegex.test(input)) {
      passwordGroup.classList.add("error");

      if (isFormSubmitted) {
        passwordErrorText.textContent = "Please input valid password.";
      } else {
        passwordErrorText.textContent = "";
      }
    } else {
      passwordGroup.classList.remove("error");
      passwordErrorText.textContent = "";
    }
  });
}

/**
 * Gắn sự kiện cho checkbox "Show my password" để đổi type của ô password
 * qua lại giữa "password" (ẩn) và "text" (hiện rõ ký tự).
 */
function setupShowPassword() {
  showPassword.addEventListener("change", () => {
    passwordInput.type = showPassword.checked ? "text" : "password";
  });
}

/**
 * Gắn sự kiện submit cho form login: validate cả email và password,
 * nếu hợp lệ thì đánh dấu đã đăng nhập (qua auth.js) và điều hướng về trang chủ,
 * không dùng form.submit() thật vì dự án không có backend để nhận request.
 */
function setupLoginForm() {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    isFormSubmitted = true;

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      login();
      window.location.href = "./index.html";
    }
  });
}

// ============================================== INIT ==================================================
setupEmailValidation();
setupPasswordValidation();
setupShowPassword();
setupLoginForm();
