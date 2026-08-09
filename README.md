# ECOMMERCE – OMS

## Introduction

Ecommerce – OMS is an educational project that replicates the structure of a modern retail website like Uniqlo and gradually evolves into a full commerce system including OMS (Order Management System), IMS (Inventory Management System), and DMS (Delivery Management System).
This project is developed alongside the curriculum of The Odin Project to strengthen frontend fundamentals, backend logic, database design, React development and overall system architecture thinking.

## Initial Project Goals

- Strengthen core skills in HTML, CSS and JavaScript through recreating the Uniqlo storefront.
- Practice analyzing real-world UI using DevTools and rebuilding layouts.
- Apply Flexbox and Responsive Design to support multiple screen sizes.
- Build foundational pages such as product lists, product details and cart UI.
- Establish a clean project structure and use Git/GitHub for version control.

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Responsive Design)
- JavaScript (ES6, ES Modules)
- Asynchronous JavaScript (Promises, async/await)
- localStorage for client-side state persistence
- Git & GitHub
- VS Code

## Completed Features

- **Phase 0 – Project Setup**
  - Created GitHub repository with folder structure for user frontend, admin frontend and backend.
  - Analysed Uniqlo.com using DevTools to understand its layout, components, typography and visual structure.
  - Initialized the base files and project structure.

- **Phase 1 – Static Landing Page**
  - Built the Uniqlo-like homepage layout using HTML and CSS.
  - Created Header with logo, WOMEN MEN KIDS BABY menu and icons.
  - Designed Hero (banner) and collection highlight sections.
  - Implemented Flexbox-based Footer with multiple columns.
  - Achieved an accurate desktop layout similar to the real Uniqlo site.

- **Phase 2 – Basic Interactivity & Responsive Design**
  - Made the entire landing page responsive with CSS media queries.
  - Implemented mobile hamburger navigation.
  - Built a simple JavaScript carousel for the homepage banner.
  - Created products.html with mock product data.
  - Created product-detail.html displaying product info by id.
  - Built a static cart page (cart.html).
  - Added hover effects and basic DOM interactions.
  - Skills Demonstrated
  - HTML & CSS Layout: Recreating complex layouts with Flexbox and Grid.
  - Responsive Web Design: Adapting UI for mobile, tablet and desktop.
  - DOM Manipulation: Implementing carousel and UI effects via JavaScript.
  - Event Handling: Toggling mobile navigation, handling user interactions.
  - UI Analysis Skills: Breaking down real website UI into components.
  - Version Control: Using Git and GitHub with clean commit history.

- **Phase 3 – Advanced JavaScript & Storefront Architecture**
  - Refactored the entire storefront into single-responsibility ES modules: `data/products.js` (product source), `cart/cart.js` and `wishlist/wishlist.js` (dedicated state modules, the only code allowed to touch their `localStorage` keys), `auth/auth.js` (simulated login state), `ui/` (reusable render components), and `utils/price.js` (shared pricing helpers).
  - Centralized cart and wishlist state so every page reads and writes through the same functions instead of duplicating `localStorage` logic.
  - Tracked wishlist items by exact `{id, color, size}` combination, keeping the heart icon in sync across product cards, the wishlist popup, and the product details page — including correct re-sync when the user changes color or size.
  - Introduced a singleton popup pattern (wishlist popup, login-required popup): built once on first use, reused on every later interaction instead of being recreated.
  - Simulated an async API with `fetchProducts()` (Promise + artificial delay), adding loading and friendly error states across the product listing and product detail pages.
  - Built a full Wishlist page (`shopping-wishlist.html`) with empty/filled states, a sticky item-count sidebar, and per-item cards supporting remove-from-wishlist and add-to-cart.
  - Implemented a login-required flow: wishlisting a product while logged out opens a popup prompting login, matching the real Uniqlo UX; wired the login form to `auth.js` so successful validation sets the logged-in flag and redirects.
  - Replaced the header's placeholder icon with a custom hand-drawn account icon matching the existing icon set's stroke style, linked to the login page across every storefront page.
  - Documented every exported function with JSDoc (`@param`/`@returns`) and gave each module a short header comment describing its responsibility.

## Lessons Learned

- Importance of UI analysis before writing code.
- Learning to break large layouts into smaller manageable sections.
- Improved understanding of responsive breakpoints.
- Better project organization and folder structuring for scalable systems.
- Recognizing when duplicated logic across files is a signal to extract a shared module — and, just as importantly, when a single-use function is not worth abstracting yet.
- The value of designing a clear data shape (e.g. wishlist items keyed by id + color + size) up front, since it determines how simple or painful every feature built on top of it will be.
- Credits / Attribution
- Visual references from uniqlo.com for educational, non-commercial purposes.
- Icons from SVG libraries, Material Icons, and hand-drawn custom icons (non-commercial usage).

## Contact

- GitHub: https://github.com/BaoLong294
- Email: longbao2904@gmail.com
- LinkedIn: https://www.linkedin.com/in/long-b%E1%BA%A3o-a9226a377/
