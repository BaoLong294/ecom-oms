import styles from './CategoryPage.module.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryListing } from '../../services/categoryService';
import ProductCard from '../../components/ProductCard/ProductCard';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../context/AuthContext';
import LoginRequiredPopup from '../../components/LoginRequiredPopup/LoginRequiredPopup';
import WishlistPopup from './WishlistPopup';

/**
 * Trang danh sách sản phẩm của một category: lấy id từ URL (/categories/:id),
 * gọi getCategoryListing và hiển thị từng nhóm (category con) gồm tiêu đề,
 * banner đầu tiên và lưới ProductCard.
 * Mỗi nhóm là một <section> đặt tên bằng aria-labelledby theo <h2> của nhóm.
 * Tiêu đề <h1> luôn được render:
 * Đang tải hoặc lỗi: "Category" (ẩn, chỉ dành cho screen reader), kèm StatusMessage.
 * Category không tồn tại (service trả null): "Category not found".
 * Có dữ liệu: tên category.
 * Bấm tim trên một card: khách chưa đăng nhập thì mở popup yêu cầu đăng nhập,
 * đã đăng nhập thì mở popup wishlist của sản phẩm đó (state chỉ lưu id sản phẩm,
 * object product được tìm lại trong listing lúc render).
 * Hai popup đặt ở trang (một popup cho mọi card) và luôn được render để Modal đóng đúng cách.
 * Popup đặt ở trang (một popup cho mọi card) và luôn được render để Modal đóng đúng cách.
 */
function CategoryPage() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [wishlistProductId, setWishlistProductId] = useState(null);

  const {
    data: listing,
    isLoading,
    errorMessage,
  } = useFetch(getCategoryListing, Number(id));

  let content = null;
  let headingText = 'Category';
  let headingClassName = 'visually-hidden';
  let wishlistProduct = null;

  if (isLoading) {
    content = <StatusMessage variant="loading" />;
  } else if (errorMessage) {
    content = <StatusMessage variant="error" message={errorMessage} />;
  } else if (listing === null) {
    headingText = 'Category not found';
    headingClassName = styles.title;
  } else {
    headingText = listing.name;
    headingClassName = styles.title;
    content = (
      <div className={styles.groups}>
        {listing.groups.map((group) => {
          const banner = group.banners[0];

          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <h2 id={`group-${group.id}`} className={styles.groupName}>
                {group.name}
              </h2>
              {banner && (
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className={styles.banner}
                />
              )}
              <div className={styles.grid}>
                {group.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onWishlistClick={handleWishlistClick}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );

    const products = listing.groups.flatMap((group) => group.products);
    wishlistProduct =
      products.find((product) => product.id === wishlistProductId) ?? null;
  }

  function handleWishlistClick(product) {
    if (!isLoggedIn) {
      setIsLoginPopupOpen(true);
      return;
    }

    setWishlistProductId(product.id);
  }

  return (
    <div className={styles.page}>
      <h1 className={headingClassName}>{headingText}</h1>
      {content}
      <LoginRequiredPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
      />
      <WishlistPopup
        product={wishlistProduct}
        onClose={() => setWishlistProductId(null)}
      />
    </div>
  );
}

export default CategoryPage;
