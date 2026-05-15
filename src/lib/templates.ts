export const DESIGN_TEMPLATES = [
  {
    id: 't-instagram-post',
    name: 'Instagram Post',
    type: 'social',
    width: 1080,
    height: 1080,
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200',
    data: {
      objects: [
        { type: 'rect', width: 1080, height: 1080, fill: '#6366F1', selectable: false },
        { type: 'i-text', text: 'NUEVA\\nAVENTURA', top: 300, left: 100, fontSize: 120, fill: '#ffffff', fontWeight: 'bold' }
      ]
    }
  },
  {
    id: 't-minimal-banner',
    name: 'Banner Minimalista',
    type: 'banner',
    width: 1200,
    height: 628,
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=200',
    data: {
      objects: [
        { type: 'rect', width: 1200, height: 628, fill: '#0F172A', selectable: false },
        { type: 'i-text', text: 'Digital Studio', top: 250, left: 400, fontSize: 60, fill: '#ffffff' }
      ]
    }
  },
  {
    id: 't-product-showcase',
    name: 'Product Promo',
    type: 'ads',
    width: 1080,
    height: 1350,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200',
    data: {
      objects: []
    }
  }
];
