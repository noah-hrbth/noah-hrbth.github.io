import React, { useEffect, useRef } from 'react';
import './Cursor.scss';
import { useNavigation } from '../../contexts/NavigationContext';

const Cursor = () => {
	const mousePosition = useMousePosition();
	const cursorRef = useRef<HTMLDivElement>(null);
	const { urlChanged } = useNavigation();

	const handleMouseEnter = () => {
		cursorRef.current?.classList.add('cursor--hover');
	};

	const handleMouseLeave = () => {
		cursorRef.current?.classList.remove('cursor--hover');
	};

	const handleMouseHover = () => {
		setTimeout(() => {
			const allLinks = document.querySelectorAll('a');
			const allButtons = document.querySelectorAll('button');

			allLinks.forEach((link) => {
				link.addEventListener('mouseenter', handleMouseEnter);
				link.addEventListener('mouseleave', handleMouseLeave);
			});

			allButtons.forEach((button) => {
				button.addEventListener('mouseenter', handleMouseEnter);
				button.addEventListener('mouseleave', handleMouseLeave);
			});
		});
	};

	useEffect(() => {
		handleMouseHover();
	}, [urlChanged]);

	return (
		<div
			className={'cursor'}
			style={{
				top: (mousePosition.y ?? 0) - 10,
				left: (mousePosition.x ?? 0) - 10,
			}}
			ref={cursorRef}
		></div>
	);
};

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
