import { RefObject, useEffect, useMemo, useState } from 'react';

type UseInViewOptions = {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number | number[];
	enabled?: boolean;
};

const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Tracks whether `ref` intersects `root` via IntersectionObserver. Returns `null` until the first observation, letting callers distinguish "not yet observed" from "observed and not in view". With reduced motion the hook stays at `null` so callers fall back to the "pre-observation" branch (typically a static visible state via CSS). */
export const useInView = (
	ref: RefObject<Element | null>,
	options: UseInViewOptions = {},
): boolean | null => {
	const {
		root = null,
		rootMargin = '0px',
		threshold = 0,
		enabled = true,
	} = options;
	const [inView, setInView] = useState<boolean | null>(null);

	// stable key so callers can pass array literals without retriggering effect each render
	const thresholdKey = useMemo(
		() => (Array.isArray(threshold) ? threshold.join(',') : String(threshold)),
		[threshold],
	);

	useEffect(() => {
		if (!enabled) return;
		if (prefersReducedMotion()) return;
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ root, rootMargin, threshold },
		);
		observer.observe(el);

		return () => observer.disconnect();
		// threshold tracked via thresholdKey
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref, root, rootMargin, thresholdKey, enabled]);

	return inView;
};
