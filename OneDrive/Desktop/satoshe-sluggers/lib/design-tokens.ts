// lib/design-tokens.ts
// Comprehensive Design System Tokens for Satoshe Sluggers

export const designTokens = {
  // ===== TYPOGRAPHY =====
  typography: {
    // Font Families
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Inconsolata, monospace', // For values, addresses, blockchain data
      mono: 'JetBrains Mono, monospace', // For code, technical details
    },
    
    // Font Sizes (rem units)
    sizes: {
      'huge': '3rem',        // 48px - Hero titles
      'h1': '2.5rem',        // 40px - Page titles
      'h2': '2rem',          // 32px - Section headers
      'h3': '1.5rem',        // 24px - Subsection headers
      'h4': '1.25rem',       // 20px - Card titles
      'h5': '1.125rem',      // 18px - Small headers
      'h6': '1rem',          // 16px - Micro headers
      'paragraph': '1rem',   // 16px - Body text
      'large': '1.125rem',   // 18px - Large body
      'default': '0.875rem', // 14px - Default text
      'small': '0.75rem',    // 12px - Small text
      'extra-small': '0.6875rem', // 11px - Extra small
      'micro': '0.625rem',   // 10px - Micro text
    },
    
    // Font Weights
    weights: {
      'light': '300',
      'normal': '400',
      'medium': '500',
      'semibold': '600',
      'bold': '700',
    },
    
    // Line Heights
    lineHeights: {
      'tight': '1.2',
      'normal': '1.4',
      'relaxed': '1.6',
    },
  },

  // ===== COLORS =====
  colors: {
    // Brand Colors
    brand: {
      primary: '#ff0099',      // Pink - Primary brand
      'primary-hover': '#ff0099/90',
      'primary-light': '#ff0099/20',
    },
    
    // Semantic Colors
    semantic: {
      success: '#10B981',      // Green - Success, buy buttons
      'success-hover': '#10B981/90',
      info: '#3B82F6',         // Blue - Info, links
      'info-hover': '#3B82F6/90',
      warning: '#F59E0B',      // Amber - Warnings
      error: '#EF4444',        // Red - Errors
    },
    
    // Neutral Grayscale
    neutral: {
      white: '#FFFFFF',
      'off-white': '#FFFBEB',  // Primary text color
      'light-gray': '#D1D5DB', // Light text
      'mid-gray': '#9CA3AF',   // Labels, categories
      'placeholder': '#6B7280', // Placeholder text
      'border': '#404040',     // Borders
      'card': '#262626',       // Card backgrounds
      'background': '#171717', // Main background
      'surface': '#0A0A0A',    // Darkest surface
    },
  },

  // ===== SPACING =====
  spacing: {
    // Gaps (between elements)
    gaps: {
      'extra-extra-small': '0.25rem',  // 4px
      'extra-small': '0.5rem',         // 8px
      'small': '0.75rem',              // 12px
      'medium': '1rem',                // 16px
      'large': '1.5rem',               // 24px
      'extra-large': '2rem',           // 32px
      'extra-extra-large': '3rem',     // 48px
    },
    
    // Padding
    padding: {
      'extra-extra-small': '0.25rem',  // 4px
      'extra-small': '0.5rem',         // 8px
      'small': '0.75rem',              // 12px
      'medium': '1rem',                // 16px
      'large': '1.5rem',               // 24px
      'extra-large': '2rem',           // 32px
    },
    
    // Margins
    margins: {
      'extra-extra-small': '0.25rem',  // 4px
      'extra-small': '0.5rem',         // 8px
      'small': '0.75rem',              // 12px
      'medium': '1rem',                // 16px
      'large': '1.5rem',               // 24px
      'extra-large': '2rem',           // 32px
      'extra-extra-large': '3rem',     // 48px
    },
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    'none': '0',
    'small': '0.125rem',  // 2px - Standard for everything
    'medium': '0.25rem',  // 4px - Alternative if needed
    'full': '9999px',     // Circles only
  },

  // ===== SHADOWS =====
  shadows: {
    'none': 'none',
    'small': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'medium': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    'large': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },

  // ===== TRANSITIONS =====
  transitions: {
    'fast': '150ms ease-in-out',
    'normal': '200ms ease-in-out',
    'slow': '300ms ease-in-out',
  },
};

// ===== TYPOGRAPHY UTILITIES =====
export const typography = {
  // Headings
  huge: `text-[${designTokens.typography.sizes.huge}] font-${designTokens.typography.weights.semibold} leading-${designTokens.typography.lineHeights.tight}`,
  h1: `text-[${designTokens.typography.sizes.h1}] font-${designTokens.typography.weights.semibold} leading-${designTokens.typography.lineHeights.tight}`,
  h2: `text-[${designTokens.typography.sizes.h2}] font-${designTokens.typography.weights.semibold} leading-${designTokens.typography.lineHeights.tight}`,
  h3: `text-[${designTokens.typography.sizes.h3}] font-${designTokens.typography.weights.semibold} leading-${designTokens.typography.lineHeights.tight}`,
  h4: `text-[${designTokens.typography.sizes.h4}] font-${designTokens.typography.weights.medium} leading-${designTokens.typography.lineHeights.normal}`,
  h5: `text-[${designTokens.typography.sizes.h5}] font-${designTokens.typography.weights.medium} leading-${designTokens.typography.lineHeights.normal}`,
  h6: `text-[${designTokens.typography.sizes.h6}] font-${designTokens.typography.weights.medium} leading-${designTokens.typography.lineHeights.normal}`,
  
  // Body Text
  paragraph: `text-[${designTokens.typography.sizes.paragraph}] font-${designTokens.typography.weights.normal} leading-${designTokens.typography.lineHeights.normal}`,
  large: `text-[${designTokens.typography.sizes.large}] font-${designTokens.typography.weights.normal} leading-${designTokens.typography.lineHeights.normal}`,
  default: `text-[${designTokens.typography.sizes.default}] font-${designTokens.typography.weights.normal} leading-${designTokens.typography.lineHeights.normal}`,
  small: `text-[${designTokens.typography.sizes.small}] font-${designTokens.typography.weights.normal} leading-${designTokens.typography.lineHeights.normal}`,
  'extra-small': `text-[${designTokens.typography.sizes['extra-small']}] font-${designTokens.typography.weights.normal} leading-${designTokens.typography.lineHeights.normal}`,
  micro: `text-[${designTokens.typography.sizes.micro}] font-${designTokens.typography.weights.normal} leading-${designTokens.typography.lineHeights.normal}`,
  
  // Special Text Elements
  eyebrow: `text-[${designTokens.typography.sizes.small}] font-${designTokens.typography.weights.medium} uppercase tracking-wider`,
  quote: `text-[${designTokens.typography.sizes.large}] font-${designTokens.typography.weights.light} italic leading-${designTokens.typography.lineHeights.relaxed}`,
  caption: `text-[${designTokens.typography.sizes['extra-small']}] font-${designTokens.typography.weights.normal} text-neutral-500`,
  
  // Values (using secondary font)
  value: `text-[${designTokens.typography.sizes.default}] font-${designTokens.typography.weights.normal} font-mono`,
  'value-large': `text-[${designTokens.typography.sizes.large}] font-${designTokens.typography.weights.normal} font-mono`,
  'value-small': `text-[${designTokens.typography.sizes.small}] font-${designTokens.typography.weights.normal} font-mono`,
  
  // Labels
  label: `text-[${designTokens.typography.sizes.small}] font-${designTokens.typography.weights.medium} text-neutral-400`,
  'label-large': `text-[${designTokens.typography.sizes.default}] font-${designTokens.typography.weights.medium} text-neutral-400`,
};

// ===== COMPONENT STYLES =====
export const components = {
  // Buttons
  buttons: {
    // Primary Button
    primary: `px-6 py-2 bg-[${designTokens.colors.brand.primary}] text-white font-${designTokens.typography.weights.normal} rounded-${designTokens.borderRadius.small} hover:bg-[${designTokens.colors.brand['primary-hover']}] transition-all ${designTokens.transitions.normal} disabled:opacity-50 disabled:cursor-not-allowed`,
    
    // Secondary Button
    secondary: `px-6 py-2 border border-[${designTokens.colors.brand.primary}] bg-transparent text-[${designTokens.colors.brand.primary}] font-${designTokens.typography.weights.normal} rounded-${designTokens.borderRadius.small} hover:bg-[${designTokens.colors.brand.primary}] hover:text-white transition-all ${designTokens.transitions.normal} disabled:opacity-50 disabled:cursor-not-allowed`,
    
    // Success Button
    success: `px-6 py-2 bg-[${designTokens.colors.semantic.success}] text-white font-${designTokens.typography.weights.normal} rounded-${designTokens.borderRadius.small} hover:bg-[${designTokens.colors.semantic['success-hover']}] transition-all ${designTokens.transitions.normal} disabled:opacity-50 disabled:cursor-not-allowed`,
    
    // Info Button
    info: `px-6 py-2 bg-[${designTokens.colors.semantic.info}] text-white font-${designTokens.typography.weights.normal} rounded-${designTokens.borderRadius.small} hover:bg-[${designTokens.colors.semantic['info-hover']}] transition-all ${designTokens.transitions.normal} disabled:opacity-50 disabled:cursor-not-allowed`,
    
    // Small Buttons
    'primary-small': `px-3 py-1.5 bg-[${designTokens.colors.brand.primary}] text-white font-${designTokens.typography.weights.normal} rounded-${designTokens.borderRadius.small} hover:bg-[${designTokens.colors.brand['primary-hover']}] transition-all ${designTokens.transitions.normal} disabled:opacity-50 disabled:cursor-not-allowed`,
    'secondary-small': `px-3 py-1.5 border border-[${designTokens.colors.brand.primary}] bg-transparent text-[${designTokens.colors.brand.primary}] font-${designTokens.typography.weights.normal} rounded-${designTokens.borderRadius.small} hover:bg-[${designTokens.colors.brand.primary}] hover:text-white transition-all ${designTokens.transitions.normal} disabled:opacity-50 disabled:cursor-not-allowed`,
    
    // Tags (Pill-shaped)
    tag: `px-3 py-1 bg-[${designTokens.colors.neutral.card}] text-[${designTokens.colors.neutral['off-white']}] font-${designTokens.typography.weights.normal} rounded-full text-[${designTokens.typography.sizes.small}] transition-all ${designTokens.transitions.normal}`,
    'tag-primary': `px-3 py-1 bg-[${designTokens.colors.brand.primary}] text-white font-${designTokens.typography.weights.normal} rounded-full text-[${designTokens.typography.sizes.small}] transition-all ${designTokens.transitions.normal}`,
    
    // Ghost Buttons
    ghost: `px-3 py-1.5 bg-transparent text-[${designTokens.colors.neutral['off-white']}] font-${designTokens.typography.weights.normal} rounded-${designTokens.borderRadius.small} hover:bg-[${designTokens.colors.neutral.card}] transition-all ${designTokens.transitions.normal}`,
  },
  
  // Cards
  cards: {
    default: `bg-[${designTokens.colors.neutral.card}] border border-[${designTokens.colors.neutral.border}] rounded-${designTokens.borderRadius.small} p-4`,
    'frosted-glass': `bg-[${designTokens.colors.neutral.surface}/80 backdrop-blur-md border border-[${designTokens.colors.neutral.border}] rounded-${designTokens.borderRadius.small} p-4`,
    compact: `bg-[${designTokens.colors.neutral.card}] border border-[${designTokens.colors.neutral.border}] rounded-${designTokens.borderRadius.small} p-3`,
  },
  
  // Inputs
  inputs: {
    default: `w-full px-3 py-2 bg-[${designTokens.colors.neutral.surface}/80 backdrop-blur-md border border-[${designTokens.colors.neutral.border}] rounded-${designTokens.borderRadius.small} text-[${designTokens.colors.neutral['off-white']}] placeholder:text-[${designTokens.colors.neutral.placeholder}] focus:outline-none focus:ring-0 focus:border-[${designTokens.colors.brand.primary}] transition-all ${designTokens.transitions.normal}`,
    textarea: `w-full px-3 py-2 bg-[${designTokens.colors.neutral.surface}/80 backdrop-blur-md border border-[${designTokens.colors.neutral.border}] rounded-${designTokens.borderRadius.small} text-[${designTokens.colors.neutral['off-white']}] placeholder:text-[${designTokens.colors.neutral.placeholder}] focus:outline-none focus:ring-0 focus:border-[${designTokens.colors.brand.primary}] transition-all ${designTokens.transitions.normal} resize-none`,
  },
  
  // Links
  links: {
    default: `text-[${designTokens.colors.neutral['mid-gray']}] hover:text-[${designTokens.colors.brand.primary}] transition-colors ${designTokens.transitions.normal}`,
    primary: `text-[${designTokens.colors.brand.primary}] hover:text-[${designTokens.colors.brand['primary-hover']}] transition-colors ${designTokens.transitions.normal}`,
    'external-link': `text-[${designTokens.colors.semantic.info}] hover:text-[${designTokens.colors.semantic['info-hover']}] transition-colors ${designTokens.transitions.normal}`,
  },
};

// ===== UTILITY FUNCTIONS =====
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Typography helper functions
export const getHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const headings = {
    1: typography.h1,
    2: typography.h2,
    3: typography.h3,
    4: typography.h4,
    5: typography.h5,
    6: typography.h6,
  };
  return headings[level];
};

export const getText = (size: 'paragraph' | 'large' | 'default' | 'small' | 'extra-small' | 'micro') => {
  return typography[size];
};

export const getValue = (size: 'large' | 'default' | 'small' = 'default') => {
  const valueMap = {
    'large': typography['value-large'],
    'default': typography.value,
    'small': typography['value-small'],
  };
  return valueMap[size];
};

export const getLabel = (size: 'large' | 'default' = 'default') => {
  const labelMap = {
    'large': typography['label-large'],
    'default': typography.label,
  };
  return labelMap[size];
};

// Spacing helper functions
export const getGap = (size: keyof typeof designTokens.spacing.gaps) => {
  return `gap-[${designTokens.spacing.gaps[size]}]`;
};

export const getPadding = (size: keyof typeof designTokens.spacing.padding) => {
  return `p-[${designTokens.spacing.padding[size]}]`;
};

export const getMargin = (size: keyof typeof designTokens.spacing.margins) => {
  return `m-[${designTokens.spacing.margins[size]}]`;
};

// Color helper functions
export const getTextColor = (color: 'primary' | 'success' | 'info' | 'warning' | 'error' | 'off-white' | 'light-gray' | 'mid-gray' | 'placeholder') => {
  const colorMap = {
    primary: designTokens.colors.brand.primary,
    success: designTokens.colors.semantic.success,
    info: designTokens.colors.semantic.info,
    warning: designTokens.colors.semantic.warning,
    error: designTokens.colors.semantic.error,
    'off-white': designTokens.colors.neutral['off-white'],
    'light-gray': designTokens.colors.neutral['light-gray'],
    'mid-gray': designTokens.colors.neutral['mid-gray'],
    placeholder: designTokens.colors.neutral.placeholder,
  };
  return `text-[${colorMap[color]}]`;
};

export const getBgColor = (color: 'primary' | 'success' | 'info' | 'card' | 'background' | 'surface') => {
  const colorMap = {
    primary: designTokens.colors.brand.primary,
    success: designTokens.colors.semantic.success,
    info: designTokens.colors.semantic.info,
    card: designTokens.colors.neutral.card,
    background: designTokens.colors.neutral.background,
    surface: designTokens.colors.neutral.surface,
  };
  return `bg-[${colorMap[color]}]`;
};
