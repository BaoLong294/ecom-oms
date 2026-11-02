import styles from './NotFoundPage.module.css';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>404 - Page not found</h1>
      <p className={styles.message}>This page doesn't exist.</p>
      <Link to="/" className={styles.homeLink}>
        Back to Homepage
      </Link>
    </div>
  );
}

export default NotFoundPage;
