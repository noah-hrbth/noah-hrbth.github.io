import React from 'react';
import './Cursor.scss';

function Cursor() {
	const mousePosition = useMousePosition();
	const cursurRef = React.useRef<HTMLDivElement>(null);

	const handleCursorHover = () => {
		const allLinks = document.querySelectorAll('a');
		const allButtons = document.querySelectorAll('button');

		allLinks.forEach((link) => {
			link.addEventListener('mouseover', () => {
				cursurRef.current?.classList.add('cursor--hover');
			});
			link.addEventListener('mouseleave', () => {
				cursurRef.current?.classList.remove('cursor--hover');
			});
		});

		allButtons.forEach((button) => {
			button.addEventListener('mouseover', () => {
				cursurRef.current?.classList.add('cursor--hover');
			});
			button.addEventListener('mouseleave', () => {
				cursurRef.current?.classList.remove('cursor--hover');
			});
		});
	};

	React.useEffect(() => {
		handleCursorHover();
	}, []);

	return (
		<div
			className={'cursor'}
			style={{
				top: (mousePosition.y ?? 0) - 10,
				left: (mousePosition.x ?? 0) - 10,
			}}
			ref={cursurRef}
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
