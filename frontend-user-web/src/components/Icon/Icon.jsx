import styles from './Icon.module.css';

const ICON_SPRITE = '/assets/icons/landing-page-icons.svg';

/**
 * Icon cho các trang khác nhau sử dụng bằng cách nhận tên
 * của icon và trả về khối svg để có thể sử dụng được ngay trong jsx.
 * @param {{ name: string }} props - id của icon trong file sprite (ví dụ 'cart-icon').
 */
function Icon({ name }) {
  return (
    <svg aria-hidden={true} className={styles.icon}>
      <use href={`${ICON_SPRITE}#${name}`} />
    </svg>
  );
}

export default Icon;
