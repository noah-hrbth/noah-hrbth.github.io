# Fix Linter Errors — Design Spec

## Goal

Resolve all ESLint errors/warnings and TypeScript build errors in the portfolio codebase cleanly and safely, with no behavior changes.

## Current State

- **ESLint:** 8 errors + 1 warning across 3 files
- **TypeScript build (`tsc -b`):** 1 error from `@vitejs/plugin-react` type declarations incompatible with TS 5.5.3

## Approach

**Fix ESLint first, then upgrade TypeScript.** Each phase is independently verifiable.

---

## Phase 1: ESLint Fixes

### 1a. `src/contexts/NavigationContext.tsx` — ref accessed during render

**Rule:** `react-hooks/refs` (2 errors: lines 25, 26)

**Problem:** `prevLocationRef` is read and written inline during render to detect location changes.

**Fix:** Move the ref comparison into a `useEffect` depending on `location`:

```tsx
useEffect(() => {
  if (prevLocationRef.current !== location) {
    prevLocationRef.current = location;
    setUrlChanged(true);
  }
}, [location]);
```

**Behavior impact:** `urlChanged` becomes `true` one render tick later. No consumer reads it synchronously during that render, so the observable behavior is equivalent.

### 1b. `src/components/Header/Header.tsx` — ref accessed during render

**Rule:** `react-hooks/refs` (2 errors: lines 85, 86)

**Problem:** Same pattern as 1a — `prevLocationRef` read/written during render to close the desktop menu on navigation.

**Fix:** Move to `useEffect` on `location`:

```tsx
useEffect(() => {
  if (prevLocationRef.current !== location) {
    prevLocationRef.current = location;
    if (isDesktopMenuOpen) {
      setIsDesktopMenuOpen(false);
    }
  }
}, [location, isDesktopMenuOpen]);
```

**Behavior impact:** Menu close happens after render rather than during. The menu is conditionally rendered based on state, so the close takes effect on the next render cycle — functionally identical to the user.

### 1c. `src/components/Cursor/Cursor.tsx` — two issues

#### Missing dependency (1 warning, line 37)

**Rule:** `react-hooks/exhaustive-deps`

**Problem:** `handleMouseHover` is defined outside the `useEffect` but used inside it, creating a missing dependency.

**Fix:** Inline the function body directly into the `useEffect` callback. This eliminates the external function and the dependency warning.

#### `any` types (4 errors, lines 58–59)

**Rules:** `@typescript-eslint/no-explicit-any` (2), `@typescript-eslint/no-unsafe-assignment` (2)

**Problem:** `useMousePosition` hook types the event parameter as `{ clientX: any; clientY: any }`.

**Fix:** Change parameter type to `MouseEvent`. This is the correct DOM event type and resolves all four errors.

### Phase 1 Verification

After all fixes: run `npx eslint .` and confirm 0 errors, 0 warnings.

---

## Phase 2: TypeScript Upgrade

**Problem:** TypeScript 5.5.3 cannot parse the `"module.exports"` export syntax in `@vitejs/plugin-react` v5.x type declarations. Vite 7 + plugin-react 5 require TS ~5.7+.

**Fix:** `npm install typescript@latest --save-dev` (upgrades to latest 5.x, currently 5.8).

**tsconfig changes:** None required. Current settings (`target: ES2022`, `module: ESNext`, `strict: true`) are forward-compatible.

**Risk:** Newer TS can surface type errors the old version missed. If new errors appear, they are fixed as part of this phase.

### Phase 2 Verification

After upgrade: run `tsc -b` and `eslint .` to confirm both pass clean.

---

## Files Modified

| File | Change |
|------|--------|
| `src/contexts/NavigationContext.tsx` | Move ref check to `useEffect` |
| `src/components/Header/Header.tsx` | Move ref check to `useEffect` |
| `src/components/Cursor/Cursor.tsx` | Inline effect body; type event as `MouseEvent` |
| `package.json` | TypeScript version bump |
| `package-lock.json` | Updated lockfile |

## Out of Scope

- Stylelint is installed but unconfigured — not addressed here.
- Prettier formatting — not addressed unless touched files need it.
- Any feature or refactoring work beyond what's needed to resolve linter errors.
