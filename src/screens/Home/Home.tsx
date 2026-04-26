import { useState } from 'react';
import './Home.scss';
import Button from '../../components/Button/Button';
import ResumeModal from '../../components/ResumeModal/ResumeModal';
import { DELAY, getDelay, hasEntrancePlayed } from '../../constants';
import resumePdf from '../../assets/documents/NoahHarborthResume.pdf';
import { useSparkle } from '../../hooks/useSparkle';

const Home = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const skipEntrance = hasEntrancePlayed();

	const {
		sparklePositions,
		sparkleColor,
		isHovering,
		handleMouseEnter,
		handleMouseLeave,
	} = useSparkle(4);

	const handleOpenResume = () => {
		handleMouseLeave();
		setIsModalOpen(true);
	};

	return (
		<main className={'home'}>
			<h1 className={'home__title'}>
				{['hey!', "i'm", 'noah'].map((word, i) => (
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
				{['software', 'developer'].map((word, i) => (
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
					onClick={handleOpenResume}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onFocus={(e) => {
						const from = e.relatedTarget;
						if (from instanceof Element && from.closest('.resume-modal__content')) return;
						handleMouseEnter();
					}}
					onBlur={handleMouseLeave}
				>
					open resume
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
			</div>
			<ResumeModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				src='/NoahHarborthResume.html'
				downloadSrc={resumePdf}
			/>
		</main>
	);
};

export default Home;
