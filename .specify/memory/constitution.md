# Aurora Design System Constitution

## Core Principles

### I. Semantic Tokens Only — No Raw Values
All component styles must consume design tokens exclusively through Tailwind utility classes that map to CSS custom properties. The three-layer token hierarchy is non-negotiable:

- **Layer 1 — Primitive**: Raw values (`--rust-500: #f97316`). Never referenced directly in component code.
- **Layer 2 — Semantic**: Contextual meaning (`--color-accent: var(--rust-500)`). The only layer components may use.
- **Layer 3 — Tailwind mapping**: `@theme inline` in `src/index.css` exposes semantics as utilities (`bg-accent`, `text-ink`, etc.).

Forbidden in any component file: hard-coded hex/rgb/hsl values, arbitrary Tailwind values (`bg-[#fff]`, `p-[6px]`), inline `style` props for color/spacing/typography, and direct references to Layer 1 primitives. If a required token does not exist in `src/styles/tokens.css`, flag it — never invent one.

Token scope covers all four categories: **color, typography, spacing, radius & shadow**.

### II. Component API Contract
Every component must conform to this API contract without exception:

- **`forwardRef`** — mandatory on every component, including sub-components in compound patterns.
- **`className`** — always accepted and merged last via `cn()` (clsx + tailwind-merge). Consumer classes always win.
- **`displayName`** — always set explicitly (e.g. `Button.displayName = "Button"`).
- **Controlled + uncontrolled** — any component that manages state must support both. Controlled: accepts `value` + `onChange`. Uncontrolled: manages internal state, accepts optional `defaultValue`.
- **`asChild`** — use Radix `Slot` to implement the `asChild` pattern on components that wrap a single interactive element (e.g. Button). This allows consumers to compose with their router's `<Link>` or any other element without losing component styles.

Props may be added freely. Props may never be removed or have their type narrowed without a major version bump.

### III. Flat vs Compound Pattern
The structural pattern is determined by component complexity — not preference:

**Flat (simple components):** A single exported component with props. Use when the component renders as one logical unit with no independently composable parts. Examples: `Button`, `Badge`, `Link`, `Input`, `Avatar`.

```tsx
<Button variant="primary" size="md">Save</Button>
```

**Compound (complex components):** A root component composed with named sub-components. Use when the component has multiple independently meaningful parts that consumers may need to reorder, omit, or extend. Examples: `Tabs`, `Dialog`, `Select`, `Accordion`, `Card` (if it has header/body/footer slots).

```tsx
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">...</Tabs.Content>
</Tabs.Root>
```

Compound sub-components are assembled via `Object.assign(Root, { List, Trigger, Content })` and exported as a single named export. Each sub-component is individually `forwardRef`-wrapped and has its own `displayName`.

### IV. Accessibility — Non-Negotiable
Target: **WCAG 2.1 AA minimum** on every component shipped.

- Use **Radix UI primitives** as the accessibility backbone for all interactive components that manage focus, keyboard navigation, or ARIA state (Dialog, Select, Tabs, Tooltip, Dropdown, Popover, etc.). Do not re-implement what Radix already handles.
- Simple interactive components (Button, Input, Checkbox) may be native HTML elements with appropriate ARIA attributes added manually.
- Every interactive component must have: correct ARIA roles/states/properties, full keyboard support (Tab, Enter, Space, Arrow keys where applicable), and visible focus indicators that meet AA contrast requirements.
- Color must never be the sole means of conveying meaning.

### V. Theming — CSS Custom Property Overrides
The theme system is pure CSS. No JavaScript, no context providers, no runtime theme switching library.

Every brand theme **must provide both a light and a dark mode**. Light/dark switching is toggled via the `data-theme` attribute on `:root`:
- No attribute (or `data-theme="light"`) → light mode
- `data-theme="dark"` → dark mode

**Brand variants** are defined by providing two blocks of semantic token overrides — one for light, one for dark. A consuming repo authors or receives a CSS file structured as:

```css
/* acme-brand.css */

/* Light mode (default) */
:root {
  --color-accent:       #0066ff;
  --color-accent-hover: #0052cc;
  --color-surface:      #ffffff;
  --color-ink:          #111111;
  /* ... all semantic tokens ... */
}

/* Dark mode */
:root[data-theme="dark"] {
  --color-accent:       #4d94ff;
  --color-accent-hover: #0066ff;
  --color-surface:      #0d0d0d;
  --color-ink:          #f5f5f5;
  /* ... all semantic tokens ... */
}
```

**Custom per-consumer themes** follow the same two-block pattern. A brand is not considered complete until both light and dark overrides are defined for every semantic token in the system.

Components must never reference primitive tokens directly, which is what makes this overridable by design. Because components only consume semantic tokens, a brand swap (including its dark mode) requires zero component code changes.

---

## Package Contract

Aurora ships as an **npm package** consumed by external repositories.

- All components are **named exports** from the package entry point. No default exports.
- The package must be **tree-shakeable** — no side-effectful barrel files; each component folder has an explicit `index.ts` with named re-exports only.
- **Strict semver** applies:
  - **Patch**: bug fixes with no API change.
  - **Minor**: new components, new optional props, new token additions.
  - **Major**: any removed prop, renamed export, changed default behaviour, altered DOM structure, or token removal. There are no deprecation cycles — breaking changes ship as majors immediately.
- CSS custom properties (`--color-*`, etc.) are part of the public API. Renaming or removing a semantic token is a breaking change.

---

## Quality Gates

A component is not shippable until all of the following are true:

1. **All five files exist**: `index.ts`, `ComponentName.tsx`, `ComponentName.stories.tsx`, `ComponentName.test.tsx`, `ComponentName.types.ts` — in a folder under `src/components/ui/ComponentName/`.
2. **Unit tests pass** (Vitest): cover all variant combinations, controlled/uncontrolled state transitions, keyboard interactions, and `forwardRef` forwarding.
3. **Storybook stories exist** for every variant, size, and meaningful state (disabled, loading, error, etc.). Stories serve as living documentation for consuming teams.
4. **No token violations**: no raw values, no arbitrary Tailwind, no inline styles for design properties.
5. **Accessibility verified**: correct ARIA roles, keyboard navigation confirmed manually or via automated checks.

---

## Governance

This constitution supersedes all other practices, preferences, and prior patterns in the repository. When a new pattern conflicts with a principle here, the constitution wins — or it must be formally amended.

**Amendments** require: written rationale, a note on what existing components are affected, and an update to this file with a new version and date.

**Version**: 1.0.0 | **Ratified**: 2026-05-01 | **Last Amended**: 2026-05-01
