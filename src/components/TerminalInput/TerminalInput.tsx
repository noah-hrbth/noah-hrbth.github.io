import { FormEvent, useEffect, useRef, useState } from 'react';
import './TerminalInput.scss';
import { APP_ROUTES } from '../../constants';
import { useNavigate } from 'react-router';

enum TerminalCommand {
	ChangeDirectory = 'cd',
	List = 'ls',
}

const TerminalInput = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;

		input.style.height = 'auto';
		input.style.height = `${input.scrollHeight}px`;
	}, [value]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedValue = value.trim();

		if (trimmedValue === TerminalCommand.List) {
			// TODO: implement toast with all app routes
			console.log(APP_ROUTES);
		}

		if (trimmedValue.startsWith(TerminalCommand.ChangeDirectory + ' ')) {
			const valueWithoutCMD = trimmedValue.slice(3).trim();
			const matchingRoute = APP_ROUTES.find(
				(route) => route.name === valueWithoutCMD,
			);

			if (matchingRoute) {
				navigate(matchingRoute.route);
			} else {
				// TODO: implement error toast
			}
		}

		setValue('');
	};

	const handleToggle = () => {
		if (isOpen) {
			setIsAnimating(true);
			setTimeout(() => {
				setIsOpen(false);
				setIsAnimating(false);
			}, 300);
		} else {
			setIsOpen(true);
		}
	};

	return (
		<div className='terminal-input fade-in'>
			<div
				className={`terminal-input__corner-toggle ${
					isOpen && !isAnimating ? 'terminal-input__corner-toggle--open' : ''
				}`}
				onClick={handleToggle}
				role='button'
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleToggle();
					}
				}}
				aria-label={isOpen ? 'Close terminal input' : 'Open terminal input'}
				aria-expanded={isOpen}
			/>
			{(isOpen || isAnimating) && (
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						ref={inputRef}
						value={value}
						onChange={handleChange}
						autoComplete='off'
						autoCorrect='off'
						spellCheck='false'
						placeholder='Type here...'
						className={`terminal-input__input ${
							isOpen && !isAnimating
								? 'terminal-input__input--open'
								: 'terminal-input__input--closed'
						}`}
					/>
				</form>
			)}
		</div>
	);
};

export default TerminalInput;
