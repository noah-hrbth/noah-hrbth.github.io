import { ReactNode } from 'react';
import LinkButton from './LinkButton/LinkButton';

interface ButtonProps {
	[key: string]: any;
	type?: string;
	className?: Array<string> | string;
	children?: ReactNode;
}

// TODO: Add button styles (round for example)
function Button({ type = 'normal', className = '', ...props }: ButtonProps) {
	const allClasses = `button button--${type} ${
		Array.isArray(className) ? className.join(' ') : className
	}`;

	if (type === 'link') {
		return <LinkButton className={allClasses} {...props} />;
	}

	// TODO: Add more button types

	return <></>;
}

export default Button;
