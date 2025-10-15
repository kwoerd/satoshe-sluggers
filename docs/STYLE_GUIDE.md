# Satoshe Sluggers NFT Marketplace - Style Guide

## Color Palette

### Primary Brand Colors
- **Primary Pink**: `#FF0099` (Brand accent color)
- **Primary Pink Hover**: `#E6008A` (Darker shade for hover states)
- **Primary Pink Light**: `#FF33B3` (Lighter shade for subtle accents)

### Neutral Colors
- **Background**: `#0A0A0A` (Darkest - #222 as mentioned in memories)
- **Card Background**: `#171717` (Slightly lighter than background)
- **Border**: `#404040` (Medium gray for borders)
- **Text Primary**: `#FFFFFF` (White text)
- **Text Secondary**: `#A3A3A3` (Muted text)
- **Text Tertiary**: `#737373` (Least important text)

### Status Colors
- **Success**: `#10B981` (Green for success states)
- **Warning**: `#F59E0B` (Amber for warnings)
- **Error**: `#EF4444` (Red for errors)
- **Info**: `#3B82F6` (Blue for information)

## Typography

### Font Families
- **Primary**: Arial, Helvetica, sans-serif (as defined in globals.css)
- **Monospace**: For addresses and technical content

### Font Sizes
- **Hero**: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` (Main headings)
- **H1**: `text-3xl sm:text-4xl` (Page titles)
- **H2**: `text-2xl sm:text-3xl` (Section headings)
- **H3**: `text-xl sm:text-2xl` (Subsection headings)
- **Body**: `text-base` (Default text)
- **Small**: `text-sm` (Secondary text)
- **Extra Small**: `text-xs` (Legal text, captions)

## Interactive States

### Hover Effects
- **Primary Pink**: `hover:bg-[#E6008A]` (Darker pink for buttons)
- **Text Links**: `hover:text-[#FF33B3]` (Lighter pink for text links)
- **Cards**: `hover:bg-neutral-800` (Subtle background change)
- **Borders**: `hover:border-[#FF0099]` (Pink border on hover)

### Focus States
- **Focus Ring**: `focus:ring-2 focus:ring-[#FF0099]` (Pink focus ring)
- **Focus Outline**: `focus:outline-none` (Remove default outline)

### Active States
- **Active Tab**: `border-b-2 border-[#FF0099] text-white font-medium`
- **Active Button**: `bg-[#FF0099] text-white`
- **Active Filter**: `bg-[#FF0099] text-white`

## Component Standards

### Buttons
- **Primary**: `bg-[#FF0099] hover:bg-[#E6008A] text-white`
- **Secondary**: `bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700`
- **Ghost**: `text-neutral-400 hover:text-white`
- **Icon**: `p-2 rounded-full hover:bg-neutral-800 transition-colors`

### Cards
- **Background**: `bg-neutral-800`
- **Border**: `border border-neutral-700`
- **Hover**: `hover:bg-neutral-700`
- **Shadow**: `shadow-[0_0_15px_rgba(255,0,153,0.5)]` (For special cards)

### Inputs
- **Background**: `bg-neutral-900`
- **Border**: `border-neutral-600`
- **Focus**: `focus:border-[#FF0099] focus:ring-0`
- **Text**: `text-[#FF0099]` (For search inputs)

### Links
- **Default**: `text-neutral-400`
- **Hover**: `hover:text-[#FF33B3]`
- **Active**: `text-[#FF0099]`

## Spacing & Layout

### Padding
- **Small**: `p-2` (8px)
- **Medium**: `p-4` (16px)
- **Large**: `p-6` (24px)

### Margins
- **Small**: `m-2` (8px)
- **Medium**: `m-4` (16px)
- **Large**: `m-6` (24px)

### Border Radius
- **Small**: `rounded` (4px)
- **Medium**: `rounded-lg` (8px)
- **Large**: `rounded-xl` (12px)

## Animation & Transitions

### Transition Classes
- **Standard**: `transition-colors duration-200`
- **All Properties**: `transition-all duration-300`
- **Hover Scale**: `hover:scale-105`

### Keyframe Animations
- **Shimmer**: For loading states
- **Fade In**: For content appearance
- **Slide**: For mobile menu transitions

## Accessibility

### Focus Management
- All interactive elements must have visible focus states
- Use `focus:ring-2 focus:ring-[#FF0099]` for focus rings
- Ensure sufficient color contrast ratios

### Color Contrast
- Text on dark backgrounds: Minimum 4.5:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Use `text-neutral-100` for primary text on dark backgrounds

## Implementation Rules

1. **Always use the defined color palette** - No arbitrary colors
2. **Consistent hover states** - Same element types use same hover effects
3. **Unified spacing** - Use the defined spacing scale
4. **Consistent transitions** - Use standard transition classes
5. **Accessible focus states** - All interactive elements need focus indicators

## Brand Consistency

- **Primary accent**: Always use `#FF0099` for brand elements
- **Hover states**: Always use `#E6008A` for primary pink hover
- **Text links**: Always use `#FF33B3` for text link hover
- **No mixing**: Don't mix hex colors with Tailwind color classes
- **Consistent naming**: Use the same class names for similar elements
