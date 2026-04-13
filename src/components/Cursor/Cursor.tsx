import { useEffect, useRef, useState, type ReactElement } from 'react';
import './Cursor.scss';

const FINE_POINTER_QUERY = '(pointer: fine)';
const HOVER_SELECTOR = 'a, button';
const HOVER_CLASS = 'cursor--hover';

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

/** Custom circular cursor follower for desktop (fine-pointer) devices. */
const Cursor = (): ReactElement | null => {
	const isFinePointer = useIsFinePointer();
	const cursorRef = useRef<HTMLDivElement>(null);
	const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const rafIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!isFinePointer) return;

		const applyTransform = (): void => {
			rafIdRef.current = null;
			const el = cursorRef.current;
			if (!el) return;
			const { x, y } = targetPosRef.current;
			el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		};

		const handleMouseMove = (event: MouseEvent): void => {
			targetPosRef.current = { x: event.clientX, y: event.clientY };
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(applyTransform);
			}
		};

		const isHoverTarget = (target: EventTarget | null): boolean => {
			if (!(target instanceof Element)) return false;
			return target.closest(HOVER_SELECTOR) !== null;
		};

		const handlePointerOver = (event: PointerEvent): void => {
			if (isHoverTarget(event.target)) {
				cursorRef.current?.classList.add(HOVER_CLASS);
			}
		};

		const handlePointerOut = (event: PointerEvent): void => {
			if (isHoverTarget(event.target)) {
				cursorRef.current?.classList.remove(HOVER_CLASS);
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('pointerover', handlePointerOver);
		document.addEventListener('pointerout', handlePointerOut);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('pointerover', handlePointerOver);
			document.removeEventListener('pointerout', handlePointerOut);
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
