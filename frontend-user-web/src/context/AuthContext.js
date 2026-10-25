import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

/**
 * Đọc trạng thái đăng nhập từ AuthProvider gần nhất phía trên trong cây.
 * Ném lỗi khi không có Provider, vì context khi đó trả null và lỗi destructure khó đoán nguyên nhân.
 * @returns {{ user: { email: string } | null, isLoggedIn: boolean, login: function(string): void, logout: function(): void }}
 * @throws {Error} Khi được gọi bên ngoài AuthProvider
 */
export function useAuth() {
  const value = useContext(AuthContext);

  if (value === null) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
