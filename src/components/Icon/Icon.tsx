import { ReactNode } from 'react';
import './Icon.scss';

type IconProps = {
	children: ReactNode;
	size?: number;
	color?: string;
};

const Icon = ({ children, size = 32, color = 'white' }: IconProps) => {
	return (
		<span
			className='icon'
			style={{
				width: `${size}px`,
				height: `${size}px`,
				color: color,
			}}
		>
			{children}
		</span>
	);
};

export default Icon;
