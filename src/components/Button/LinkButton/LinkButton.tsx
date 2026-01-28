import { ReactNode } from 'react';
import './LinkButton.scss';

interface LinkButtonProps {
	[key: string]: any;
	href?: string;
	target?: string;
	rel?: string;
	download?: string | boolean;
}

function LinkButton({
	className = '',
	children,
	...props
}: { className?: string; children: ReactNode } & LinkButtonProps) {
	const { href = '', target = '_blank', rel = 'noreferrer', download } = props;

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
