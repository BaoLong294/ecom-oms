const products = [
  {
    id: 1,
    name: 'Cotton Relaxed Ankle Pants | Denim',
    categoryId: 25,
    gender: 'Women',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/cotton-relaxed-denim/detail-1.avif',
      '/images/product-details/cotton-relaxed-denim/detail-2.avif',
      '/images/product-details/cotton-relaxed-denim/detail-3.avif',
      '/images/product-details/cotton-relaxed-denim/detail-4.avif',
    ],
    colors: [
      {
        code: '08',
        name: '08 Dark Gray',
        swatch: '/images/color-swatches/cotton/08-dark-gray.avif',
        image: '/images/product-details/cotton-relaxed-denim/08-dark-gray.avif',
      },
      {
        code: '65',
        name: '65 Blue',
        swatch: '/images/color-swatches/cotton/65-blue.avif',
        image: '/images/product-details/cotton-relaxed-denim/65-blue.avif',
      },
      {
        code: '67',
        name: '67 Blue',
        swatch: '/images/color-swatches/cotton/67-blue.avif',
        image: '/images/product-details/cotton-relaxed-denim/67-blue.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/cotton-relaxed-denim/feature-1.avif',
        text: 'Made from soft and comfortable 100% cotton.',
      },
      {
        img: '/images/product-details/cotton-relaxed-denim/feature-2.avif',
        text: 'Elastic waistband makes for easy outfit changes. Versatile relaxed silhouette.',
      },
      {
        img: '/images/product-details/cotton-relaxed-denim/feature-3.avif',
        text: 'Designed to look like jeans with a classic denim color and a comfortable fit.',
      },
    ],
  },

  {
    id: 2,
    name: 'Cotton Relaxed Ankle Pants',
    categoryId: 25,
    gender: 'Women',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/cotton-relaxed/detail-1.avif',
      '/images/product-details/cotton-relaxed/detail-2.avif',
    ],
    colors: [
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/cotton/09-black.avif',
        image: '/images/product-details/cotton-relaxed/09-black.avif',
      },
      {
        code: '30',
        name: '30 Natural',
        swatch: '/images/color-swatches/cotton/30-natural.avif',
        image: '/images/product-details/cotton-relaxed/30-natural.avif',
      },
      {
        code: '31',
        name: '31 Beige',
        swatch: '/images/color-swatches/cotton/31-beige.avif',
        image: '/images/product-details/cotton-relaxed/31-beige.avif',
      },
      {
        code: '57',
        name: '57 Olive',
        swatch: '/images/color-swatches/cotton/57-olive.avif',
        image: '/images/product-details/cotton-relaxed/57-olive.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/cotton-relaxed/feature-1.avif',
        text: 'Made from soft and comfortable 100% cotton.',
      },
      {
        img: '/images/product-details/cotton-relaxed/feature-2.avif',
        text: 'Elastic waistband makes for easy outfit changes. Versatile relaxed silhouette.',
      },
    ],
  },

  {
    id: 3,
    name: 'Jersey Easy Cargo Pants',
    categoryId: 25,
    gender: 'Unisex',
    price: 40,
    discountPercent: 20,
    discountInfo: 'Sale',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/jersey-easy/detail-1.avif',
      '/images/product-details/jersey-easy/detail-2.avif',
      '/images/product-details/jersey-easy/detail-3.avif',
      '/images/product-details/jersey-easy/detail-4.avif',
      '/images/product-details/jersey-easy/detail-5.avif',
    ],
    colors: [
      {
        code: '01',
        name: '01 Off White',
        swatch: '/images/color-swatches/cotton/01-off-white.avif',
        image: '/images/product-details/jersey-easy/01-off-white.avif',
      },
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/cotton/09-black.avif',
        image: '/images/product-details/jersey-easy/09-black.avif',
      },
      {
        code: '56',
        name: '56 Olive',
        swatch: '/images/color-swatches/cotton/56-olive.avif',
        image: '/images/product-details/jersey-easy/56-olive.avif',
      },
      {
        code: '69',
        name: '69 Navy',
        swatch: '/images/color-swatches/cotton/69-navy.avif',
        image: '/images/product-details/jersey-easy/69-navy.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/jersey-easy/feature-1.avif',
        text: 'Casual cargo design with convenient pockets.',
      },
      {
        img: '/images/product-details/jersey-easy/feature-2.avif',
        text: 'Elastic waist with a drawstring for size adjustment.',
      },
      {
        img: '/images/product-details/jersey-easy/feature-3.avif',
        text: 'Tapered relaxed cut for comfort and easy movement.',
      },
    ],
  },

  {
    id: 4,
    name: 'Flannel Pants | Gingham',
    categoryId: 26,
    gender: 'Women',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: ['/images/product-details/flannel-gingham/detail-1.avif'],
    colors: [
      {
        code: '66',
        name: '66 Blue',
        swatch: '/images/color-swatches/flannel/66-blue.avif',
        image: '/images/product-details/flannel-gingham/66-blue.avif',
      },
      {
        code: '69',
        name: '69 Navy',
        swatch: '/images/color-swatches/flannel/69-navy.avif',
        image: '/images/product-details/flannel-gingham/69-navy.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/flannel-gingham/feature-1.avif',
        text: 'Soft and warm 100% cotton flannel fabric that is brushed on both sides.',
      },
      {
        img: '/images/product-details/flannel-gingham/feature-2.avif',
        text: 'Comfortable elastic waist with an inner drawstring for easy adjustment.',
      },
      {
        img: '/images/product-details/flannel-gingham/feature-3.avif',
        text: 'Pockets on both sides.',
      },
      {
        img: '/images/product-details/flannel-gingham/feature-4.avif',
        text: 'Gingham check pattern for outdoorsy styles.',
      },
    ],
  },

  {
    id: 5,
    name: 'Flannel Pants | Check',
    categoryId: 26,
    gender: 'Women',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: ['/images/product-details/flannel-check/detail-1.avif'],
    colors: [
      {
        code: '37',
        name: '37 Brown',
        swatch: '/images/color-swatches/flannel/37-brown.avif',
        image: '/images/product-details/flannel-check/37-brown.avif',
      },
      {
        code: '38',
        name: '38 Dark Brown',
        swatch: '/images/color-swatches/flannel/38-dark-brown.avif',
        image: '/images/product-details/flannel-check/38-dark-brown.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/flannel-check/feature-1.avif',
        text: '100% cotton flannel, brushed on both sides for a soft and cozy feel.',
      },
      {
        img: '/images/product-details/flannel-check/feature-2.avif',
        text: 'Comfortable elastic waist with an inner drawstring for easy adjustment.',
      },
      {
        img: '/images/product-details/flannel-check/feature-3.avif',
        text: 'Pockets on both sides.',
      },
      {
        img: '/images/product-details/flannel-check/feature-4.avif',
        text: 'Checked pattern for outdoorsy styles.',
      },
    ],
  },

  {
    id: 6,
    name: 'Flannel Pants | Solid',
    categoryId: 26,
    gender: 'Women',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: ['/images/product-details/flannel-solid/detail-1.avif'],
    colors: [
      {
        code: '02',
        name: '02 Light Gray',
        swatch: '/images/color-swatches/flannel/02-light-gray.avif',
        image: '/images/product-details/flannel-solid/02-light-gray.avif',
      },
      {
        code: '08',
        name: '08 Dark Gray',
        swatch: '/images/color-swatches/flannel/08-dark-gray.avif',
        image: '/images/product-details/flannel-solid/08-dark-gray.avif',
      },
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/flannel/09-black.avif',
        image: '/images/product-details/flannel-solid/09-black.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/flannel-solid/feature-1.avif',
        text: '100% cotton flannel, brushed on both sides for a soft and cozy feel.',
      },
      {
        img: '/images/product-details/flannel-solid/feature-2.avif',
        text: 'Comfortable elastic waist with an inner drawstring for easy adjustment.',
      },
      {
        img: '/images/product-details/flannel-solid/feature-3.avif',
        text: 'Pockets on both sides.',
      },
    ],
  },

  {
    id: 7,
    name: 'Washable Knit Cable Pants',
    categoryId: 27,
    gender: 'Women',
    price: 40,
    discountPercent: 50,
    discountInfo: 'Sale',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/knit-cable/detail-1.avif',
      '/images/product-details/knit-cable/detail-2.avif',
    ],
    colors: [
      {
        code: '01',
        name: '01 Off White',
        swatch: '/images/color-swatches/knit-cable/01-off-white.avif',
        image: '/images/product-details/knit-cable/01-off-white.avif',
      },
      {
        code: '06',
        name: '06 Gray',
        swatch: '/images/color-swatches/knit-cable/06-gray.avif',
        image: '/images/product-details/knit-cable/06-gray.avif',
      },
      {
        code: '33',
        name: '33 Khaki',
        swatch: '/images/color-swatches/knit-cable/33-khaki.avif',
        image: '/images/product-details/knit-cable/33-khaki.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/knit-cable/feature-1.avif',
        text: 'Machine-washable cable knit fabric for easy care.',
      },
      {
        img: '/images/product-details/knit-cable/feature-2.avif',
        text: 'Soft and non-itchy.',
      },
    ],
  },

  {
    id: 8,
    name: 'Washable Knit Ribbed Pants',
    categoryId: 27,
    gender: 'Women',
    price: 60,
    discountPercent: 50,
    discountInfo: 'Online + App-Only Offer',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/knit-ribbed/detail-1.avif',
      '/images/product-details/knit-ribbed/detail-2.avif',
    ],
    colors: [
      {
        code: '07',
        name: '07 Gray',
        swatch: '/images/color-swatches/knit-ribbed/07-gray.avif',
        image: '/images/product-details/knit-ribbed/07-gray.avif',
      },
      {
        code: '08',
        name: '08 Dark Gray',
        swatch: '/images/color-swatches/knit-ribbed/08-dark-gray.avif',
        image: '/images/product-details/knit-ribbed/08-dark-gray.avif',
      },
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/knit-ribbed/09-black.avif',
        image: '/images/product-details/knit-ribbed/09-black.avif',
      },
      {
        code: '19',
        name: '19 Wine',
        swatch: '/images/color-swatches/knit-ribbed/19-wine.avif',
        image: '/images/product-details/knit-ribbed/19-wine.avif',
      },
      {
        code: '30',
        name: '30 Natural',
        swatch: '/images/color-swatches/knit-ribbed/30-natural.avif',
        image: '/images/product-details/knit-ribbed/30-natural.avif',
      },
      {
        code: '33',
        name: '33 Khaki',
        swatch: '/images/color-swatches/knit-ribbed/33-khaki.avif',
        image: '/images/product-details/knit-ribbed/33-khaki.avif',
      },
      {
        code: '35',
        name: '35 Brown',
        swatch: '/images/color-swatches/knit-ribbed/35-brown.avif',
        image: '/images/product-details/knit-ribbed/35-brown.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/knit-ribbed/feature-1.avif',
        text: 'Wide, non-constricting waistband and outer drawstring for a flattering look at the waist.',
      },
      {
        img: '/images/product-details/knit-ribbed/feature-2.avif',
        text: 'Machine-washable ribbed knit fabric for easy care.',
      },
      {
        img: '/images/product-details/knit-ribbed/feature-3.avif',
        text: 'Soft and non-itchy.',
      },
    ],
  },

  {
    id: 9,
    name: 'Dry Sweat Curve Pants',
    categoryId: 28,
    gender: 'Women',
    price: 40,
    discountPercent: 60,
    discountInfo: 'Sale',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/sweat-curve/detail-1.avif',
      '/images/product-details/sweat-curve/detail-2.avif',
    ],
    colors: [
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/sweat/09-black.avif',
        image: '/images/product-details/sweat-curve/09-black.avif',
      },
      {
        code: '30',
        name: '30 Natural',
        swatch: '/images/color-swatches/sweat/30-natural.avif',
        image: '/images/product-details/sweat-curve/30-natural.avif',
      },
      {
        code: '36',
        name: '36 Brown',
        swatch: '/images/color-swatches/sweat/36-brown.avif',
        image: '/images/product-details/sweat-curve/36-brown.avif',
      },
      {
        code: '58',
        name: '58 Dark Green',
        swatch: '/images/color-swatches/sweat/58-dark-green.avif',
        image: '/images/product-details/sweat-curve/58-dark-green.avif',
      },
      {
        code: '69',
        name: '69 Navy',
        swatch: '/images/color-swatches/sweat/69-navy.avif',
        image: '/images/product-details/sweat-curve/69-navy.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/sweat-curve/feature-1.avif',
        text: 'Smooth, premium-look fabric keeps its shape for a casual yet elegant look.',
      },
      {
        img: '/images/product-details/sweat-curve/feature-2.avif',
        text: 'With DRY technology.',
      },
      {
        img: '/images/product-details/sweat-curve/feature-3.avif',
        text: 'Ribbed knit waist for a snug fit and all-day comfort.',
      },
    ],
  },

  {
    id: 10,
    name: 'Linen Blend Easy Pants | Striped | Short',
    categoryId: 29,
    gender: 'Women',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: ['/images/product-details/linen-blend-short/detail-1.avif'],
    colors: [
      {
        code: '55',
        name: '55 Green',
        swatch: '/images/color-swatches/linen-blend-short/55-green.avif',
        image: '/images/product-details/linen-blend-short/55-green.avif',
      },
      {
        code: '61',
        name: '61 Blue',
        swatch: '/images/color-swatches/linen-blend-short/61-blue.avif',
        image: '/images/product-details/linen-blend-short/61-blue.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/linen-blend-short/feature-1.avif',
        text: 'The distinctive texture of natural linen blended with smooth rayon for added comfort.',
      },
      {
        img: '/images/product-details/linen-blend-short/feature-2.avif',
        text: 'External waist drawstring for size adjustment. Narrow elastic waistband for a sleek look.',
      },
      {
        img: '/images/product-details/linen-blend-short/feature-3.avif',
        text: 'Fine stripes showcase the beautiful colors of linen.',
      },
    ],
  },

  {
    id: 11,
    name: 'Linen Blend Easy Pants | Striped',
    categoryId: 29,
    gender: 'Women',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: ['/images/product-details/linen-blend/detail-1.avif'],
    colors: [
      {
        code: '01',
        name: '01 Off White',
        swatch: '/images/color-swatches/linen-blend/01-off-white.avif',
        image: '/images/product-details/linen-blend/01-off-white.avif',
      },
      {
        code: '56',
        name: '56 Olive',
        swatch: '/images/color-swatches/linen-blend/56-olive.avif',
        image: '/images/product-details/linen-blend/56-olive.avif',
      },
      {
        code: '69',
        name: '69 Navy',
        swatch: '/images/color-swatches/linen-blend/69-navy.avif',
        image: '/images/product-details/linen-blend/69-navy.avif',
      },
    ],
    features: [],
  },

  {
    id: 12,
    name: 'Culottes',
    categoryId: 29,
    gender: 'Unisex',
    price: 50,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/culottes/detail-1.avif',
      '/images/product-details/culottes/detail-2.avif',
      '/images/product-details/culottes/detail-3.avif',
      '/images/product-details/culottes/detail-4.avif',
    ],
    colors: [
      {
        code: '08',
        name: '08 Dark Gray',
        swatch: '/images/color-swatches/culottes/08-dark-gray.avif',
        image: '/images/product-details/culottes/08-dark-gray.avif',
      },
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/culottes/09-black.avif',
        image: '/images/product-details/culottes/09-black.avif',
      },
      {
        code: '38',
        name: '38 Dark Brown',
        swatch: '/images/color-swatches/culottes/38-dark-brown.avif',
        image: '/images/product-details/culottes/38-dark-brown.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/culottes/feature-1.avif',
        text: "Wide-leg design with tucks for a skirt style that's easy to wear.",
      },
      {
        img: '/images/product-details/culottes/feature-2.avif',
        text: 'Made with two-way stretch fabric.',
      },
      {
        img: '/images/product-details/culottes/feature-3.avif',
        text: 'Elastic at the back of the waist for comfort.',
      },
    ],
  },

  {
    id: 13,
    name: 'Nylon Culottes',
    categoryId: 29,
    gender: 'Women',
    price: 50,
    discountPercent: 20,
    discountInfo: 'Sale',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/nylon-culottes/detail-1.avif',
      '/images/product-details/nylon-culottes/detail-2.avif',
    ],
    colors: [
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/nylon-culottes/09-black.avif',
        image: '/images/product-details/nylon-culottes/09-black.avif',
      },
      {
        code: '38',
        name: '38 Dark Brown',
        swatch: '/images/color-swatches/nylon-culottes/38-dark-brown.avif',
        image: '/images/product-details/nylon-culottes/38-dark-brown.avif',
      },
      {
        code: '56',
        name: '56 Olive',
        swatch: '/images/color-swatches/nylon-culottes/56-olive.avif',
        image: '/images/product-details/nylon-culottes/56-olive.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/nylon-culottes/feature-1.avif',
        text: 'Comfortable wide hem design that looks like a skirt.',
      },
      {
        img: '/images/product-details/nylon-culottes/feature-2.avif',
        text: 'Cropped length in soft nylon fabric.',
      },
      {
        img: '/images/product-details/nylon-culottes/feature-3.avif',
        text: 'Elastic waist with a drawstring for ease. Flat-waist design with contouring fabric for comfort all day long.',
      },
      {
        img: '/images/product-details/nylon-culottes/feature-4.avif',
        text: 'With DRY technology.',
      },
    ],
  },

  {
    id: 14,
    name: 'Stretch Denim Relaxed Ankle Pants',
    categoryId: 29,
    gender: 'Unisex',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/cotton-relaxed-unisex/detail-1.avif',
      '/images/product-details/cotton-relaxed-unisex/detail-2.avif',
      '/images/product-details/cotton-relaxed-unisex/detail-3.avif',
      '/images/product-details/cotton-relaxed-unisex/detail-4.avif',
    ],
    colors: [
      {
        code: '07',
        name: '07 Gray',
        swatch: '/images/color-swatches/cotton-relaxed/07-gray.avif',
        image: '/images/product-details/cotton-relaxed-unisex/07-gray.avif',
      },
      {
        code: '63',
        name: '63 Blue',
        swatch: '/images/color-swatches/cotton-relaxed/63-blue.avif',
        image: '/images/product-details/cotton-relaxed-unisex/63-blue.avif',
      },
      {
        code: '68',
        name: '68 Blue',
        swatch: '/images/color-swatches/cotton-relaxed/68-blue.avif',
        image: '/images/product-details/cotton-relaxed-unisex/68-blue.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/cotton-relaxed-unisex/feature-1.avif',
        text: 'Stretch for easy movement.',
      },
      {
        img: '/images/product-details/cotton-relaxed-unisex/feature-2.avif',
        text: 'Authentic denim.',
      },
      {
        img: '/images/product-details/cotton-relaxed-unisex/feature-3.avif',
        text: 'Convenient elastic waist with drawstring.',
      },
    ],
  },

  {
    id: 15,
    name: 'Corduroy Easy Pants',
    categoryId: 29,
    gender: 'Unisex',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/corduroy/detail-1.avif',
      '/images/product-details/corduroy/detail-2.avif',
      '/images/product-details/corduroy/detail-3.avif',
      '/images/product-details/corduroy/detail-4.avif',
    ],
    colors: [
      {
        code: '01',
        name: '01 Off White',
        swatch: '/images/color-swatches/corduroy/01-off-white.avif',
        image: '/images/product-details/corduroy/01-off-white.avif',
      },
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/corduroy/09-black.avif',
        image: '/images/product-details/corduroy/09-black.avif',
      },
      {
        code: '35',
        name: '35 Brown',
        swatch: '/images/color-swatches/corduroy/35-brown.avif',
        image: '/images/product-details/corduroy/35-brown.avif',
      },
      {
        code: '56',
        name: '56 Olive',
        swatch: '/images/color-swatches/corduroy/56-olive.avif',
        image: '/images/product-details/corduroy/56-olive.avif',
      },
      {
        code: '68',
        name: '68 Blue',
        swatch: '/images/color-swatches/corduroy/68-blue.avif',
        image: '/images/product-details/corduroy/68-blue.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/corduroy/feature-1.avif',
        text: 'Brushed corduroy material for softness, stretch, and a relaxed feel.',
      },
      {
        img: '/images/product-details/corduroy/feature-2.avif',
        text: 'Convenient elastic waistband with front slide fastener.',
      },
    ],
  },

  {
    id: 16,
    name: 'Knitted Fleece Easy Ankle Pants',
    categoryId: 29,
    gender: 'Unisex',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/knitted-fleece/detail-1.avif',
      '/images/product-details/knitted-fleece/detail-2.avif',
      '/images/product-details/knitted-fleece/detail-3.avif',
    ],
    colors: [
      {
        code: '68',
        name: '68 Blue',
        swatch: '/images/color-swatches/knitted-fleece/68-blue.avif',
        image: '/images/product-details/knitted-fleece/68-blue.avif',
      },
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/knitted-fleece/09-black.avif',
        image: '/images/product-details/knitted-fleece/09-black.avif',
      },
      {
        code: '04',
        name: '04 Gray',
        swatch: '/images/color-swatches/knitted-fleece/04-gray.avif',
        image: '/images/product-details/knitted-fleece/04-gray.avif',
      },
    ],
    features: [
      {
        img: '/images/product-details/knitted-fleece/feature-1.avif',
        text: 'Elegant, warm fleece fabric with a knitted look.',
      },
      {
        img: '/images/product-details/knitted-fleece/feature-2.avif',
        text: 'With practical back pockets.',
      },
      {
        img: '/images/product-details/knitted-fleece/feature-3.avif',
        text: 'Elasticated waist and drawstring for easy adjustment.',
      },
    ],
  },

  {
    id: 17,
    name: 'Geared Pants',
    categoryId: 29,
    gender: 'Unisex',
    price: 50,
    discountPercent: null,
    discountInfo: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    detailImages: [
      '/images/product-details/geared-pants/detail-1.avif',
      '/images/product-details/geared-pants/detail-2.avif',
      '/images/product-details/geared-pants/detail-3.avif',
      '/images/product-details/geared-pants/detail-4.avif',
    ],
    colors: [
      {
        code: '09',
        name: '09 Black',
        swatch: '/images/color-swatches/geared-pants/09-black.avif',
        image: '/images/product-details/geared-pants/09-black.avif',
      },
      {
        code: '31',
        name: '31 Beige',
        swatch: '/images/color-swatches/geared-pants/31-beige.avif',
        image: '/images/product-details/geared-pants/31-beige.avif',
      },
      {
        code: '38',
        name: '38 Dark Brown',
        swatch: '/images/color-swatches/geared-pants/38-dark-brown.avif',
        image: '/images/product-details/geared-pants/38-dark-brown.avif',
      },
    ],
    features: [],
  },
];

export default products;
