# 🎨 Satoshe Sluggers Style Guide

**Design System for Consistent, Minimal, Sharp UI**

---

## 📐 Core Principles

1. **Minimal Rounding**: Only `rounded-sm` (2px) for consistency. NO bubbly fat corners.
2. **Clear Hierarchy**: Font weights establish visual importance (labels > values)
3. **Consistent Spacing**: Use defined gaps and margins everywhere
4. **Color Psychology**: Green for success/money, Pink for brand, Blue for info
5. **Frosted Glass**: Use backdrop-blur for overlays and navigation

---

## 🔤 Typography

### Font Weights (Hierarchy)
```
font-semibold (600)  → Primary headings, NFT names, prices
font-normal (400)    → Section headers, labels, categories
font-light (300)     → Values, body text, descriptions
```

### Font Sizes
```
text-3xl (30px)     → Page titles (desktop)
text-2xl (24px)     → NFT names, prices
text-xl (20px)      → Page titles (mobile)
text-lg (18px)      → Section headers (Attributes, Details)
text-base (16px)    → Navigation, attribute values
text-[15px] (15px)  → NFT card details
text-sm (14px)      → Body text, descriptions, labels
text-xs (12px)      → Footer, small metadata
```

### Usage Examples
```tsx
// Section Header
<h2 className="text-lg font-normal text-neutral-100">Attributes</h2>

// Category Label
<p className="text-sm text-neutral-400">Collection</p>

// Value
<p className="text-sm font-light text-neutral-100">Retinal Delights - Collection 11</p>

// NFT Name
<h1 className="text-2xl font-semibold text-neutral-100">Satoshe Slugger #1</h1>
```

---

## 🎨 Colors

### Brand Colors
- **Primary Pink**: `#ff0099`
- **Pink Hover**: `#ff0099/80` (80% opacity)
- **Pink Fill Hover**: `#ff0099/90` (90% opacity)

### Action Colors
- **Success Green**: `#10B981` (purchases, buy buttons)
- **Info Blue**: `#3B82F6` (IPFS, media links)

### Neutral Grayscale
```
white           → #ffffff (pure white - rare use)
neutral-100     → Off-white text (primary text)
neutral-300     → Light gray text
neutral-400     → Mid gray (labels, categories, inactive)
neutral-500     → Placeholder text
neutral-700     → Borders
neutral-800     → Cards, containers
neutral-900     → Darker backgrounds
neutral-950     → Darkest backgrounds, inputs
```

### Color Usage
```tsx
// Primary text (white)
<p className="text-neutral-100">Primary Text</p>

// Labels/categories (gray)
<span className="text-neutral-400">Label</span>

// Placeholders (light gray)
<input placeholder="..." className="placeholder:text-neutral-500" />

// Links (pink)
<a className="text-[#ff0099] hover:text-[#ff0099]/80">Link</a>

// Buy button (green)
<button className="text-[#10B981] border-[#10B981] hover:bg-[#10B981]/90">
  BUY NOW
</button>
```

---

## 📏 Spacing

### Gaps (Between Elements)
```
gap-2 (8px)     → Tight spacing (icon + text)
gap-3 (12px)    → Small spacing (attribute columns)
gap-4 (16px)    → Default spacing
gap-6 (24px)    → Large spacing (details grid horizontal)
gap-8 (32px)    → Extra large spacing (NFT cards vertical)
```

### Specific Grid Gaps
```tsx
// NFT Card Grid
className="gap-x-6 gap-y-8"

// Details Grid (2 columns)
className="gap-x-6 gap-y-4"

// Attributes Grid
className="gap-4"
```

### Margins
```
mb-2 (8px)      → Between label and value
mb-4 (16px)     → Between sections
mb-8 (32px)     → Between NFT cards (vertical)
```

### Padding
```
p-3 (12px)      → Smaller cards (attributes)
p-4 (16px)      → Standard cards
```

---

## 🔲 Borders & Corners

### Border Radius
**RULE: Use `rounded-sm` (2px) everywhere for consistency**

```tsx
// Cards
className="rounded-sm"

// Buttons
className="rounded-sm"

// Inputs
className="rounded-sm"

// Dropdowns
className="rounded-sm"

// ONLY exception: Circles
className="rounded-full" // scroll button, icon containers
```

### Border Styles
```tsx
// Default border
className="border border-neutral-700"

// Hover border
className="hover:border-[#ff0099]/50"
```

---

## 🔘 Buttons

### Primary Button (Pink Filled)
```tsx
<button className="px-6 py-2 bg-[#ff0099] text-white font-normal rounded-sm hover:bg-[#ff0099]/90 transition-all duration-200">
  Click Me
</button>
```

### Outline Button (Pink Outline)
```tsx
<button className="px-6 py-2 border border-[#ff0099] bg-transparent text-[#ff0099] font-normal rounded-sm hover:bg-[#ff0099]/90 hover:text-white transition-all duration-200">
  Contact
</button>
```

### Success Button (Green - For Purchases)
```tsx
<button className="px-8 py-3 border border-[#10B981] bg-transparent text-[#10B981] font-normal rounded-sm hover:bg-[#10B981]/90 hover:text-white transition-all duration-200">
  BUY NOW
</button>
```

**Button Rules:**
- NO scaling on hover (`hover:scale-105` ❌)
- Thin borders (`border` not `border-2`)
- `font-normal` (400) weight
- Always include disabled state: `disabled:opacity-50 disabled:cursor-not-allowed`

---

## 📦 Cards & Containers

### Standard Card
```tsx
<div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700">
  Card Content
</div>
```

### Frosted Glass Container
```tsx
<div className="bg-neutral-950/80 backdrop-blur-md border border-neutral-700 rounded-sm">
  Glass Content
</div>
```

### Attribute Card
```tsx
<div className="bg-neutral-800 p-3 rounded-sm border border-neutral-700">
  <p className="text-sm font-normal text-[color]">Category</p>
  <p className="font-light text-base text-neutral-100">Value</p>
</div>
```

---

## 📝 Inputs & Forms

### Text Input
```tsx
<input 
  className="text-sm font-normal rounded-sm text-neutral-100 placeholder:text-neutral-500 border-neutral-700 bg-neutral-950/80 backdrop-blur-md focus:outline-none focus:ring-0 focus:border-[#ff0099]"
  placeholder="Placeholder text"
/>
```

### Textarea
```tsx
<textarea 
  className="text-sm font-normal rounded-sm text-neutral-100 placeholder:text-neutral-500 border-neutral-700 bg-neutral-950/80 backdrop-blur-md focus:outline-none focus:ring-0 focus:border-[#ff0099]"
  placeholder="Message"
/>
```

**Input Rules:**
- Placeholders are ALWAYS `text-neutral-500` (light gray)
- Actual typed text is `text-neutral-100` (white) or `text-[#ff0099]` (pink)
- Focus ring is thin pink: `focus:border-[#ff0099]`
- Dark frosted background: `bg-neutral-950/80 backdrop-blur-md`

---

## 🗂️ Tabs

### Tab List & Triggers
```tsx
<TabsList className="grid w-full grid-cols-2 bg-neutral-800/50 p-1 rounded-sm border border-neutral-700">
  <TabsTrigger 
    value="description"
    className="data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=inactive]:text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer rounded-sm"
  >
    Description
  </TabsTrigger>
  <TabsTrigger value="sales" className="...">
    Sales History
  </TabsTrigger>
</TabsList>

<TabsContent value="description" className="mt-4 space-y-4">
  {/* Content */}
</TabsContent>
```

**Tab Rules:**
- Background container with border
- Active: darker background (`bg-neutral-700`) + white text
- Inactive: gray text (`text-neutral-400`)
- Hover: lighten text (`hover:text-neutral-100`)
- Cursor pointer for clear interactivity

---

## 🔗 Links & IPFS

### Navigation Link
```tsx
<Link 
  href="/nfts"
  className="text-base text-neutral-400 hover:text-[#ff0099] transition-colors"
>
  NFTs
</Link>

{/* Active State */}
<Link className="text-base text-[#ff0099]">NFTs</Link>
```

### IPFS Token URI Link
```tsx
<div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700">
  <a 
    href="https://ipfs.io/ipfs/..."
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between gap-3 group cursor-pointer"
  >
    <div className="flex items-center gap-3">
      {/* Icon Container */}
      <div className="w-8 h-8 rounded-sm bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-emerald-500">...</svg>
      </div>
      {/* Text */}
      <div>
        <p className="text-sm font-normal text-neutral-100 group-hover:text-emerald-500 transition-colors">
          Token URI
        </p>
        <p className="text-xs text-neutral-400">View metadata on IPFS</p>
      </div>
    </div>
    {/* External Link Icon */}
    <svg className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors">...</svg>
  </a>
</div>
```

### IPFS Media URI Link
Same as Token URI, but use:
- `bg-blue-500/10` for icon container
- `text-blue-500` for icon and hover
- "View image on IPFS" for description

---

## 📋 Dropdowns & Selects

```tsx
<Select>
  <SelectTrigger className="w-[180px] bg-neutral-950/80 backdrop-blur-md border-neutral-700 rounded-sm">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-neutral-950/95 backdrop-blur-md border-neutral-700 rounded-sm">
    <SelectItem value="newest">Newest</SelectItem>
  </SelectContent>
</Select>
```

---

## 🎴 NFT Cards

### Card Structure
```tsx
<div className="group mb-8">
  {/* Image */}
  <Link href={`/nft/${tokenId}`} className="block mb-4">
    <img
      src={image}
      alt={name}
      className="w-full transition-transform duration-300 group-hover:rotate-[5deg]"
      style={{ aspectRatio: '27/30' }}
    />
  </Link>

  {/* Details Section */}
  <div className="space-y-2 px-2">
    {/* Title and Heart */}
    <div className="flex items-start justify-between gap-2">
      <Link href={`/nft/${tokenId}`}>
        <h3 className="font-normal text-[15px] text-neutral-100 hover:text-[#ff0099] transition-colors">
          {name}
        </h3>
      </Link>
      <Button variant="ghost">
        <Heart className="w-4 h-4" />
      </Button>
    </div>

    {/* Stats */}
    <div className="text-sm text-neutral-400 space-y-2">
      <div className="flex justify-between">
        <span>Rank:</span>
        <span className="text-neutral-300">7272 of 7777</span>
      </div>
    </div>
  </div>
</div>
```

**NFT Card Rules:**
- NO border or background around image
- Image rotates 5° on hover (NOT scale)
- Details are narrower than image (`px-2`)
- Title: `text-[15px] font-normal`
- Details: `text-sm text-neutral-400 space-y-2`
- Vertical spacing between cards: `mb-8`

---

## 📱 Responsive Design

### Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### NFT Grid Responsive
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-8">
```

### Text Responsive
```tsx
<h1 className="text-xl sm:text-2xl lg:text-3xl">Title</h1>
```

---

## ✨ Transitions & Animations

### Standard Transitions
```tsx
// Default (fast)
className="transition-all duration-200"

// Colors only
className="transition-colors duration-200"

// Transform (slower)
className="transition-transform duration-300"
```

### Hover Effects
```tsx
// Text color change
className="hover:text-[#ff0099] transition-colors"

// Background change
className="hover:bg-neutral-900 transition-colors"

// Border change
className="hover:border-[#ff0099]/50 transition-colors"

// Rotate (NFT images)
className="transition-transform duration-300 group-hover:rotate-[5deg]"
```

**Animation Rules:**
- NO scaling on hover for buttons
- Images rotate, don't scale
- Smooth 200ms transitions for colors
- 300ms for transforms

---

## 🎯 Common Patterns

### Section Header
```tsx
<h2 className="text-lg font-normal text-neutral-100 mb-4">
  Section Title
</h2>
```

### Label + Value (Details)
```tsx
<div>
  <p className="text-neutral-400 mb-2">Label</p>
  <p className="text-neutral-100 font-light">Value</p>
</div>
```

### Two-Column Grid (Details)
```tsx
<div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
  <div>
    <p className="text-neutral-400 mb-2">NFT Number</p>
    <p className="text-neutral-100 font-light">1</p>
  </div>
  <div>
    <p className="text-neutral-400 mb-2">Token ID</p>
    <p className="text-neutral-100 font-light">0</p>
  </div>
</div>
```

---

## 🚫 Don'ts (Common Mistakes)

### Typography
- ❌ Don't use `font-bold` (700) anywhere
- ❌ Don't use inconsistent font sizes
- ❌ Don't make values thicker than labels

### Spacing
- ❌ Don't use random gaps (`gap-5`, `gap-7`)
- ❌ Don't use `mb-1` or `gap-1` (too tight)

### Borders
- ❌ Don't use `rounded`, `rounded-md`, `rounded-lg`
- ❌ Only `rounded-sm` (2px) or `rounded-full` (circles)
- ❌ Don't use thick borders (`border-2`) on buttons

### Colors
- ❌ Don't use pure white text (`text-white`) except rare cases
- ❌ Don't use pink for purchase buttons (use green)
- ❌ Don't use random gray shades (stick to defined neutrals)

### Buttons
- ❌ Don't scale buttons on hover (`hover:scale-105`)
- ❌ Don't use `font-medium` or `font-semibold` on buttons

### Inputs
- ❌ Don't use pink placeholder text (use `text-neutral-500`)
- ❌ Don't use thick focus rings

---

## 📚 Design Token Import

```tsx
import { designSystem, cn, getSectionHeader, getLabel, getValue } from '@/lib/design-system';

// Use design tokens
<h2 className={getSectionHeader()}>Attributes</h2>
<p className={getLabel()}>Collection</p>
<p className={getValue()}>Retinal Delights</p>

// Combine tokens
<button className={cn(
  designSystem.buttons.success,
  designSystem.transitions.default
)}>
  BUY NOW
</button>
```

---

## 🎨 Summary

**The Golden Rules:**
1. **Minimal rounded corners** (`rounded-sm` only)
2. **Clear font weight hierarchy** (semibold > normal > light)
3. **Consistent spacing** (use defined gaps/margins)
4. **Color psychology** (green = buy, pink = brand, blue = info)
5. **No scaling animations** on buttons
6. **Light gray placeholders** (`text-neutral-500`)
7. **Frosted glass backgrounds** for overlays
8. **Cursor pointer** on all clickable elements

---

**Last Updated:** January 2026  
**Version:** 1.0.0

