import { getLandingBanners } from '../../services/bannerService';
import LandingBanner from '../../components/LandingBanner/LandingBanner';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { useFetch } from '../../hooks/useFetch';

const WOMEN_CATEGORY_ID = 1;

/**
 * Trang chủ: lấy banner landing của category Women từ service và hiển thị toàn màn hình.
 * Trong lúc chờ dữ liệu hiện thông báo loading, gặp lỗi thì hiện thông báo lỗi.
 * Tiêu đề trang (ẩn, dành cho screen reader) luôn được render ở mọi trạng thái.
 */
function HomePage() {
  const {
    data: banners,
    isLoading,
    errorMessage,
  } = useFetch(getLandingBanners, WOMEN_CATEGORY_ID);

  let content;
  if (isLoading) {
    content = <StatusMessage variant="loading" />;
  } else if (errorMessage) {
    content = <StatusMessage variant="error" message={errorMessage} />;
  } else {
    content = banners.map((banner) => (
      <LandingBanner key={banner.id} banner={banner} />
    ));
  }

  return (
    <>
      <h1 className="visually-hidden">UNIQLO</h1>
      {content}
    </>
  );
}

export default HomePage;
