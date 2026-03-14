# Fix Linter Errors Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all ESLint errors/warnings and TypeScript build errors with no behavior changes.

**Architecture:** Fix ESLint issues in user code first (3 files), verify clean, then upgrade TypeScript to resolve build errors from dependency type declarations.

**Tech Stack:** React 19, TypeScript, Vite 7, ESLint 9

**Spec:** `docs/superpowers/specs/2026-03-14-fix-linter-errors-design.md`

---

## Chunk 1: ESLint Fixes and TypeScript Upgrade

### File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/contexts/NavigationContext.tsx` | Modify | Add `useEffect` import; move ref logic to effect |
| `src/components/Header/Header.tsx` | Modify | Move ref logic to `useEffect` |
| `src/components/Cursor/Cursor.tsx` | Modify | Inline handlers into effect; fix `MouseEvent` type |
| `package.json` | Modify (auto) | TypeScript version bump via npm |
| `package-lock.json` | Modify (auto) | Lockfile update via npm |

---

### Task 1: Fix `NavigationContext.tsx` — ref during render

**Files:**
- Modify: `src/contexts/NavigationContext.tsx:2` (add `useEffect` to import)
- Modify: `src/contexts/NavigationContext.tsx:24-28` (replace inline ref logic with `useEffect`)

- [ ] **Step 1: Add `useEffect` to import**

In `src/contexts/NavigationContext.tsx`, change line 2 from:

```tsx
import React, { createContext, useState, useContext, useRef } from 'react';
```

to:

```tsx
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
```

- [ ] **Step 2: Replace inline ref logic with `useEffect`**

In `src/contexts/NavigationContext.tsx`, replace lines 24-28:

```tsx
	const prevLocationRef = useRef(location);
	if (prevLocationRef.current !== location) {
		prevLocationRef.current = location;
		setUrlChanged(true);
	}
```

with:

```tsx
	const prevLocationRef = useRef(location);
	useEffect(() => {
		if (prevLocationRef.current !== location) {
			prevLocationRef.current = location;
			setUrlChanged(true);
		}
	}, [location]);
```

- [ ] **Step 3: Verify**

Run: `npx eslint src/contexts/NavigationContext.tsx`
Expected: 0 errors, 0 warnings (the existing `eslint-disable react-refresh/only-export-components` comment on line 1 is unrelated and should remain)

- [ ] **Step 4: Commit**

```bash
git add src/contexts/NavigationContext.tsx
git commit -m "fix: move ref check to useEffect in NavigationContext"
```

---

### Task 2: Fix `Header.tsx` — ref during render

**Files:**
- Modify: `src/components/Header/Header.tsx:84-90` (replace inline ref logic with `useEffect`)

- [ ] **Step 1: Replace inline ref logic with `useEffect`**

In `src/components/Header/Header.tsx`, replace lines 84-90:

```tsx
	const prevLocationRef = useRef(location);
	if (prevLocationRef.current !== location) {
		prevLocationRef.current = location;
		if (isDesktopMenuOpen) {
			setIsDesktopMenuOpen(false);
		}
	}
```

with:

```tsx
	const prevLocationRef = useRef(location);
	useEffect(() => {
		if (prevLocationRef.current !== location) {
			prevLocationRef.current = location;
			if (isDesktopMenuOpen) {
				setIsDesktopMenuOpen(false);
			}
		}
	}, [location, isDesktopMenuOpen]);
```

Note: `useEffect` is already imported on line 11. No import change needed.

- [ ] **Step 2: Verify**

Run: `npx eslint src/components/Header/Header.tsx`
Expected: 0 errors, 0 warnings

- [ ] **Step 3: Commit**

```bash
git add src/components/Header/Header.tsx
git commit -m "fix: move ref check to useEffect in Header"
```

---

### Task 3: Fix `Cursor.tsx` — missing dependency + `any` types

**Files:**
- Modify: `src/components/Cursor/Cursor.tsx:10-37` (inline all handlers into `useEffect`)
- Modify: `src/components/Cursor/Cursor.tsx:58` (fix `MouseEvent` type)

- [ ] **Step 1: Inline handlers into `useEffect`**

In `src/components/Cursor/Cursor.tsx`, replace lines 10-37 (the three handler functions + useEffect):

```tsx
	const handleMouseEnter = () => {
		cursorRef.current?.classList.add('cursor--hover');
	};

	const handleMouseLeave = () => {
		cursorRef.current?.classList.remove('cursor--hover');
	};

	const handleMouseHover = () => {
		setTimeout(() => {
			const allLinks = document.querySelectorAll('a');
			const allButtons = document.querySelectorAll('button');

			allLinks.forEach((link) => {
				link.addEventListener('mouseenter', handleMouseEnter);
				link.addEventListener('mouseleave', handleMouseLeave);
			});

			allButtons.forEach((button) => {
				button.addEventListener('mouseenter', handleMouseEnter);
				button.addEventListener('mouseleave', handleMouseLeave);
			});
		});
	};

	useEffect(() => {
		handleMouseHover();
	}, [urlChanged]);
```

with:

```tsx
	useEffect(() => {
		setTimeout(() => {
			const handleMouseEnter = () => {
				cursorRef.current?.classList.add('cursor--hover');
			};
			const handleMouseLeave = () => {
				cursorRef.current?.classList.remove('cursor--hover');
			};

			const allLinks = document.querySelectorAll('a');
			const allButtons = document.querySelectorAll('button');

			allLinks.forEach((link) => {
				link.addEventListener('mouseenter', handleMouseEnter);
				link.addEventListener('mouseleave', handleMouseLeave);
			});
			allButtons.forEach((button) => {
				button.addEventListener('mouseenter', handleMouseEnter);
				button.addEventListener('mouseleave', handleMouseLeave);
			});
		});
	}, [urlChanged]);
```

- [ ] **Step 2: Fix `MouseEvent` type**

In `src/components/Cursor/Cursor.tsx`, in the `useMousePosition` hook, change:

```tsx
		const updateMousePosition = (ev: { clientX: any; clientY: any }) => {
```

to:

```tsx
		const updateMousePosition = (ev: MouseEvent) => {
```

- [ ] **Step 3: Verify**

Run: `npx eslint src/components/Cursor/Cursor.tsx`
Expected: 0 errors, 0 warnings

- [ ] **Step 4: Commit**

```bash
git add src/components/Cursor/Cursor.tsx
git commit -m "fix: inline effect handlers and fix MouseEvent type in Cursor"
```

---

### Task 4: Verify Phase 1 — all ESLint clean

- [ ] **Step 1: Run full ESLint**

Run: `npx eslint .`
Expected: 0 errors, 0 warnings (clean exit code 0)

If any new issues appear, fix them before proceeding.

---

### Task 5: Upgrade TypeScript

**Files:**
- Modify (auto): `package.json` — TypeScript version
- Modify (auto): `package-lock.json` — lockfile

- [ ] **Step 1: Upgrade TypeScript**

Run: `npm install typescript@latest --save-dev`
Expected: TypeScript upgrades to 5.8.x

- [ ] **Step 2: Verify TypeScript build**

Run: `npx tsc -b`
Expected: Clean exit (no errors). The `@vitejs/plugin-react` type declaration error should be resolved.

- [ ] **Step 3: Verify ESLint still clean**

Run: `npx eslint .`
Expected: 0 errors, 0 warnings

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: upgrade TypeScript to 5.8 for Vite 7 compatibility"
```

---

### Task 6: Final verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Clean exit — both `tsc -b` and `vite build` succeed.

- [ ] **Step 2: Run dev server smoke test**

Run: `npm run dev`
Expected: Dev server starts without errors. Verify no console errors in terminal output. Kill the server after confirming.
