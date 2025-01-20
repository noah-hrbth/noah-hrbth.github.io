import { ReactNode } from 'react';

interface LinkButtonProps {
	[key: string]: any;
	href?: string;
	target?: string;
	rel?: string;
}

function LinkButton({
	className = '',
	children,
	...props
}: { className?: string; children: ReactNode } & LinkButtonProps) {
	const { href = '', target = '_blank', rel = 'noreferrer' } = props;

	return (
		<a className={className} href={href} target={target} rel={rel}>
			{children}
		</a>
	);
}

export default LinkButton;
