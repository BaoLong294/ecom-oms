import styles from './CategoryPage.module.css';
import { useParams } from 'react-router-dom';
import { getCategoryListing } from '../../services/categoryService';
import ProductCard from '../../components/ProductCard/ProductCard';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { useFetch } from '../../hooks/useFetch';

/**
 * Trang danh sách sản phẩm của một category: lấy id từ URL (/categories/:id),
 * gọi getCategoryListing và hiển thị từng nhóm (category con) gồm tiêu đề,
 * banner đầu tiên và lưới ProductCard.
 * Mỗi nhóm là một <section> đặt tên bằng aria-labelledby theo <h2> của nhóm.
 * Tiêu đề <h1> luôn được render:
 * Đang tải hoặc lỗi: "Category" (ẩn, chỉ dành cho screen reader), kèm StatusMessage.
 * Category không tồn tại (service trả null): "Category not found".
 * Có dữ liệu: tên category.
 */
function CategoryPage() {
  const { id } = useParams();

  const {
    data: listing,
    isLoading,
    errorMessage,
  } = useFetch(getCategoryListing, Number(id));

  let content = null;
  let headingText = 'Category';
  let headingClassName = 'visually-hidden';

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
        {listing.groups.map((group) => (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <h2 id={`group-${group.id}`} className={styles.groupName}>
              {group.name}
            </h2>
            {group.banners[0] && (
              <img
                src={group.banners[0].image}
                alt={group.banners[0].alt}
                className={styles.banner}
              />
            )}
            <div className={styles.grid}>
              {group.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={headingClassName}>{headingText}</h1>
      {content}
    </div>
  );
}

export default CategoryPage;
