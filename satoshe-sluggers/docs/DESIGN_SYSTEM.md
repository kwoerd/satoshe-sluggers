# Satoshe Sluggers NFT Marketplace - Complete Design System

## 🎨 Brand Identity

### Brand Colors
- **Primary Pink**: `#FF0099` - Main brand accent, CTAs, active states
- **Primary Pink Hover**: `#E6008A` - Hover states for primary pink
- **Primary Pink Light**: `#FF33B3` - Subtle accents, text links
- **Cream Background**: `#fffbeb` - User's preferred background color [[memory:7073536]]

### Neutral Palette
- **Background**: `#0A0A0A` - Main dark background
- **Card Background**: `#171717` - Card and component backgrounds
- **Border**: `#404040` - Subtle borders and dividers
- **Text Primary**: `#FFFFFF` - Primary text on dark backgrounds
- **Text Secondary**: `#A3A3A3` - Secondary text, labels
- **Text Tertiary**: `#737373` - Least important text

### Status Colors
- **Success**: `#10B981` - Green for success states, active counts
- **Warning**: `#F59E0B` - Amber for warnings, time-sensitive content
- **Error**: `#EF4444` - Red for errors, urgent states
- **Info**: `#3B82F6` - Blue for information, sold counts

## 📝 Typography System

### Font Family
- **Primary**: `Arial, Helvetica, sans-serif` - System font for consistency
- **Fallback**: System sans-serif fonts

### Typography Scale
```css
/* Headings */
h1: text-3xl sm:text-4xl (30px/36px) - Page titles
h2: text-2xl sm:text-3xl (24px/30px) - Section headings  
h3: text-xl sm:text-2xl (20px/24px) - Subsection headings
h4: text-lg (18px) - Card titles, component headings
h5: text-base (16px) - Small headings
h6: text-sm (14px) - Micro headings

/* Body Text */
body: text-base (16px) - Default text
small: text-sm (14px) - Secondary text
xs: text-xs (12px) - Legal text, captions, counts

/* Special */
hero: text-4xl sm:text-5xl md:text-6xl lg:text-7xl - Landing page hero
```

### Font Weights
- **Light**: `font-light` (300) - Subtle text
- **Normal**: `font-normal` (400) - Body text
- **Medium**: `font-medium` (500) - Emphasized text
- **Semibold**: `font-semibold` (600) - Headings
- **Bold**: `font-bold` (700) - Strong emphasis

## 🎯 Component Standards

### Buttons

#### Primary Button
```css
bg-[#FF0099] hover:bg-[#E6008A] text-white
px-4 py-2 rounded-md text-sm font-medium
transition-colors duration-200
```

#### Secondary Button
```css
bg-neutral-800 hover:bg-neutral-700 text-white
border border-neutral-700 px-4 py-2 rounded-md
text-sm font-medium transition-colors duration-200
```

#### Ghost Button
```css
text-neutral-400 hover:text-white
px-4 py-2 rounded-md text-sm font-medium
transition-colors duration-200
```

#### Icon Button
```css
p-2 rounded-full hover:bg-neutral-800
transition-colors duration-200
```

### Cards

#### NFT Card
```css
bg-neutral-800 border border-neutral-700
rounded-md p-4 hover:bg-neutral-700
transition-colors duration-200
```

#### Content Card
```css
bg-neutral-800 border border-neutral-700
rounded-md p-6
```

### Inputs

#### Text Input
```css
bg-neutral-900 border border-neutral-600
text-white placeholder-neutral-400
focus:border-[#FF0099] focus:ring-0
px-3 py-2 rounded-md text-sm
```

#### Search Input
```css
bg-neutral-900 border border-neutral-600
text-[#FF0099] placeholder-neutral-400
focus:border-[#FF0099] focus:ring-0
px-3 py-2 rounded-md text-sm
```

### Navigation

#### Active Tab
```css
border-b-2 border-[#FF0099] text-white font-medium
```

#### Inactive Tab
```css
text-neutral-400 hover:text-white
transition-colors duration-200
```

## 📐 Spacing System

### Padding Scale
- **xs**: `p-1` (4px) - Micro spacing
- **sm**: `p-2` (8px) - Small spacing
- **md**: `p-4` (16px) - Medium spacing
- **lg**: `p-6` (24px) - Large spacing
- **xl**: `p-8` (32px) - Extra large spacing

### Margin Scale
- **xs**: `m-1` (4px) - Micro spacing
- **sm**: `m-2` (8px) - Small spacing
- **md**: `m-4` (16px) - Medium spacing
- **lg**: `m-6` (24px) - Large spacing
- **xl**: `m-8` (32px) - Extra large spacing

### Gap Scale
- **xs**: `gap-1` (4px) - Micro gaps
- **sm**: `gap-2` (8px) - Small gaps
- **md**: `gap-4` (16px) - Medium gaps
- **lg**: `gap-6` (24px) - Large gaps
- **xl**: `gap-8` (32px) - Extra large gaps

## 🔄 Border Radius System

### Standard Radius
- **sm**: `rounded-sm` (2px) - Small elements
- **md**: `rounded` (4px) - **STANDARD** - Most components
- **lg**: `rounded-lg` (8px) - Large elements
- **xl**: `rounded-xl` (12px) - Extra large elements
- **full**: `rounded-full` (9999px) - Pills, avatars

### CSS Variables
```css
--radius: 0.5rem (8px) - Base radius
--radius-sm: calc(var(--radius) - 4px) (4px)
--radius-md: calc(var(--radius) - 2px) (6px)
--radius-lg: var(--radius) (8px)
```

## 🎭 Interactive States

### Hover Effects
- **Primary Pink**: `hover:bg-[#E6008A]` - Darker pink for buttons
- **Text Links**: `hover:text-[#FF33B3]` - Lighter pink for text links
- **Cards**: `hover:bg-neutral-700` - Subtle background change
- **Borders**: `hover:border-[#FF0099]` - Pink border on hover

### Focus States
- **Focus Ring**: `focus:ring-2 focus:ring-[#FF0099]` - Pink focus ring
- **Focus Outline**: `focus:outline-none` - Remove default outline

### Active States
- **Active Tab**: `border-b-2 border-[#FF0099] text-white font-medium`
- **Active Button**: `bg-[#FF0099] text-white`
- **Active Filter**: `bg-[#FF0099] text-white`

## 🎨 Color Usage Patterns

### Text Colors
- **Primary Text**: `text-white` - Main content
- **Secondary Text**: `text-neutral-400` - Labels, descriptions
- **Tertiary Text**: `text-neutral-500` - Captions, metadata
- **Brand Text**: `text-[#FF0099]` - Brand elements, prices
- **Success Text**: `text-[#10B981]` - Success states, active counts
- **Error Text**: `text-[#EF4444]` - Error states, urgent content
- **Info Text**: `text-[#3B82F6]` - Information, sold counts

### Background Colors
- **Main Background**: `bg-[#0A0A0A]` - Page background
- **Card Background**: `bg-neutral-800` - Card backgrounds
- **Input Background**: `bg-neutral-900` - Input fields
- **Hover Background**: `bg-neutral-700` - Hover states

### Border Colors
- **Default Border**: `border-neutral-700` - Standard borders
- **Input Border**: `border-neutral-600` - Input borders
- **Focus Border**: `border-[#FF0099]` - Focus states
- **Success Border**: `border-[#10B981]` - Success states

## 🎬 Animation & Transitions

### Transition Classes
- **Standard**: `transition-colors duration-200` - Color changes
- **All Properties**: `transition-all duration-300` - Complex animations
- **Hover Scale**: `hover:scale-105` - Subtle scale on hover

### Keyframe Animations
- **Shimmer**: Loading states with shimmer effect
- **Fade In**: Content appearance animations
- **Slide**: Mobile menu transitions

## 📱 Responsive Design

### Breakpoints
- **xs**: `475px` - Extra small devices
- **sm**: `640px` - Small devices
- **md**: `768px` - Medium devices
- **lg**: `1024px` - Large devices
- **xl**: `1280px` - Extra large devices
- **2xl**: `1536px` - 2X large devices
- **3xl**: `1920px` - 3X large devices
- **4xl**: `2560px` - 4X large devices

### Grid System
- **Mobile**: 1 column
- **Small**: 2 columns
- **Medium**: 3 columns
- **Large**: 4 columns
- **Extra Large**: 5 columns

## ♿ Accessibility Standards

### Focus Management
- All interactive elements must have visible focus states
- Use `focus:ring-2 focus:ring-[#FF0099]` for focus rings
- Ensure sufficient color contrast ratios

### Color Contrast
- Text on dark backgrounds: Minimum 4.5:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Use `text-neutral-100` for primary text on dark backgrounds

### Text Selection
```css
::selection {
  background-color: #FF0099;
  color: white;
}
```

## 🎯 Implementation Rules

### 1. Color Consistency
- **Always use the defined color palette** - No arbitrary colors
- **Use brand colors for CTAs** - `#FF0099` for primary actions
- **Consistent hover states** - Same element types use same hover effects

### 2. Typography Hierarchy
- **Use semantic HTML** - `<h1>`, `<h2>`, `<h3>` for proper hierarchy
- **Consistent font sizes** - Use the defined scale
- **Proper font weights** - Match the design system

### 3. Spacing Consistency
- **Use the spacing scale** - No arbitrary spacing values
- **Consistent padding/margins** - Same components use same spacing
- **Grid alignment** - Use consistent gaps

### 4. Border Radius
- **Standard radius is 4px** - Use `rounded` for most components
- **Consistent corner treatment** - Same element types use same radius
- **No mixing** - Don't mix different radius values

### 5. Interactive States
- **Consistent hover effects** - Same element types use same hover
- **Proper focus states** - All interactive elements need focus indicators
- **Smooth transitions** - Use standard transition classes

## 🚀 Quick Reference

### Most Used Classes
```css
/* Colors */
text-white, text-neutral-400, text-[#FF0099]
bg-neutral-800, bg-[#FF0099], bg-neutral-900
border-neutral-700, border-[#FF0099]

/* Typography */
text-sm, text-base, text-lg, text-xl
font-medium, font-semibold, font-bold

/* Spacing */
p-4, m-4, gap-4
px-4 py-2, px-6 py-3

/* Layout */
rounded, rounded-md, rounded-lg
flex, grid, block, inline-block

/* States */
hover:bg-neutral-700, hover:text-[#FF33B3]
focus:ring-2 focus:ring-[#FF0099]
transition-colors duration-200
```

### Component Patterns
```css
/* Button Pattern */
bg-[#FF0099] hover:bg-[#E6008A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200

/* Card Pattern */
bg-neutral-800 border border-neutral-700 rounded-md p-4 hover:bg-neutral-700 transition-colors duration-200

/* Input Pattern */
bg-neutral-900 border border-neutral-600 text-white placeholder-neutral-400 focus:border-[#FF0099] focus:ring-0 px-3 py-2 rounded-md text-sm
```

This design system ensures consistency, accessibility, and maintainability across the entire Satoshe Sluggers NFT Marketplace.
