export const colors = {
  primary: '#1a237e',
  secondary: '#4a148c',
  accent: '#FFD700',
  background: '#2C1810',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  overlay: 'rgba(255,255,255,0.1)',
  overlayDark: 'rgba(44, 24, 16, 0.8)',
  border: 'rgba(255,255,255,0.2)',
  tertiary: '#7e57c2',
};

export const gradients = {
  primary: ['#1a237e', '#4a148c'],
  dark: ['#2C1810', '#1a1a1a'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 15,
  lg: 25,
  full: 9999,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
};

// Hem named export hem de default export olarak theme tanımı
export const theme = {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography
};

// Aynı objeyi default olarak da export et
export default theme;