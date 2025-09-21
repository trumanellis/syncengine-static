# 🔄 Development Workflow - Avoiding File Redundancies

## The Problem We Solved

Previously, the project had **dual copies** of HTML files:
- **Source files**: `packages/main-site/*.html`
- **Build output**: `*.html` (root directory)

This caused issues where:
- Edits to root files got overwritten on next build
- Changes to source files weren't immediately visible
- Constant sync conflicts and lost work

## The Solution: Single Source of Truth

### 📁 File Structure
```
sync-evolve/
├── packages/main-site/     ← 🎯 ALWAYS EDIT HERE (source)
│   ├── eden-game.html
│   ├── index.html
│   ├── sacred-theme.css
│   └── ...
├── *.html                  ← 🚫 NEVER EDIT (build output)
├── scripts/
│   └── sync-from-root.js   ← Emergency sync tool
└── deploy.js               ← Build tool
```

### ⚡ Proper Workflow

1. **Development**: Always edit files in `packages/main-site/`
2. **Testing**: Run `npm run dev` (serves from packages directory)
3. **Building**: Run `npm run build` (copies to root for GitHub Pages)
4. **Deploying**: Run `npm run deploy` (builds + commits + pushes)

### 🚨 Emergency Recovery

If you accidentally edited root files:
```bash
npm run sync-from-root    # Copies root changes back to source
```

### 🔧 Available Scripts

```bash
npm run dev              # Development server
npm run build            # Build for production
npm run deploy           # Build + deploy to GitHub Pages
npm run sync-from-root   # Emergency sync root → source
npm run edit-warning     # Reminder of proper workflow
```

### ✅ Benefits

- **Single source of truth**: Only edit `packages/main-site/`
- **No lost work**: Build process never overwrites your changes
- **Clean deploys**: Root files are always generated from source
- **Emergency recovery**: Can sync back accidental root edits

### 🎯 Remember

**Golden Rule**: Always edit files in `packages/main-site/`, never in root!

The build process (`deploy.js`) copies from `packages/main-site/` to root for GitHub Pages deployment.