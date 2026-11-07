import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Layout route chặn các route con khỏi người chưa đăng nhập.
 *
 * Đã đăng nhập thì render route con qua `<Outlet />`, không thêm phần tử nào vào DOM.
 * Chưa đăng nhập thì chuyển sang `/login` kèm `state.from` là đường dẫn đang vào,
 * để đăng nhập xong quay lại đúng trang đó. `replace` thay mục của trang bị chặn
 * trong lịch sử, nên bấm Back từ trang Login không quay lại rồi bị chuyển đi lần nữa.
 *
 * Đánh giá lại ở mỗi lần render, nên đăng xuất khi đang ở trang được bảo vệ
 * cũng bị chuyển đi.
 *
 * @returns {JSX.Element} Route con hoặc lệnh chuyển hướng tới trang Login.
 */
function RequireAuth() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
