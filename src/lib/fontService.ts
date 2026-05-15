
const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Open Sans', 
  'Lato', 'Oswald', 'Raleway', 'Poppins', 'Fira Sans', 'Epilogue',
  'Space Grotesk', 'Outfit', 'JetBrains Mono', 'Syncopate', 'Bungee'
];

export const fontService = {
  getPopularFonts() {
    return GOOGLE_FONTS;
  },

  async loadFont(fontFamily: string) {
    if ((document as any).fonts.check(`1em ${fontFamily}`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
    document.head.appendChild(link);

    // Wait for font to load
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if ((document as any).fonts.check(`1em ${fontFamily}`)) {
          clearInterval(check);
          resolve(true);
        }
      }, 50);
      // Timeout after 3s
      setTimeout(() => { clearInterval(check); resolve(false); }, 3000);
    });
  }
};
