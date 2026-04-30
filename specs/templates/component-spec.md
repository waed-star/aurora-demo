# Component Spec — [ComponentName]

> Copy this template into `specs/[ComponentName].md` and fill in every section
> before handing the spec to an agent for implementation.
> Fields marked **required** must be completed. Fields marked *optional* may
> be left blank if not applicable — but leave the heading so nothing is
> accidentally skipped.

---

## 1. Component Name and Purpose

**Name:** `[ComponentName]`

**Purpose:** *(1–2 sentences. What does this component do? What problem does it
solve? Keep it user-facing — what a developer using the design system needs to
know.)*

---

## 2. Figma Source

**File URL:** `https://www.figma.com/file/[FILE_ID]/[FILE_NAME]`

**Node ID:** `[node-id]`
*(Right-click the component in Figma → "Copy/Paste as" → "Copy link" — the
node ID appears after `node-id=` in the URL.)*

**Last reviewed:** `YYYY-MM-DD`

> The agent will use these values to run the `figma-design-context` skill
> before implementation begins.

---

## 3. Design Token Requirements

List every design token this component consumes. Use the semantic layer
(`--color-*`) names. Do not list primitive (`--rust-500`) values here.

| Token variable | Tailwind utility | Used for |
|---|---|---|
| `--color-accent` | `bg-accent` | Primary background |
| `--color-accent-hover` | `bg-accent-hover` | Hover state background |
| `--color-ink` | `text-ink` | Label text |
| *(add rows)* | | |

> If a required token does not yet exist in `src/styles/tokens.css`, flag it
> here with a note: `[NEEDS TOKEN]`.

---

## 4. Component API — Props Table

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `className` | `string` | `undefined` | No | Additional Tailwind classes |
| `children` | `React.ReactNode` | — | Yes | Slot content |
| *(add rows)* | | | | |

**Controlled props (if stateful):**

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `[type]` | — | No (controlled) | Controlled value |
| `onChange` | `(value: [type]) => void` | — | No (controlled) | Change handler |
| `defaultValue` | `[type]` | `[default]` | No (uncontrolled) | Initial value |

---

## 5. States

Mark each state as **applies** or *n/a*. For each that applies, describe the
visual change and which token drives it.

| State | Applies? | Visual change | Token |
|---|---|---|---|
| Default | applies | — | `bg-accent`, `text-ink` |
| Hover | applies | Background darkens | `bg-accent-hover` |
| Focus | applies | Focus ring visible | *(focus utility)* |
| Disabled | *(applies / n/a)* | | |
| Error | *(applies / n/a)* | | |
| Loading | *(applies / n/a)* | | |
| Active/Pressed | *(applies / n/a)* | | |

---

## 6. Accessibility Requirements

**ARIA role(s):** *(e.g. `button`, `combobox`, `listbox`, `dialog` — use the
WAI-ARIA spec name)*

**Required ARIA attributes:**

| Attribute | Value | When |
|---|---|---|
| *(e.g. `aria-expanded`)* | `true` / `false` | When open / closed |
| *(add rows)* | | |

**Keyboard interactions:**

| Key | Action |
|---|---|
| `Tab` | Move focus to / away from component |
| `Enter` / `Space` | *(action)* |
| *(add rows)* | |

**Focus behaviour:**
*(Describe focus entry, movement within, and exit. Note any focus trapping
requirements, e.g. modals.)*

**Screen reader notes:**
*(Any additional labelling, live regions, or announcements required.)*

**WCAG target:** WCAG 2.1 AA minimum.

---

## 7. Composition Pattern

**Compound component?**
- [ ] Yes — list sub-components below
- [ ] No — single root component

**Sub-components (if compound):**

| Export | Description |
|---|---|
| `[ComponentName].Root` | Wrapper / context provider |
| `[ComponentName].Header` | *(describe)* |
| *(add rows)* | |

**Controlled / uncontrolled?**
- [ ] Stateless — no internal state
- [ ] Supports both controlled and uncontrolled modes (describe above in §4)

**Slot pattern?**
*(Describe any named slots beyond `children`, e.g. `leftIcon`, `rightIcon`,
`label`.)*

---

## 8. Acceptance Criteria

Each criterion must be independently testable. Write them as "Given / When /
Then" or a plain "must" statement.

- [ ] Renders without errors when only required props are provided.
- [ ] Applies `bg-accent` class in the default state.
- [ ] Applies `bg-accent-hover` class on mouse hover.
- [ ] Is keyboard-focusable via Tab.
- [ ] Activates on Enter and Space keypress.
- [ ] Has `aria-disabled="true"` when the `disabled` prop is `true`, and does
  not fire `onChange`.
- [ ] Accepts and forwards `className` without overriding base token classes.
- [ ] *(Controlled mode)* Updates only when `value` prop changes — does not
  maintain internal state.
- [ ] *(Uncontrolled mode)* Initialises with `defaultValue` and manages its
  own state thereafter.
- [ ] *(Add component-specific criteria)*

---

## 9. Out of Scope

List anything explicitly **not** covered by this spec to prevent scope creep.

- Animation / transition timing (deferred to motion spec)
- *(add items)*

---

*Template version: 1.0 — Aurora Design System*
