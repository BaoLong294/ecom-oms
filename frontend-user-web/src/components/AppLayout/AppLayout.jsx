import styles from './AppLayout.module.css';
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        <span>Skip to main content</span>
      </a>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
