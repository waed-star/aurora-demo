# Aurora Design System

A React 19 + TypeScript component library built with design tokens, Tailwind CSS v4, and Radix UI primitives. Components are developed and documented in Storybook.

## Getting started

```bash
npm install
npm run dev        # Opens Storybook at localhost:6006
npm test           # Run component tests
npm run build-storybook  # Build static Storybook site
```

## Building a component from a Figma design

Aurora uses Claude Code's `/figma-quick-component` skill to turn a Figma frame into a production-ready component. The agent follows a spec-driven pipeline — it generates planning artifacts before writing any code, so you can review and redirect before implementation begins.

### How to use it

1. Open this repo in [Claude Code](https://claude.ai/code) (desktop app, VS Code extension, or via the StackBlitz + Claude Code integration)
2. In Figma, right-click any frame or component → **Copy link to selection**
3. In Claude Code, type:
   ```
   /figma-quick-component
   ```
4. Paste the Figma node URL when prompted
5. The agent produces four planning artifacts in `specs/<component-name>/`:
   - `spec.md` — what the component is and why it exists
   - `plan.md` — how it will be built (structure, tokens, variants)
   - `checklists/requirements.md` — completion checklist
   - `data-model.md` — props interface and variant definitions
6. Review these files. Once you're happy, the agent implements the component under `src/components/ui/<ComponentName>/`

> **Note:** Implementation is blocked until all four spec files are verified on disk. This is intentional — the spec is the contract.

### Example output

See the `specs/` folder for completed examples:

- [`specs/001-search-section-component/`](specs/001-search-section-component/) — Search section with input and results
- [`specs/002-navbar-component/`](specs/002-navbar-component/) — Navigation bar component

Each folder contains the full set of planning artifacts produced by the agent before implementation.

## Project structure

```
src/
├── components/ui/     # Shipped components (one folder per component)
├── styles/tokens.css  # All design tokens
├── index.css          # Tailwind @theme mappings
└── lib/utils.ts       # cn() class merging utility

specs/                 # Agent-generated planning artifacts
.storybook/            # Storybook configuration
```

## Design token rules

- No hex values or arbitrary Tailwind classes (`bg-[#fff]`) — tokens only
- All tokens live in `src/styles/tokens.css`
- Use `cn()` from `src/lib/utils.ts` for all class merging
