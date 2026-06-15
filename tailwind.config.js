export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest:      '#0D1810',
        moss:        '#162210',
        grove:       '#1C2B14',
        sage:        '#4A6741',
        parchment:   '#E8DFD0',
        ochre:       '#C9A84C',
        rust:        '#7A5C38',
        // Aliases used throughout existing code — remapped to new palette
        espresso:    '#0D1810',
        gold:        '#C9A84C',
        cream:       '#E8DFD0',
        'dark-roast':'#1C2B14',
        'medium-roast':'#4A6741',
      },
      fontFamily: {
        display:  ['"Playfair Display"', 'serif'],
        elegant:  ['"Cormorant Garamond"', 'serif'],
        body:     ['Inter', 'sans-serif'],
        mono:     ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
