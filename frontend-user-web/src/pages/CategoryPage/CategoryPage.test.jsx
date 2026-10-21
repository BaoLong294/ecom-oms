import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CategoryPage from './CategoryPage.jsx';
import { getCategoryListing } from '../../services/categoryService';

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
          ],
          features: [
            {
              img: '/images/product-c-feature.avif',
              text: 'Product C Feature',
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

  render(<RouterProvider router={router} />);
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
