import './styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import AuthProvider from './context/AuthProvider';
import CartProvider from './context/CartProvider';
import WishlistProvider from './context/WishlistProvider';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
