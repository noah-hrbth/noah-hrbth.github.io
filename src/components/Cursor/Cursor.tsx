import { useEffect, useRef, useState, type ReactElement } from 'react';
import './Cursor.scss';

const FINE_POINTER_QUERY = '(pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const HOVER_SELECTOR = 'a, button';
const HOVER_CLASS = 'cursor--hover';
const BASE_SIZE = 25;
const SNAP_PADDING = 6;
const MIN_SNAP_SIZE = 32;
const MIN_SNAP_RADIUS = 8;
const LERP_FACTOR = 0.22;
const SETTLE_EPSILON = 0.5;

type Point = { x: number; y: number };

const useIsFinePointer = (): boolean => {
	const [isFinePointer, setIsFinePointer] = useState<boolean>(() => {
		if (typeof window === 'undefined' || !window.matchMedia) return false;
		return window.matchMedia(FINE_POINTER_QUERY).matches;
	});

	useEffect(() => {
		if (typeof window === 'undefined' || !window.matchMedia) return;

		const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
		const handleChange = (event: MediaQueryListEvent): void => {
			setIsFinePointer(event.matches);
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	return isFinePointer;
};

const parseFirstRadius = (borderRadius: string): number => {
	const first = borderRadius.split(' ')[0];
	const parsed = Number.parseFloat(first);
	return Number.isFinite(parsed) ? parsed : 0;
};

const prefersReducedMotion = (): boolean => {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

/** Custom magnetic-snap cursor for desktop (fine-pointer) devices. */
const Cursor = (): ReactElement | null => {
	const isFinePointer = useIsFinePointer();
	const cursorRef = useRef<HTMLDivElement>(null);
	const targetPosRef = useRef<Point>({ x: 0, y: 0 });
	const visualPosRef = useRef<Point>({ x: 0, y: 0 });
	const hoveredElementRef = useRef<Element | null>(null);
	const hoveredRadiusRef = useRef<number>(0);
	const wasSnappedRef = useRef<boolean>(false);
	const isAnimatingRef = useRef<boolean>(false);
	const rafIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!isFinePointer) return;

		const lerpFactor = prefersReducedMotion() ? 1 : LERP_FACTOR;

		const applySnapStyles = (el: HTMLDivElement, rect: DOMRect): Point => {
			const width = Math.max(rect.width + SNAP_PADDING * 2, MIN_SNAP_SIZE);
			const height = Math.max(rect.height + SNAP_PADDING * 2, MIN_SNAP_SIZE);
			const radius =
				Math.max(hoveredRadiusRef.current, MIN_SNAP_RADIUS) + SNAP_PADDING;

			const widthPx = `${width}px`;
			const heightPx = `${height}px`;
			const radiusPx = `${radius}px`;
			if (el.style.width !== widthPx) el.style.width = widthPx;
			if (el.style.height !== heightPx) el.style.height = heightPx;
			if (el.style.borderRadius !== radiusPx) el.style.borderRadius = radiusPx;

			return {
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2,
			};
		};

		const resetSnapStyles = (el: HTMLDivElement): void => {
			el.style.width = `${BASE_SIZE}px`;
			el.style.height = `${BASE_SIZE}px`;
			el.style.borderRadius = '50%';
		};

		const computeTarget = (el: HTMLDivElement): Point => {
			const hovered = hoveredElementRef.current;
			if (hovered && document.contains(hovered)) {
				wasSnappedRef.current = true;
				return applySnapStyles(el, hovered.getBoundingClientRect());
			}
			if (hovered) {
				hoveredElementRef.current = null;
				el.classList.remove(HOVER_CLASS);
			}
			if (wasSnappedRef.current) {
				resetSnapStyles(el);
				wasSnappedRef.current = false;
			}
			return targetPosRef.current;
		};

		const scheduleFrame = (): void => {
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(tick);
			}
		};

		const tick = (): void => {
			rafIdRef.current = null;
			const el = cursorRef.current;
			if (!el) return;

			const target = computeTarget(el);

			if (isAnimatingRef.current) {
				const dx = target.x - visualPosRef.current.x;
				const dy = target.y - visualPosRef.current.y;
				if (Math.abs(dx) < SETTLE_EPSILON && Math.abs(dy) < SETTLE_EPSILON) {
					visualPosRef.current = { x: target.x, y: target.y };
					isAnimatingRef.current = false;
				} else {
					visualPosRef.current = {
						x: visualPosRef.current.x + dx * lerpFactor,
						y: visualPosRef.current.y + dy * lerpFactor,
					};
					scheduleFrame();
				}
			} else {
				visualPosRef.current = { x: target.x, y: target.y };
			}

			el.style.translate = `${visualPosRef.current.x}px ${visualPosRef.current.y}px`;
		};

		const handlePointerMove = (event: PointerEvent): void => {
			targetPosRef.current = { x: event.clientX, y: event.clientY };
			const hovered = hoveredElementRef.current;
			if (hovered) {
				if (document.contains(hovered)) return;
				// Stale ref (e.g. router replaced the link's DOM node after
				// navigation): force a tick so computeTarget can unsnap.
				isAnimatingRef.current = true;
				scheduleFrame();
				return;
			}
			if (isAnimatingRef.current) return;
			scheduleFrame();
		};

		const findHoverTarget = (target: EventTarget | null): Element | null => {
			if (!(target instanceof Element)) return null;
			return target.closest(HOVER_SELECTOR);
		};

		const handlePointerOver = (event: PointerEvent): void => {
			const match = findHoverTarget(event.target);
			if (!match) return;
			if (hoveredElementRef.current === match) return;
			const related = event.relatedTarget;
			if (related instanceof Node && match.contains(related)) return;
			hoveredElementRef.current = match;
			hoveredRadiusRef.current = parseFirstRadius(
				getComputedStyle(match).borderRadius,
			);
			cursorRef.current?.classList.add(HOVER_CLASS);
			isAnimatingRef.current = true;
			scheduleFrame();
		};

		const handlePointerOut = (event: PointerEvent): void => {
			const match = findHoverTarget(event.target);
			if (!match || hoveredElementRef.current !== match) return;
			const related = event.relatedTarget;
			if (related instanceof Node && match.contains(related)) return;
			hoveredElementRef.current = null;
			cursorRef.current?.classList.remove(HOVER_CLASS);
			isAnimatingRef.current = true;
			scheduleFrame();
		};

		// Re-run tick after a click: navigation or layout shifts may invalidate
		// the snapped target's rect, so we need to re-read or clean up.
		const handleClick = (): void => {
			if (hoveredElementRef.current) {
				isAnimatingRef.current = true;
				scheduleFrame();
			}
		};

		const handleViewportChange = (): void => {
			if (hoveredElementRef.current) scheduleFrame();
		};

		window.addEventListener('pointermove', handlePointerMove, {
			passive: true,
		});
		document.addEventListener('pointerover', handlePointerOver);
		document.addEventListener('pointerout', handlePointerOut);
		document.addEventListener('click', handleClick);
		window.addEventListener('scroll', handleViewportChange, {
			passive: true,
			capture: true,
		});
		window.addEventListener('resize', handleViewportChange);

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerover', handlePointerOver);
			document.removeEventListener('pointerout', handlePointerOut);
			document.removeEventListener('click', handleClick);
			window.removeEventListener('scroll', handleViewportChange, {
				capture: true,
			});
			window.removeEventListener('resize', handleViewportChange);
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [isFinePointer]);

	if (!isFinePointer) return null;

	return <div className='cursor' ref={cursorRef} />;
};

export default Cursor;
