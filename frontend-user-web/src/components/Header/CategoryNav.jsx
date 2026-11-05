import styles from './CategoryNav.module.css';
import { useState, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getCategoryMenu } from '../../services/categoryService';
import { LANDING_CATEGORIES } from '../../config/landingCategories';

/**
 * Một mục của menu category (WOMEN, MEN, KIDS, BABY): link tới landing của
 * category và mega-menu thả xuống liệt kê các category con.
 * Mega-menu mở khi rê chuột vào hoặc focus vào mục, đóng khi chuột rời đi,
 * focus ra khỏi mục, nhấn Escape (focus quay về link của mục) hoặc bấm một link.
 * Các handler gắn trên <li> vì sự kiện focus/blur/keydown của link con nổi lên <li>,
 * còn mouseleave tính cả phần tử con, nên rê chuột từ chữ xuống bảng không làm đóng menu.
 * @param {object} props
 * @param {{ slug: string, name: string, categoryId: number }} props.category - phần tử của LANDING_CATEGORIES
 * @param {{ id: number, name: string, image: string | null }[]} props.subcategories - category con của mục
 * @param {boolean} props.isLoading - dữ liệu menu đang tải
 * @param {string | null} props.errorMessage - thông báo lỗi khi tải menu thất bại
 * @param {boolean} props.isOpen - mega-menu của mục này đang mở
 * @param {function(): void} props.onOpen - mở mega-menu của mục này
 * @param {function(): void} props.onClose - đóng mega-menu
 */
function CategoryNavItem({
  category,
  subcategories,
  isLoading,
  errorMessage,
  isOpen,
  onOpen,
  onClose,
}) {
  const linkRef = useRef(null);

  let menuContent;

  if (isLoading) {
    menuContent = <p className={styles.status}>Loading...</p>;
  } else if (errorMessage) {
    menuContent = <p className={styles.status}>{errorMessage}</p>;
  } else {
    menuContent = (
      <ul
        aria-label={`${category.name} categories`}
        className={styles.subcategories}
      >
        {subcategories.map((subcategory) => (
          <li key={subcategory.id}>
            <Link
              to={`/categories/${subcategory.id}`}
              onClick={onClose}
              className={styles.subcategoryLink}
            >
              {subcategory.image !== null ? (
                <img
                  src={subcategory.image}
                  alt=""
                  className={styles.subcategoryImage}
                />
              ) : (
                <span className={styles.subcategoryImage} />
              )}
              <span className={styles.subcategoryName}>{subcategory.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) onClose();
  }

  function handleKeyDown(event) {
    if (event.key !== 'Escape') return;

    // Focus trước rồi mới đóng: focus về link làm onFocus của <li> chạy (mở menu);
    // đóng sau thì lần mở đó không có tác dụng.
    linkRef.current.focus();
    onClose();
  }

  return (
    <li
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={styles.item}
    >
      <NavLink
        ref={linkRef}
        to={`/${category.slug}`}
        className={styles.menuLink}
        onClick={onClose}
      >
        {category.name.toUpperCase()}
      </NavLink>
      {isOpen && <div className={styles.megaMenu}>{menuContent}</div>}
    </li>
  );
}

/**
 * Menu category của header landing (WOMEN, MEN, KIDS, BABY), sinh từ LANDING_CATEGORIES.
 * Lấy dữ liệu mega-menu một lần bằng getCategoryMenu; tách khỏi Header để chỉ header
 * landing mới gọi service (hook không gọi được trong điều kiện isLanding).
 * State openMenuId (categoryId của mục đang mở) đặt ở đây để chỉ một mega-menu mở tại một lúc.
 */
function CategoryNav() {
  const { data: menu, isLoading, errorMessage } = useFetch(getCategoryMenu);
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <nav className={styles.menu} aria-label="Categories">
      <ul className={styles.menuList}>
        {LANDING_CATEGORIES.map((category) => {
          const subcategories =
            menu?.find((root) => root.id === category.categoryId)?.children ??
            [];

          return (
            <CategoryNavItem
              key={category.slug}
              category={category}
              subcategories={subcategories}
              isLoading={isLoading}
              errorMessage={errorMessage}
              isOpen={openMenuId === category.categoryId}
              onOpen={() => setOpenMenuId(category.categoryId)}
              onClose={() => setOpenMenuId(null)}
            />
          );
        })}
      </ul>
    </nav>
  );
}

export default CategoryNav;
