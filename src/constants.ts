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

/**
 * Centralized animation delay pairs (in seconds).
 * Each entry defines the delay for skip-entrance (return visit) vs first-visit entrance.
 * All animation timing lives here to keep sequencing coordinated.
 */
export const DELAY = {
	LAYOUT: { skip: 0.5, entrance: 3.7 },
	HEADER_LOGO: { skip: 1.3, entrance: 4.2 },
	HEADER_SLASH: { skip: 1.5, entrance: 4.4 },
	HEADER_ACTIVE_PAGE: { skip: 1.7, entrance: 4.5 },
	HEADER_NAV_BUTTON: { skip: 2.0, entrance: 4.7 },
	COLOR_SHUFFLE: { skip: 2.0, entrance: 4.7 },
	HOME_TITLE_BASE: { skip: 0, entrance: 1.4 },
	HOME_SUBTITLE_BASE: { skip: 0.55, entrance: 1.95 },
	HOME_DOWNLOAD: { skip: 1.0, entrance: 4.5 },
} as const;

/** Get animation delay CSS string based on entrance state, with optional per-item offset. */
export const getDelay = (
	delays: { skip: number; entrance: number },
	skipEntrance: boolean,
	offsetS = 0,
): string => `${(skipEntrance ? delays.skip : delays.entrance) + offsetS}s`;

export default VIEWPORT;
