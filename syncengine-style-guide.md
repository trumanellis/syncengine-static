# Synchronicity Engine Style Guide
## Complete Design System Documentation

---

## 🎨 Core Design Philosophy

### Primary Aesthetic: **Solarpunk meets Sacred Geometry**
- **Vision**: Technology and nature in harmony, sacred patterns underlying all design
- **Mood**: Optimistic, regenerative, mystical yet grounded
- **Principle**: Every element should feel both organic and intentional

### Design Pillars
1. **Living Systems**: Interfaces that breathe, grow, and respond
2. **Sacred Mathematics**: Golden ratio, Fibonacci sequences, geometric harmony
3. **Earth Connection**: Natural textures, organic forms, elemental colors
4. **Transparent Depth**: Layered glassmorphism suggesting multiple dimensions

---

## 🎨 Color System

### Primary Palette
```css
:root {
  /* Earth Foundation */
  --forest-deep: #0B3D0B;      /* Primary dark green */
  --forest-medium: #1a5d1a;    /* Medium forest */
  --forest-light: #2d7a2d;     /* Light forest */
  
  /* Sacred Metals */
  --honey-gold: #FFB300;        /* Primary gold - CTAs, highlights */
  --copper: #B87333;            /* Copper accents */
  --bronze: #CD7F32;            /* Bronze details */
  
  /* Sky & Spirit */
  --sky-blessed: #87CEEB;       /* Sky blue - spiritual elements */
  --sky-deep: #4682B4;          /* Deeper sky */
  --amethyst: #9B59B6;          /* Purple - sacred/mystical */
  
  /* Earth Tones */
  --soil-rich: #3E2723;         /* Dark earth */
  --terracotta: #CC5500;        /* Clay/ceramic */
  --sage: #87A96B;              /* Sage green - wisdom */
  
  /* Neutrals */
  --cream: #FFF8E7;              /* Off-white text */
  --parchment: #F4E8D0;          /* Background light */
  --mist: rgba(255, 248, 231, 0.1); /* Transparent overlay */
}
```

### Semantic Colors
```css
:root {
  /* States */
  --success: #4CAF50;           /* Growth, completion */
  --warning: #FF9800;           /* Attention needed */
  --error: #f44336;             /* Issues, blocks */
  --info: var(--sky-blessed);   /* Information */
  
  /* Gradients */
  --gradient-gold: linear-gradient(135deg, #FFB300, #CC5500);
  --gradient-forest: linear-gradient(135deg, #0B3D0B, #2d7a2d);
  --gradient-sky: linear-gradient(135deg, #87CEEB, #4682B4);
  --gradient-earth: linear-gradient(180deg, #3E2723, #8D6E63);
  --gradient-sacred: linear-gradient(135deg, #FFB300, #9B59B6, #87CEEB);
}
```

### Dark Mode Adjustments
```css
/* Automatically adjust for dark sections */
.dark-section {
  --text-primary: var(--cream);
  --text-secondary: rgba(255, 248, 231, 0.85);
  --text-muted: rgba(255, 248, 231, 0.6);
  --bg-card: rgba(255, 248, 231, 0.05);
  --border-subtle: rgba(255, 179, 0, 0.2);
}

.light-section {
  --text-primary: var(--forest-deep);
  --text-secondary: var(--soil-rich);
  --text-muted: rgba(62, 39, 35, 0.7);
  --bg-card: rgba(255, 255, 255, 0.9);
  --border-subtle: rgba(11, 61, 11, 0.2);
}
```

---

## 📝 Typography

### Font Stack
```css
/* Headers - Sacred/Classical */
--font-heading: 'Cinzel', 'Playfair Display', 'Georgia', serif;

/* Body Text - Organic/Readable */
--font-body: 'Crimson Text', 'EB Garamond', 'Georgia', serif;

/* UI Elements - Clean/Modern */
--font-ui: 'Inter', 'Source Sans Pro', -apple-system, sans-serif;

/* Monospace - Code/Data */
--font-mono: 'Fira Code', 'Source Code Pro', monospace;
```

### Type Scale (Desktop)
```css
/* Using golden ratio (1.618) */
--text-xs: 0.694rem;     /* 11px */
--text-sm: 0.833rem;     /* 13px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.2rem;       /* 19px */
--text-xl: 1.44rem;      /* 23px */
--text-2xl: 1.728rem;    /* 28px */
--text-3xl: 2.074rem;    /* 33px */
--text-4xl: 2.488rem;    /* 40px */
--text-5xl: 2.986rem;    /* 48px */
--text-6xl: 3.583rem;    /* 57px */
```

### Typography Styles
```css
/* Hero Title */
.hero-title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Section Heading */
.section-heading {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

/* Body Text */
.body-text {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  line-height: 1.7;
  letter-spacing: 0.01em;
}

/* UI Labels */
.ui-label {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

---

## 📐 Spacing System

### Base Unit: 8px (Sacred Geometry)
```css
:root {
  --space-xs: 0.5rem;    /* 8px */
  --space-sm: 1rem;      /* 16px */
  --space-md: 1.5rem;    /* 24px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 3rem;      /* 48px */
  --space-2xl: 4rem;     /* 64px */
  --space-3xl: 6rem;     /* 96px */
  --space-4xl: 8rem;     /* 128px */
}
```

---

## 🎭 Component Patterns

### Cards (Glassmorphic)
```css
.card {
  background: rgba(255, 248, 231, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 179, 0, 0.2);
  border-radius: 20px;
  padding: var(--space-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    var(--honey-gold) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-5px);
  border-color: var(--honey-gold);
  box-shadow: 
    0 10px 40px rgba(255, 179, 0, 0.2),
    0 0 60px rgba(255, 179, 0, 0.1) inset;
}

.card:hover::before {
  opacity: 0.05;
}
```

### Buttons
```css
/* Primary - Sacred Gold */
.btn-primary {
  font-family: var(--font-ui);
  padding: 0.75rem 2rem;
  background: var(--gradient-gold);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 500;
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 179, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 25px rgba(255, 179, 0, 0.4);
}

.btn-primary:active::after {
  width: 300px;
  height: 300px;
}

/* Secondary - Ghost */
.btn-secondary {
  font-family: var(--font-ui);
  padding: 0.75rem 2rem;
  background: transparent;
  border: 2px solid var(--sage);
  border-radius: 25px;
  color: var(--cream);
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--sage);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(135, 169, 107, 0.3);
}
```

### Sacred Geometry Overlays
```css
/* Flower of Life Background */
.sacred-bg {
  position: relative;
}

.sacred-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG pattern */
  opacity: 0.03;
  pointer-events: none;
}

/* Animated Sacred Circle */
.sacred-circle {
  width: 300px;
  height: 300px;
  position: relative;
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1);
    filter: drop-shadow(0 0 30px rgba(255, 179, 0, 0.3));
  }
  50% { 
    transform: scale(1.05);
    filter: drop-shadow(0 0 40px rgba(255, 179, 0, 0.5));
  }
}
```

### Navigation Patterns
```css
.nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: linear-gradient(
    180deg,
    rgba(11, 61, 11, 0.95) 0%,
    rgba(11, 61, 11, 0.8) 70%,
    transparent 100%
  );
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.nav.scrolled {
  background: rgba(11, 61, 11, 0.98);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.nav-link {
  position: relative;
  color: var(--cream);
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-gold);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--honey-gold);
}

.nav-link:hover::after {
  width: 100%;
}
```

---

## ✨ Animation System

### Timing Functions
```css
:root {
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
```

### Standard Animations
```css
/* Floating Particles */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) translateX(0px);
    opacity: 0;
  }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { 
    transform: translateY(-100vh) translateX(30px);
    opacity: 0;
  }
}

/* Rotation */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Shimmer */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* Growth */
@keyframes grow {
  0% { 
    transform: scale(0);
    opacity: 0;
  }
  50% { opacity: 1; }
  100% { 
    transform: scale(1);
    opacity: 1;
  }
}
```

### Hover States
```css
/* Universal hover lift */
.hover-lift {
  transition: transform 0.3s var(--ease-smooth);
}

.hover-lift:hover {
  transform: translateY(-5px);
}

/* Hover glow */
.hover-glow:hover {
  box-shadow: 
    0 0 20px rgba(255, 179, 0, 0.4),
    0 0 40px rgba(255, 179, 0, 0.2);
}
```

---

## 🌿 Organic Patterns

### Living Borders
```css
.living-border {
  border: 2px solid transparent;
  border-image: linear-gradient(
    45deg,
    var(--honey-gold),
    var(--sage),
    var(--sky-blessed)
  ) 1;
  position: relative;
}

.living-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(
    45deg,
    var(--honey-gold),
    var(--sage),
    var(--sky-blessed)
  );
  mask: 
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: rotate 10s linear infinite;
}
```

### Nature Textures
```css
/* Paper texture */
.texture-paper {
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 248, 231, 0.02) 10px,
      rgba(255, 248, 231, 0.02) 20px
    );
}

/* Leaf pattern */
.texture-leaves {
  background-image: 
    radial-gradient(
      ellipse at top left,
      rgba(135, 169, 107, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at bottom right,
      rgba(135, 169, 107, 0.1) 0%,
      transparent 50%
    );
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
:root {
  --breakpoint-xs: 375px;   /* Small phones */
  --breakpoint-sm: 640px;   /* Large phones */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Small laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */
}

/* Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Mobile Adjustments
```css
/* Typography scaling */
@media (max-width: 768px) {
  :root {
    --text-base: 0.9rem;
    --text-5xl: 2.5rem;
    --text-4xl: 2rem;
    --text-3xl: 1.75rem;
  }
  
  .hero-title {
    font-size: var(--text-4xl);
  }
  
  .card {
    padding: var(--space-md);
    border-radius: 15px;
  }
}
```

---

## 🎯 Accessibility Guidelines

### Color Contrast
- Text on dark backgrounds: minimum 4.5:1 ratio
- Use `--cream` (#FFF8E7) for primary text on dark
- Always provide hover/focus states

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--honey-gold);
  outline-offset: 2px;
  border-radius: 4px;
}

button:focus-visible {
  outline-offset: 4px;
}
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🌟 Special Effects

### Blessing Particles
```html
<div class="blessing-particle"></div>
```

```css
.blessing-particle {
  position: fixed;
  width: 4px;
  height: 4px;
  background: var(--honey-gold);
  border-radius: 50%;
  box-shadow: 
    0 0 6px var(--honey-gold),
    0 0 12px rgba(255, 179, 0, 0.5);
  animation: float 20s infinite;
  pointer-events: none;
}
```

### Glassmorphism
```css
.glass {
  background: rgba(255, 248, 231, 0.05);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 179, 0, 0.2);
}
```

### Sacred Glow
```css
.sacred-glow {
  filter: drop-shadow(0 0 30px rgba(255, 179, 0, 0.3));
  animation: pulse 4s ease-in-out infinite;
}
```

---

## 🎨 Icon System

### Primary Icon Set
- Use **Lucide Icons** for consistency
- Fallback to **Tabler Icons**
- Custom SVG for sacred geometry symbols

### Icon Sizes
```css
.icon-xs { width: 16px; height: 16px; }
.icon-sm { width: 20px; height: 20px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }
```

---

## 📋 Component Library

### Required Components
1. **Navigation** (fixed, glassmorphic)
2. **Hero Sections** (with sacred geometry)
3. **Cards** (glassmorphic with hover states)
4. **Buttons** (primary, secondary, ghost)
5. **Forms** (organic styling)
6. **Modals** (centered, glassmorphic)
7. **Progress Bars** (growing vines)
8. **Tooltips** (organic shapes)
9. **Tabs** (living borders)
10. **Accordions** (smooth expansion)

---

## 🚀 Implementation Checklist

### Phase 1: Foundation
- [ ] Set up CSS variables
- [ ] Import font families
- [ ] Create base layout grid
- [ ] Implement color system
- [ ] Add responsive breakpoints

### Phase 2: Core Components
- [ ] Navigation component
- [ ] Button variants
- [ ] Card system
- [ ] Form elements
- [ ] Typography classes

### Phase 3: Special Effects
- [ ] Sacred geometry overlays
- [ ] Floating particles
- [ ] Glassmorphism effects
- [ ] Animation system
- [ ] Living borders

### Phase 4: Polish
- [ ] Hover states
- [ ] Focus states
- [ ] Loading animations
- [ ] Error states
- [ ] Success confirmations

---

## 🌈 Example Implementation

```html
<!-- Hero Section Example -->
<section class="hero sacred-bg">
  <div class="hero-content glass">
    <div class="sacred-circle">
      <!-- SVG sacred geometry here -->
    </div>
    <h1 class="hero-title">
      An Evolutionary Game of Harmony
    </h1>
    <p class="subtitle">Played on Earth itself</p>
    <div class="cta-group">
      <button class="btn-primary hover-lift">
        Enter Paradise
      </button>
      <button class="btn-secondary hover-glow">
        Learn More
      </button>
    </div>
  </div>
  <div class="blessing-particle"></div>
</section>
```

---

## 📝 Notes for Claude Code

1. **Progressive Enhancement**: Start with solid HTML structure, layer on CSS, then add JavaScript interactions
2. **Performance**: Use CSS transforms over position changes, implement lazy loading for images
3. **Accessibility**: Always include ARIA labels, ensure keyboard navigation works
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Component Isolation**: Each component should be self-contained and reusable
6. **Sacred Geometry**: Use SVG for complex patterns, CSS for simple shapes
7. **Organic Feel**: Add subtle randomness to animations (vary duration/delay)
8. **Loading States**: Every async action needs a beautiful loading animation

---

This style guide provides the complete design system for the Synchronicity Engine. Follow these patterns consistently across all pages and components to maintain the sacred, organic, regenerative aesthetic throughout the experience.