# Quick Start: Combobox Component Development

**Target Audience**: Developers implementing the Combobox component  
**Time to Setup**: 5 minutes  
**Prerequisites**: Node.js 18+, npm/yarn installed, repository cloned

---

## 1. Environment Setup

### Verify Node.js & Package Manager

```bash
node --version        # Should be 18.0.0 or higher
npm --version        # Latest LTS recommended
```

### Install Dependencies

If not already done:

```bash
cd /Users/waedibrahim/Repo/aurora-demo
npm install
```

### Verify Project Structure

```bash
ls -la src/components/ui/
# Should list: Button/, Input/, Tabs/, ...
```

---

## 2. Understanding Existing Patterns

Before implementing Combobox, study existing Aurora components to understand project conventions.

### Key Files to Review

1. **Button Component** (simplest flat component):

   ```bash
   cat src/components/ui/Button/Button.tsx
   cat src/components/ui/Button/button.stories.tsx
   ```

   Key patterns:
   - `forwardRef` wrapping
   - `cn()` for className composition
   - `displayName` assignment
   - Tailwind token usage (`bg-background`, `text-foreground`)

2. **Tabs Component** (compound component with state):

   ```bash
   cat src/components/ui/Tabs/Tabs.tsx
   cat src/components/ui/Tabs/Tabs.test.tsx
   ```

   Key patterns:
   - Compound component structure (Root, List, Trigger, Content)
   - Internal state management
   - Keyboard navigation
   - WCAG 2.1 AA compliance

3. **Input Component** (form input with props):

   ```bash
   cat src/components/ui/Input/input.tsx
   cat src/components/ui/Input/input.stories.tsx
   ```

   Key patterns:
   - Controlled + uncontrolled modes
   - Props interface
   - Accessibility attributes

### Token System

```bash
cat src/styles/tokens.css
cat src/index.css
```

Key insight: Tokens are CSS custom properties. Tailwind `@theme` directive maps them to utilities:

- `var(--background)` → Tailwind `bg-background`
- `var(--border)` → Tailwind `border-border`
- `var(--foreground)` → Tailwind `text-foreground`

---

## 3. Project Structure for Combobox

Create the component directory:

```bash
mkdir -p src/components/ui/Combobox
```

Files to create (from task list):

```
src/components/ui/Combobox/
├── index.ts                 # Named export (tree-shakeable)
├── Combobox.tsx            # Component implementation
├── Combobox.types.ts       # TypeScript interfaces
├── Combobox.stories.tsx    # Storybook stories
├── Combobox.test.tsx       # Unit + integration tests
└── Combobox.a11y.test.tsx  # Accessibility tests (axe-core)
```

---

## 4. Development Workflow

### Start Dev Server + Storybook

```bash
# Terminal 1: Vite dev server (watches src/ changes)
npm run dev

# Terminal 2: Storybook (watches Storybook stories)
npm run storybook
```

### Run Tests

```bash
# Watch mode (re-run on file changes)
npm run test -- --watch

# Specific file
npm run test -- Combobox.test.tsx

# With coverage
npm run test -- --coverage
```

### TypeScript Checking

```bash
# Check for type errors (no build)
npm run type-check
```

### Linting & Formatting

```bash
# ESLint
npm run lint

# Prettier
npm run format
npm run format:check
```

---

## 5. Key Development Commands

| Command                   | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `npm run dev`             | Start Vite dev server                          |
| `npm run storybook`       | Start Storybook server (http://localhost:6006) |
| `npm run test`            | Run tests (Vitest)                             |
| `npm run test:watch`      | Run tests in watch mode                        |
| `npm run type-check`      | Check TypeScript types                         |
| `npm run lint`            | Run ESLint                                     |
| `npm run format`          | Format code with Prettier                      |
| `npm run build`           | Build library for distribution                 |
| `npm run build:storybook` | Build Storybook static site                    |

---

## 6. Implementation Checklist

Use this as a guide while coding:

- [ ] Create `Combobox.types.ts` with `ComboboxProps` and `ComboboxOption` interfaces
- [ ] Implement `Combobox.tsx` with core logic
  - [ ] Uncontrolled mode (defaultValue)
  - [ ] Controlled mode (value + onChange)
  - [ ] Keyboard navigation (arrows, enter, escape)
  - [ ] Search/filter functionality
  - [ ] State management (open/closed, highlighted, search)
- [ ] Add TypeScript validation (required props in controlled mode)
- [ ] Export from `index.ts` as named export
- [ ] Create Storybook stories (`Combobox.stories.tsx`)
  - [ ] Default state
  - [ ] Open state
  - [ ] With selected value
  - [ ] With custom options
  - [ ] Dark theme variant
  - [ ] Disabled state
- [ ] Write unit tests (`Combobox.test.tsx`)
  - [ ] Controlled mode
  - [ ] Uncontrolled mode
  - [ ] onChange callback
  - [ ] Keyboard navigation
  - [ ] Search filter
  - [ ] Prop validation
- [ ] Write a11y tests (`Combobox.a11y.test.tsx`)
  - [ ] axe-core scan
  - [ ] ARIA attributes
  - [ ] Keyboard focus
  - [ ] Screen reader (manual + RTL tests)
- [ ] Add design tokens if missing
- [ ] Ensure > 80% test coverage
- [ ] Verify Storybook renders correctly
- [ ] Test in light and dark themes

---

## 7. Design Token Reference

All colors and spacing MUST come from tokens. Use these in your implementation:

### Color Tokens (via Tailwind utilities)

```tsx
// ✅ CORRECT
<div className="bg-background border-border text-foreground">
<div className="bg-accent text-accent-foreground">
<div className="bg-popover text-popover-foreground">
<div className="text-muted-foreground">  // placeholders, hints

// ❌ WRONG
<div className="bg-white text-black">
<div className="bg-[#f5f5f5]">
<div style={{ backgroundColor: '#fff' }}>
```

### Spacing Tokens

```tsx
// ✅ CORRECT
<div className="px-3 py-2 gap-2">  // px-3 = --px-3 token
<div className="px-4 py-2 gap-1">

// ❌ WRONG
<div className="px-6 py-4 gap-10">  // arbitrary values
<div style={{ padding: '8px 16px' }}>  // inline styles
```

### Typography Tokens

```tsx
// ✅ CORRECT
<p className="text-sm font-medium">      // size/sm, weight/medium
<p className="text-base font-normal">    // size/base, weight/normal

// ❌ WRONG
<p style={{ fontSize: '14px' }}>
<p className="text-[13px] font-[500]">  // arbitrary values
```

### Border Radius

```tsx
// ✅ CORRECT
<div className="rounded-md">  // radius-md token

// ❌ WRONG
<div className="rounded-lg">  // might not have lg token
<div style={{ borderRadius: '8px' }}>
```

### Shadows

```tsx
// ✅ CORRECT
<div className="shadow-md">  // shadow-md token

// ❌ WRONG
<div className="shadow-lg">
<div style={{ boxShadow: '...' }}>
```

---

## 8. Using Radix UI Primitives

For the dropdown/popover functionality, use Radix UI components:

```tsx
import * as Popover from "@radix-ui/react-popover";

// Access Radix Popover for focus management and positioning
<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
  <Popover.Trigger asChild>
    <button className="...">Select framework</button>
  </Popover.Trigger>
  <Popover.Content side="bottom" align="start" className="...">
    {/* Dropdown content */}
  </Popover.Content>
</Popover.Root>;
```

Check dependencies in package.json:

```bash
grep "@radix-ui" package.json
```

---

## 9. Testing & Validation

### Unit Test Example (Vitest)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';

describe('Combobox', () => {
  it('renders with placeholder in default state', () => {
    render(<Combobox placeholder="Select..." />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('supports uncontrolled mode with defaultValue', () => {
    const { container } = render(
      <Combobox defaultValue="nextjs" options={[...]} />
    );
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('fires onChange on selection', async () => {
    const onChange = vi.fn();
    render(
      <Combobox
        onChange={onChange}
        options={[{ value: 'nextjs', label: 'Next.js' }]}
      />
    );

    const option = screen.getByText('Next.js');
    await userEvent.click(option);
    expect(onChange).toHaveBeenCalledWith('nextjs');
  });
});
```

### Accessibility Test (axe-core)

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Combobox } from './Combobox';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Combobox options={[...]} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 10. Storybook Story Example

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./Combobox";

const meta = {
  component: Combobox,
  tags: ["autodocs"],
  args: {
    options: [
      { value: "nextjs", label: "Next.js" },
      { value: "sveltekit", label: "SvelteKit" },
      { value: "nuxt", label: "Nuxt.js" },
    ],
    placeholder: "Select a framework",
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { state: "open" }, // if component supports state prop for demos
};

export const WithValue: Story = {
  args: { defaultValue: "nextjs" },
};
```

---

## 11. Debugging Tips

### Check TypeScript Errors

```bash
npm run type-check
# or in VS Code: Ctrl+Shift+B (Tasks) → TypeScript: Watch Mode
```

### Debug in Browser

```bash
# In Storybook, use browser DevTools
# Component source map available if built with sourceMap: true
```

### Test in Isolation

```bash
# Run single test file
npm run test -- Combobox.test.tsx --watch

# Run single test suite
npm run test -- Combobox.test.tsx -t "controlled mode"
```

### Visual Inspection

1. Start Storybook: `npm run storybook`
2. Navigate to Combobox story
3. Switch to Canvas tab for interactive testing
4. Try keyboard navigation, search, selections
5. Toggle dark theme (if Storybook has theme switch)

---

## 12. Common Pitfalls & Solutions

| Issue                        | Solution                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------- |
| "Token not found" in console | Add token to `src/styles/tokens.css` and `tailwind.config.ts`                |
| Component not re-rendering   | Ensure state updates via `onChange` callback in controlled mode              |
| Keyboard nav not working     | Verify Radix Popover focus trap is active; check event handlers              |
| Styling looks wrong          | Check token names (should match Tailwind utilities); inspect DevTools        |
| Tests failing                | Ensure RTL queries match actual DOM (use `screen.debug()` to inspect)        |
| a11y violations              | Run `npm run test -- Combobox.a11y.test.tsx` and fix with axe-core guidance  |
| Bundle too large             | Check imports; ensure tree-shaking works (`npm run build` and inspect dist/) |

---

## 13. Resources

### Documentation

- [Aurora Constitution](../../.specify/memory/constitution.md)
- [Radix UI Docs](https://radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Related Components

- Button: `src/components/ui/Button/`
- Input: `src/components/ui/Input/`
- Tabs: `src/components/ui/Tabs/`

### Test Libraries

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [jest-axe (a11y testing)](https://github.com/nickcolley/jest-axe)

---

## Next Steps

1. ✅ Complete this Quick Start (you are here)
2. ⬜ Generate `/speckit.tasks` with implementation tasks
3. ⬜ Create `Combobox.types.ts` with TypeScript interfaces
4. ⬜ Implement `Combobox.tsx` (core component logic)
5. ⬜ Create `Combobox.stories.tsx` (Storybook documentation)
6. ⬜ Write `Combobox.test.tsx` (unit + integration tests)
7. ⬜ Write `Combobox.a11y.test.tsx` (accessibility tests)
8. ⬜ Verify all tests pass and coverage > 80%
9. ⬜ Open pull request for review
10. ⬜ Merge to main; prepare release

---

**Ready to start?** Run `/speckit.tasks` to generate a detailed task breakdown with dependencies and time estimates.
