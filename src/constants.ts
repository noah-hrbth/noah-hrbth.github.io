export const VIEWPORT: { [key: string]: number } = {
	SMALL: 576,
	MEDIUM: 768,
	LARGE: 992,
	XLARGE: 1200,
};

export const APP_ROUTES = [
	{ route: '/', name: 'home' },
	{ route: '/about', name: 'about' },
	{ route: '/contact', name: 'contact' },
];

export const ENTRANCE_SESSION_KEY = 'portfolioBlobEntrancePlayed';

/** Check whether the entrance animation has already played this session. */
export const hasEntrancePlayed = (): boolean => {
	try {
		return sessionStorage.getItem(ENTRANCE_SESSION_KEY) === 'true';
	} catch {
		return false;
	}
};

export default VIEWPORT;
