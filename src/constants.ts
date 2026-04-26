export const APP_ROUTES = [
	{ route: '/', name: 'home' },
	{ route: '/projects', name: 'projects' },
	{ route: '/contact', name: 'contact' },
];

export interface Project {
	id: string;
	label: string;
	description: string;
	badge?: string;
	link?: string;
	tags: string[];
	/** Effective column width in the grid (2, 3, or 4). Default: 3. Used for sparkle count scaling. */
	gridSpan?: number;
}

export const SPARKLE_COUNT_PER_SPAN = 2;
export const DEFAULT_GRID_SPAN = 3;

export const PROJECTS: Project[] = [
	{
		id: 'bachelor-thesis',
		label: 'RAG Bachelor Thesis',
		description:
			'My bachelor thesis project where I implemented a RAG pipeline and exlpored the theoretical background of it',
		badge: 'WIP',
		tags: ['AI', 'RAG', 'Python'],
	},
	{
		id: 'zed-claude-code',
		label: 'Zed Claude Code',
		description:
			"A Rust CLI (zcc - downloadable via homebrew) that bridges Zed and Claude Code, letting you set a keybinding in Zed to send the current selection to a Claude Code session running in Zed's integrated terminal",
		link: 'https://github.com/noah-hrbth/zed-claude-code',
		tags: ['Zed', 'Claude Code', 'Rust'],
	},

	{
		id: 'token-saver',
		label: 'LLM Token Saver',
		description:
			'A Rust CLI wrapper that strips unnecessary stuff from some command outputs to save tokens when used by agents',
		link: 'https://github.com/noah-hrbth/token-saver',
		tags: ['AI', 'CLI', 'Rust'],
	},
	{
		id: 'evkk',
		label: 'EVKK Website',
		description: 'The website of the EVKK, a hospital in Cologne',
		link: 'https://www.evkk.de',
		tags: ['Web Dev', 'Wordpress', 'PHP', 'React'],
		gridSpan: 2,
	},
	{
		id: 'kunstpalast',
		label: 'Kunstpalast Website & Webshop',
		description:
			'The website and webshop for the Kunstpalast museum, the biggest art museum in Düsseldorf',
		link: 'https://kunstpalast.de',
		tags: ['Web Dev', 'Wordpress', 'PHP', 'React'],
	},
	{
		id: 'nextmuseum-sacred-pixels',
		label: 'NextMuseum: Sacred Pixels',
		description:
			'An uni project for the Museum Ulm where we created a 3 split screen altar, that took pictures of the visitors and transformed them into various art styles with the help of AI',
		tags: ['AI', 'Computer Vision', 'Python'],
		gridSpan: 4,
	},
	{
		id: 'hovercube-42',
		label: 'HoverCube 42',
		description:
			'An uni project where we programmed a movement based racing game for a 1x1x1m wooden cube with a screen on top that had gyroscopes and a raspberry pi inside',
		link: 'https://github.com/jbg-1/hovercar-42',
		tags: ['Game Dev', 'Unity', 'C#'],
		gridSpan: 4,
	},
	{
		id: 'css-flex-grid-game',
		label: 'CSS Flex & Grid Game',
		description: 'An uni project game to practice CSS layout skills',
		badge: 'archived',
		tags: ['Web Dev', 'Vue.js'],
		gridSpan: 2,
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
	PROJECTS_HEADLINE: { skip: 0, entrance: 1.5 },
	PROJECTS_CARD_BASE: { skip: 0.1, entrance: 1.6 },
	CONTACT_HEADING: { skip: 0, entrance: 1.5 },
	CONTACT_ICONS_BASE: { skip: 0.2, entrance: 1.8 },
	CONTACT_EMAIL: { skip: 0.5, entrance: 2.2 },
	CONTACT_MESSAGE: { skip: 0.8, entrance: 2.5 },
	CONTACT_SUBMIT: { skip: 1.1, entrance: 2.8 },
	CONTACT_FOOTER: { skip: 2.3, entrance: 5.0 },
} as const;

/** Get animation delay CSS string based on entrance state, with optional per-item offset. */
export const getDelay = (
	delays: { skip: number; entrance: number },
	skipEntrance: boolean,
	offsetS = 0,
): string => `${(skipEntrance ? delays.skip : delays.entrance) + offsetS}s`;
