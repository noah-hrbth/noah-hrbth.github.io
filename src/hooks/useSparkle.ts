import { useState, useCallback, useRef, useEffect } from 'react';
import {
	useBlobColors,
	DEFAULT_BLOB_COLORS,
} from '../contexts/BlobColorsContext';

const BLOB_COLOR_KEYS = [
	'color1',
	'color2',
	'color3',
	'color4',
	'color5',
] as const;
const WHITE = '255, 255, 255';

interface SparklePosition {
	top: string;
	left: string;
}

interface UseSparkleReturn {
	sparklePositions: SparklePosition[];
	sparkleColor: string;
	isHovering: boolean;
	handleMouseEnter: () => void;
	handleMouseLeave: () => void;
}

const generatePositions = (count: number): SparklePosition[] =>
	Array.from({ length: count }, () => ({
		top: `${10 + Math.random() * 80}%`,
		left: `${8 + Math.random() * 84}%`,
	}));

/** Manages sparkle hover state: positions, color selection from BlobColorsContext, and hover toggling. */
export const useSparkle = (count: number): UseSparkleReturn => {
	const [isHovering, setIsHovering] = useState(false);
	const [sparklePositions, setSparklePositions] = useState(() =>
		generatePositions(count),
	);
	const [sparkleColor, setSparkleColor] = useState(WHITE);

	const { colors } = useBlobColors();
	const colorsRef = useRef(colors);

	useEffect(() => {
		colorsRef.current = colors;
	}, [colors]);

	const handleMouseEnter = useCallback(() => {
		const c = colorsRef.current;
		const isDefault = c.color1 === DEFAULT_BLOB_COLORS.color1;
		const color = isDefault
			? WHITE
			: c[BLOB_COLOR_KEYS[Math.floor(Math.random() * BLOB_COLOR_KEYS.length)]];

		setSparkleColor(color);
		setSparklePositions(generatePositions(count));
		setIsHovering(true);
	}, [count]);

	const handleMouseLeave = useCallback(() => {
		setIsHovering(false);
	}, []);

	return {
		sparklePositions,
		sparkleColor,
		isHovering,
		handleMouseEnter,
		handleMouseLeave,
	};
};
