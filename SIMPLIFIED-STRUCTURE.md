# Simplified Site Structure Plan

## 🎯 Goal: Single Source of Truth

### ❌ Current Redundant Structure:
```
sync-evolve/
├── *.html (12 files - GitHub Pages serves these)
├── *.css, *.js (build outputs)
├── docs/ (13 files - redundant copy)
├── packages/main-site/ (12 files - "source")
├── dist/ (build artifacts)
├── scripts/ (build scripts)
└── media/ (images)
```

### ✅ New Simplified Structure:
```
sync-evolve/
├── src/ (SINGLE SOURCE OF TRUTH)
│   ├── pages/
│   │   ├── index.html
│   │   ├── eden-game.html
│   │   ├── tractor.html
│   │   ├── agua-lila.html
│   │   ├── temples.html
│   │   └── ...
│   ├── styles/
│   │   ├── sacred-theme.css
│   │   └── critical.css
│   ├── scripts/
│   │   └── sacred-theme.js
│   └── media/
│       └── *.png, *.jpg
├── .github/workflows/
├── scripts/ (build/deploy only)
└── package.json
```

## 🔧 New Build Process:
1. **Edit files in `src/`** (single location)
2. **Build copies to root** for GitHub Pages
3. **No more sync scripts or redundant copies**

## 🗑️ Files to Delete:
- `docs/` (entire directory)
- `packages/` (entire directory)
- `dist/` (build artifacts)
- Root HTML/CSS/JS files (will be build outputs)

## 📝 Benefits:
- ✅ Single source of truth
- ✅ No more sync confusion
- ✅ Simpler build process
- ✅ Clear separation: source vs build output
- ✅ Easier to maintain
- ✅ No more "which file do I edit?"