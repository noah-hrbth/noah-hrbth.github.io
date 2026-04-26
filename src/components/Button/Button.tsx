import React, { ReactNode, forwardRef } from 'react';
import './Button.scss';

interface ButtonProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
	styleType?: string;
	className?: string[] | string;
	children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ styleType = '', className = '', children, ...props }, ref) => {
		const classNameArrayAsString = Array.isArray(className)
			? className.join(' ')
			: className;
		const allClasses = {
			button: true,
			[`button--${styleType}`]: styleType,
			[`${classNameArrayAsString}`]: classNameArrayAsString,
		};
		const formattedClassName = Object.keys(allClasses)
			.filter((key) => allClasses[key])
			.join(' ');

		return (
			<button ref={ref} className={formattedClassName} {...props}>
				{children}
			</button>
		);
	},
);

Button.displayName = 'Button';

export default Button;
