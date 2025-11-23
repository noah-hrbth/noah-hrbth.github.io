import { useEffect, useRef, useState } from 'react';
import './TerminalInput.scss';

const TerminalInput = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [value, setValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}, [value]);

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(event.target.value);
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
		<div className="terminal-input fade-in">
			<div
				className={`terminal-input__corner-toggle ${
					isOpen && !isAnimating ? 'terminal-input__corner-toggle--open' : ''
				}`}
				onClick={handleToggle}
				role="button"
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
				<textarea
					ref={textareaRef}
					value={value}
					onChange={handleChange}
					rows={1}
					placeholder="Type here..."
					className={`terminal-input__textarea ${
						isOpen && !isAnimating ? 'terminal-input__textarea--open' : 'terminal-input__textarea--closed'
					}`}
				/>
			)}
		</div>
	);
};

export default TerminalInput;
