import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CategoryPage from './CategoryPage.jsx';
import { getCategoryListing } from '../../services/categoryService';
import AuthProvider from '../../context/AuthProvider.jsx';
import userEvent from '@testing-library/user-event';
import WishlistProvider from '../../context/WishlistProvider.jsx';

vi.mock('../../services/categoryService', () => ({
  getCategoryListing: vi.fn(),
}));

// Listing của category 3: Group A có 2 banner (chỉ ảnh position 1 được hiển thị)
// và 1 sản phẩm; Group B có 1 banner và 2 sản phẩm.
const mockListing = {
  id: 3,
  name: 'Example Collection',
  groups: [
    {
      id: 11,
      name: 'Group A',
      banners: [
        {
          id: 1,
          categoryId: 11,
          position: 1,
          image: '/images/first-banner.jpg',
          alt: 'Banner A1',
        },
        {
          id: 2,
          categoryId: 11,
          position: 2,
          image: '/images/second-banner.jpg',
          alt: 'Banner A2',
        },
      ],
      products: [
        {
          id: 31,
          name: 'Product B',
          categoryId: 11,
          gender: 'Women',
          price: 40,
          discountPercent: null,
          discountInfo: null,
          sizes: ['S', 'L', 'XL'],
          detailImages: ['/images/product-b-details.avif'],
          colors: [
            {
              code: '08',
              name: '08 DARK GRAY',
              swatch: '/images/08-dark-gray.avif',
              image: '/images/product-b/08-dark-gray.avif',
            },
          ],
          features: [
            {
              img: '/images/product-b-feature.avif',
              text: 'Product B Feature',
            },
          ],
          variants: [
            {
              id: 101,
              productId: 31,
              colorCode: '08',
              size: 'S',
              stockQuantity: 10,
            },
            {
              id: 102,
              productId: 31,
              colorCode: '08',
              size: 'L',
              stockQuantity: 10,
            },
            {
              id: 103,
              productId: 31,
              colorCode: '08',
              size: 'XL',
              stockQuantity: 10,
            },
          ],
        },
      ],
    },
    {
      id: 12,
      name: 'Group B',
      banners: [
        {
          id: 3,
          categoryId: 12,
          position: 1,
          image: '/images/third-banner.jpg',
          alt: 'Banner B1',
        },
      ],
      products: [
        {
          id: 32,
          name: 'Product C',
          categoryId: 12,
          gender: 'Unisex',
          price: 50,
          discountPercent: 20,
          discountInfo: 'Sale ends 11/30',
          sizes: ['XS', 'M'],
          detailImages: ['/images/product-c-details.avif'],
          colors: [
            {
              code: '09',
              name: '09 BLACK',
              swatch: '/images/09-black.avif',
              image: '/images/product-c/09-black.avif',
            },
            {
              code: '10',
              name: '10 WHITE',
              swatch: '/images/10-white.avif',
              image: '/images/product-c/10-white.avif',
            },
          ],
          features: [
            {
              img: '/images/product-c-feature.avif',
              text: 'Product C Feature',
            },
          ],
          variants: [
            {
              id: 201,
              productId: 32,
              colorCode: '09',
              size: 'XS',
              stockQuantity: 10,
            },
            {
              id: 202,
              productId: 32,
              colorCode: '09',
              size: 'M',
              stockQuantity: 10,
            },
            {
              id: 203,
              productId: 32,
              colorCode: '10',
              size: 'XS',
              stockQuantity: 10,
            },
            {
              id: 204,
              productId: 32,
              colorCode: '10',
              size: 'M',
              stockQuantity: 10,
            },
          ],
        },
        {
          id: 33,
          name: 'Product D',
          categoryId: 12,
          gender: 'Women',
          price: 30,
          discountPercent: null,
          discountInfo: null,
          sizes: ['M', 'XXL'],
          detailImages: ['/images/product-d-details.avif'],
          colors: [
            {
              code: '30',
              name: '30 NATURAL',
              swatch: '/images/30-natural.avif',
              image: '/images/product-d/30-natural.avif',
            },
          ],
          features: [
            {
              img: '/images/product-d-feature.avif',
              text: 'Product D Feature',
            },
          ],
          variants: [
            {
              id: 301,
              productId: 33,
              colorCode: '30',
              size: 'M',
              stockQuantity: 10,
            },
            {
              id: 302,
              productId: 33,
              colorCode: '30',
              size: 'XXL',
              stockQuantity: 10,
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Render CategoryPage trong router tối thiểu tại /categories/3,
 * để useParams đọc được id = '3'. Dữ liệu đến từ service bị mock,
 * nên mỗi test phải lập trình getCategoryListing trước khi gọi hàm này.
 */
function renderCategoryPage() {
  const router = createMemoryRouter(
    [{ path: '/categories/:id', element: <CategoryPage /> }],
    { initialEntries: ['/categories/3'] }
  );

  render(
    <AuthProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </AuthProvider>
  );
}

describe('CategoryPage', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should show the loading message while fetching', () => {
    getCategoryListing.mockReturnValue(new Promise(() => {}));
    renderCategoryPage();
    const loading = screen.getByText('Loading...');

    expect(loading).toBeInTheDocument();
  });

  it('should render a level-1 heading "Category" while loading', () => {
    getCategoryListing.mockReturnValue(new Promise(() => {}));
    renderCategoryPage();
    const heading = screen.getByRole('heading', {
      name: 'Category',
      level: 1,
    });

    expect(heading).toBeInTheDocument();
  });

  it('should call the service with the category id from the URL as a number', () => {
    getCategoryListing.mockReturnValue(new Promise(() => {}));
    renderCategoryPage();

    expect(getCategoryListing).toHaveBeenCalledWith(3);
  });

  it('should show the error message when the request fails', async () => {
    getCategoryListing.mockRejectedValue(new Error('Loading error!'));
    renderCategoryPage();
    const errorMessage = await screen.findByText('Loading error!');

    expect(errorMessage).toBeInTheDocument();
  });

  it('should show the category name as the level-1 heading and hide loading after fetching', async () => {
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const heading = await screen.findByRole('heading', {
      name: 'Example Collection',
      level: 1,
    });
    const loading = screen.queryByText('Loading...');

    expect(heading).toBeInTheDocument();
    expect(loading).not.toBeInTheDocument();
  });

  it('should render a level-2 heading for each group', async () => {
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const groupHeadings = await screen.findAllByRole('heading', { level: 2 });

    expect(groupHeadings.map((heading) => heading.textContent)).toEqual([
      'Group A',
      'Group B',
    ]);
  });

  it('should render each product inside its own group', async () => {
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const groupB = await screen.findByRole('region', { name: 'Group B' });
    const groupA = screen.getByRole('region', { name: 'Group A' });

    const productExist = within(groupB).getByRole('link', {
      name: 'Product C',
    });
    const productNotExist = within(groupA).queryByRole('link', {
      name: 'Product C',
    });

    expect(productExist).toBeInTheDocument();
    expect(productNotExist).not.toBeInTheDocument();
  });

  it('should show only the first banner of each group', async () => {
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const groupA = await screen.findByRole('region', { name: 'Group A' });

    const bannerShown = within(groupA).getByRole('img', {
      name: 'Banner A1',
    });
    const bannerHidden = within(groupA).queryByRole('img', {
      name: 'Banner A2',
    });

    expect(bannerShown).toBeInTheDocument();
    expect(bannerHidden).not.toBeInTheDocument();
  });

  it('should show "Category not found" when the category does not exist', async () => {
    getCategoryListing.mockResolvedValue(null);
    renderCategoryPage();
    const categoryNotFound = await screen.findByRole('heading', {
      level: 1,
      name: 'Category not found',
    });

    expect(categoryNotFound).toBeInTheDocument();
  });
});

describe('CategoryPage wishlist', () => {
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  function logIn() {
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
  }

  function storeWishlist(ids) {
    localStorage.setItem('wishlist', JSON.stringify(ids));
  }

  function readStoredWishlist() {
    return JSON.parse(localStorage.getItem('wishlist'));
  }

  // Bấm tim của Product C (nhóm thứ hai, không phải sản phẩm đầu) rồi trả về popup đã mở.
  async function openWishlistPopup(user) {
    const heart = await screen.findByRole('button', {
      name: 'Add Product C to wishlist',
    });
    await user.click(heart);

    return screen.getByRole('dialog', {
      name: 'Add to wishlist',
      hidden: true,
    });
  }

  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function () {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function () {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
  });

  afterEach(() => {
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('should open the login popup when a guest clicks a product heart', async () => {
    const user = userEvent.setup();
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const heart = await screen.findByRole('button', {
      name: 'Add Product C to wishlist',
    });

    expect(
      screen.queryByRole('dialog', { name: 'Login' })
    ).not.toBeInTheDocument();

    await user.click(heart);

    expect(
      screen.getByRole('dialog', { name: 'Login', hidden: true })
    ).toHaveAttribute('open');
  });

  it('should open the wishlist popup when a logged-in user clicks a product heart', async () => {
    const user = userEvent.setup();
    logIn();
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const heart = await screen.findByRole('button', {
      name: 'Add Product C to wishlist',
    });

    expect(
      screen.queryByRole('dialog', { name: 'Add to wishlist' })
    ).not.toBeInTheDocument();

    await user.click(heart);

    expect(
      screen.getByRole('dialog', { name: 'Add to wishlist', hidden: true })
    ).toHaveAttribute('open');
    expect(
      screen.queryByRole('dialog', { name: 'Login' })
    ).not.toBeInTheDocument();
  });

  it('should show the first color of the clicked product', async () => {
    const user = userEvent.setup();
    logIn();
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const popup = within(await openWishlistPopup(user));

    expect(
      popup.getByRole('img', { name: 'Product C, 09 BLACK' })
    ).toBeInTheDocument();
    expect(popup.getByRole('radio', { name: '09 BLACK' })).toBeChecked();
    expect(popup.getByText('Color: 09 BLACK')).toBeInTheDocument();
  });

  it('should press the size hearts of variants already in the wishlist', async () => {
    const user = userEvent.setup();
    logIn();
    storeWishlist([202]);
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const popup = within(await openWishlistPopup(user));

    expect(
      popup.getByRole('button', { name: 'Add Product C size M to wishlist' })
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      popup.getByRole('button', { name: 'Add Product C size XS to wishlist' })
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('should add the variant of the selected color and size', async () => {
    const user = userEvent.setup();
    logIn();
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const popup = within(await openWishlistPopup(user));
    const heartXS = popup.getByRole('button', {
      name: 'Add Product C size XS to wishlist',
    });

    expect(heartXS).toHaveAttribute('aria-pressed', 'false');

    await user.click(heartXS);

    expect(heartXS).toHaveAttribute('aria-pressed', 'true');
    expect(readStoredWishlist()).toEqual([201]);
  });

  it('should remove a variant that is already in the wishlist', async () => {
    const user = userEvent.setup();
    logIn();
    storeWishlist([202]);
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const popup = within(await openWishlistPopup(user));
    const heartM = popup.getByRole('button', {
      name: 'Add Product C size M to wishlist',
    });

    expect(heartM).toHaveAttribute('aria-pressed', 'true');

    await user.click(heartM);

    expect(heartM).toHaveAttribute('aria-pressed', 'false');
    expect(readStoredWishlist()).toEqual([]);
  });

  it('should update the image and size hearts when the color changes', async () => {
    const user = userEvent.setup();
    logIn();
    storeWishlist([203]);
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const popup = within(await openWishlistPopup(user));
    const heartXS = popup.getByRole('button', {
      name: 'Add Product C size XS to wishlist',
    });

    expect(heartXS).toHaveAttribute('aria-pressed', 'false');

    await user.click(popup.getByRole('radio', { name: '10 WHITE' }));

    expect(heartXS).toHaveAttribute('aria-pressed', 'true');
    expect(
      popup.getByRole('button', { name: 'Add Product C size M to wishlist' })
    ).toHaveAttribute('aria-pressed', 'false');
    expect(
      popup.getByRole('img', { name: 'Product C, 10 WHITE' })
    ).toBeInTheDocument();
    expect(popup.getByText('Color: 10 WHITE')).toBeInTheDocument();
  });

  it('should close the popup with the close button', async () => {
    const user = userEvent.setup();
    logIn();
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const dialog = await openWishlistPopup(user);

    await user.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(dialog).not.toHaveAttribute('open');
  });

  it('should close with CLOSE and start from the first color when reopened', async () => {
    const user = userEvent.setup();
    logIn();
    getCategoryListing.mockResolvedValue(mockListing);
    renderCategoryPage();
    const dialog = await openWishlistPopup(user);

    await user.click(within(dialog).getByRole('radio', { name: '10 WHITE' }));
    await user.click(within(dialog).getByRole('button', { name: 'CLOSE' }));

    expect(dialog).not.toHaveAttribute('open');

    const reopened = within(await openWishlistPopup(user));

    expect(reopened.getByRole('radio', { name: '09 BLACK' })).toBeChecked();
  });
});
