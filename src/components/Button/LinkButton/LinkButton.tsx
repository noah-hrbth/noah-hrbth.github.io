import { ReactNode } from 'react';
import './LinkButton.scss';

interface LinkButtonProps {
	className?: string;
	children: ReactNode;
	href?: string;
	target?: string;
	rel?: string;
	download?: string | boolean;
	styleType?: string;
}

function LinkButton({
	className = '',
	children,
	href = '',
	target = '_blank',
	rel = 'noreferrer',
	download,
}: LinkButtonProps) {
	return (
		<a
			className={className}
			href={href}
			target={target}
			rel={rel}
			download={download}
		>
			{children}
		</a>
	);
}

export default LinkButton;
