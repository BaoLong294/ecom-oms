import AppLayout from './components/AppLayout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

export const routes = [
  {
    element: <AppLayout headerVariant="landing" hasBottomNav={true} />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  {
    element: <AppLayout headerVariant="default" hasBottomNav={true} />,
    children: [
      { path: '/categories/:id', element: <CategoryPage /> },
      { path: '/products/:id', element: <ProductPage /> },
    ],
  },
  {
    element: <AppLayout headerVariant="default" hasBottomNav={false} />,
    children: [
      { path: '/cart', element: <CartPage /> },
      { path: '/wishlist', element: <WishlistPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
