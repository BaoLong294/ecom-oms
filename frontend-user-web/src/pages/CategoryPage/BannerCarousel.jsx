import styles from './BannerCarousel.module.css';
import { useRef, useState } from 'react';

/**
 * Dải banner của một nhóm sản phẩm trên trang danh sách: mọi ảnh nằm trong một
 * danh sách cuộn ngang, mỗi lần cuộn dừng đúng một ảnh.
 * Nhóm có từ 2 ảnh thì có thêm 2 nút mũi tên, mỗi lần bấm cuộn đúng một ảnh
 * (bằng chiều rộng khung cuộn). Ở ảnh đầu thì nút trước bị khóa, ở ảnh cuối thì nút sau bị khóa.
 * Nút bị khóa dùng aria-disabled thay cho disabled để không mất focus khi bấm liên tục.
 * Trạng thái đầu/cuối cập nhật theo sự kiện scroll nên vẫn đúng khi người dùng vuốt tay.
 * Tên của danh sách và của nút kèm tên nhóm để không trùng giữa các nhóm trên cùng trang.
 * @param {Object} props
 * @param {{ id: number, image: string, alt: string }[]} props.banners - banner của nhóm, đã sắp theo position.
 * @param {string} props.groupName - tên nhóm, dùng trong tên của danh sách và của nút.
 */
function BannerCarousel({ banners, groupName }) {
  const listRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const hasArrows = banners.length > 1;

  // Cập nhật trạng thái đầu/cuối dải cuộn để khóa mũi tên tương ứng.
  // Dùng <= 1 và >= scrollWidth - 1 thay vì so sánh bằng để bù sai số làm tròn
  // pixel trên các màn hình có độ phân giải cao hoặc khi zoom.
  function handleScroll() {
    const { scrollLeft, clientWidth, scrollWidth } = listRef.current;

    setIsAtStart(scrollLeft <= 1);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  }

  function handlePrevious() {
    if (isAtStart) return;

    listRef.current.scrollBy({
      left: -listRef.current.clientWidth,
      behavior: 'smooth',
    });
  }

  function handleNext() {
    if (isAtEnd) return;

    listRef.current.scrollBy({
      left: listRef.current.clientWidth,
      behavior: 'smooth',
    });
  }

  return (
    <div className={styles.carousel}>
      <ul
        ref={listRef}
        aria-label={`${groupName} banners`}
        className={styles.list}
        onScroll={handleScroll}
      >
        {banners.map((banner) => (
          <li key={banner.id} className={styles.slide}>
            <img src={banner.image} alt={banner.alt} className={styles.image} />
          </li>
        ))}
      </ul>
      {hasArrows && (
        <>
          <button
            type="button"
            aria-label={`Previous ${groupName} banner`}
            aria-disabled={isAtStart}
            onClick={handlePrevious}
            className={`${styles.arrow} ${styles.previous}`}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label={`Next ${groupName} banner`}
            aria-disabled={isAtEnd}
            onClick={handleNext}
            className={`${styles.arrow} ${styles.next}`}
          >
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}
    </div>
  );
}

export default BannerCarousel;
