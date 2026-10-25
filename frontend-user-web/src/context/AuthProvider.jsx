import { useState } from 'react';
import { AuthContext } from './AuthContext';

const USER_STORAGE_KEY = 'user';

/**
 * Đọc user đã lưu trong localStorage để khôi phục đăng nhập khi tải lại trang.
 * Dữ liệu hỏng (không parse được) được coi như chưa đăng nhập.
 * @returns {{ email: string } | null} User đã lưu, hoặc null nếu không có hoặc dữ liệu hỏng
 */
function readStoredUser() {
  try {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Giữ trạng thái đăng nhập giả lập và cung cấp cho toàn bộ cây con qua AuthContext.
 * login và logout ghi thẳng vào localStorage để trạng thái giữ nguyên sau khi tải lại trang.
 * @param {{ children: React.ReactNode }} props
 * @param {React.ReactNode} props.children Phần app được bọc, có thể đọc context bằng useAuth
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const isLoggedIn = user !== null;

  function login(email) {
    const value = { email };
    setUser(value);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  return (
    <AuthContext value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;
