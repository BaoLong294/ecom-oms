import { Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { LANDING_CATEGORIES } from './config/landingCategories';
import RequireAuth from './components/RequireAuth/RequireAuth';
import AccountPage from './pages/AccountPage/AccountPage';

export const routes = [
  {
    element: <AppLayout headerVariant="landing" hasBottomNav={true} />,
    children: [
      { path: '/', element: <Navigate to="/women" replace /> },
      ...LANDING_CATEGORIES.map((category) => ({
        path: `/${category.slug}`,
        element: <HomePage category={category} />,
      })),
    ],
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
      {
        element: <RequireAuth />,
        children: [{ path: '/account', element: <AccountPage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
