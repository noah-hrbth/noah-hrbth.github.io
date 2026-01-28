import { useEffect, useState } from 'react';
import './Home.scss';
import DecryptedText from '../../components/DecryptedText/DecryptedText';
import Button from '../../components/Button/Button';
import resumePdf from '../../assets/documents/NoahHarborthResume.pdf';
import totoroImage from '../../assets/images/totoro.png';

const professions = ['Software', 'Web', 'Fullstack'];

function Home() {
	const [professionStart, setProfessionStart] = useState('Fullstack');
	const [showTotoro, setShowTotoro] = useState(false);

	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			setProfessionStart(professions[i]);
			i = i === professions.length - 1 ? 0 : i + 1;
		}, 2000);

		return () => clearInterval(interval);
	}, []);

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

	return (
		<main className={'home'}>
			<h1 className={'home__title fade-slide-in--top'}>Hey! I'm Noah</h1>
			<h2 className={'home__profession fade-slide-in--bottom delay-03'}>
				<span className={'home__profession--start'}>
					<DecryptedText text={professionStart} animateOn='view' speed={175} />
				</span>
				<span className={'home__profession--end'}>Developer</span>
			</h2>
			<div className='home__download-container'>
				<Button
					className='home__download-btn fade-slide-in--bottom delay-06'
					onClick={handleDownloadResume}
				>
					Download Resume
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
