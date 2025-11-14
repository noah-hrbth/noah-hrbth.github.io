import { useEffect, useState } from 'react';
import './Home.scss';
import DecryptedText from '../../components/DecryptedText/DecryptedText';

const professions = ['Software', 'Web', 'Fullstack'];

function Home() {
	const [professionStart, setProfessionStart] = useState('Fullstack');

	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			setProfessionStart(professions[i]);
			i = i === professions.length - 1 ? 0 : i + 1;
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<main className={'home'}>
			<h1 className={'home__title fade-slide-in--top'}>Hey! I'm Noah</h1>
			<h2 className={'home__profession fade-slide-in--bottom delay-03'}>
				<span className={'home__profession--start'}>
					<DecryptedText text={professionStart} animateOn='view' speed={175} />
				</span>{' '}
				<span className={'home__profession--end'}>Developer</span>
			</h2>
		</main>
	);
}

export default Home;
