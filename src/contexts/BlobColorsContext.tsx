import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	useRef,
	ReactNode,
} from 'react';

interface BlobColors {
	color1: string;
	color2: string;
	color3: string;
	color4: string;
	color5: string;
	colorInteractive: string;
}

interface BlobColorsContextType {
	colors: BlobColors;
	regenerateColors: () => void;
}

const BlobColorsContext = createContext<BlobColorsContextType | undefined>(
	undefined,
);

const generateRandomRGB = (): string => {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	return `${r}, ${g}, ${b}`;
};

const parseRgb = (rgb: string): [number, number, number] => {
	const [r, g, b] = rgb.split(',').map((channel) => Number(channel.trim()));
	return [r, g, b];
};

const interpolateChannel = (
	start: number,
	end: number,
	progress: number,
): number => {
	return Math.round(start + (end - start) * progress);
};

const interpolateRgb = (
	start: string,
	end: string,
	progress: number,
): string => {
	const [sr, sg, sb] = parseRgb(start);
	const [er, eg, eb] = parseRgb(end);

	const r = interpolateChannel(sr, er, progress);
	const g = interpolateChannel(sg, eg, progress);
	const b = interpolateChannel(sb, eb, progress);

	return `${r}, ${g}, ${b}`;
};

const interpolateBlobColors = (
	start: BlobColors,
	end: BlobColors,
	progress: number,
): BlobColors => ({
	color1: interpolateRgb(start.color1, end.color1, progress),
	color2: interpolateRgb(start.color2, end.color2, progress),
	color3: interpolateRgb(start.color3, end.color3, progress),
	color4: interpolateRgb(start.color4, end.color4, progress),
	color5: interpolateRgb(start.color5, end.color5, progress),
	colorInteractive: interpolateRgb(
		start.colorInteractive,
		end.colorInteractive,
		progress,
	),
});

// Default colors matching global.scss :root values
export const DEFAULT_BLOB_COLORS: BlobColors = {
	color1: '20, 20, 20',
	color2: '45, 45, 45',
	color3: '80, 80, 80',
	color4: '120, 120, 120',
	color5: '160, 160, 160',
	colorInteractive: '200, 200, 200',
};

const generateRandomColors = (): BlobColors => ({
	color1: generateRandomRGB(),
	color2: generateRandomRGB(),
	color3: generateRandomRGB(),
	color4: generateRandomRGB(),
	color5: generateRandomRGB(),
	colorInteractive: generateRandomRGB(),
});

export const BlobColorsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [colors, setColors] = useState<BlobColors>(DEFAULT_BLOB_COLORS);
	const animationFrameRef = useRef<number | null>(null);
	const animationStartRef = useRef<number | null>(null);
	const animationStartColorsRef = useRef<BlobColors | null>(null);
	const animationTargetColorsRef = useRef<BlobColors | null>(null);

	const regenerateColors = useCallback(() => {
		const targetColors = generateRandomColors();

		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		animationStartRef.current = null;
		animationStartColorsRef.current = colors;
		animationTargetColorsRef.current = targetColors;

		const duration = 800;

		const step = (timestamp: number) => {
			if (animationStartRef.current === null) {
				animationStartRef.current = timestamp;
			}

			const startTime = animationStartRef.current;
			const startColors = animationStartColorsRef.current;
			const endColors = animationTargetColorsRef.current;

			if (!startColors || !endColors) {
				setColors(targetColors);
				return;
			}

			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const easedProgress = progress * (2 - progress);
			const nextColors = interpolateBlobColors(
				startColors,
				endColors,
				easedProgress,
			);
			setColors(nextColors);

			if (progress < 1) {
				animationFrameRef.current = requestAnimationFrame(step);
				return;
			}

			animationFrameRef.current = null;
			animationStartRef.current = null;
			animationStartColorsRef.current = null;
			animationTargetColorsRef.current = null;
		};

		animationFrameRef.current = requestAnimationFrame(step);
	}, [colors]);

	const contextValue = useMemo(
		() => ({ colors, regenerateColors }),
		[colors, regenerateColors],
	);

	return (
		<BlobColorsContext.Provider value={contextValue}>
			{children}
		</BlobColorsContext.Provider>
	);
};

export const useBlobColors = () => {
	const context = useContext(BlobColorsContext);
	if (!context) {
		throw new Error('useBlobColors must be used within BlobColorsProvider');
	}
	return context;
};
