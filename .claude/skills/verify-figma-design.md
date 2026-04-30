# Skill: verify-figma-design

**When to run:** After implementing any component, before marking the task complete.

---

## Purpose

Systematically compare the implemented component against its Figma source to
catch visual and behavioural regressions before the work is considered done.
Any discrepancy must be logged — this skill does not silently pass.

---

## Trigger

Run this skill when:
- A component implementation is complete (all five files written)
- A component has been modified and the change touches visual output

---

## Prerequisites

- The `figma-design-context` skill must have been run first. Its output
  (the design context summary) is the baseline for this verification.
- The component must be renderable (TypeScript compiles, no import errors).

---

## Steps

1. **Re-read the design context summary** produced by `figma-design-context`.
   This is your checklist baseline.

2. **Audit the implementation against the baseline**, checking each dimension:

   ### 2a. Token compliance
   - Every Tailwind class in the component maps to a design token. No arbitrary
     values, no hard-coded colours.
   - Token names exactly match the Figma variable names recorded in step 1.

   ### 2b. Visual structure
   - Layer hierarchy in the rendered output matches the Figma layer structure.
   - Sub-components (compound parts) exist and are exported correctly.
   - Spacing (gap, padding, margin) uses token-mapped utilities.
   - Border radius, shadow, and other decorative properties use token utilities.

   ### 2c. States
   For each state recorded in the design context (default, hover, focus,
   disabled, error, loading):
   - The state is implemented and visually testable.
   - The correct token is applied per state (e.g. `bg-accent-hover` on hover).
   - Disabled state is communicated via `aria-disabled` and visual token, not
     just reduced opacity.

   ### 2d. Typography
   - Font size, weight, and line-height use token utilities.
   - No inline `style` overrides for typography.

   ### 2e. Accessibility
   - Correct ARIA role(s) present.
   - Keyboard interactions implemented (Tab, Enter, Space, arrows as applicable).
   - Focus indicator visible and meets WCAG 2.1 AA contrast.
   - `aria-label`, `aria-labelledby`, or visible label present where required.

   ### 2f. API compliance
   - All props defined in the spec's props table are present in the component.
   - No props from an existing component have been removed.
   - Controlled and uncontrolled modes both work if state is involved.

3. **Produce a verification report** in this format:

   ```
   ## Verification Report — [ComponentName]

   Date: <timestamp>
   Figma node: <node ID>

   | Dimension          | Status | Notes |
   |--------------------|--------|-------|
   | Token compliance   | PASS / FAIL | |
   | Visual structure   | PASS / FAIL | |
   | States             | PASS / FAIL | |
   | Typography         | PASS / FAIL | |
   | Accessibility      | PASS / FAIL | |
   | API compliance     | PASS / FAIL | |

   ### Discrepancies
   [List each FAIL item with: what was expected vs what was found, and the
   recommended fix. If all PASS, write "None".]
   ```

4. **If any dimension is FAIL:**
   - Write the full verification report to
     `src/components/ui/ComponentName/VERIFICATION.md`.
   - Do not mark the task complete.
   - Fix each discrepancy, then re-run this skill from step 2.

5. **If all dimensions PASS:**
   - State "Verification passed — all dimensions match Figma source" in the
     response.
   - The task may be marked complete.
   - Do not write a `VERIFICATION.md` file for a clean pass (no noise in clean
     components).

---

## Escalation

If a discrepancy cannot be resolved automatically (e.g. the Figma design is
ambiguous, or a required token does not exist in the codebase), stop and report
to the user rather than making a judgement call. State what was found, what
is ambiguous, and what options exist. Do not proceed silently.
