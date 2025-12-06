import {
	FormEvent,
	useEffect,
	useRef,
	useState,
	Fragment,
	useMemo,
} from 'react';
import './TerminalInput.scss';
import { APP_ROUTES } from '../../constants';
import { useNavigate } from 'react-router';

enum TerminalCommand {
	ChangeDirectory = 'cd',
	List = 'ls',
}

const highlightCommand = (text: string): JSX.Element | null => {
	if (!text) return null;

	const trimmedText = text.trim();
	if (!trimmedText) {
		return <span className='text'>{text}</span>;
	}

	const parts = trimmedText.split(/\s+/);
	const [command] = parts;

	const isValidCommand = Object.values(TerminalCommand).includes(
		command as TerminalCommand,
	);

	const commandEndIndex = text.indexOf(command) + command.length;
	const restOfText = text.slice(commandEndIndex);

	return (
		<Fragment>
			<span className={isValidCommand ? 'command' : 'text'}>{command}</span>
			{restOfText && <span className='argument'>{restOfText}</span>}
		</Fragment>
	);
};

interface TerminalFormProps {
	isOpen: boolean;
	isAnimating: boolean;
}

const TerminalForm = ({ isOpen, isAnimating }: TerminalFormProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState('');
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

	const highlightedValue = useMemo(() => highlightCommand(value), [value]);

	return (
		<form onSubmit={handleSubmit}>
			<div className='terminal-input__container'>
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
				{value && (
					<div
						className={`terminal-input__highlight ${
							isOpen && !isAnimating
								? 'terminal-input__highlight--open'
								: 'terminal-input__highlight--closed'
						}`}
						aria-hidden='true'
					>
						{highlightedValue}
					</div>
				)}
			</div>
		</form>
	);
};

const TerminalInput = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [mountKey, setMountKey] = useState(0);

	const handleToggle = () => {
		if (isOpen) {
			setIsAnimating(true);
			setTimeout(() => {
				setIsOpen(false);
				setIsAnimating(false);
			}, 300);
		} else {
			setIsOpen(true);
			setMountKey((prev) => prev + 1);
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
				<TerminalForm
					key={mountKey}
					isOpen={isOpen}
					isAnimating={isAnimating}
				/>
			)}
		</div>
	);
};

export default TerminalInput;
