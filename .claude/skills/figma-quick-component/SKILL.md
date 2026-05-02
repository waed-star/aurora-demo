---
name: figma-quick-component
description: Implement a single Figma component in React. Uses Spec Kit to generate spec.md and data-model.md, then implements all 5 constitution-required files in parallel — no full Spec Kit pipeline, no review gates, no tasks file. Use when the user provides a Figma node URL and wants a component built fast.
---

# Figma Quick Component

Implement a React component from a Figma design.

**Prerequisites** — complete both before any other step:

1. **Node v23** — verify the active version and switch if needed:
   ```bash
   node --version
   ```
   If the output does not start with `v23`, run:
   ```bash
   nvm use 23
   ```
   If nvm reports that v23 is not installed:
   ```bash
   nvm install 23 && nvm use 23
   ```
   Confirm with `node --version` before proceeding. Do not continue on an older Node version.

2. **figma-use skill** — you MUST invoke the `figma-use` skill before calling `use_figma`. Load it now before proceeding.

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

## Step 2 — Generate Spec + Data-Model via Spec Kit

Use Spec Kit's `specify` and `plan` agent prompts to generate the planning documents. Read each agent file and follow its instructions, scoped to this component only. Output goes to `specs/{branch-name}/`.

### 2a. Generate `spec.md` — follow `.github/agents/speckit.specify.agent.md`

Read `.github/agents/speckit.specify.agent.md` and execute it with the component description derived from the Figma node. The input `$ARGUMENTS` should be a concise description of the component, e.g.:

> "Implement the [ComponentName] component from Figma. It has [N] variants: [list]. Used for [purpose]."

This will produce `specs/{branch}/spec.md` using the spec template. **Scope the spec to the component only** — ignore any sections about backend, APIs, or multi-page flows that don't apply.

### 2b. Generate `data-model.md` — follow `.github/agents/speckit.plan.agent.md`

Read `.github/agents/speckit.plan.agent.md` and execute it scoped to data modelling only. From the plan output, extract or write `specs/{branch}/data-model.md` containing:
- The TypeScript props interface
- The CVA variant shape
- State interfaces (only if the component is stateful)

Skip writing a full `plan.md` — only the data-model section is needed here.

**Stop after Step 2b.** Do not run `speckit.tasks` or `speckit.implement` — the rest of the workflow is handled below.

### 2c. Read `data-model.md` before writing any code

**Mandatory.** Read `specs/{branch}/data-model.md` in full before starting Step 3. This file is the source of truth for:
- The exact TypeScript props interface (name, types, optional/required, defaults)
- The CVA variant keys and their string values
- Any state interfaces the component needs

The implementation in Step 3 **must match `data-model.md` exactly** — do not invent props, rename variants, or add fields not present there. If the data-model is ambiguous or missing a field you need, resolve it by updating the file before writing code.

---

## Step 3 — Write All 5 Files in Parallel (4-6 min)

Create the component directory at `src/components/ui/ComponentName/` and write all 5 files **in a single parallel batch**. Do not write them sequentially.

### Constitution Requirements (Non-Negotiable)
- **Semantic tokens only**: `bg-accent`, `text-ink`, `border-border`, etc. No hex values, no `bg-[#fff]`, no inline `style` for design properties.
- **`forwardRef`** on every component.
- **`cn()`** from `../../../lib/utils` for class merging. Consumer `className` always wins.
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
      className={cn(
        "/* part classes — semantic tokens only */",
        className,
      )}
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

## Step 4 — Type-Check, Open Storybook in VS Code, and Visually Verify (2-3 min)

### 4a. Type-check

```bash
npm run type-check
```

Fix any TypeScript errors inline before proceeding.

### 4b. Start Storybook

Check whether Storybook is already running:

```bash
lsof -ti :6006
```

If no process is listening on port 6006, start it in the background:

```bash
npm run storybook &
```

Poll until the server responds (retry up to 6 times at 5-second intervals):

```bash
for i in $(seq 1 6); do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:6006 | grep -q "200" && break
  sleep 5
done
```

### 4c. Open the component story in VS Code's built-in preview

Use the `mcp__Claude_Preview__preview_start` tool to open Storybook inside VS Code:

- URL: `http://localhost:6006/?path=/story/ui-componentname--primary`
  - Replace `componentname` with the lowercase, hyphenated component name (e.g. `search-input` for `SearchInput`).
  - Replace `primary` with the first exported story name lowercased and hyphenated.

After the preview loads, call `mcp__Claude_Preview__preview_screenshot` to capture the rendered story.

### 4d. Verify visually

Compare the screenshot against the Figma design:
- Correct variant styles (color, spacing, radius, typography match the design tokens)?
- All exported stories render without errors?
- No console errors? (call `mcp__Claude_Preview__preview_console_logs` to check)

If anything looks wrong, fix it in the source files, wait for Storybook HMR to reload (~2 sec), then take a second screenshot to confirm.

### 4e. Report to the user

- All 5 files created in `src/components/ui/ComponentName/`
- `npm run type-check` passes
- Embed the Storybook screenshot
- Note any visual discrepancies found and whether they were fixed

---

## What This Skill Skips (Intentionally)

- `research.md`, `quickstart.md`, `contracts/` — not generated
- `plan.md` — Spec Kit plan runs but only `data-model.md` is extracted from it
- `tasks.md` — skipped entirely; the skill proceeds straight to implementation
- Full unit test coverage (> 80%) — 3-5 smoke tests only
- A11y test file — accessibility handled in implementation via Radix and ARIA
- Bundle size analysis
- Spec Kit review gates (`review-spec`, `review-plan`) — no gates; proceed after each step
- `speckit.tasks` and `speckit.implement` commands — replaced by Step 3 of this skill
