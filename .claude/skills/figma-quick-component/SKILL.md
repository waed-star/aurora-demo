---
name: figma-quick-component
description: Implement a single Figma component in React. Runs Spec Kit to generate spec.md, checklists/requirements.md, plan.md, and data-model.md — implementation is BLOCKED until all four files are verified on disk. Use when the user provides a Figma node URL and wants a component built correctly.
---

# Figma Quick Component

Implement a React component from a Figma design.

**Prerequisite**: You MUST invoke the `figma-use` skill before calling `use_figma`. Load it now before proceeding.

---

## Aurora Token & Package Reference (read this before writing any code)

### Available Tailwind utilities — semantic layer only, no raw values

**Colors** (from `src/styles/tokens.css` → `src/index.css @theme inline`):
```
bg-primary        text-primary        border-primary
bg-surface        text-surface
bg-surface-muted
bg-ink            text-ink            border-ink
                  text-ink-muted
bg-accent         text-accent         border-accent
                  hover:bg-accent-hover
bg-line           text-line           border-line
bg-danger         text-danger         border-danger
```

**Spacing** (use these — not arbitrary values like `p-[6px]`):
```
p-xs  p-sm  p-md  p-lg  p-xl  p-2xl
m-xs  m-sm  m-md  m-lg  m-xl  m-2xl
gap-xs  gap-sm  gap-md  gap-lg  gap-xl  gap-2xl
px-xs  px-sm  px-md  px-lg  px-xl  px-2xl   (and py-*)
```

**Radius**:
```
rounded-sm  rounded-md  rounded-lg  rounded-xl  rounded-pill
```

**Shadows**:
```
shadow-sm  shadow-md  shadow-lg
```

**Typography**:
```
text-xs  text-sm  text-base  text-lg  text-xl  text-2xl  text-3xl  text-4xl
font-sans  font-mono
font-normal  font-medium  font-semibold  font-bold
leading-tight  leading-normal  leading-relaxed
tracking-tight  tracking-normal  tracking-wide
```

> ⚠️ There is no `tailwind.config.ts` — Aurora uses Tailwind v4's `@theme inline` in `src/index.css`. Do not look for or create a config file.

### Installed Radix UI packages — only these three are available

```
@radix-ui/react-slot    ← asChild pattern on all flat components
@radix-ui/react-tabs    ← Tabs compound component
@radix-ui/react-dialog  ← Dialog/Modal compound component
```

> ⚠️ Do NOT import any other `@radix-ui/*` package. If a component needs Radix functionality from a package not listed above (e.g. `react-select`, `react-popover`, `react-accordion`), flag it to the user and ask whether to install it first. Do not write broken imports.

### Import path for `cn()`

Always use the `@/` alias — never relative paths:
```ts
import { cn } from "@/lib/utils";   ✅
import { cn } from "../../../lib/utils";  ❌
```

---

## Step 1 — Read Everything in Parallel (30-60 sec)

Do all three in a single parallel batch:

1. **Read the Figma node** using `use_figma`. Run this inspection script on the target node URL/ID:
   ```js
   // Replace NODE_ID with the actual node ID from the Figma URL (?node-id=...)
   const node = await figma.getNodeByIdAsync("NODE_ID");
   if (!node) return { error: "Node not found" };

   // For component sets (variants), list all children
   const children = node.type === "COMPONENT_SET"
     ? node.children.map(c => ({ name: c.name, id: c.id, type: c.type }))
     : [];

   // Extract fills (colors), padding, item spacing from auto-layout
   const fills = "fills" in node ? node.fills : [];
   const padding = "paddingTop" in node ? {
     top: node.paddingTop, right: node.paddingRight,
     bottom: node.paddingBottom, left: node.paddingLeft
   } : null;
   const spacing = "itemSpacing" in node ? node.itemSpacing : null;
   const cornerRadius = "cornerRadius" in node ? node.cornerRadius : null;

   return {
     name: node.name,
     type: node.type,
     width: "width" in node ? node.width : null,
     height: "height" in node ? node.height : null,
     fills,
     padding,
     spacing,
     cornerRadius,
     children,
   };
   ```
   From the response, extract: **component name**, **variant names** (from children of a COMPONENT_SET), **fills/colors**, **padding/spacing**, **corner radius**.

2. **Read `.specify/memory/constitution.md`** — the binding constraints for this project.

3. **Read the implementation template** — which file depends on the component pattern:
   - **Flat** (single element, no composable parts — Badge, Avatar, Input): read `src/components/ui/Button/Button.tsx`
   - **Compound** (multiple composable sub-components — Tabs, Dialog, Select, Accordion): read `src/components/ui/Tabs/Tabs.tsx` and `src/components/ui/Tabs/Tabs.types.ts`

   Determine the pattern from the Figma node structure: if the design shows independently meaningful parts that consumers would reorder or omit (e.g. a tab list + triggers + content panels), it's compound. If it renders as one logical unit, it's flat. When in doubt, default to flat.

---

## Step 2 — Run Spec Kit (MANDATORY — BLOCKING)

> **⛔ HARD STOP: You MUST complete all of 2a and 2b before writing a single line of component code.**
> Do not rationalise skipping or abbreviating Spec Kit because you "have enough Figma context". These files are the ground truth that prevents implementation drift. The component cannot be started without them.

Use the component name and variant information from Step 1 as the description input. Format it as:

> "Implement the [ComponentName] component from Figma. It has [N] variants: [list]. Used for [purpose derived from Figma]."

---

### 2a — Run `speckit.specify` → produces `spec.md` and `checklists/requirements.md`

1. Read `.github/agents/speckit.specify.agent.md` in full.
2. Execute **every instruction in that file** with the component description above as `$ARGUMENTS`.
   - This will create `specs/NNN-component-name/` and write `spec.md` inside it.
   - It will then validate the spec and write `specs/NNN-component-name/checklists/requirements.md`.
   - It will write `.specify/feature.json` recording the feature directory path.
3. Scope the spec to the UI component only — skip any sections about backend, APIs, or multi-page flows.

**After 2a completes — verify with the Read tool before continuing:**

- Read `specs/NNN-component-name/spec.md` → must exist and contain User Scenarios + Functional Requirements sections.
- Read `specs/NNN-component-name/checklists/requirements.md` → must exist and contain the quality checklist.

**If either file is missing or empty → re-run speckit.specify before proceeding.**

---

### 2b — Run `speckit.plan` → produces `plan.md` and `data-model.md`

1. Read `.github/agents/speckit.plan.agent.md` in full.
2. Execute **every instruction in that file**. The plan agent reads `.specify/feature.json` to locate the feature directory from 2a, then runs `setup-plan.sh --json` from the repo root to get all paths.
3. The plan agent produces:
   - `specs/NNN-component-name/plan.md` — technical implementation plan
   - `specs/NNN-component-name/data-model.md` — TypeScript props interface, CVA variant shape, and state interfaces

**After 2b completes — verify with the Read tool before continuing:**

- Read `specs/NNN-component-name/plan.md` → must exist and contain the Constitution Check and Technical Approach sections.
- Read `specs/NNN-component-name/data-model.md` → must exist and contain the full TypeScript interface for the component's props.

**If either file is missing or empty → re-run speckit.plan before proceeding.**

> **Do NOT run `speckit.tasks` or `speckit.implement`** — the implementation is handled by Step 3 of this skill.

---

### ⛔ GATE: All four files must be verified before Step 3

Use the Read tool on all four paths now. Do not proceed until every Read succeeds with substantive content:

```
Read: specs/NNN-component-name/spec.md
Read: specs/NNN-component-name/checklists/requirements.md
Read: specs/NNN-component-name/plan.md
Read: specs/NNN-component-name/data-model.md
```

**Any missing or empty file = STOP. Fix it before continuing.**

---

## Step 3 — Write All 5 Files in Parallel (4-6 min)

Create the component directory at `src/components/ui/ComponentName/` and write all 5 files **in a single parallel batch**. Do not write them sequentially.

> Before writing, re-read `specs/NNN-component-name/data-model.md`. The TypeScript interfaces in that file are your authoritative source — implement them verbatim in `ComponentName.types.ts`. Do not invent props that aren't in the data model.

### Constitution Requirements (Non-Negotiable)
- **Semantic tokens only**: `bg-accent`, `text-ink`, `border-border`, etc. No hex values, no `bg-[#fff]`, no inline `style` for design properties.
- **`forwardRef`** on every component.
- **`cn()`** from `@/lib/utils` for class merging. Consumer `className` always wins.
- **`displayName`** set explicitly: `ComponentName.displayName = "ComponentName"`.
- **`asChild`** via Radix `Slot` on components wrapping a single interactive element.
- **`cva`** from `class-variance-authority` for variants.
- **Named exports only** — no default exports.
- If the component manages state (open/closed, selected value): support both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`).
- For interactive components with focus/keyboard/ARIA: use **Radix UI primitives** — do not re-implement what Radix handles.

---

### If Flat Pattern — follow `src/components/ui/Button/`

#### `ComponentName.types.ts`
Define the interface directly in the `.tsx` file for simple components. Only create a separate types file if the component is complex enough to warrant it — export types from `index.ts` either way.

#### `ComponentName.tsx`
```tsx
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentNameVariants = cva(
  "/* base classes — semantic tokens only */",
  {
    variants: {
      variant: {
        // one entry per Figma variant
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: { variant: "/* first variant */", size: "md" },
  },
);

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentNameVariants> {
  asChild?: boolean;
  className?: string;
}

export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ asChild, className, variant, size, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"; // use appropriate HTML element
    return (
      <Comp
        ref={ref}
        className={cn(componentNameVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

ComponentName.displayName = "ComponentName";
```

#### `index.ts`
```ts
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

#### `ComponentName.stories.tsx`
One story per Figma variant plus Disabled. Follow `src/components/ui/Button/Button.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "UI/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["/* variants from spec */"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  render: (args) => (
    <div className="flex w-full justify-center h-40 items-center">
      <ComponentName {...args} />
    </div>
  ),
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary", size: "md" } };
export const Disabled: Story = { args: { variant: "primary", disabled: true } };
```

#### `ComponentName.test.tsx`
```tsx
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("renders without crashing", () => {
    render(<ComponentName>Content</ComponentName>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("forwards ref to the DOM element", () => {
    const ref = createRef<HTMLElement>();
    render(<ComponentName ref={ref}>Content</ComponentName>);
    expect(ref.current).toBeInTheDocument();
  });

  it("merges consumer className last", () => {
    render(<ComponentName className="test-class">Content</ComponentName>);
    expect(screen.getByText("Content")).toHaveClass("test-class");
  });

  it("renders as child element with asChild", () => {
    render(<ComponentName asChild><span>Slot</span></ComponentName>);
    expect(screen.getByText("Slot").tagName).toBe("SPAN");
  });
});
```

---

### If Compound Pattern — follow `src/components/ui/Tabs/`

Use this when the component has multiple independently composable parts (e.g. Root + List + Trigger + Content). Each sub-component is individually `forwardRef`-wrapped, then assembled via `Object.assign` and exported as one named export.

#### `ComponentName.types.ts`
Extend Radix prop types directly — no need to redeclare props Radix already handles:
```ts
import type { ComponentPropsWithoutRef } from "react";
import * as RadixPrimitive from "@radix-ui/react-[primitive]";

export type ComponentNameRootProps = ComponentPropsWithoutRef<typeof RadixPrimitive.Root>;
export type ComponentNamePartProps = ComponentPropsWithoutRef<typeof RadixPrimitive.Part>;
// one type per sub-component
```

#### `ComponentName.tsx`
```tsx
import { forwardRef } from "react";
import * as RadixPrimitive from "@radix-ui/react-[primitive]";
import { cn } from "@/lib/utils";
import type {
  ComponentNameRootProps,
  ComponentNamePartProps,
} from "./ComponentName.types";

const ComponentNameRoot = forwardRef<HTMLDivElement, ComponentNameRootProps>(
  ({ className, ...props }, ref) => (
    <RadixPrimitive.Root
      ref={ref}
      className={cn("/* base classes */", className)}
      {...props}
    />
  ),
);
ComponentNameRoot.displayName = "ComponentName.Root";

const ComponentNamePart = forwardRef<HTMLElement, ComponentNamePartProps>(
  ({ className, ...props }, ref) => (
    <RadixPrimitive.Part
      ref={ref}
      className={cn("/* part classes — semantic tokens only */", className)}
      {...props}
    />
  ),
);
ComponentNamePart.displayName = "ComponentName.Part";

// Repeat for each sub-component from the Figma design

export const ComponentName = Object.assign(ComponentNameRoot, {
  Part: ComponentNamePart,
  // one key per sub-component
});
```

#### `index.ts`
```ts
export { ComponentName } from "./ComponentName";
export type {
  ComponentNameRootProps,
  ComponentNamePartProps,
} from "./ComponentName.types";
```

#### `ComponentName.stories.tsx`
Use `render:` for all stories — compound components can't use `args` directly. Follow `src/components/ui/Tabs/Tabs.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "UI/ComponentName",
  component: ComponentName,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ComponentName defaultValue="first">
      <ComponentName.Part value="first">First</ComponentName.Part>
      {/* mirror the Figma structure */}
    </ComponentName>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <ComponentName defaultValue="first">
      <ComponentName.Part value="first">Active</ComponentName.Part>
      <ComponentName.Part value="disabled" disabled>Unavailable</ComponentName.Part>
    </ComponentName>
  ),
};
```

#### `ComponentName.test.tsx`
Test interaction between sub-components and ARIA roles — follow `src/components/ui/Tabs/Tabs.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ComponentName } from "./ComponentName";

function renderComponent() {
  return render(
    <ComponentName defaultValue="first">
      {/* minimal fixture mirroring the Figma structure */}
    </ComponentName>,
  );
}

describe("ComponentName", () => {
  it("renders the default active state", () => {
    renderComponent();
    // assert default visible content
  });

  it("responds to interaction", async () => {
    renderComponent();
    await userEvent.click(screen.getByRole("/* correct role */", { name: "/* label */" }));
    // assert state change
  });

  it("does not activate a disabled sub-component", async () => {
    renderComponent();
    const disabled = screen.getByRole("/* role */", { name: "Unavailable" });
    expect(disabled).toBeDisabled();
  });

  it("has correct ARIA roles", () => {
    renderComponent();
    // assert roles match the Radix primitive's ARIA contract
  });
});
```

---

## Step 4 — Type-Check, Launch Storybook, and Verify (2-3 min)

### 4a — Type-check

```bash
npm run type-check
```

Fix any TypeScript errors inline before continuing.

### 4b — Start Storybook in the background (no system browser)

```bash
npm run storybook -- --no-open
```

The `--no-open` flag prevents Storybook from launching the system browser. Run this in the background. Storybook starts on `http://localhost:6006` by default.

### 4c — Open in VS Code Simple Browser only

Open the component's story directly in the VS Code built-in browser using this URL format:

```
http://localhost:6006/?path=/story/ui-componentname--default
```

Use the VS Code Simple Browser panel — do NOT open in the system browser or a new Chrome tab. The correct story path slug follows Storybook's convention: `ui-[componentname]--[storyname]` (all lowercase, spaces replaced with hyphens). For example:
- `title: "UI/SearchSection"` with story `Default` → `ui-searchsection--default`
- `title: "UI/Button"` with story `Primary` → `ui-button--primary`

### 4d — Verify every story against the Figma design

For each exported story in `ComponentName.stories.tsx`, navigate to it in the Simple Browser and take a screenshot. Verify:

- [ ] Component renders without errors or blank output
- [ ] All Figma variants are represented (one story per variant)
- [ ] Spacing, colours, and radius use semantic tokens (no raw values visible in inspector)
- [ ] Hover and focus states are visible
- [ ] Disabled state (if applicable) renders correctly
- [ ] Component does not overflow its container

If any story shows a blank render, console error, or visual mismatch → fix the component and re-verify before reporting complete.

### 4e — Report completion

Confirm to the user:

- All 4 spec files exist in `specs/NNN-component-name/`
- All 5 component files created in `src/components/ui/ComponentName/`
- `npm run type-check` passes
- Each story verified visually in VS Code Simple Browser (list any issues found and fixed)

---

## What This Skill Skips (Intentionally)

- `research.md`, `quickstart.md`, `contracts/` — not generated
- Full unit test coverage (> 80%) — 3-5 smoke tests only
- A11y test file — accessibility handled in implementation via Radix and ARIA
- Bundle size analysis
- Spec Kit review gates (`review-spec`, `review-plan`) — no gates; proceed after each step
- `speckit.tasks` and `speckit.implement` commands — replaced by Step 3 of this skill
