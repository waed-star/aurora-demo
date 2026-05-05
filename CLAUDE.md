# Aurora Design System

React 19 + TypeScript 6 component library. Design tokens → Tailwind utilities → components.

## Catch Up Fast

New conversation? Run this before anything else:

```bash
git log --oneline -5                     # recent work
cat .specify/feature.json                # active spec directory
ls specs/$(cat .specify/feature.json | python3 -c "import sys,json; print(json.load(sys.stdin)['feature_directory'])")/
ls src/components/ui/                    # components already shipped
```

Then read the active feature's `spec.md`, `plan.md`, and `checklists/requirements.md` — that tells you what's being built, what's already decided, and what's left to do.

## Architecture

**Authoritative rules:** `.specify/memory/constitution.md` — supersedes everything else, read it when uncertain.

Key rules:
- **Tokens only** — no hex values, no arbitrary Tailwind (`bg-[#fff]`), no inline `style` props. Tokens live in `src/styles/tokens.css`, exposed as Tailwind utilities via `src/index.css`.
- **`cn()` for all class merging** — `src/lib/utils.ts`. Consumer classes always win.
- **`forwardRef` + `displayName` + `className`** — mandatory on every component and sub-component.
- **Flat vs compound** — simple components (Button, Input) are flat single exports; complex ones (Tabs, Dialog) use `Object.assign(Root, { Sub })`.
- **Radix UI** for interactive primitives managing focus/keyboard/ARIA. Don't reimplement what Radix handles.
- **Named exports only** — no default exports.

## Spec-Driven Workflow

This repo uses Spec Kit. Features follow this pipeline — don't skip steps:

```
/speckit.specify   → spec.md + checklists/requirements.md
/speckit.plan      → plan.md
/speckit.tasks     → data-model.md + task list
/speckit.implement → implementation against spec, task by task
```

Active feature is always at `specs/<feature_directory>/` (see `.specify/feature.json`). If a spec artifact is missing, run the Spec Kit command — don't implement without one.

## Component Structure

Every component must have exactly 5 files under `src/components/ui/ComponentName/`:

```
ComponentName/
├── index.ts              ← named re-exports only
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.stories.tsx
└── ComponentName.test.tsx
```

A component is not shippable until all 5 exist and all quality gates in the constitution pass.

## Key Files at a Glance

| File | Purpose |
|------|---------|
| `.specify/feature.json` | Active feature spec directory |
| `.specify/memory/constitution.md` | Design system rules (authoritative) |
| `src/styles/tokens.css` | All design tokens |
| `src/index.css` | Tailwind `@theme` mappings |
| `src/lib/utils.ts` | `cn()` utility |
| `specs/<feature>/spec.md` | What we're building and why |
| `specs/<feature>/plan.md` | How we're building it |
| `specs/<feature>/checklists/requirements.md` | Completion checklist |

## Commands

```bash
npm run dev        # Vite dev server (App.tsx sandbox)
npm run storybook  # Storybook component explorer
npm test           # Vitest browser tests (via Storybook addon)
npm run build      # Production build
```

## Path Alias

`@` → `src/`
