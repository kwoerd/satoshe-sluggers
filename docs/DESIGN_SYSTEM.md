# 🎨 Satoshe Sluggers NFT Marketplace — Unified Design System

## 🧠 Purpose
This document consolidates the complete design framework across all sources. It defines branding, layout, components, spacing, accessibility, and enforcement rules for the Satoshe Sluggers Marketplace UI — ensuring consistency, scalability, and professional quality for high-value auctions.

## 🎯 Design Principles
- Minimal & Clean — No clutter or visual noise
- Consistent — Shared patterns across every page
- Functional — Design serves performance and clarity
- Stealth-like — Subtle, high-end visual tone
- High-Value Ready — Designed for $40K+ NFT sales

## 🎨 Color System (2 Shades Max per Color)
### Brand Colors
```css
--brand-pink: #FF0099;        /* Primary action, highlights */
--brand-pink-hover: #E6008A;  /* Hover states */
```
### Neutral Palette
```css
--bg-primary: #0A0A0A;
--bg-secondary: #171717;
--border-primary: #404040;
--text-primary: #FFFFFF;
--text-secondary: #A3A3A3;
```
### Status Colors
```css
--success: #10B981;   --success-hover: #059669;
--warning: #F59E0B;   --warning-hover: #D97706;
--error: #EF4444;     --error-hover: #DC2626;
--info: #3B82F6;      --info-hover: #2563EB;
```

## 📝 Typography System
```css
--font-sans: "Inter", system-ui, -apple-system, sans-serif;
```
| Type | Size | Weight | Use |
|------|------|---------|-----|
| H1 | 2.5rem (40px) | 700 | Page titles |
| H2 | 2rem (32px) | 600 | Section headings |
| H3 | 1.5rem (24px) | 600 | Subsections |
| H4 | 1.25rem (20px) | 500 | Card titles |
| Body | 1rem (16px) | 400 | Default text |
| Small | 0.875rem (14px) | 400 | Secondary text |
| Caption | 0.75rem (12px) | 400 | Labels, metadata |
| Button | 0.875rem (14px) | 600 | Uppercase button text |

## 📏 Spacing System (8px Base)
```css
--space-1: 0.125rem;   /* 2px  */
--space-2: 0.25rem;    /* 4px  */
--space-3: 0.375rem;   /* 6px  */
--space-4: 0.5rem;     /* 8px  */
--space-5: 0.625rem;   /* 10px */
--space-6: 0.75rem;    /* 12px */
--space-8: 1rem;       /* 16px */
--space-10: 1.25rem;   /* 20px */
--space-12: 1.5rem;    /* 24px */
--space-16: 2rem;      /* 32px */
--space-20: 2.5rem;    /* 40px */
--space-24: 3rem;      /* 48px */
```

## 🔲 Border Radius
```css
--radius-none: 0;
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-full: 9999px;
```

## 🧩 Component Standards
### Buttons
| Type | Style |
|------|--------|
| Primary | `bg-[#FF0099] hover:bg-[#E6008A] text-white font-semibold` |
| Secondary | `bg-transparent border border-neutral-700 text-white hover:bg-neutral-800` |
| Ghost | `text-neutral-400 hover:text-white` |
| Icon | `p-2 rounded-full hover:bg-neutral-800` |

### Cards
```css
.nft-card {
  background: #171717;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.nft-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
```

## 🌀 Transitions & Animations
```css
--transition: all 0.2s ease-out;
--transition-fast: all 0.1s ease-out;
--transition-slow: all 0.3s ease-out;
```

## 📱 Responsive Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
--breakpoint-3xl: 1920px;
```

## ♿ Accessibility
- Visible focus rings: `focus:ring-2 focus:ring-[#FF0099]`
- Maintain 4.5:1 contrast for text
- Keyboard navigable
- Avoid color-only state indicators

## 🚫 Enforcement Rules
✅ Always:
- Use CSS variables
- Follow the 8px spacing scale
- Maintain the 2-shade rule per color
- Use semantic HTML
- Test on mobile

❌ Never:
- Use random or hardcoded colors
- Mix radius sizes within a component
- Add unapproved spacing or shadows
- Use untested font sizes

## 📋 Implementation Checklist
- [x] Unified color palette
- [x] Typography hierarchy
- [x] Spacing and radius system
- [x] Component patterns documented
- [x] Tailwind config aligned
- [ ] Audit old components for violations
- [ ] Replace hardcoded styles
- [ ] Enforce via linting or style checks

## 🧭 Summary
This unified system forms the single source of truth for all UI elements in the Satoshe Sluggers marketplace. It merges brand style with performance, accessibility, and production consistency — giving your marketplace a premium, stealth-like, Web3-native aesthetic ready for launch.
