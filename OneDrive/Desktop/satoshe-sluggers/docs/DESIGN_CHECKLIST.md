<!-- docs/DESIGN_CHECKLIST.md -->
# ✅ Design Consistency Checklist

Use this checklist before committing any UI component or page.

---

## 🔤 Typography

- [ ] Section headers use `text-lg font-normal text-neutral-100`
- [ ] Labels/categories use `text-sm text-neutral-400`
- [ ] Values use `text-sm font-light text-neutral-100`
- [ ] NO `font-bold` anywhere
- [ ] Values are LIGHTER than their labels (hierarchy)

---

## 🎨 Colors

- [ ] Primary brand color is `#ff0099` (pink)
- [ ] Buy/purchase buttons use `#10B981` (green)
- [ ] IPFS/info links use `#3B82F6` (blue)
- [ ] Placeholders use `text-neutral-500` (light gray)
- [ ] Borders use `border-neutral-700`
- [ ] Cards use `bg-neutral-800`

---

## 📏 Spacing

- [ ] NFT card grid uses `gap-x-6 gap-y-8`
- [ ] Details grid uses `gap-x-6 gap-y-4`
- [ ] Label-to-value spacing uses `mb-2`
- [ ] Cards use `p-4` padding
- [ ] NO random gaps like `gap-5` or `gap-7`

---

## 🔲 Borders & Corners

- [ ] ALL corners use `rounded-sm` (2px)
- [ ] NO `rounded`, `rounded-md`, `rounded-lg`
- [ ] Exception: Circles use `rounded-full` only
- [ ] Borders are thin: `border` not `border-2` (except special cases)

---

## 🔘 Buttons

- [ ] Outline buttons use thin border: `border` not `border-2`
- [ ] Font weight is `font-normal` (400)
- [ ] NO scaling on hover (`hover:scale-105` ❌)
- [ ] Success/buy buttons use green (`#10B981`)
- [ ] Include disabled state: `disabled:opacity-50 disabled:cursor-not-allowed`

---

## 📝 Inputs & Forms

- [ ] Placeholders use `placeholder:text-neutral-500` (LIGHT GRAY)
- [ ] Typed text uses `text-neutral-100` or `text-[#ff0099]`
- [ ] Focus ring is minimal pink: `focus:border-[#ff0099]`
- [ ] Background is frosted: `bg-neutral-950/80 backdrop-blur-md`
- [ ] Border radius is `rounded-sm`

---

## 🗂️ Tabs

- [ ] Tab container has background: `bg-neutral-800/50 p-1 border border-neutral-700`
- [ ] Active tab: `bg-neutral-700 text-neutral-100`
- [ ] Inactive tab: `text-neutral-400`
- [ ] Hover state: `hover:text-neutral-100`
- [ ] Cursor pointer: `cursor-pointer`

---

## 🔗 Links

- [ ] Nav links: `text-neutral-400 hover:text-[#ff0099]`
- [ ] Active nav links: `text-[#ff0099]`
- [ ] Footer links: `text-[#ff0099] hover:text-[#ff0099]/80`
- [ ] IPFS links have colored icons (green for token, blue for media)
- [ ] External link arrow on right side

---

## 📦 Cards

- [ ] Standard card: `bg-neutral-800 p-4 rounded-sm border border-neutral-700`
- [ ] Glass card: `bg-neutral-950/80 backdrop-blur-md`
- [ ] All cards use `rounded-sm`
- [ ] NO bubbly fat corners

---

## 🎴 NFT Cards

- [ ] NO border around image
- [ ] Image rotates 5° on hover (NOT scale)
- [ ] Details are narrower than image (`px-2`)
- [ ] Title is `text-[15px] font-normal`
- [ ] Details use `text-sm text-neutral-400 space-y-2`
- [ ] Vertical spacing between cards: `mb-8`
- [ ] Image aspect ratio: `27/30`

---

## ✨ Transitions

- [ ] Standard transition: `transition-all duration-200`
- [ ] Color transitions: `transition-colors duration-200`
- [ ] Transform transitions: `transition-transform duration-300`
- [ ] NO scaling animations on buttons

---

## 🎯 Hover States

- [ ] All clickable elements have `cursor-pointer`
- [ ] Buttons have visible hover states
- [ ] Links change color on hover
- [ ] Tabs show hover feedback
- [ ] NO elements scale on hover (except NFT images rotate)

---

## 📱 Responsive

- [ ] NFT grid responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
- [ ] Text sizes responsive where needed: `text-xl sm:text-2xl lg:text-3xl`
- [ ] Footer text responsive: `text-[10px] sm:text-xs`

---

## 🚫 Common Mistakes to Avoid

- [ ] ❌ NO `font-bold` anywhere
- [ ] ❌ NO `hover:scale-105` on buttons
- [ ] ❌ NO pink placeholder text
- [ ] ❌ NO thick borders on buttons (`border-2`)
- [ ] ❌ NO rounded-lg or rounded-md corners
- [ ] ❌ NO random gray shades (stick to neutral-100, 300, 400, 500, 700, 800, 900, 950)
- [ ] ❌ NO values with heavier font weight than labels

---

## 🎨 Design Token Usage

- [ ] Import design system: `import { designSystem, cn } from '@/lib/design-system'`
- [ ] Use helper functions: `getSectionHeader()`, `getLabel()`, `getValue()`
- [ ] Use design tokens instead of hardcoded styles

---

## 📋 Before Committing

- [ ] All components follow style guide
- [ ] No inconsistent spacing
- [ ] No inconsistent font weights
- [ ] All corners are `rounded-sm`
- [ ] All colors match design system
- [ ] All hover states work
- [ ] Cursor changes to pointer on clickables
- [ ] Placeholders are light gray
- [ ] No scaling animations on buttons

---

**Quick Reference:**

```tsx
// Section Header
<h2 className="text-lg font-normal text-neutral-100">Title</h2>

// Label + Value
<p className="text-sm text-neutral-400 mb-2">Label</p>
<p className="text-sm font-light text-neutral-100">Value</p>

// Button (Success)
<button className="px-8 py-3 border border-[#10B981] bg-transparent text-[#10B981] font-normal rounded-sm hover:bg-[#10B981]/90 hover:text-white transition-all duration-200">
  BUY NOW
</button>

// Card
<div className="bg-neutral-800 p-4 rounded-sm border border-neutral-700">
  Content
</div>

// Input
<input className="text-sm font-normal rounded-sm text-neutral-100 placeholder:text-neutral-500 border-neutral-700 bg-neutral-950/80 backdrop-blur-md focus:outline-none focus:ring-0 focus:border-[#ff0099]" />
```

