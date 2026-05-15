export const DESIGN_TEMPLATES = [
  {
    id: 't-instagram-cyberpunk',
    name: 'Instagram Cyberpunk',
    category: 'social',
    width: 1080,
    height: 1080,
    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=300',
    data: {
      version: '5.3.0',
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#000000', selectable: false },
        { type: 'rect', left: 540, top: 0, width: 540, height: 1080, fill: '#FF00A0', opacity: 0.1, selectable: false },
        { type: 'i-text', text: 'FUTURE\\nIS NOW', left: 100, top: 200, fontSize: 160, fontFamily: 'Syncopate', fontWeight: 'bold', fill: '#00FFE0', charSpacing: 100 },
        { type: 'rect', left: 100, top: 600, width: 400, height: 10, fill: '#7000FF' }
      ]
    }
  },
  {
    id: 't-minimal-architect',
    name: 'Minimal Architect',
    category: 'banner',
    width: 1200,
    height: 628,
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300',
    data: {
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1200, height: 628, fill: '#F5F5F7', selectable: false },
        { type: 'i-text', text: 'DESIGN\\nCOLLECTIVE', left: 100, top: 150, fontSize: 80, fontFamily: 'Outfit', fontWeight: 'bold', fill: '#1d1d1f' },
        { type: 'i-text', text: 'EST. 2026', left: 100, top: 400, fontSize: 24, fontFamily: 'JetBrains Mono', fill: '#86868b' }
      ]
    }
  },
  {
    id: 't-vibrant-ad',
    name: 'Vibrant Promo',
    category: 'ads',
    width: 1080,
    height: 1350,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300',
    data: {
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1080, height: 1350, fill: '#FDBA74', selectable: false },
        { type: 'circle', left: 400, top: 200, radius: 300, fill: '#F97316' },
        { type: 'i-text', text: 'RETRÓ', left: 100, top: 500, fontSize: 200, fontFamily: 'Bungee', fill: '#ffffff' }
      ]
    }
  },
  {
    id: 't-youtube-thumb',
    name: 'YouTube Thumbnail',
    category: 'youtube',
    width: 1280,
    height: 720,
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=300',
    data: {
      objects: [
        { type: 'rect', left: 0, top: 0, width: 1280, height: 720, fill: '#0F172A' },
        { type: 'i-text', text: 'COMO CREAR\\nSTUDIO', left: 60, top: 100, fontSize: 100, fontFamily: 'Montserrat', fontWeight: 'bold', fill: '#ffffff', stroke: '#8B5CF6', strokeWidth: 4 }
      ]
    }
  }
];
