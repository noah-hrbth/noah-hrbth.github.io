export const VIEWPORT: { [key: string]: number } = {
	SMALL: 576,
	MEDIUM: 768,
	LARGE: 992,
	XLARGE: 1200,
};

export const APP_ROUTES = [
	{ route: '/', name: 'home' },
	{ route: '/projects', name: 'projects' },
	{ route: '/contact', name: 'contact' },
];

export const PROJECTS = [
	{
		id: 'cnn-bachelor-thesis',
		label: 'CNN Bachelor Thesis',
		description:
			'My bachelor thesis project where I implemented a CNN to classify traffic signs and skin lesions',
		badge: 'WIP',
		tags: ['AI', 'Computer Vision', 'Python'],
	},
	{
		id: 'raspberry-pi-garden',
		label: 'Raspberry Pi Garden',
		description:
			'A Raspberry Pi project to monitor my plant with an infrared camera and to keep them alive',
		badge: 'WIP',
		tags: ['IoT', 'Computer Vision', 'Python'],
	},
	{
		id: 'nextmuseum-sacred-pixels',
		label: 'NextMuseum: Sacred Pixels',
		description:
			'An uni project for the Museum Ulm where we created a 3 split screen altar, that took pictures of the visitors and transformed them into various art styles with the help of AI',
		tags: ['AI', 'Computer Vision', 'Python'],
	},
	{
		id: 'hovercube-42',
		label: 'HoverCube 42',
		description:
			'An uni project where we programmed a movement based racing game for a 1x1x1m wooden cube with a screen on top that had gyroscopes and a raspberry pi inside',
		link: 'https://github.com/jbg-1/hovercar-42',
		tags: ['Game Dev', 'Unity', 'C#'],
	},
	{
		id: 'css-flex-grid-game',
		label: 'CSS Flex & Grid Game',
		description: 'An uni project game to practice CSS layout skills',
		badge: 'archived',
		tags: ['Web Dev', 'Vue.js'],
	},
	{
		id: 'git-work-tracker',
		label: 'Git Work Tracker',
		description:
			'A tool to keep track of your work and to filter & search for your tickets/branches you worked on',
		badge: 'internal tool',
		tags: ['Web Dev', 'Python', 'SQLite'],
	},
	{
		id: 'slack-bot',
		label: 'Slack Bot',
		description:
			'A bot that ~annoys~ helps reminding your team to check the tickets you are waiting for',
		badge: 'internal tool',
		tags: ['Slack', 'TypeScript'],
	},
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
