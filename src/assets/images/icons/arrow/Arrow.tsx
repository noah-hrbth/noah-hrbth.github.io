import Icon from '../../../../components/Icon/Icon';

type Arrow = {
	size?: number;
	color?: string;
};

const Arrow = ({ size, color }: Arrow) => (
	<Icon size={size} color={color}>
		<svg
      width={'100%'}
      height={'100%'}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 100 100'
			fill='currentColor'
      stroke='currentColor'
			strokeWidth='10'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<polyline fill='none' points='30,10 80,50 30,90 ' />
		</svg>
	</Icon>
);

export default Arrow;