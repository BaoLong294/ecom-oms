const products = [
  {
    id: 1,
    name: "Cotton Relaxed Ankle Pants | Denim",
    category: "Cotton",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/cotton-relaxed-denim/08-dark-gray.avif",
      "./images/product-details/cotton-relaxed-denim/detail-1.avif",
      "./images/product-details/cotton-relaxed-denim/detail-2.avif",
      "./images/product-details/cotton-relaxed-denim/detail-3.avif",
      "./images/product-details/cotton-relaxed-denim/detail-4.avif",
    ],
    color: [
      {
        name: "08 DARK GRAY",
        swatch: "./images/color-swatches/cotton/08-dark-gray.avif",
        image:
          "./images/product-details/cotton-relaxed-denim/08-dark-gray.avif",
      },
      {
        name: "65 BLUE",
        swatch: "./images/color-swatches/cotton/65-blue.avif",
        image: "./images/product-details/cotton-relaxed-denim/65-blue.avif",
      },
      {
        name: "67 BLUE",
        swatch: "./images/color-swatches/cotton/67-blue.avif",
        image: "./images/product-details/cotton-relaxed-denim/67-blue.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/cotton-relaxed-denim/feature-1.avif",
        text: "Made from soft and comfortable 100% cotton.",
      },
      {
        img: "./images/product-details/cotton-relaxed-denim/feature-2.avif",
        text: "Elastic waistband makes for easy outfit changes. Versatile relaxed silhouette.",
      },
      {
        img: "./images/product-details/cotton-relaxed-denim/feature-3.avif",
        text: "Designed to look like jeans with a classic denim color and a comfortable fit.",
      },
    ],
  },

  {
    id: 2,
    name: "Cotton Relaxed Ankle Pants",
    category: "Cotton",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/cotton-relaxed/09-black.avif",
      "./images/product-details/cotton-relaxed/detail-1.avif",
      "./images/product-details/cotton-relaxed/detail-2.avif",
    ],
    color: [
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/cotton/09-black.avif",
        image: "./images/product-details/cotton-relaxed/09-black.avif",
      },
      {
        name: "30 NATURAL",
        swatch: "./images/color-swatches/cotton/30-natural.avif",
        image: "./images/product-details/cotton-relaxed/30-natural.avif",
      },
      {
        name: "31 BEIGE",
        swatch: "./images/color-swatches/cotton/31-beige.avif",
        image: "./images/product-details/cotton-relaxed/31-beige.avif",
      },
      {
        name: "57 OLIVE",
        swatch: "./images/color-swatches/cotton/57-olive.avif",
        image: "./images/product-details/cotton-relaxed/57-olive.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/cotton-relaxed/feature-1.avif",
        text: "Made from soft and comfortable 100% cotton.",
      },
      {
        img: "./images/product-details/cotton-relaxed/feature-2.avif",
        text: "Elastic waistband makes for easy outfit changes. Versatile relaxed silhouette.",
      },
    ],
  },

  {
    id: 3,
    name: "Jersey Easy Cargo Pants",
    category: "Cotton",
    gender: "Unisex",
    price: 39.9,
    discount: 29.9,
    description: "Sale",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/jersey-easy/01-off-white.avif",
      "./images/product-details/jersey-easy/detail-1.avif",
      "./images/product-details/jersey-easy/detail-2.avif",
      "./images/product-details/jersey-easy/detail-3.avif",
      "./images/product-details/jersey-easy/detail-4.avif",
      "./images/product-details/jersey-easy/detail-5.avif",
    ],
    color: [
      {
        name: "01 OFF WHITE",
        swatch: "./images/color-swatches/cotton/01-off-white.avif",
        image: "./images/product-details/jersey-easy/01-off-white.avif",
      },
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/cotton/09-black.avif",
        image: "./images/product-details/jersey-easy/09-black.avif",
      },
      {
        name: "56 OLIVE",
        swatch: "./images/color-swatches/cotton/56-olive.avif",
        image: "./images/product-details/jersey-easy/56-olive.avif",
      },
      {
        name: "69 NAVY",
        swatch: "./images/color-swatches/cotton/69-navy.avif",
        image: "./images/product-details/jersey-easy/69-navy.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/jersey-easy/feature-1.avif",
        text: "Casual cargo design with convenient pockets.",
      },
      {
        img: "./images/product-details/jersey-easy/feature-2.avif",
        text: "Elastic waist with a drawstring for size adjustment.",
      },
      {
        img: "./images/product-details/jersey-easy/feature-3.avif",
        text: "Tapered relaxed cut for comfort and easy movement.",
      },
    ],
  },

  {
    id: 4,
    name: "Flannel Pants | Gingham",
    category: "Flannel",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/flannel-gingham/66-blue.avif",
      "./images/product-details/flannel-gingham/detail-1.avif",
    ],
    color: [
      {
        name: "66 BLUE",
        swatch: "./images/color-swatches/flannel/66-blue.avif",
        image: "./images/product-details/flannel-gingham/66-blue.avif",
      },
      {
        name: "69 NAVY",
        swatch: "./images/color-swatches/flannel/69-navy.avif",
        image: "./images/product-details/flannel-gingham/69-navy.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/flannel-gingham/feature-1.avif",
        text: "Soft and warm 100% cotton flannel fabric that is brushed on both sides.",
      },
      {
        img: "./images/product-details/flannel-gingham/feature-2.avif",
        text: "Comfortable elastic waist with an inner drawstring for easy adjustment.",
      },
      {
        img: "./images/product-details/flannel-gingham/feature-3.avif",
        text: "Pockets on both sides.",
      },
      {
        img: "./images/product-details/flannel-gingham/feature-4.avif",
        text: "Gingham check pattern for outdoorsy styles.",
      },
    ],
  },

  {
    id: 5,
    name: "Flannel Pants | Check",
    category: "Flannel",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/flannel-check/37-brown.avif",
      "./images/product-details/flannel-check/detail-1.avif",
    ],
    color: [
      {
        name: "37 BROWN",
        swatch: "./images/color-swatches/flannel/37-brown.avif",
        image: "./images/product-details/flannel-check/37-brown.avif",
      },
      {
        name: "38 DARK BROWN",
        swatch: "./images/color-swatches/flannel/38-dark-brown.avif",
        image: "./images/product-details/flannel-check/38-dark-brown.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/flannel-check/feature-1.avif",
        text: "100% cotton flannel, brushed on both sides for a soft and cozy feel.",
      },
      {
        img: "./images/product-details/flannel-check/feature-2.avif",
        text: "Comfortable elastic waist with an inner drawstring for easy adjustment.",
      },
      {
        img: "./images/product-details/flannel-check/feature-3.avif",
        text: "Pockets on both sides.",
      },
      {
        img: "./images/product-details/flannel-check/feature-4.avif",
        text: "Checked pattern for outdoorsy styles.",
      },
    ],
  },

  {
    id: 6,
    name: "Flannel Pants | Solid",
    category: "Flannel",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/flannel-solid/02-light-gray.avif",
      "./images/product-details/flannel-solid/detail-1.avif",
    ],
    color: [
      {
        name: "02 LIGHT GRAY",
        swatch: "./images/color-swatches/flannel/02-light-gray.avif",
        image: "./images/product-details/flannel-solid/02-light-gray.avif",
      },
      {
        name: "08 DARK GRAY",
        swatch: "./images/color-swatches/flannel/08-dark-gray.avif",
        image: "./images/product-details/flannel-solid/08-dark-gray.avif",
      },
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/flannel/09-black.avif",
        image: "./images/product-details/flannel-solid/09-black.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/flannel-solid/feature-1.avif",
        text: "100% cotton flannel, brushed on both sides for a soft and cozy feel.",
      },
      {
        img: "./images/product-details/flannel-solid/feature-2.avif",
        text: "Comfortable elastic waist with an inner drawstring for easy adjustment.",
      },
      {
        img: "./images/product-details/flannel-solid/feature-3.avif",
        text: "Pockets on both sides.",
      },
    ],
  },

  {
    id: 7,
    name: "Washable Knit Cable Pants",
    category: "Knit",
    gender: "Women",
    price: 39.9,
    discount: 19.9,
    description: "Sale",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/knit-cable/01-off-white.avif",
      "./images/product-details/knit-cable/detail-1.avif",
      "./images/product-details/knit-cable/detail-2.avif",
    ],
    color: [
      {
        name: "01 OFF WHITE",
        swatch: "./images/color-swatches/knit-cable/01-off-white.avif",
        image: "./images/product-details/knit-cable/01-off-white.avif",
      },
      {
        name: "06 GRAY",
        swatch: "./images/color-swatches/knit-cable/06-gray.avif",
        image: "./images/product-details/knit-cable/06-gray.avif",
      },
      {
        name: "33 KHAKI",
        swatch: "./images/color-swatches/knit-cable/33-khaki.avif",
        image: "./images/product-details/knit-cable/33-khaki.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/knit-cable/feature-1.avif",
        text: "Machine-washable cable knit fabric for easy care.",
      },
      {
        img: "./images/product-details/knit-cable/feature-2.avif",
        text: "Soft and non-itchy.",
      },
    ],
  },

  {
    id: 8,
    name: "Washable Knit Ribbed Pants",
    category: "Knit",
    gender: "Women",
    price: 59.9,
    discount: 29.9,
    description: "Online + App-Only Offer",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/knit-ribbed/07-gray.avif",
      "./images/product-details/knit-ribbed/detail-1.avif",
      "./images/product-details/knit-ribbed/detail-2.avif",
    ],
    color: [
      {
        name: "07 GRAY",
        swatch: "./images/color-swatches/knit-ribbed/07-gray.avif",
        image: "./images/product-details/knit-ribbed/07-gray.avif",
      },
      {
        name: "08 DARK GRAY",
        swatch: "./images/color-swatches/knit-ribbed/08-dark-gray.avif",
        image: "./images/product-details/knit-ribbed/08-dark-gray.avif",
      },
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/knit-ribbed/09-black.avif",
        image: "./images/product-details/knit-ribbed/09-black.avif",
      },
      {
        name: "19 WINE",
        swatch: "./images/color-swatches/knit-ribbed/19-wine.avif",
        image: "./images/product-details/knit-ribbed/19-wine.avif",
      },
      {
        name: "30 NATURAL",
        swatch: "./images/color-swatches/knit-ribbed/30-natural.avif",
        image: "./images/product-details/knit-ribbed/30-natural.avif",
      },
      {
        name: "33 KHAKI",
        swatch: "./images/color-swatches/knit-ribbed/33-khaki.avif",
        image: "./images/product-details/knit-ribbed/33-khaki.avif",
      },
      {
        name: "35 BROWN",
        swatch: "./images/color-swatches/knit-ribbed/35-brown.avif",
        image: "./images/product-details/knit-ribbed/35-brown.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/knit-ribbed/feature-1.avif",
        text: "Wide, non-constricting waistband and outer drawstring for a flattering look at the waist.",
      },
      {
        img: "./images/product-details/knit-ribbed/feature-2.avif",
        text: "Machine-washable cable knit fabric for easy care.",
      },
      {
        img: "./images/product-details/knit-ribbed/feature-3.avif",
        text: "Soft and non-itchy.",
      },
    ],
  },

  {
    id: 9,
    name: "Dry Sweat Curve Pants",
    category: "Sweat",
    gender: "Women",
    price: 39.9,
    discount: 14.9,
    description: "Sale",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/sweat-curve/09-black.avif",
      "./images/product-details/sweat-curve/detail-1.avif",
      "./images/product-details/sweat-curve/detail-2.avif",
    ],
    color: [
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/sweat/09-black.avif",
        image: "./images/product-details/sweat-curve/09-black.avif",
      },
      {
        name: "30 NATURAL",
        swatch: "./images/color-swatches/sweat/30-natural.avif",
        image: "./images/product-details/sweat-curve/30-natural.avif",
      },
      {
        name: "36 BROWN",
        swatch: "./images/color-swatches/sweat/36-brown.avif",
        image: "./images/product-details/sweat-curve/36-brown.avif",
      },
      {
        name: "58 DARK GREEN",
        swatch: "./images/color-swatches/sweat/58-dark-green.avif",
        image: "./images/product-details/sweat-curve/58-dark-green.avif",
      },
      {
        name: "69 NAVY",
        swatch: "./images/color-swatches/sweat/69-navy.avif",
        image: "./images/product-details/sweat-curve/69-navy.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/sweat-curve/feature-1.avif",
        text: "Smooth, premium-look fabric keeps its shape for a casual yet elegant look.",
      },
      {
        img: "./images/product-details/sweat-curve/feature-2.avif",
        text: "With DRY technology.",
      },
      {
        img: "./images/product-details/sweat-curve/feature-3.avif",
        text: "Ribbed knit waist for a snug fit and all-day comfort.",
      },
    ],
  },

  {
    id: 10,
    name: "Linen Blend Easy Pants | Striped | Short",
    category: "Others",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/linen-blend-short/55-green.avif",
      "./images/product-details/linen-blend-short/detail-1.avif",
    ],
    color: [
      {
        name: "55 GREEN",
        swatch: "./images/color-swatches/linen-blend-short/55-green.avif",
        image: "./images/product-details/linen-blend-short/55-green.avif",
      },
      {
        name: "61 BLUE",
        swatch: "./images/color-swatches/linen-blend-short/61-blue.avif",
        image: "./images/product-details/linen-blend-short/61-blue.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/linen-blend-short/feature-1.avif",
        text: "The distinctive texture of natural linen blended with smooth rayon for added comfort.",
      },
      {
        img: "./images/product-details/linen-blend-short/feature-2.avif",
        text: "External waist drawstring for size adjustment. Narrow elastic waistband for a sleek look.",
      },
      {
        img: "./images/product-details/linen-blend-short/feature-3.avif",
        text: "Fine stripes showcase the beautiful colors of linen.",
      },
    ],
  },

  {
    id: 11,
    name: "Linen Blend Easy Pants | Striped",
    category: "Others",
    gender: "Women",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/linen-blend/01-off-white.avif",
      "./images/product-details/linen-blend/detail-1.avif",
    ],

    color: [
      {
        name: "01 OFF WHITE",
        swatch: "./images/color-swatches/linen-blend/01-off-white.avif",
        image: "./images/product-details/linen-blend/01-off-white.avif",
      },
      {
        name: "56 OLIVE",
        swatch: "./images/color-swatches/linen-blend/56-olive.avif",
        image: "./images/product-details/linen-blend/56-olive.avif",
      },
      {
        name: "69 NAVY",
        swatch: "./images/color-swatches/linen-blend/69-navy.avif",
        image: "./images/product-details/linen-blend/69-navy.avif",
      },
    ],
    features: [],
  },

  {
    id: 12,
    name: "Culottes",
    category: "Others",
    gender: "Unisex",
    price: 49.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/culottes/08-dark-gray.avif",
      "./images/product-details/culottes/detail-1.avif",
      "./images/product-details/culottes/detail-2.avif",
      "./images/product-details/culottes/detail-3.avif",
      "./images/product-details/culottes/detail-4.avif",
    ],
    color: [
      {
        name: "08 DARK GRAY",
        swatch: "./images/color-swatches/culottes/08-dark-gray.avif",
        image: "./images/product-details/culottes/08-dark-gray.avif",
      },
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/culottes/09-black.avif",
        image: "./images/product-details/culottes/09-black.avif",
      },
      {
        name: "38 DARK BROWN",
        swatch: "./images/color-swatches/culottes/38-dark-brown.avif",
        image: "./images/product-details/culottes/38-dark-brown.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/culottes/feature-1.avif",
        text: "Wide-leg design with tucks for a skirt style that's easy to wear.",
      },
      {
        img: "./images/product-details/culottes/feature-2.avif",
        text: "Made with two-way stretch fabric.",
      },
      {
        img: "./images/product-details/culottes/feature-3.avif",
        text: "Elastic at the back of the waist for comfort.",
      },
    ],
  },

  {
    id: 13,
    name: "Nylon Culottes",
    category: "Others",
    gender: "Women",
    price: 49.9,
    discount: 39.9,
    description: "Sale",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/nylon-culottes/09-black.avif",
      "./images/product-details/nylon-culottes/detail-1.avif",
      "./images/product-details/nylon-culottes/detail-2.avif",
    ],
    color: [
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/nylon-culottes/09-black.avif",
        image: "./images/product-details/nylon-culottes/09-black.avif",
      },
      {
        name: "38 DARK BROWN",
        swatch: "./images/color-swatches/nylon-culottes/38-dark-brown.avif",
        image: "./images/product-details/nylon-culottes/38-dark-brown.avif",
      },
      {
        name: "56 OLIVE",
        swatch: "./images/color-swatches/nylon-culottes/56-olive.avif",
        image: "./images/product-details/nylon-culottes/56-olive.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/nylon-culottes/feature-1.avif",
        text: "Comfortable wide hem design that looks like a skirt.",
      },
      {
        img: "./images/product-details/nylon-culottes/feature-2.avif",
        text: "Cropped length in soft nylon fabric.",
      },
      {
        img: "./images/product-details/nylon-culottes/feature-3.avif",
        text: "Elastic waist with a drawstring for ease. Flat-waist design with contouring fabric for comfort all day long.",
      },
      {
        img: "./images/product-details/nylon-culottes/feature-4.avif",
        text: "With DRY technology.",
      },
    ],
  },

  {
    id: 14,
    name: "Cotton Relaxed Ankle Pants | Denim",
    category: "Others",
    gender: "Unisex",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/cotton-relaxed-unisex/07-gray.avif",
      "./images/product-details/cotton-relaxed-unisex/detail-1.avif",
      "./images/product-details/cotton-relaxed-unisex/detail-2.avif",
      "./images/product-details/cotton-relaxed-unisex/detail-3.avif",
      "./images/product-details/cotton-relaxed-unisex/detail-4.avif",
    ],
    color: [
      {
        name: "07 GRAY",
        swatch: "./images/color-swatches/cotton-relaxed/07-gray.avif",
        image: "./images/product-details/cotton-relaxed-unisex/07-gray.avif",
      },
      {
        name: "63 BLUE",
        swatch: "./images/color-swatches/cotton-relaxed/63-blue.avif",
        image: "./images/product-details/cotton-relaxed-unisex/63-blue.avif",
      },
      {
        name: "68 BLUE",
        swatch: "./images/color-swatches/cotton-relaxed/68-blue.avif",
        image: "./images/product-details/cotton-relaxed-unisex/68-blue.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/cotton-relaxed-unisex/feature-1.avif",
        text: "Stretch for easy movement.",
      },
      {
        img: "./images/product-details/cotton-relaxed-unisex/feature-2.avif",
        text: "Authentic denim.",
      },
      {
        img: "./images/product-details/cotton-relaxed-unisex/feature-3.avif",
        text: "Convenient elastic waist with drawstring..",
      },
    ],
  },

  {
    id: 15,
    name: "Corduroy Easy Pants",
    category: "Others",
    gender: "Unisex",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/corduroy/01-off-white.avif",
      "./images/product-details/corduroy/detail-1.avif",
      "./images/product-details/corduroy/detail-2.avif",
      "./images/product-details/corduroy/detail-3.avif",
      "./images/product-details/corduroy/detail-4.avif",
    ],
    color: [
      {
        name: "01 OFF WHITE",
        swatch: "./images/color-swatches/corduroy/01-off-white.avif",
        image: "./images/product-details/corduroy/01-off-white.avif",
      },
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/corduroy/09-black.avif",
        image: "./images/product-details/corduroy/09-black.avif",
      },
      {
        name: "35 BROWN",
        swatch: "./images/color-swatches/corduroy/35-brown.avif",
        image: "./images/product-details/corduroy/35-brown.avif",
      },
      {
        name: "56 OLIVE",
        swatch: "./images/color-swatches/corduroy/56-olive.avif",
        image: "./images/product-details/corduroy/56-olive.avif",
      },
      {
        name: "68 BLUE",
        swatch: "./images/color-swatches/corduroy/68-blue.avif",
        image: "./images/product-details/corduroy/68-blue.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/corduroy/feature-1.avif",
        text: "Brushed corduroy material for softness, stretch, and a relaxed feel.",
      },
      {
        img: "./images/product-details/corduroy/feature-2.avif",
        text: "Convenient elastic waistband with front slide fastener.",
      },
    ],
  },

  {
    id: 16,
    name: "Knitted Fleece Easy Ankle Pants",
    category: "Others",
    gender: "Unisex",
    price: 39.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/knitted-fleece/09-black.avif",
      "./images/product-details/knitted-fleece/detail-1.avif",
      "./images/product-details/knitted-fleece/detail-2.avif",
      "./images/product-details/knitted-fleece/detail-3.avif",
    ],
    color: [
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/knitted-fleece/09-black.avif",
        image: "./images/product-details/knitted-fleece/09-black.avif",
      },
      {
        name: "04 GRAY",
        swatch: "./images/color-swatches/knitted-fleece/04-gray.avif",
        image: "./images/product-details/knitted-fleece/04-gray.avif",
      },
      {
        name: "68 BLUE",
        swatch: "./images/color-swatches/knitted-fleece/68-blue.avif",
        image: "./images/product-details/knitted-fleece/68-blue.avif",
      },
    ],
    features: [
      {
        img: "./images/product-details/knitted-fleece/feature-1.avif",
        text: "Elegant, warm fleece fabric with a knitted look.",
      },
      {
        img: "./images/product-details/knitted-fleece/feature-2.avif",
        text: "With practical back pockets.",
      },
      {
        img: "./images/product-details/knitted-fleece/feature-2.avif",
        text: "Elasticated waist and drawstring for easy adjustment.",
      },
    ],
  },

  {
    id: 17,
    name: "Geared Pants",
    category: "Others",
    gender: "Unisex",
    price: 49.9,
    discount: null,
    description: null,
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    galleryImages: [
      "./images/product-details/geared-pants/09-black.avif",
      "./images/product-details/geared-pants/detail-1.avif",
      "./images/product-details/geared-pants/detail-2.avif",
      "./images/product-details/geared-pants/detail-3.avif",
      "./images/product-details/geared-pants/detail-4.avif",
    ],
    color: [
      {
        name: "09 BLACK",
        swatch: "./images/color-swatches/geared-pants/09-black.avif",
        image: "./images/product-details/geared-pants/09-black.avif",
      },
      {
        name: "31 BEIGE",
        swatch: "./images/color-swatches/geared-pants/31-beige.avif",
        image: "./images/product-details/geared-pants/31-beige.avif",
      },
      {
        name: "38 DARK BROWN",
        swatch: "./images/color-swatches/geared-pants/38-dark-brown.avif",
        image: "./images/product-details/geared-pants/38-dark-brown.avif",
      },
    ],
    features: [],
  },
];

/**
 * Để mô phỏng việc gọi API thật bằng cách dùng Promise + độ trễ giả lập
 * Đây sẽ là hàm mà các modules khác gọi để lấy dữ liệu sản phẩm chứ không đọc thẳng biến products nữa
 * @returns {array} - mảng chứa tất cả các sản phẩm
 */
export function fetchProducts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let isSuccess = true;

      if (isSuccess) {
        resolve(products);
      } else {
        reject(
          new Error("Unable to connect to the server to retrieve products!"),
        );
      }
    }, 800);
  });
}
