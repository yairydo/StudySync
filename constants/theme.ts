export const Colors = {
  primary: '#7B4FBF',
  primaryLight: '#9E7DD3',
  primarySoft: '#EDE4F5',
  accent: '#FF6B6B',
  accentLight: '#FFB4B4',
  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceAlt: '#F0EEFF',
  text: '#2D2B3D',
  textSecondary: '#8B87A0',
  textOnPrimary: '#FFFFFF',
  border: '#E8E6F0',
  sharedHighlight: '#E8F5E9',
  sharedHighlightBorder: '#A5D6A7',
  success: '#4CAF50',
  error: '#EF5350',
  google: '#5C8AFF',
  microsoft: '#5EC4E8',
};

// 8pt grid system following 2026 UX/UI standards
export const Spacing = {
  xs: 8,      // Minimum spacing between elements
  sm: 12,     // Small padding/margins
  md: 16,     // Standard padding/margins (screen edges)
  lg: 24,     // Section spacing
  xl: 32,     // Large section spacing
  xxl: 40,    // Extra large spacing
};

// Typography following mobile best practices (16px minimum for body)
export const FontSize = {
  xs: 12,     // Fine print, captions
  sm: 14,     // Secondary text
  md: 16,     // Body text (standard)
  lg: 20,     // Subheadings
  xl: 24,     // Headings
  xxl: 32,    // Large headings
  xxxl: 40,   // Hero text
};

export const Font = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
};

export const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 28,
  full: 100,
};

// Touch target standards (Apple: 44pt, Android: 48dp)
export const TouchTarget = {
  minimum: 44,    // Minimum tappable area
  comfortable: 48, // Recommended comfortable size
};
