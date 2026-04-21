import { useEffect, useRef, useState } from 'react';
import { DELAY, getDelay, hasEntrancePlayed } from '../../constants.ts';
import Github from '../../assets/images/icons/github/Github.tsx';
import Linkedin from '../../assets/images/icons/linkedin/Linkedin.tsx';
import HuggingFace from '../../assets/images/icons/hugging-face/HuggingFace.tsx';
import Heart from '../../assets/images/icons/heart/Heart.tsx';
import { useSparkle } from '../../hooks/useSparkle';
import './Contact.scss';

const SOCIAL_LINKS = [
	{
		label: 'GitHub',
		url: 'https://github.com/noah-hrbth',
		IconComponent: Github,
	},
	{
		label: 'LinkedIn',
		url: 'https://www.linkedin.com/in/noah-harborth-5b91541a1/',
		IconComponent: Linkedin,
	},
	{
		label: 'HuggingFace',
		url: 'https://huggingface.co/noah-hrbth',
		IconComponent: HuggingFace,
	},
];

const WEB3FORMS_ACCESS_KEY = '57fd0d01-bd28-41e8-a6f8-8bd113d17eb0';

const LABEL_DELAY_OFFSET = 0.3;

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const BRAILLE_SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const SPINNER_INTERVAL_MS = 80;

function Contact() {
	const skipEntrance = hasEntrancePlayed();
	const formRef = useRef<HTMLFormElement>(null);
	const [submitState, setSubmitState] = useState<SubmitState>('idle');
	const [spinnerFrame, setSpinnerFrame] = useState(0);

	useEffect(() => {
		if (submitState !== 'submitting') return;
		const interval = setInterval(() => {
			setSpinnerFrame((prev) => (prev + 1) % BRAILLE_SPINNER.length);
		}, SPINNER_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [submitState]);

	const submitLabel =
		submitState === 'submitting'
			? `sending ${BRAILLE_SPINNER[spinnerFrame]}`
			: submitState === 'success'
				? 'sent!'
				: submitState === 'error'
					? 'error, try again'
					: 'send message';

	const {
		sparklePositions,
		sparkleColor,
		isHovering,
		handleMouseEnter,
		handleMouseLeave,
	} = useSparkle(4);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formRef.current) return;

		setSubmitState('submitting');

		try {
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: new FormData(formRef.current),
			});

			if (response.ok) {
				setSubmitState('success');
				formRef.current.reset();
				setTimeout(() => setSubmitState('idle'), 3000);
			} else {
				setSubmitState('error');
			}
		} catch {
			setSubmitState('error');
		}
	};

	return (
		<main className='contact'>
			<h1
				className='contact__heading fade-slide-in--top'
				style={{
					animationDelay: getDelay(DELAY.CONTACT_HEADING, skipEntrance),
				}}
			>
				contact me
			</h1>

			<div className='contact__socials'>
				{SOCIAL_LINKS.map((social, i) => (
					<a
						key={social.label}
						href={social.url}
						target='_blank'
						rel='noreferrer noopener'
						className='contact__social-link fade-scale-in'
						style={{
							animationDelay: getDelay(
								DELAY.CONTACT_ICONS_BASE,
								skipEntrance,
								i * 0.15,
							),
						}}
						aria-label={social.label}
					>
						<social.IconComponent size={32} />
					</a>
				))}
			</div>

			<form
				ref={formRef}
				className='contact__form'
				onSubmit={(e) => void handleSubmit(e)}
			>
				<input
					type='hidden'
					name='access_key'
					value={WEB3FORMS_ACCESS_KEY}
				/>

				<div className='contact__field'>
					<label
						htmlFor='email'
						className='contact__label fade-in'
						style={{
							animationDelay: getDelay(
								DELAY.CONTACT_EMAIL,
								skipEntrance,
								LABEL_DELAY_OFFSET,
							),
						}}
					>
						email
					</label>
					<input
						id='email'
						type='email'
						name='email'
						className='contact__input fade-slide-in--bottom'
						style={{
							animationDelay: getDelay(DELAY.CONTACT_EMAIL, skipEntrance),
						}}
						required
						placeholder='your@email.com'
					/>
				</div>

				<div className='contact__field'>
					<label
						htmlFor='message'
						className='contact__label fade-in'
						style={{
							animationDelay: getDelay(
								DELAY.CONTACT_MESSAGE,
								skipEntrance,
								LABEL_DELAY_OFFSET,
							),
						}}
					>
						message
					</label>
					<textarea
						id='message'
						name='message'
						className='contact__textarea fade-slide-in--bottom'
						style={{
							animationDelay: getDelay(
								DELAY.CONTACT_MESSAGE,
								skipEntrance,
							),
						}}
						required
						placeholder='say hi...'
						rows={5}
					/>
				</div>

				<button
					type='submit'
					className='contact__submit fade-slide-in--bottom'
					style={{
						animationDelay: getDelay(DELAY.CONTACT_SUBMIT, skipEntrance),
					}}
					disabled={submitState === 'submitting'}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onFocus={handleMouseEnter}
					onBlur={handleMouseLeave}
				>
					<span
						key={submitState}
						className='contact__submit-label fade-in animation--fast'
					>
						{submitLabel}
					</span>
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
				</button>
			</form>
			<p
				className='contact__footer fade-in'
				style={{
					animationDelay: getDelay(DELAY.CONTACT_FOOTER, skipEntrance),
				}}
			>
				made with <Heart size={14} /> by me
			</p>
		</main>
	);
}

export default Contact;
