import { useCallback, useRef } from 'react';

const MAX_ROTATION = 6;
const PERSPECTIVE = 800;

/** Returns mouse handlers that apply a subtle 3D tilt effect directly on the target element. */
export const useTilt = (): {
	handleMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
	handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
	handleMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
} => {
	const rafId = useRef<number>(0);
	const rectRef = useRef<DOMRect | null>(null);

	const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
		rectRef.current = e.currentTarget.getBoundingClientRect();
	}, []);

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
		cancelAnimationFrame(rafId.current);

		const el = e.currentTarget;

		rafId.current = requestAnimationFrame(() => {
			if (rectRef.current === null) {
				rectRef.current = el.getBoundingClientRect();
			}
			const rect = rectRef.current;

			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;

			const rotateY = (x - 0.5) * 2 * MAX_ROTATION;
			const rotateX = (0.5 - y) * 2 * MAX_ROTATION;

			el.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
		});
	}, []);

	const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
		cancelAnimationFrame(rafId.current);
		rectRef.current = null;
		const el = e.currentTarget;
		el.style.transform = '';
	}, []);

	return { handleMouseEnter, handleMouseMove, handleMouseLeave };
};
