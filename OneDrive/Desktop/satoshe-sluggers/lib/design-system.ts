// lib/design-system.ts
/**
 * SATOSHE SLUGGERS DESIGN SYSTEM
 * Centralized design tokens for consistent styling across the entire application
 * 
 * This file now uses the comprehensive design-tokens.ts system
 * with proper typography hierarchy, consistent spacing, and tokenized colors.
 */

// Import the comprehensive design tokens
export * from './design-tokens';

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font Weights
  weights: {
    light: 'font-light',      // 300 - Used for values, body text, descriptions
    normal: 'font-normal',     // 400 - Used for labels, categories, section headers
    medium: 'font-medium',     // 500 - Reserved for emphasis (rarely used)
    semibold: 'font-semibold', // 600 - Used for primary headings, NFT names
  },

  // Font Sizes
  sizes: {
    xs: 'text-xs',       // 12px - Footer text, metadata labels
    sm: 'text-sm',       // 14px - Body text, descriptions, details
    base: 'text-base',   // 16px - Navigation links, attribute values
    md: 'text-[15px]',   // 15px - NFT card details
    lg: 'text-lg',       // 18px - Section headers (Attributes, Details)
    xl: 'text-xl',       // 20px - Page titles (mobile)
    '2xl': 'text-2xl',   // 24px - NFT name, prices
    '3xl': 'text-3xl',   // 30px - Page titles (desktop)
  },

  // Line Heights
  leading: {
    tight: 'leading-tight',   // Headings
    relaxed: 'leading-relaxed', // Body text, descriptions
  },
} as const;

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    pink: '#ff0099',           // Hot pink - Primary brand color
    pinkHover: '#ff0099/80',   // 80% opacity for hover states
    pinkLight: '#ff0099/90',   // 90% opacity for fills
  },

  // Success/Action Colors (for purchases, money)
  success: {
    green: '#10B981',          // Emerald green - Buy actions
    greenHover: '#10B981/90',  // 90% opacity for hover
    greenBg: 'bg-emerald-500/10', // 10% opacity backgrounds
    greenText: 'text-emerald-500',
  },

  // Info Colors (for links, metadata)
  info: {
    blue: '#3B82F6',           // Blue - Media/IPFS links
    blueHover: '#3B82F6/90',   // 90% opacity for hover
    blueBg: 'bg-blue-500/10',  // 10% opacity backgrounds
    blueText: 'text-blue-500',
  },

  // Neutral Colors (grayscale)
  neutral: {
    white: 'text-white',              // #ffffff
    100: 'text-neutral-100',          // Off-white text
    200: 'text-neutral-200',          // Lighter gray
    300: 'text-neutral-300',          // Light gray
    400: 'text-neutral-400',          // Mid gray - Labels, inactive states
    500: 'text-neutral-500',          // Placeholders
    700: 'border-neutral-700',        // Borders
    800: 'bg-neutral-800',            // Cards, containers
    900: 'bg-neutral-900',            // Darker backgrounds
    950: 'bg-neutral-950',            // Darkest backgrounds
    frost950: 'bg-neutral-950/80 backdrop-blur-md', // Frosted glass
    frost800: 'bg-neutral-800/50',    // Lighter frosted glass
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  // Gaps (between elements)
  gaps: {
    xs: 'gap-2',    // 8px - Tight spacing
    sm: 'gap-3',    // 12px - Small spacing
    md: 'gap-4',    // 16px - Default spacing
    lg: 'gap-6',    // 24px - Large spacing
    xl: 'gap-8',    // 32px - Extra large spacing
  },

  // Grid Gaps (for grids)
  gridGaps: {
    nftCards: 'gap-x-6 gap-y-8',     // NFT card grid
    details: 'gap-x-6 gap-y-4',       // Details grid (2 columns)
    attributes: 'gap-4',              // Attributes grid
  },

  // Margins
  margins: {
    labelValue: 'mb-2',    // Between label and value
    sectionBottom: 'mb-4', // Between sections
    cardBottom: 'mb-8',    // Between NFT cards vertically
  },

  // Padding
  padding: {
    card: 'p-4',           // Card padding
    cardSm: 'p-3',         // Smaller card padding
    container: 'px-4',     // Container horizontal padding
  },
} as const;

// ============================================================================
// BORDERS & RADIUS
// ============================================================================

export const borders = {
  // Border Radius (MINIMAL ROUNDING ONLY!)
  radius: {
    sm: 'rounded-sm',      // 2px - Used everywhere for consistency
    md: 'rounded',         // 4px - Reserved for special cases
    full: 'rounded-full',  // Circles only (scroll button, icons)
  },

  // Border Styles
  styles: {
    default: 'border border-neutral-700',
    thick: 'border-2',
    thin: 'border',
  },

  // Border Colors
  colors: {
    default: 'border-neutral-700',
    hover: 'border-[#ff0099]/50',
    pink: 'border-[#ff0099]',
    green: 'border-[#10B981]',
  },
} as const;

// ============================================================================
// BUTTONS
// ============================================================================

export const buttons = {
  // Primary Button (Pink filled)
  primary: 'px-6 py-2 bg-[#ff0099] text-white font-normal rounded-sm hover:bg-[#ff0099]/90 transition-all duration-200',
  
  // Outline Button (Pink outline, transparent fill)
  outline: 'px-6 py-2 border border-[#ff0099] bg-transparent text-[#ff0099] font-normal rounded-sm hover:bg-[#ff0099]/90 hover:text-white transition-all duration-200',
  
  // Success Button (Green for purchases)
  success: 'px-8 py-3 border border-[#10B981] bg-transparent text-[#10B981] font-normal rounded-sm hover:bg-[#10B981]/90 hover:text-white transition-all duration-200 text-base',
  
  // Ghost Button (Transparent, no border)
  ghost: 'hover:bg-transparent transition-colors',
  
  // Disabled State
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

// ============================================================================
// CARDS & CONTAINERS
// ============================================================================

export const containers = {
  // Card Container
  card: 'bg-neutral-800 p-4 rounded-sm border border-neutral-700',
  
  // Card with hover
  cardHover: 'bg-neutral-800 p-4 rounded-sm border border-neutral-700 hover:border-[#ff0099]/50 transition-colors',
  
  // Glass Container (frosted)
  glass: 'bg-neutral-950/80 backdrop-blur-md border border-neutral-700 rounded-sm',
  
  // Attribute Card
  attributeCard: 'bg-neutral-800 p-3 rounded-sm border border-neutral-700',
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

export const transitions = {
  default: 'transition-all duration-200',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-300',
  slow: 'transition-all duration-300',
} as const;

// ============================================================================
// INPUTS
// ============================================================================

export const inputs = {
  // Base Input Style
  base: 'text-sm font-normal rounded-sm text-neutral-100 border-neutral-700 bg-neutral-950/80 backdrop-blur-md',
  
  // Placeholder Style
  placeholder: 'placeholder:text-neutral-500',
  
  // Focus Style (minimal pink outline)
  focus: 'focus:outline-none focus:ring-0 focus:border-[#ff0099]',
  
  // Combined Input
  input: 'text-sm font-normal rounded-sm text-neutral-100 placeholder:text-neutral-500 border-neutral-700 bg-neutral-950/80 backdrop-blur-md focus:outline-none focus:ring-0 focus:border-[#ff0099]',
} as const;

// ============================================================================
// TABS
// ============================================================================

export const tabs = {
  list: 'grid w-full grid-cols-2 bg-neutral-800/50 p-1 rounded-sm border border-neutral-700',
  
  trigger: 'data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=inactive]:text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer rounded-sm',
  
  content: 'mt-4 space-y-4',
} as const;

// ============================================================================
// ICONS & BADGES
// ============================================================================

export const icons = {
  // Icon Sizes
  sizes: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  },

  // Icon Containers
  containers: {
    emerald: 'w-8 h-8 rounded-sm bg-emerald-500/10 flex items-center justify-center',
    blue: 'w-8 h-8 rounded-sm bg-blue-500/10 flex items-center justify-center',
    pink: 'w-8 h-8 rounded-sm bg-[#ff0099]/10 flex items-center justify-center',
  },
} as const;

// ============================================================================
// LINKS
// ============================================================================

export const links = {
  // Navigation Link
  nav: 'text-base text-neutral-400 hover:text-[#ff0099] transition-colors',
  navActive: 'text-[#ff0099]',
  
  // IPFS Link (with icon)
  ipfsToken: 'flex items-center justify-between gap-3 group cursor-pointer',
  ipfsTokenHover: 'group-hover:text-emerald-500',
  
  ipfsMedia: 'flex items-center justify-between gap-3 group cursor-pointer',
  ipfsMediaHover: 'group-hover:text-blue-500',
  
  // Footer Link
  footer: 'text-[#ff0099] hover:text-[#ff0099]/80 transition-colors',
} as const;

// ============================================================================
// LAYOUT
// ============================================================================

export const layout = {
  // Grid Layouts
  nftGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-8',
  
  detailsGrid: 'grid grid-cols-2 gap-x-6 gap-y-4',
  
  attributesGrid: 'grid grid-cols-2 gap-4',
  
  // Container Max Widths
  maxWidth: 'max-w-7xl mx-auto',
} as const;

// ============================================================================
// DROPDOWN/SELECT MENUS
// ============================================================================

export const dropdowns = {
  trigger: 'w-[180px] bg-neutral-950/80 backdrop-blur-md border-neutral-700 rounded-sm',
  content: 'bg-neutral-950/95 backdrop-blur-md border-neutral-700 rounded-sm',
} as const;

// ============================================================================
// RARITY COLORS
// ============================================================================

export const rarityColors = {
  // Rarity tier colors for price display
  'Common': 'text-neutral-300',
  'Uncommon': 'text-green-400',
  'Rare': 'text-blue-400',
  'Epic': 'text-purple-400',
  'Legendary': 'text-orange-400',
  'Ultra-Legendary': 'text-pink-400',
  'Unknown': 'text-neutral-400',
} as const;

/**
 * Get color class for rarity tier
 */
export function getRarityColor(rarity: string): string {
  // Clean up rarity string to match our mapping
  const cleanRarity = rarity.replace(' (Ultra-Legendary)', '').trim();
  return rarityColors[cleanRarity as keyof typeof rarityColors] || rarityColors.Unknown;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Combine multiple design tokens into a single className string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get section header styles
 */
export function getSectionHeader(): string {
  return cn(typography.sizes.lg, typography.weights.normal, colors.neutral[100]);
}

/**
 * Get label (category) styles
 */
export function getLabel(): string {
  return cn(typography.sizes.sm, colors.neutral[400]);
}

/**
 * Get value styles
 */
export function getValue(): string {
  return cn(typography.sizes.sm, typography.weights.light, colors.neutral[100]);
}

/**
 * Get card container styles
 */
export function getCard(): string {
  return containers.card;
}

/**
 * Get NFT card detail text styles
 */
export function getNFTCardText(): string {
  return cn('text-[15px]', typography.weights.normal, colors.neutral[100]);
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const designSystem = {
  typography,
  colors,
  spacing,
  borders,
  buttons,
  containers,
  transitions,
  inputs,
  tabs,
  icons,
  links,
  layout,
  dropdowns,
} as const;

