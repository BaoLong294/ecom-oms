const categories = [
  // ===== LANDING PAGE =====
  { id: 1, name: 'Women', position: 1, parentId: null },
  { id: 2, name: 'Men', position: 2, parentId: null },
  { id: 3, name: 'Kids', position: 3, parentId: null },
  { id: 4, name: 'Baby', position: 4, parentId: null },

  // ===== WOMEN =====
  { id: 5, name: 'Casual Pants Collection', position: 1, parentId: 1 },
  { id: 6, name: 'Knit Collection', position: 2, parentId: 1 },
  { id: 7, name: 'Outerwear Collection', position: 3, parentId: 1 },
  { id: 8, name: 'Shirts & Blouses Collection', position: 4, parentId: 1 },
  { id: 9, name: 'T-shirt Collection', position: 5, parentId: 1 },

  // ===== MEN =====
  { id: 10, name: 'Bottoms Collection', position: 1, parentId: 2 },
  { id: 11, name: 'Knit Collection', position: 2, parentId: 2 },
  { id: 12, name: 'Outerwear Collection', position: 3, parentId: 2 },
  { id: 13, name: 'Shirts Collection', position: 4, parentId: 2 },
  { id: 14, name: 'T-shirt Collection', position: 5, parentId: 2 },

  // ===== KIDS =====
  { id: 15, name: 'Fall Flannels', position: 1, parentId: 3 },
  { id: 16, name: 'Knit Collection', position: 2, parentId: 3 },
  { id: 17, name: 'Sweat Collection', position: 3, parentId: 3 },
  { id: 18, name: 'T-shirt Collection', position: 4, parentId: 3 },
  { id: 19, name: 'Warm Pants', position: 5, parentId: 3 },

  // ===== BABY =====
  { id: 20, name: 'Bottoms Collection', position: 1, parentId: 4 },
  { id: 21, name: 'Knit Collection', position: 2, parentId: 4 },
  { id: 22, name: 'Newborn', position: 3, parentId: 4 },
  { id: 23, name: 'Outerwear', position: 4, parentId: 4 },
  { id: 24, name: 'T-shirt Collection', position: 5, parentId: 4 },

  // ===== Casual Pants Collection =====
  { id: 25, name: 'Cotton', position: 1, parentId: 5 },
  { id: 26, name: 'Flannel', position: 2, parentId: 5 },
  { id: 27, name: 'Knit', position: 3, parentId: 5 },
  { id: 28, name: 'Sweat', position: 4, parentId: 5 },
  { id: 29, name: 'Others', position: 5, parentId: 5 },
];

export default categories;
