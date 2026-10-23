import { useState, useEffect } from 'react';

/**
 * Gọi một hàm service khi component mount và mỗi khi tham số thay đổi,
 * quản lý 3 trạng thái: dữ liệu trả về, đang tải và thông báo lỗi.
 * Kết quả của lần gọi đã hết hiệu lực (unmount hoặc tham số đổi) bị bỏ qua nhờ cờ ignore.
 * @param {function(number): Promise<*>} fetcher - hàm service nhận 1 tham số và trả về Promise, khai báo ở cấp module để tham chiếu ổn định
 * @param {number} param - tham số truyền vào fetcher, cũng là dependency của effect
 * @returns {{ data: *, isLoading: boolean, errorMessage: string|null }} dữ liệu (null khi chưa có hoặc không tồn tại), trạng thái tải và thông báo lỗi
 */
export function useFetch(fetcher, param) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        const result = await fetcher(param);
        if (!ignore) setData(result);
      } catch (err) {
        if (!ignore) setErrorMessage(err.message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [fetcher, param]);

  return { data, isLoading, errorMessage };
}
