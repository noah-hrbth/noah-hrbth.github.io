import { useState, useCallback, useRef } from 'react';
import './Home.scss';
import Button from '../../components/Button/Button';
import { DELAY, getDelay, hasEntrancePlayed } from '../../constants';
import { useBlobColors, DEFAULT_BLOB_COLORS } from '../../contexts/BlobColorsContext';
import resumePdf from '../../assets/documents/NoahHarborthResume.pdf';
import totoroImage from '../../assets/images/totoro.png';

const SPARKLE_COUNT = 4;
const BLOB_COLOR_KEYS = ['color1', 'color2', 'color3', 'color4', 'color5'] as const;
const WHITE = '255, 255, 255';

const generatePositions = (): Array<{ top: string; left: string }> =>
	Array.from({ length: SPARKLE_COUNT }, () => ({
		top: `${10 + Math.random() * 80}%`,
		left: `${8 + Math.random() * 84}%`,
	}));

function Home() {
	const [showTotoro, setShowTotoro] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const [sparklePositions, setSparklePositions] = useState(generatePositions);
	const [sparkleColor, setSparkleColor] = useState(WHITE);
	const skipEntrance = hasEntrancePlayed();

	const { colors } = useBlobColors();
	const colorsRef = useRef(colors);
	colorsRef.current = colors;

	const handleDownloadResume = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		// Show Totoro animation
		setShowTotoro(true);

		// Delay download to ensure Totoro is visible
		setTimeout(() => {
			const link = document.createElement('a');
			link.href = resumePdf;
			link.download = 'NoahHarborthResume.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}, 300);

		// Hide Totoro after animation
		setTimeout(() => {
			setShowTotoro(false);
		}, 3000);
	};

	const handleMouseEnter = useCallback(() => {
		const c = colorsRef.current;
		const isDefault = c.color1 === DEFAULT_BLOB_COLORS.color1;
		const color = isDefault
			? WHITE
			: c[BLOB_COLOR_KEYS[Math.floor(Math.random() * BLOB_COLOR_KEYS.length)]];

		setSparkleColor(color);
		setSparklePositions(generatePositions());
		setIsHovering(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovering(false);
	}, []);

	return (
		<main className={'home'}>
			<h1 className={'home__title'}>
				{["Hey!", "I'm", 'Noah'].map((word, i) => (
					<span
						key={word}
						className='fade-slide-in--top'
						style={{ animationDelay: getDelay(DELAY.HOME_TITLE_BASE, skipEntrance, i * 0.15) }}
					>
						{word}
					</span>
				))}
			</h1>
			<h2 className={'home__profession'}>
				{['Software', 'Developer'].map((word, i) => (
					<span
						key={word}
						className='fade-slide-in--bottom'
						style={{ animationDelay: getDelay(DELAY.HOME_SUBTITLE_BASE, skipEntrance, i * 0.15) }}
					>
						{word}
					</span>
				))}
			</h2>
			<div className='home__download-container'>
				<Button
					className='home__download-btn fade-slide-in--bottom'
					style={{ animationDelay: getDelay(DELAY.HOME_DOWNLOAD, skipEntrance) }}
					onClick={handleDownloadResume}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onFocus={handleMouseEnter}
					onBlur={handleMouseLeave}
				>
					Download Resume
					{sparklePositions.map((pos, i) => (
						<span
							key={i}
							className={`home__sparkle${isHovering ? ' home__sparkle--active' : ''}`}
							style={{
								'--sparkle-index': i,
								'--sparkle-color': sparkleColor,
								top: pos.top,
								left: pos.left,
							} as React.CSSProperties}
						/>
					))}
				</Button>
				{showTotoro && (
					<img
						src={totoroImage}
						alt='Totoro'
						className='home__totoro'
					/>
				)}
			</div>
		</main>
	);
}

export default Home;
