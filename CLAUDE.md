# Aurora Design System — AI Agent Guardrails

This file governs how AI agents must behave in this repository at all times,
for every component, without exception. Read it before touching any file.

---

## Design System Rules

### 1. Tokens only — no raw values
All components must consume design tokens exclusively via Tailwind CSS utility
classes that map to CSS custom properties. Never use:
- Hard-coded hex, rgb, or hsl values in `className`
- Arbitrary Tailwind values such as `bg-[#6320EE]`, `text-[14px]`, `p-[6px]`
- Inline `style` props for colour, spacing, or typography

**Token layer convention (3 layers: core → semantic → component):**
```
Layer 1 – Core/Primitive   --color-brand-primary: #f97316   (raw value)
Layer 2 – Semantic         --color-action-default: var(--color-brand-primary)
Layer 3 – Component        consumed in Button as `bg-action-default`
```
Token names in code must match variable names in Figma **exactly**.
When in doubt about a token name, ask — never guess.

### 2. Controlled + uncontrolled support
Every component that manages state must support both modes:
- **Controlled** — accepts `value` + `onChange` props; the parent owns state
- **Uncontrolled** — manages its own internal state; accepts an optional
  `defaultValue` prop for initial state

### 3. Compound component pattern
Any component with multiple related parts must use the compound pattern:
```tsx
<Card.Root>
  <Card.Header />
  <Card.Body />
  <Card.Footer />
</Card.Root>
```
Sub-components are exported as named properties on the root export.

### 4. Accessibility — non-negotiable
Every interactive component must have:
- Correct ARIA roles, states, and properties
- Full keyboard navigation (Tab, Enter, Space, Arrow keys where applicable)
- Visible focus indicators that meet WCAG 2.1 AA contrast requirements
- No reliance on colour alone to convey meaning
- Screen-reader-friendly labels (aria-label / aria-labelledby / aria-describedby)

Target: **WCAG 2.1 AA minimum**.

### 5. Headless-first architecture
Behaviour and accessibility live in the primitive component.
Visual styles are applied via `className` props passed from the outside.
A component must be fully functional (keyboard, ARIA, state) with zero Tailwind
classes applied. Tailwind classes are progressive enhancement only.

### 6. Component file structure
Every component lives in its own folder under `src/components/ui/`:

```
src/components/ui/ComponentName/
  index.ts                    ← named exports only, no implementation
  ComponentName.tsx           ← implementation
  ComponentName.stories.tsx   ← Storybook: all variants + states
  ComponentName.test.tsx      ← Jest unit tests
  ComponentName.types.ts      ← TypeScript interfaces and types
```

All five files must be created together. Never ship a component without all five.

---

## Agent Behaviour Rules

### Before doing anything
1. Read this file (`CLAUDE.md`) in full
2. Check `/specs` for an existing spec for the component you are working on
3. Read any existing component files before modifying them — never overwrite
   without understanding what is already there

### Before implementing a component
- Before implementing any component, always run the official
  `figma-implement-design` skill from `.claude/skills/figma-implement-design.md`.
  This handles design context, screenshot capture, and token extraction
  directly from Figma via the MCP server.
- Before running `figma-implement-design`, always load `figma-use.md` first.
  The `figma-implement-design` skill requires it — it contains critical rules
  that apply to every Figma MCP operation.
- Do not proceed if the Figma URL or Node ID has not been provided.

### After implementing a component
- After implementing any component, always run the custom `verify-figma-design`
  skill at `.claude/skills/verify-figma-design.md`. This extends the official
  workflow by visually verifying the rendered component in Storybook via
  Playwright against the Figma reference screenshot.
- Log any visual discrepancy in a `VERIFICATION.md` file inside the component
  folder before marking the task complete.

### Mandatory skill sequence
The sequence **`figma-use` → `figma-implement-design` → implement component →
`verify-figma-design`** is mandatory for every component. No step is optional.

### Class and token discipline
- Never introduce a Tailwind class that does not map to a design token unless
  explicitly instructed in writing
- Never hard-code colours, spacing, or typography values anywhere
- If a required token does not exist in `src/styles/tokens.css`, flag it and
  ask for the correct token — do not invent one

### Component API discipline
- Do not remove existing props from a component's public API without an explicit
  written instruction to do so
- Additive changes are safe; breaking changes require explicit sign-off

### Figma MCP rules
- The Figma MCP server (used via `figma-use` + `figma-implement-design` skills)
  is the single source of visual truth for all components.
- Token names in code must match Figma variable names exactly — no aliases,
  no approximations.
- Never assume a token value — always read it from Figma via the MCP.

---

## Skill Reference

| Skill | When to run | Location |
|---|---|---|
| `figma-use` | Always load first — required by `figma-implement-design` | `.claude/skills/figma-use.md` |
| `figma-implement-design` | Before implementing any component | `.claude/skills/figma-implement-design.md` |
| `figma-code-connect-components` | When establishing Figma ↔ code component mappings | `.claude/skills/figma-code-connect-components.md` |
| `verify-figma-design` | After implementing any component | `.claude/skills/verify-figma-design.md` |

---

## Key Paths

| Path | Purpose |
|---|---|
| `src/components/ui/` | All design system components |
| `src/styles/tokens.css` | CSS custom property definitions (all 3 layers) |
| `src/index.css` | Tailwind `@theme inline` block — registers tokens as utilities |
| `src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |
| `specs/` | Component specs — check here before implementing |
| `specs/templates/component-spec.md` | Template for new specs |
| `.claude/skills/` | Agent skill definitions |
