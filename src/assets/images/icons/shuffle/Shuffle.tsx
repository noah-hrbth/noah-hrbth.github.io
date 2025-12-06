import Icon from '../../../../components/Icon/Icon';

type Shuffle = {
	size?: number;
	color?: string;
};

const Shuffle = ({ size, color }: Shuffle) => (
	<Icon size={size} color={color}>
		<svg
			width={'100%'}
			height={'100%'}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 100 100'
			fill='none'
			stroke='currentColor'
			strokeWidth='10'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<path d='M 75 30 L 85 20 L 75 10' />
			<path d='M 85 20 L 65 20 C 50 20 45 30 35 50 C 25 70 20 80 15 80' />
			<path d='M 25 70 L 15 80 L 25 90' />
			<path d='M 15 80 L 35 80 C 50 80 55 70 65 50 C 75 30 80 20 85 20' />
		</svg>
	</Icon>
);

export default Shuffle;
