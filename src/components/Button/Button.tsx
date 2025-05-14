import { ReactNode } from 'react';
import LinkButton from './LinkButton/LinkButton';
import './Button.scss';

interface ButtonProps {
	[key: string]: any;
	type?: string;
	styleType?: string;
	className?: Array<string> | string;
	children?: ReactNode;
}

// TODO: Add button styles (round for example)
function Button({
	type = '',
	styleType = '',
	className = '',
	children,
	...props
}: ButtonProps) {
	const classNameArrayAsString = Array.isArray(className)
		? className.join(' ')
		: className;
	const allClasses = {
		button: true,
		[`button--${type}`]: type,
		[`button--${styleType}`]: styleType,
		[`${classNameArrayAsString}`]: classNameArrayAsString,
	};
	const formattedClassName = Object.keys(allClasses)
		.filter((key) => allClasses[key])
		.join(' ');

	if (type === 'link' || type === 'link-inline') {
		return (
			<LinkButton
				className={formattedClassName}
				styleType={styleType}
				{...props}
			>
				{children}
			</LinkButton>
		);
	}

	return (
		<button className={formattedClassName} {...props}>
			{children}
		</button>
	);
}

export default Button;
