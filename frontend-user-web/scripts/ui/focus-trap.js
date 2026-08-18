/* 
 * Khi các popup mở ra, người dùng phím tab vẫn có thể tab ra các phần tử bên ngoài popup,
    điều nay gây nhầm lẫn vì họ không thấy được tiêu điểm đang ở đâu và ngoài ra họ sẽ phải
    tab qua toàn bộ các sản phẩm cho đến khi tab được vào bên trong popup.
 * Module này khóa toàn bộ nội dung bên ngoài popup khi popup hiện lên bằng thuộc tính inert,
    đồng thời tự bắt phím Tab để tiêu điểm "vòng lại" giữa phần tử đầu và cuối của popup,
    tránh trường hợp Tab/Shift+Tab thoát hẳn ra khỏi trang khi đã hết phần tử bên trong popup.
*/

/* 
    Lưu lại hàm xử lý phím Tab đang được gắn cho popup hiện tại, để ta có thể gỡ hàm
    này ra sau khi popup đã được đóng lại, — addEventListener/removeEventListener
    chỉ gỡ được nếu ta cung cấp lại đúng cùng một tham chiếu hàm đã từng gắn vào.
*/
let keydownHandler = null;

/**
 * Ta sẽ khóa toàn bộ các phần tử ngoài popup bên trong body của HTML,
 * đồng thời gắn sự kiện bắt phím Tab để tiêu điểm không thoát ra khỏi popup trường hợp
 * đang ở phần tử đầu tiên mà Shift+Tab thì vòng tới phần tử cuối, và ngược lại tab ở phần tử cuối.
 * @param {HTMLElement} popupElement - phần tử popup sẽ hiện lên
 */
export function trapFocusOutside(popupElement) {
  const bodyChildren = Array.from(document.body.children);

  bodyChildren.forEach((child) => {
    if (child !== popupElement) {
      child.setAttribute("inert", "");
    }
  });

  keydownHandler = (event) => {
    if (event.key !== "Tab") return;

    const focusableElements = popupElement.querySelectorAll(
      "button, [href], input, [tabindex]",
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  document.addEventListener("keydown", keydownHandler);
}

/**
 * Ta sẽ gỡ khóa toàn bộ các phần tử trong body của HTML khi popup tắt đi,
 * đồng thời gỡ sự kiện bắt phím Tab đã gắn lúc mở popup để tránh việc
 * nó tiếp tục lắng nghe phím Tab trên toàn trang sau khi popup đã đóng.
 */
export function releaseFocusTrap() {
  const bodyChildren = Array.from(document.body.children);

  bodyChildren.forEach((child) => {
    child.removeAttribute("inert");
  });

  document.removeEventListener("keydown", keydownHandler);
  keydownHandler = null;
}
