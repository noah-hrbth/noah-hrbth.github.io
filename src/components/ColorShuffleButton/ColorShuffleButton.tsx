import { useState, useRef, useEffect } from 'react';
import { useBlobColors } from '../../contexts/BlobColorsContext';
import { DELAY, getDelay, hasEntrancePlayed } from '../../constants';
import './ColorShuffleButton.scss';

const ColorShuffleButton = () => {
	const { regenerateColors } = useBlobColors();
	const [isAnimating, setIsAnimating] = useState(false);
	const skipEntrance = hasEntrancePlayed();
	const timeoutRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();

		if (isAnimating) return;

		setIsAnimating(true);
		regenerateColors();

		timeoutRef.current = window.setTimeout(() => {
			setIsAnimating(false);
			timeoutRef.current = null;
		}, 800);
	};

	return (
		<div className='color-shuffle-button fade-in' style={{ animationDelay: getDelay(DELAY.COLOR_SHUFFLE, skipEntrance) }}>
			<button
				className='color-shuffle-button__btn'
				onClick={handleClick}
				aria-label='Shuffle background colors'
				disabled={isAnimating}
			>
				<div
					className={`color-shuffle-button__circles ${isAnimating ? 'color-shuffle-button__circles--animating' : ''}`}
				>
					<div className='color-shuffle-button__circle'></div>
					<div className='color-shuffle-button__circle'></div>
					<div className='color-shuffle-button__circle'></div>
					<div className='color-shuffle-button__circle'></div>
				</div>
			</button>
		</div>
	);
};

export default ColorShuffleButton;
