// Giả lập việc gọi API cho tầng service khi chưa có backend.
// Sẽ bị xóa ở Giai đoạn 6.4, khi các service gọi API thật.

// Độ trễ giả lập: 500ms trên trình duyệt để thấy được trạng thái loading,
// 0ms khi chạy test để test không bị chậm.
const DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 500;

// Khi true, mọi request giả lập đều thất bại, bật bằng tay để xem giao diện lỗi trên trình duyệt.
let shouldFail = false;

/**
 * Bật hoặc tắt lỗi giả lập cho simulateRequest. Dùng trong test.
 *
 * @param {boolean} value - true: mọi request giả lập bị reject; false: request thành công.
 */
export function setMockError(value) {
  shouldFail = value;
}

/**
 * Giả lập một request API bằng cách chờ DELAY_MS
 * rồi trả về kết quả, hoặc thất bại nếu cờ lỗi đang bật.
 *
 * @template T
 * @param {T} result - Dữ liệu service muốn trả về.
 * @returns {Promise<T>} resolve với result sau DELAY_MS;
 *   reject với Error('Loading error!') nếu cờ lỗi đang bật.
 */
export function simulateRequest(result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Loading error!'));
      } else {
        resolve(result);
      }
    }, DELAY_MS);
  });
}
