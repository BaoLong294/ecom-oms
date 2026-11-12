# ECOMMERCE – OMS

## Introduction

Ecommerce – OMS is an educational project that replicates the structure of a modern retail website like Uniqlo and gradually evolves into a full commerce system including OMS (Order Management System), IMS (Inventory Management System), and DMS (Delivery Management System).
This project is developed alongside the curriculum of The Odin Project to strengthen frontend fundamentals, backend logic, database design, React development and overall system architecture thinking.

The customer storefront (`frontend-user-web/`) was first built with plain HTML, CSS and JavaScript (Phases 0–4), then rewritten in React 19 with 371 automated tests (Phase 5). The next phases add a Node.js/Express + PostgreSQL backend (`backend/`) and an Admin Dashboard (`frontend-admin-web/`).

**Live demo:** https://ecom-oms-user-web.vercel.app

## Initial Project Goals

- Strengthen core skills in HTML, CSS and JavaScript through recreating the Uniqlo storefront.
- Practice analyzing real-world UI using DevTools and rebuilding layouts.
- Apply Flexbox and Responsive Design to support multiple screen sizes.
- Build foundational pages such as product lists, product details and cart UI.
- Establish a clean project structure and use Git/GitHub for version control.
- Rewrite the storefront in React test-first, keeping the same behavior and look while fixing the bugs of the vanilla version.
- Shape mock data like the future database and keep all data access in a service layer, so the backend can replace the mocks without changing the pages.
- Build the core flows of a real store: category navigation, search, cart, wishlist, protected account pages, checkout and order history.

## Technologies Used

- HTML5 (Semantic HTML, ARIA-friendly focus patterns)
- CSS3 (Flexbox, Grid, Responsive Design, CSS Transitions, `:focus-visible`, pseudo-elements, `:has()`, scroll-snap)
- JavaScript (ES6, ES Modules)
- Asynchronous JavaScript (Promises, async/await)
- localStorage for client-side state persistence
- Web Accessibility (WAI-ARIA basics, keyboard navigation, focus management, native `<dialog>`)
- React 19 (hooks, Context, `useReducer`, React Compiler)
- React Router 7 (nested layout routes, protected routes, `ScrollRestoration`)
- Vite 8, CSS Modules
- Vitest 5, React Testing Library, user-event, jest-dom
- ESLint 10, Prettier, JSDoc typedefs
- Vercel (continuous deployment)
- Git & GitHub
- VS Code, Chrome DevTools (accessibility tree, box model, force element state)

## Completed Features

- **Phase 0 – Project Setup**
  - Created GitHub repository with folder structure for user frontend, admin frontend and backend.
  - Analysed Uniqlo.com using DevTools to understand its layout, components, typography and visual structure.
  - Initialized the base files and project structure.

- **Phase 1 – Static Landing Page**
  - Built the Uniqlo-like homepage layout using HTML and CSS.
  - Created Header with logo, WOMEN MEN KIDS BABY menu and icons.
  - Designed Hero (banner) and collection highlight sections.
  - Implemented a Flexbox-based multi-column footer (prototype, later removed).
  - Achieved an accurate desktop layout similar to the real Uniqlo site.

- **Phase 2 – Basic Interactivity & Responsive Design**
  - Made the entire landing page responsive with CSS media queries.
  - Prototyped mobile hamburger navigation and a JavaScript banner carousel (both later removed; a hamburger menu is planned for Phase 8).
  - Created products.html with mock product data.
  - Created product-detail.html displaying product info by id.
  - Built a static cart page (cart.html).
  - Added hover effects and basic DOM interactions.

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

- **Phase 4 – Advanced UI Polish Before React**

  Applied the Advanced HTML & CSS curriculum (accessibility, animation, responsive design) to bring the storefront to a portfolio-ready, production-feel state before the upcoming React rewrite.
  - **Accessibility (a11y)**
    - Converted every wishlist heart icon from a bare `<svg>` into a real `<button>` across product cards, the wishlist popup, product details, and the wishlist page, restoring proper keyboard operability.
    - Built a shared `ui/focus-trap.js` module using the `inert` attribute and a `keydown` listener to trap Tab focus inside open popups (wishlist, login-required, add-to-cart), preventing focus from silently escaping to the page behind them.
    - Made product cards keyboard-navigable with `role="link"` and `tabindex="0"`, resolving an event-bubbling conflict where Enter on the nested heart button also triggered the card's own navigation.
    - Converted layout `<div>`s into semantic landmarks (`<header>`, `<nav>`, `<main>`) across all six pages, fixed an invalid `button > a` nesting in `product-details.html`, and added a `.visually-hidden` `<h1>` to the landing page so each page exposes exactly one `h1` to assistive technology.
    - Rolled out `:focus-visible` styling to every interactive control site-wide, using two consistent patterns: a flush outline (`outline: 1px solid`, no offset) for icon-sized controls, and an offset outline (`outline-offset`) for larger pill/circular controls — matching each element's existing hover/active styling for visual consistency.
    - Added a skip-to-main-content link as the first focusable element in the header on every page: hidden by default via `opacity`/`pointer-events` (not `display`/`visibility`, which would remove it from the tab order) and revealed with a full-header overlay on `:focus`.
    - Added an `id` to every page's `<main>` as the skip link's target landmark.
    - Added `:focus-visible` handling for a visually-hidden native checkbox (the "show password" toggle) by targeting its visible `label::before` counterpart, since the real input has zero size and cannot be outlined directly.
    - Replaced generic `alt="Color Swatch"` text with the actual color name pulled from product data, so screen readers announce meaningful color information.
    - Diagnosed and fixed several real accessibility bugs along the way: silent CSS selector typos (missing leading dot, copy-pasted wrong class name) that made focus rules never match; a `line-height: 0` popup close button with no padding that caused its focus outline to clip through the glyph; and a `<button>` nested inside an `<a>` (invalid HTML) that made a "Continue Shopping" link require two Tab presses before showing focus.
  - **Animation**
    - Added fade + scale transitions to all three popup types (login-required, wishlist, add-to-cart), animating only `opacity` and `transform` for cheap compositing performance, with `transition-delay` on `visibility` to avoid a flash on close.
    - Used `requestAnimationFrame` to ensure the first-open animation of JS-generated popups actually plays instead of snapping instantly.
  - **Responsive Design**
    - Replaced fixed-width layout containers (`width: 1170px`, etc.) with `max-width` + `width: 100%` across all six pages, eliminating horizontal overflow on mobile.
    - Rebuilt every page for a `max-width: 480px` breakpoint using a desktop-first strategy: header, product grid, product details image carousel (via `scroll-snap-type`), wishlist, cart, login form, and all three popups.
  - **Landing page polish**
    - Added a focus-visible outline to the landing page hero banner link using a `::after` pseudo-element overlay, since a standard `outline` on a full-bleed image gets clipped by the image layer and is invisible with `outline-offset` set to a negative value.

- **Phase 5 – React Storefront**

  Rewrote the storefront in React 19 in 22 parts: fixed the critical bugs of the vanilla version (Part 0), set up the toolchain, mock API and routing (Parts 1–3), ported every vanilla page with the same behavior and look (Parts 4–12), built new store features (Parts 13–20) and wrapped up the phase (Part 22). Every behavior was written test-first. Live demo: https://ecom-oms-user-web.vercel.app (deployed automatically on every push to `main`). The vanilla version is archived under the Git tag `vanilla-storefront`.
  - **Architecture**
    - Mock data in `data/` is normalized like the future database: products, variants (color × size), categories and banners are flat tables linked by ids.
    - Pages never import mock data directly. They call a service layer (`getCategoryListing`, `getProductById`, `getVariantsByIds`, `searchProducts`...) whose functions return Promises shaped exactly like the planned REST endpoints (for example `GET /api/categories/:id/listing`), with a simulated network delay and error mode, so Phase 6 only has to replace the inside of the services.
    - A generic `useFetch` hook handles loading, errors and stale responses for every page.
    - App-wide user data lives in four Contexts (Auth, Cart, Wishlist, Orders), each persisted to `localStorage`. The cart and wishlist store only variant ids, while an order stores a snapshot of names, sizes and prices at the time of purchase, so later price changes never rewrite past orders.
    - Routing is configuration: three layout routes give each group of pages its header style and bottom navigation, a `RequireAuth` layout route protects the account pages, and the four category landings are generated from one config array.
  - **Browsing**
    - Category landings at `/women`, `/men`, `/kids` and `/baby`, each with five full-screen banners. The header menu uses `NavLink` with `aria-current="page"` and a Uniqlo-style underline. Switching categories keeps the old banners on screen until the new ones arrive, and a response that arrives late for an old category is ignored.
    - Mega-menu: hovering or focusing WOMEN/MEN/KIDS/BABY opens a full-width panel of subcategories with product images. It works fully by keyboard (opens on focus, closes when focus leaves, Escape closes it and returns focus to the menu link), and hovering never changes the URL, so the Back button history stays clean.
    - Category pages group products by subcategory. Each group has a horizontal banner carousel (scroll-snap, arrow buttons locked with `aria-disabled` at both ends, swipe support), and categories without products show an empty state.
    - Product details page with an image gallery (scroll-snap on mobile), color and size as real radio groups, the selected variant derived from color + size, a quantity stepper, discount pricing, features and description.
    - Live product search: the search button in the bottom navigation opens a small dialog right above it. Results appear as the user types, a `role="status"` line announces the result count to screen readers, and results from an older query can never overwrite newer ones.
  - **Cart and Wishlist**
    - Cart managed by a pure `useReducer` reducer (add, change quantity, remove, clear) and persisted to `localStorage`, with a header badge, an "added to cart" dialog showing the cart subtotal, and a cart page with quantity steppers and an order summary.
    - Wishlist saved per variant (color + size). The heart on the product page follows the selected color and size automatically; the heart on a product card opens a dialog to pick sizes. Wishlist actions require login and bring the user back to the same page afterwards.
  - **Account, Checkout and Orders**
    - Simulated login with form validation (errors on blur and on submit, focus moved to the first invalid field) and a return to the page the user came from.
    - Protected routes: guests opening Membership, Checkout or Orders are redirected to login and brought back afterwards. Logging out from a protected page goes home, and Back does not return to it.
    - Checkout with a four-field delivery form built from a shared `FormField` component and a table of validators (each rule written once and used on both blur and submit), cash on delivery and a sticky order summary. Placing an order saves a snapshot of the items, clears the cart and links to the new order.
    - Order history listing the current user's orders (newest first, item count, total, status badge), and an order details page with a `Placed → Shipped → Delivered` timeline, the items linked to their product pages, the delivery address and the totals. Orders from another account and unknown ids show the same "not found" page, so the app never reveals that someone else's order exists.
  - **Accessibility**
    - Every popup is a native `<dialog>` opened with `showModal()`: the page behind becomes inert, Escape closes it, focus returns to the button that opened it, and page scrolling is locked.
    - Accessible names for every icon button, including repeated buttons (each cart item's remove and quantity buttons include the product, color and size).
    - Real radio groups inside `fieldset`/`legend`, `aria-pressed` for toggle buttons, `aria-haspopup="dialog"` for buttons that open dialogs, `aria-invalid` and `aria-describedby` for form errors, and `aria-current="step"` for the order timeline.
    - A unique tab title for every page (`Men | UNIQLO`, `Order #3 | UNIQLO`...), a skip link, a favicon and visible `:focus-visible` styles everywhere.
  - **Testing and Code Quality**
    - 371 automated tests in 29 files (Vitest + React Testing Library) covering user-visible behavior: navigation, redirects, loading and error states, form validation, focus, keyboard interaction, `localStorage`, race conditions and accessible names.
    - Shared hooks and components extracted only when the same logic appeared a second or third time (`useFetch`, `useVariants`, `Price`, `QuantityStepper`, `ColorOptions`, `FormField`, `Modal`).
    - Function declarations enforced by ESLint, Prettier formatting, and JSDoc typedefs (`Product`, `VariantDetails`, `Order`...) so the editor suggests object fields across the app; `useFetch` is generic (`@template`), so every page knows the shape of the data it fetches.
    - Fixed and documented bugs from the vanilla version, such as an email regex that rejected `john.doe@gmail.com`, wishlist removal with an unchecked `-1` index, and blur validation that disagreed with submit validation.

## Skills Demonstrated

- **React Fundamentals**: Building pages from small components, passing data down through props, computing derived values instead of storing duplicated state, lifting state up, and writing controlled forms.
- **State Management**: Using Context for app-wide data, `useReducer` for the cart, `localStorage` persistence with lazy initializers, and keeping state on the URL when it must survive reloads and the Back button.
- **Effects and Data Fetching**: Writing a generic `useFetch` hook whose cleanup ignores stale responses, and choosing event handlers instead of effects for reactions to user actions.
- **Routing**: Nested layout routes, protected routes with redirect-and-return, routes generated from configuration, and scroll restoration.
- **Test-Driven Development**: Writing behavior tests before the code, mocking services, reproducing race conditions with `Promise.withResolvers()`, and faking browser APIs that jsdom lacks (`<dialog>`, scroll measurements).
- **Accessibility**: Native dialogs, keyboard-operable menus and carousels, meaningful accessible names, live regions, and focus management after form errors.
- **Data Modeling**: Normalized mock tables, a service layer shaped like a REST API, and snapshots for orders versus references for the cart.
- **CSS Layout**: CSS Modules, Grid with `minmax(0, fr)`, scroll-snap carousels, stretched links, pseudo-element underlines and timelines, and `:has()` for state styling.
- **UI Analysis Skills**: Breaking down real website UI into components and deciding which Uniqlo features are worth building for this project.
- **Version Control and Workflow**: Conventional Commits, small focused commits, linting and testing before every push, and continuous deployment on Vercel.

## Lessons Learned

- Importance of UI analysis before writing code.
- Learning to break large layouts into smaller manageable sections.
- Improved understanding of responsive breakpoints.
- Better project organization and folder structuring for scalable systems.
- Recognizing when duplicated logic across files is a signal to extract a shared module — and, just as importantly, when a single-use function is not worth abstracting yet.
- The value of designing a clear data shape (e.g. wishlist items keyed by id + color + size) up front, since it determines how simple or painful every feature built on top of it will be.
- Accessibility is not just "add an outline" — it requires understanding _which_ element in the DOM actually receives keyboard focus (a wrapping `<a>` vs. an inner `<svg>`), how invalid HTML nesting silently breaks focus order, and how positioning/stacking (`z-index`, `position`, pseudo-elements) can hide or clip focus indicators even when the CSS rule is technically correct.
- CSS selector mistakes (a missing dot, a copy-pasted wrong class name) fail completely silently — no console error, no visual break — making methodical, page-by-page testing with the keyboard and DevTools essential rather than optional.
- The difference between hiding an element for accessibility (`opacity` + `pointer-events`, which preserves tab order) versus hiding it visually only (`display`/`visibility`, which removes it from the accessibility tree entirely) — and why the wrong choice can make a feature invisible to the very users it's meant to help.
- Passing tests do not prove the app works: each test file wraps its own providers, so a provider missing from `main.jsx` crashed the real Checkout page while every test stayed green. Running the app and checking the live site became part of every feature.
- Some bugs only exist in a real browser: logging out from a protected page redirected to login instead of home, because React drew the auth change before the router's navigation. Tests never saw it because they wait for every update; the fix was to navigate first with `await navigate('/', { flushSync: true })` and log out afterwards.
- A test is only trustworthy if it can fail: before trusting a green test, I broke the code on purpose (removed the stale-response guard, forced a remount with `key`) and checked that exactly the expected tests turned red.
- Two things that look alike are not always the same thing: two carousels with different behavior stayed separate components, while four checkout fields that shared everything became one table-driven form.
- Layout bugs hide at in-between widths: order summaries overflowed only around 600px, invisible on both desktop and phone, so every layout is now checked at desktop, about 600px and 375px.

## Credits / Attribution

- Visual references, product images and banner images from uniqlo.com, used for educational, non-commercial purposes only. This project is not affiliated with Uniqlo.
- Icons from SVG libraries, Material Icons, and hand-drawn custom icons (non-commercial usage).

## Contact

- GitHub: https://github.com/BaoLong294
- Email: longbao2904@gmail.com
- LinkedIn: https://www.linkedin.com/in/long-b%E1%BA%A3o-a9226a377/
