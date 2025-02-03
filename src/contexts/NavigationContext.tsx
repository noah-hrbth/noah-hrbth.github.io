import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
	urlChanged: boolean;
	setUrlChanged: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
	undefined
);

interface NavigationProviderProps {
	children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
	children,
}) => {
	const [urlChanged, setUrlChanged] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setUrlChanged(true);
	}, [location]);

	return (
		<NavigationContext.Provider value={{ urlChanged, setUrlChanged }}>
			{children}
		</NavigationContext.Provider>
	);
};

export const useNavigation = () => {
	const context = useContext(NavigationContext);

	if (!context) {
		throw new Error('useNavigation must be used within a NavigationProvider');
	}

	return context;
};
