import React from 'react';

function Cursor() {
	const mousePosition = useMousePosition();

	return (
		<div
			className={'cursor'}
			style={{
				top: (mousePosition.y ?? 0) - 10,
				left: (mousePosition.x ?? 0) - 10,
			}}
		></div>
	);
}

const useMousePosition = () => {
	const [mousePosition, setMousePosition] = React.useState({
		x: 0,
		y: 0,
	});

	React.useEffect(() => {
		const updateMousePosition = (ev: { clientX: any; clientY: any }) => {
			setMousePosition({ x: ev.clientX, y: ev.clientY });
		};

		window.addEventListener('mousemove', updateMousePosition);

		return () => {
			window.removeEventListener('mousemove', updateMousePosition);
		};
	}, []);

	return mousePosition;
};

export default Cursor;
