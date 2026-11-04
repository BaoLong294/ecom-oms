import { getLandingBanners } from '../../services/bannerService';
import LandingBanner from '../../components/LandingBanner/LandingBanner';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { useFetch } from '../../hooks/useFetch';

/**
 * Trang landing của một category gốc (WOMEN, MEN, KIDS, BABY): lấy banner landing của
 * category đó từ service và hiển thị toàn màn hình.
 * Mỗi category có route riêng (sinh từ LANDING_CATEGORIES), cùng render HomePage với prop
 * category khác nhau.
 * Trong lúc chờ dữ liệu hiện thông báo loading, gặp lỗi thì hiện thông báo lỗi.
 * Tiêu đề tab ('{name} | UNIQLO') và <h1> ẩn (tên category viết hoa, dành cho screen reader)
 * luôn được render ở mọi trạng thái, vì đều lấy từ prop, không phải chờ dữ liệu.
 * @param {{ category: { slug: string, name: string, categoryId: number } }} props
 * @param props.category - category gốc của trang, lấy từ LANDING_CATEGORIES
 */
function HomePage({ category }) {
  const { name, categoryId } = category;

  const {
    data: banners,
    isLoading,
    errorMessage,
  } = useFetch(getLandingBanners, categoryId);

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
      <title>{`${name} | UNIQLO`}</title>
      <h1 className="visually-hidden">{name.toUpperCase()}</h1>
      {content}
    </>
  );
}

export default HomePage;
