// Module này hiển thị popup yêu cầu đăng nhập mỗi khi người dùng chưa đăng nhập
// mà cố gắng thao tác với wishlist (bấm icon trái tim ở bất kỳ đâu trong app).

// ============================================= IMPORT ================================================
import { trapFocusOutside, releaseFocusTrap } from "./focus-trap.js";

// ============================================== STATE ================================================
// Tạo popup 1 lần duy nhất trong body, các lần gọi sau chỉ hiển thị lại, không tạo lại DOM.
let popupElement = null;

/**
 * Tạo popup và thêm khung HTML tĩnh vào body trong lần đầu tiên cần hiển thị,
 * ở những lần sau chỉ cần gọi lại hàm show, không tạo lại.
 * @returns {HTMLElement} phần tử DOM div popup
 */
function getOrCreatePopup() {
  if (popupElement === null) {
    popupElement = document.createElement("div");
    popupElement.className = "login-required-popup-overlay hidden";

    popupElement.innerHTML = `
        <div class="login-required-popup">
            <p class="login-required-title">Login</p>
            <p class="login-required-message">You must be logged in to add to your wishlist.</p>
            <div class="login-required-buttons">
                <button class="login-required-confirm">LOG IN</button>
                <button class="login-required-cancel">CANCEL</button>
            </div>
        </div>
    `;

    document.body.appendChild(popupElement);

    setupPopupButtons();
  }

  return popupElement;
}

/**
 * Gắn sự kiện cho 2 nút trong popup: LOG IN điều hướng sang trang login,
 * CANCEL chỉ đóng popup lại, không làm gì thêm.
 */
function setupPopupButtons() {
  const confirmButton = popupElement.querySelector(".login-required-confirm");
  const cancelButton = popupElement.querySelector(".login-required-cancel");

  confirmButton.addEventListener("click", () => {
    window.location.href = "./login.html";
  });

  cancelButton.addEventListener("click", () => {
    popupElement.classList.add("hidden");
    releaseFocusTrap();
  });
}

// ======================================= EXPORTED ENTRY POINT =======================================

/**
 * Ta cần hiển thị popup yêu cầu đăng nhập, gọi hàm này ở bất kỳ nơi nào
 * cần chặn thao tác wishlist khi người dùng chưa đăng nhập.
 */
export function openLoginRequiredPopup() {
  getOrCreatePopup();
  requestAnimationFrame(() => {
    popupElement.classList.remove("hidden");
    trapFocusOutside(popupElement);
  });
}
