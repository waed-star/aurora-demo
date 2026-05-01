# Aurora Design System

React 19 + TypeScript 6 component library. Design tokens → Tailwind utilities → components.

## Commands

```bash
npm run dev        # Vite dev server (App.tsx sandbox)
npm run storybook  # Storybook component explorer
npm test           # Vitest browser tests (via Storybook addon)
npm run build      # Production build
```

## Architecture

**Read this first:** `.specify/memory/constitution.md` — the authoritative design system rules. It supersedes everything else.

Key points:
- **Tokens only** — no hex values, no arbitrary Tailwind (`bg-[#fff]`), no inline `style` props for design properties. Tokens live in `src/styles/tokens.css` and are exposed as Tailwind utilities via `src/index.css`.
- **`cn()` for all class merging** — lives at `src/lib/utils.ts`. Consumer classes always win.
- **`forwardRef` + `displayName` + `className`** — mandatory on every component.
- **Flat vs compound pattern** — simple components (Button, Input) are flat; complex ones (Tabs, Dialog) use the compound `Object.assign()` pattern.
- **Radix UI** for all interactive primitives that manage focus/ARIA state.

## Component Structure

Every component must have exactly 5 files under `src/components/ui/ComponentName/`:

```
ComponentName/
├── index.ts
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.stories.tsx
└── ComponentName.test.tsx
```

A component is not shippable until all 5 exist and all quality gates in the constitution pass.

## Path Alias

`@` → `src/`
