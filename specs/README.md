# Specs — Spec-Driven Development in Aurora

This folder contains component specs. Every new component starts here, not in
code.

---

## What is Spec-Driven Development (SDD)?

SDD is a workflow where the full design contract for a component is written
*before* any code is produced. The spec becomes the single source of truth that
the agent, the developer, and the reviewer all work from. It eliminates
ambiguity, prevents scope creep, and makes verification objective.

**Why Aurora uses SDD:**
- Design tokens must match Figma exactly — a spec forces that mapping to be
  explicit before implementation.
- Components need to meet WCAG 2.1 AA — a spec makes accessibility requirements
  a first-class constraint, not an afterthought.
- The compound-component and controlled/uncontrolled patterns require deliberate
  API design — a spec surfaces these decisions early, when they are cheap to
  change.
- Acceptance criteria in the spec become the basis for unit tests, making test
  coverage structural rather than optional.

---

## Full SDD Workflow

```
1. Write spec using specs/templates/component-spec.md
   → Copy to specs/[ComponentName].md
   → Fill in every section: tokens, props, states, ARIA, acceptance criteria
        ↓
2. Run figma-use skill (.claude/skills/figma-use.md)
   → Loads critical rules that apply to every Figma MCP operation
   → Must be loaded before any other Figma skill runs
        ↓
3. Run figma-implement-design skill (.claude/skills/figma-implement-design.md)
   → Fetches design context, tokens, and screenshot directly from Figma via MCP
   → Validates all token names against src/styles/tokens.css
   → Outputs a structured design context summary
        ↓
4. Implement component across all 5 required files
   → index.ts, ComponentName.tsx, ComponentName.stories.tsx,
     ComponentName.test.tsx, ComponentName.types.ts
   → Located at src/components/ui/[ComponentName]/
        ↓
5. Run verify-figma-design skill (.claude/skills/verify-figma-design.md)
   → Opens Storybook via Playwright, takes screenshots of all states
   → Compares rendered output against the Figma reference screenshot
   → Checks token compliance, visual structure, states, typography,
     accessibility, and API completeness
   → Produces VERIFICATION.md inside the component folder if any dimension fails
        ↓
6. Human reviews VERIFICATION.md and component output
   → VERIFICATION.md should be absent on a clean pass
   → Run npm test to check acceptance criteria coverage
   → Smoke-test in Storybook (npm run storybook) across all variants
   → Approve or request changes
```

---

## How CLAUDE.md Guardrails and Skills Work Together

`CLAUDE.md` at the repo root defines **standing rules** that apply to every
agent action in this repository — token discipline, file structure, API
contracts, accessibility requirements. It is read before any component work
begins.

The skills in `.claude/skills/` define **procedural steps** for specific
moments in the workflow:

| File | Role | When it runs |
|---|---|---|
| `CLAUDE.md` | Guardrail — governs all agent behaviour at all times | Always |
| `.claude/skills/figma-use.md` | Official Figma skill — critical rules for all Figma MCP operations | Before any Figma skill |
| `.claude/skills/figma-implement-design.md` | Official Figma skill — fetches design context, tokens, screenshot | Before implementing |
| `.claude/skills/figma-code-connect-components.md` | Official Figma skill — maps Figma components to code | When setting up Code Connect |
| `.claude/skills/verify-figma-design.md` | Custom skill — visual verification via Playwright + Storybook | After implementing |

The guardrails enforce *what* is always true (no raw hex, correct file
structure, WCAG AA). The official Figma skills handle Figma MCP operations
reliably. The custom `verify-figma-design` skill extends the official workflow
with Playwright screenshot comparison in Storybook.

---

## How to Use the Template for a New Component

1. **Get the Figma details.**
   Open the component in Figma, right-click → "Copy link". Extract the file URL
   and the `node-id` parameter from the link.

2. **Create the spec file.**
   ```
   cp specs/templates/component-spec.md specs/[ComponentName].md
   ```

3. **Fill in every section.**
   Required fields: name + purpose, Figma source, token requirements, props
   table, states, accessibility, acceptance criteria. Do not leave required
   fields blank — ambiguity at spec time becomes bugs at implementation time.

4. **Kick off implementation** with this exact prompt format:

   ```
   Implement a [ComponentName] component. Figma URL: <file-url>, Node ID: <node-id>
   ```

   The agent will:
   - Read `CLAUDE.md`
   - Check `specs/[ComponentName].md`
   - Load `figma-use` then run `figma-implement-design`
   - Implement all five component files
   - Run `verify-figma-design`
   - Report any discrepancies before closing

5. **Review the output.**
   - If `VERIFICATION.md` exists in the component folder, review the logged
     discrepancies and confirm they have been resolved or accepted.
   - Run `npm test` to execute the generated unit tests.
   - Smoke-test in Storybook (`npm run storybook`) across all variants.

---

## Folder Structure

```
specs/
  README.md                          ← this file
  templates/
    component-spec.md                ← blank template — copy, never edit in place
  [ComponentName].md                 ← one spec per component
```

---

*Aurora Design System — SDD infrastructure v1.1 (official Figma skills integrated)*
