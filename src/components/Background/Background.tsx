import React, { useEffect, useRef } from 'react';
import { useBlobColors } from '../../contexts/BlobColorsContext';
import './Background.scss';

const Background: React.FC = () => {
	const interBubbleRef = useRef<HTMLDivElement>(null);
	const cornerOrbitRef = useRef<HTMLDivElement>(null);
	const { colors } = useBlobColors();

	useEffect(() => {
		const interBubble = interBubbleRef.current;
		if (!interBubble) return;

		let curX = 0;
		let curY = 0;
		let tgX = 0;
		let tgY = 0;

		const move = () => {
			curX += (tgX - curX) / 20;
			curY += (tgY - curY) / 20;

			if (interBubble) {
				interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
			}

			requestAnimationFrame(move);
		};

		const handleMouseMove = (event: MouseEvent) => {
			tgX = event.clientX;
			tgY = event.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);
		move();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	useEffect(() => {
		const orbitEl = cornerOrbitRef.current;
		if (!orbitEl) return;

		const updateCornerOrigin = () => {
			const toggle = document.querySelector(
				'.terminal-input__corner-toggle',
			) as HTMLElement | null;
			if (!toggle) return;
			const rect = toggle.getBoundingClientRect();
			// Anchor at the toggle's bottom-left corner
			orbitEl.style.left = `${rect.left}px`;
			orbitEl.style.top = `${rect.bottom}px`;
		};

		updateCornerOrigin();
		window.addEventListener('resize', updateCornerOrigin);
		// Reflow guard: re-calc shortly after mount to account for layout animations
		const timeoutId = window.setTimeout(updateCornerOrigin, 600);

		return () => {
			window.removeEventListener('resize', updateCornerOrigin);
			window.clearTimeout(timeoutId);
		};
	}, []);

	useEffect(() => {
		document.documentElement.style.setProperty('--color1', colors.color1);
		document.documentElement.style.setProperty('--color2', colors.color2);
		document.documentElement.style.setProperty('--color3', colors.color3);
		document.documentElement.style.setProperty('--color4', colors.color4);
		document.documentElement.style.setProperty('--color5', colors.color5);
		document.documentElement.style.setProperty(
			'--color-interactive',
			colors.colorInteractive,
		);
	}, [colors]);

	return (
		<div className='gradient-bg'>
			<svg xmlns='http://www.w3.org/2000/svg'>
				<defs>
					<filter id='goo'>
						<feGaussianBlur
							in='SourceGraphic'
							stdDeviation='10'
							result='blur'
						/>
						<feColorMatrix
							in='blur'
							mode='matrix'
							values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8'
							result='goo'
						/>
						<feBlend in='SourceGraphic' in2='goo' />
					</filter>
				</defs>
			</svg>
			<div className='gradients-container'>
				<div className='g1'></div>
				<div className='g2'></div>
				<div className='g3'></div>
				<div className='g4'></div>
				<div className='g5'></div>
				<div className='g-corner-orbit' ref={cornerOrbitRef} aria-hidden>
					<div className='g-corner'></div>
				</div>
				<div className='interactive' ref={interBubbleRef}></div>
			</div>
		</div>
	);
};

export default Background;
