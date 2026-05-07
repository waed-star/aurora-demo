# Aurora Design System Demo

A React 19 + TypeScript component library built with design tokens, Tailwind CSS v4, and Radix UI primitives. Components are developed and documented in Storybook.

## Getting started

```bash
npm install
npm run dev        # Opens Storybook at localhost:6006
npm test           # Run component tests
npm run build-storybook  # Build static Storybook site
```

## Building a component from a Figma design

This design system uses Claude Code's `/figma-quick-component` skill to turn a Figma frame into a production-ready component. The agent follows a spec-driven pipeline — it generates planning artifacts before writing any code, so you can review and redirect before implementation begins.

### How it works

The skill is designed around two principles: **rich context upfront** and **agentic verification at the end**.

**1. SpecKit for high-quality specs**
Before writing a single line of component code, the agent runs two SpecKit commands:

- `speckit.specify` → produces `spec.md` (user scenarios, functional requirements) and `checklists/requirements.md` (completion checklist)
- `speckit.plan` → produces `plan.md` (technical approach, token mapping) and `data-model.md` (TypeScript props interface, CVA variant shape)

These four files are the contract. Implementation is hard-blocked until all four exist and have substantive content. This is context engineering in practice: the more precisely the spec defines what to build, the less back-and-forth is needed during implementation — the model has everything it needs to make the right call every time.

**2. Skips `speckit.tasks` and `speckit.implement`**
The full SpecKit pipeline has two more commands — `tasks` (breaks work into a numbered task list) and `implement` (runs through them one by one). This skill intentionally skips both. For a single UI component, generating a granular task list and then re-reading it on every step burns context unnecessarily without adding quality. The implementation goes straight from the four spec files to writing all five component files in a single parallel batch.

**3. Designed for teams, not just individuals**
The skill is a slash command (`/figma-quick-component`) — engineers invoke it with one word, no prompt-writing required. This keeps results consistent across every engineer and every team using the design system: the same spec structure, the same implementation rules, the same verification steps, every time. When the process needs to change (new token, new Radix primitive, updated constitution rule), you update the skill file once and every future run picks it up.

**4. Agentic visual verification**
Once the component is written, the agent doesn't just run a type-check and stop. It:

1. Starts Storybook in the background
2. Opens the component's Storybook stories in a browser
3. Navigates through each variant story, taking a screenshot of each
4. Checks every screenshot against the spec — spacing, colours, radius, states, overflow
5. If anything looks wrong (blank render, visual mismatch, console error) — it fixes the component and re-verifies before reporting complete

---

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

**Demo recordings**

- [Navbar component](https://1drv.ms/v/c/cc39a0b7dbfc17ac/IQAduYUd8pXuRaKRiCNl_jxHAaoTMy5uxFm5SMWxqGsjFOg?e=kQmZIj) — Full run from Figma URL to verified component. From **5:29**, watch the agent take control of Storybook, switch between variants, take screenshots, and self-correct until every story passes.
- [Search section component](https://1drv.ms/v/c/cc39a0b7dbfc17ac/IQBHxGEhTZoRSLHCd8oUCv0LAamFk4kySg4zxpEqBZWyyKs?e=JlGSHp) — Another end-to-end example showing the same pipeline on a more complex component.

## Themed products

This design system is built to power multiple products from a single component library. Every component uses semantic design tokens (`bg-surface`, `text-ink`, `border-accent`, etc.) rather than hardcoded values — swapping a theme changes the entire product's look without touching component code.

Storybook ships with a theme and brand switcher in the toolbar, so you can preview any component across all supported themes in one place.

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
