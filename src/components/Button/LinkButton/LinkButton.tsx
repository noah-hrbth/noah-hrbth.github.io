import { ReactNode } from 'react';

interface LinkButtonProps {
	[key: string]: any;
	href?: string;
	target?: string;
	rel?: string;
	children?: ReactNode;
}

function LinkButton({
	className = '',
	...props
}: { className?: string } & LinkButtonProps) {
	const {
		href = '',
		target = '_blank',
		rel = 'noreferrer',
		children,
		...rest
	} = props;

	return (
		<a className={className} href={href} target={target} rel={rel} {...rest}>
			{children}
		</a>
	);
}

export default LinkButton;
