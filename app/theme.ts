// Ana tema dosyası (tüm uygulama için)
import { MD3DarkTheme } from 'react-native-paper';

export const theme = {
  colors: {
    // Ana renkler - iyileştirilmiş kontrast
    background: '#131326',
    surface: '#1f1f30',
    text: '#f2f4f6',
    textSecondary: '#c5cad0',
    
    // Vurgu renkleri - daha canlı
    primary: '#f7cb2f', // Daha canlı altın
    secondary: '#a55ebd', // Daha parlak mor
    accent: '#38a1ec', // Daha canlı mavi
    
    // Semantik renkler
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
    
    // Kart renkler - daha görünür
    cardBorder: 'rgba(247, 203, 47, 0.35)',
    cardBackground: 'rgba(31, 31, 48, 0.85)',
    
    // Vurgu renkleri (alternatif)
    dream: '#9b59b6', // Rüya yorumu
    archive: '#e74c3c', // Arşiv
    analytics: '#2ecc71', // Analitik
    
    // UI elementleri
    inputBackground: '#2C2C3E',
    divider: 'rgba(255, 255, 255, 0.12)',
    
    // Durum renkleri
    activeTab: '#f1c40f',
    inactiveTab: '#FFFFFF',
    activeTabBackground: 'rgba(241, 196, 15, 0.1)',
  },
  
  // Boşluk ve kenar yuvarlaklığı
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  // Tipografi - optimize edilmiş
  typography: {
    fontFamily: {
      regular: 'SpaceMono',
      medium: 'SpaceMono',
      bold: 'SpaceMono',
    },
    fontSize: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 21,
      xxl: 26,
      xxxl: 32,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
  
  // Gölgeler - iyileştirilmiş
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.30,
      shadowRadius: 4.5,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.35,
      shadowRadius: 6.5,
      elevation: 10,
    },
  },
  
  // Animasyon süreleri
  animation: {
    fast: 200,
    medium: 300,
    slow: 500,
  },
};

// Kart stilleri
export const cardStyles = {
  standardCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.md,
  },
  
  featureCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
};

// Buton stilleri
export const buttonStyles = {
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  
  primaryButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
};

// Input stilleri
export const inputStyles = {
  standardInput: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
};

// Paper tema oluştur
export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: theme.colors.primary,
    onPrimary: theme.colors.background,
    secondary: theme.colors.secondary,
    background: theme.colors.background,
    surface: theme.colors.surface,
    error: theme.colors.error,
    onSurface: theme.colors.text,
    surfaceVariant: 'rgba(31, 31, 48, 0.8)',
    onSurfaceVariant: theme.colors.textSecondary,
  },
  roundness: 12,
};

export default theme;
