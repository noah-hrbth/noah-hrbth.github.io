import { useRef } from 'react';
import './SpotlightEffect.scss';

import { ReactNode } from 'react';

interface SpotlightEffectProps {
	children: ReactNode;
	className?: string;
	spotlightColor?: string;
}

const SpotlightEffect = ({
	children,
	className = '',
	spotlightColor = 'rgba(255, 255, 255, 0.25)',
}: SpotlightEffectProps) => {
	const divRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: { clientX: number; clientY: number }) => {
		if (divRef.current) {
			const rect = divRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			divRef.current.style.setProperty('--mouse-x', `${x}px`);
			divRef.current.style.setProperty('--mouse-y', `${y}px`);
			divRef.current.style.setProperty('--spotlight-color', spotlightColor);
		}
	};

	return (
		<div
			ref={divRef}
			onMouseMove={handleMouseMove}
			className={`spotlight-effect ${className}`}
		>
			{children}
		</div>
	);
};

export default SpotlightEffect;
