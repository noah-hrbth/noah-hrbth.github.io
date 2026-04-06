import { useState } from 'react';
import './Home.scss';
import Button from '../../components/Button/Button';
import { DELAY, getDelay, hasEntrancePlayed } from '../../constants';
import resumePdf from '../../assets/documents/NoahHarborthResume.pdf';
import totoroImage from '../../assets/images/totoro.png';
import { useSparkle } from '../../hooks/useSparkle';

const Home = () => {
	const [showTotoro, setShowTotoro] = useState(false);
	const skipEntrance = hasEntrancePlayed();

	const {
		sparklePositions,
		sparkleColor,
		isHovering,
		handleMouseEnter,
		handleMouseLeave,
	} = useSparkle(4);

	const handleDownloadResume = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		setShowTotoro(true);

		setTimeout(() => {
			const link = document.createElement('a');
			link.href = resumePdf;
			link.download = 'NoahHarborthResume.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}, 300);

		setTimeout(() => {
			setShowTotoro(false);
		}, 3000);
	};

	return (
		<main className={'home'}>
			<h1 className={'home__title'}>
				{['Hey!', "I'm", 'Noah'].map((word, i) => (
					<span
						key={word}
						className='fade-slide-in--top'
						style={{
							animationDelay: getDelay(
								DELAY.HOME_TITLE_BASE,
								skipEntrance,
								i * 0.15,
							),
						}}
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
						style={{
							animationDelay: getDelay(
								DELAY.HOME_SUBTITLE_BASE,
								skipEntrance,
								i * 0.15,
							),
						}}
					>
						{word}
					</span>
				))}
			</h2>
			<div className='home__download-container'>
				<Button
					className='home__download-btn fade-slide-in--bottom'
					style={{
						animationDelay: getDelay(DELAY.HOME_DOWNLOAD, skipEntrance),
					}}
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
							className={`sparkle${isHovering ? ' sparkle--active' : ''}`}
							style={
								{
									'--sparkle-index': i,
									'--sparkle-color': sparkleColor,
									top: pos.top,
									left: pos.left,
								} as React.CSSProperties
							}
						/>
					))}
				</Button>
				{showTotoro && (
					<img src={totoroImage} alt='Totoro' className='home__totoro' />
				)}
			</div>
		</main>
	);
};

export default Home;
