import React, { ReactNode } from 'react';
import LinkButton from './LinkButton/LinkButton';
import './Button.scss';

interface ButtonProps
	extends Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		'type' | 'className'
	> {
	type?: string;
	styleType?: string;
	className?: string[] | string;
	children?: ReactNode;
	href?: string;
	target?: string;
	rel?: string;
	download?: string | boolean;
}
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
