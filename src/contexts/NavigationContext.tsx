/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
	locationKey: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
	undefined,
);

interface NavigationProviderProps {
	children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
	children,
}) => {
	const location = useLocation();

	return (
		<NavigationContext.Provider value={{ locationKey: location.key ?? '' }}>
			{children}
		</NavigationContext.Provider>
	);
};

/** Provides access to the NavigationContext for tracking URL changes. */
export const useNavigation = (): NavigationContextType => {
	const context = useContext(NavigationContext);

	if (!context) {
		throw new Error('useNavigation must be used within a NavigationProvider');
	}

	return context;
};
