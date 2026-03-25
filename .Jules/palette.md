# Palette's Journal

*Only add entries for CRITICAL UX/accessibility learnings.*


## 2025-03-03 - Form Submission UX and Accessibility
**Learning:** Adding loading states to auth forms isn't just about the spinner; disabling inputs, applying `aria-disabled`, and wrapping error messages with `role="alert" aria-live="polite"` makes the experience dramatically better for screen readers, preventing confusion during async delays. The use of Tailwind's `disabled:` pseudo-class cleanly manages visual state without extra class logic.
**Action:** Always map disabled states across all interactive elements in a form (both the submit button and inputs) when an async operation is pending. Always provide an explicit or screen-reader only (`sr-only`) `<label>` for placeholder-only inputs.
