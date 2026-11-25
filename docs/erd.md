# Ecom-OMS – Entity Relationship Diagram

ERD of the Ecom-OMS PostgreSQL database: 15 tables with all their columns, primary keys (PK), foreign keys (FK), unique keys (UK) and relationships. Column types show the type name only; exact sizes and constraints are in `backend/db/schema.sql`.

- **Catalog**: categories (self-referencing tree), products, their colors, detail images and features, the shared size lookup, and variants (one row per product × color × size, the unit that is stocked and sold).
- **Banners**: landing banners and category banners, both attached to categories.
- **Users and orders**: user accounts (customer, admin, shipper roles), shipper profiles, cart and wishlist items, orders and order items (order items snapshot product data at the time of purchase).

```mermaid
erDiagram
    %% Catalog
    categories |o--o{ categories : "parent of"
    categories ||--o{ products : "contains"
    products ||--|{ product_colors : "comes in"
    products ||--o{ product_images : "has"
    products ||--o{ product_features : "has"
    products ||--|{ variants : "sold as"
    product_colors ||--|{ variants : "colors"
    sizes ||--o{ variants : "sizes"

    %% Banners
    categories ||--o{ landing_banners : "shows"
    categories ||--o{ landing_banners : "is target of"
    categories ||--o{ category_banners : "shows"

    %% Users, cart and wishlist
    users ||--o| shippers : "has profile"
    users ||--o{ cart_items : "has in cart"
    variants ||--o{ cart_items : "added to"
    users ||--o{ wishlist_items : "has in wishlist"
    variants ||--o{ wishlist_items : "saved to"

    %% Orders
    users ||--o{ orders : "places"
    shippers |o--o{ orders : "delivers"
    orders ||--|{ order_items : "contains"
    variants |o--o{ order_items : "ordered as"
    products |o--o{ order_items : "referenced by"

    %% Catalog tables
    categories {
        int id PK
        varchar name
        int position
        int parent_id FK
        text image
    }
    products {
        int id PK
        varchar name
        int category_id FK
        varchar gender
        numeric price
        int discount_percent
        text discount_info
    }
    product_colors {
        int product_id PK, FK
        varchar code PK
        varchar name
        text swatch
        text image
    }
    product_images {
        int id PK
        int product_id FK
        text image
        int position
    }
    product_features {
        int id PK
        int product_id FK
        text image
        text text
        int position
    }
    sizes {
        varchar code PK
        int position
    }
    variants {
        int id PK
        int product_id FK
        varchar color_code FK
        varchar size_code FK
        int stock_quantity
    }

    %% Banner tables
    landing_banners {
        int id PK
        int category_id FK
        int target_category_id FK
        int position
        varchar title
        varchar subtitle
        text description
        numeric price
        int discount_percent
        text discount_info
        varchar text_color
        text image
        text alt
    }
    category_banners {
        int id PK
        int category_id FK
        int position
        text image
        text alt
    }

    %% User tables
    users {
        int id PK
        varchar email UK
        text password_hash
        varchar role
        timestamptz created_at
    }
    shippers {
        int id PK
        int user_id FK, UK
        varchar name
        varchar phone
    }
    cart_items {
        int user_id PK, FK
        int variant_id PK, FK
        int quantity
        timestamptz created_at
    }
    wishlist_items {
        int user_id PK, FK
        int variant_id PK, FK
        timestamptz created_at
    }

    %% Order tables
    orders {
        int id PK
        int user_id FK
        int shipper_id FK
        varchar status
        varchar shipping_first_name
        varchar shipping_last_name
        text shipping_address
        varchar shipping_phone
        numeric total
        timestamptz created_at
    }
    order_items {
        int id PK
        int order_id FK
        int variant_id FK
        int product_id FK
        varchar product_name
        varchar color_name
        varchar size
        text image
        int quantity
        numeric unit_price
    }
```
