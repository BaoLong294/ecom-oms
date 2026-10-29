import styles from './Modal.module.css';
import { useRef, useEffect } from 'react';

/**
 * Hộp thoại modal dùng chung cho các popup (thêm vào giỏ, yêu cầu đăng nhập, wishlist).
 * Là controlled component: component cha giữ state isOpen và quyết định mở hay đóng.
 * Dùng <dialog> với showModal() nên trình duyệt tự khóa phần còn lại của trang,
 * đóng bằng phím Escape và trả focus về phần tử đã mở popup khi đóng.
 * onClose được gọi mỗi khi dialog đóng, kể cả khi trình duyệt tự đóng (Escape),
 * để cha cập nhật lại isOpen. Modal không tự vẽ nút đóng: mỗi popup đặt nút của mình trong children.
 * @param {object} props
 * @param {boolean} props.isOpen - true thì mở dialog, false thì đóng
 * @param {function(): void} props.onClose - cha đặt isOpen về false khi dialog đóng
 * @param {string} props.labelledBy - id của tiêu đề bên trong, dùng làm tên của dialog
 * @param {React.ReactNode} props.children - nội dung của popup
 */
function Modal({ isOpen, onClose, labelledBy, children }) {
  const dialogRef = useRef(null);

  // showModal() và close() là phương thức DOM, không có thuộc tính JSX tương ứng, nên dùng
  // effect để đồng bộ prop isOpen với trạng thái mở/đóng thật của trình duyệt.
  // Kiểm tra dialog.open trước khi ra lệnh vì hai trạng thái không luôn đổi cùng lúc:
  // StrictMode chạy effect 2 lần khi mount (showModal() trên dialog đang mở sẽ ném lỗi),
  // và khi bấm Escape trình duyệt đã tự đóng dialog trước khi isOpen chuyển về false.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={onClose}
      className={styles.modal}
    >
      {children}
    </dialog>
  );
}

export default Modal;
