import { useLayoutEffect, useState } from 'react';

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const handleSize = () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	useLayoutEffect(() => {
		window.addEventListener('resize', handleSize);

		return () => window.removeEventListener('resize', handleSize);
	}, []);

	return windowSize;
};

export default useWindowSize;
