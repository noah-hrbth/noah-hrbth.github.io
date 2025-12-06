import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
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

	const regenerateColors = useCallback(() => {
		setColors(generateRandomColors());
	}, []);

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
