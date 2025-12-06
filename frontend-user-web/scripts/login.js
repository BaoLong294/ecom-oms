// Handle email input
const emailInput = document.querySelector("#user-email");
const emailGroup = emailInput.closest(".input-group");
const emailErrorText = document.querySelector(".email-error");

const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/;

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

// Handle password input
const passwordInput = document.querySelector("#user-password");
const passwordGroup = passwordInput.closest(".input-group");
const passwordErrorText = document.querySelector(".password-error");

const passwordRegex = /^[A-Za-z0-9!#$%&()'*+,-./:;<=?>@[\]^_`{|}~]{8,20}$/;

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

// Handle show password checkbox
const showPassword = document.querySelector("#show-password");

showPassword.addEventListener("change", () => {
  passwordInput.type = showPassword.checked ? "text" : "password";
});

// Handle log in button
let isFormSubmitted = false;
const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  isFormSubmitted = true;

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (isEmailValid && isPasswordValid) {
    loginForm.submit();
  }
});
