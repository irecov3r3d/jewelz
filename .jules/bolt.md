## 2024-03-24 - React Re-renders on Keystrokes
**Learning:** In `app/page.tsx`, the `Home` component houses both the input for the "objective" and two lists (Thought Stream and Shell Activity). Typing in the `objective` input updates its state on every keystroke, causing the entire `Home` component to re-render, including all items in the two lists. This is a classic O(N) re-render issue on a keystroke path.
**Action:** Extract list items into memoized components (using `React.memo`) to break the re-render chain, ensuring that typing only re-renders the input, not the unbounded lists.
