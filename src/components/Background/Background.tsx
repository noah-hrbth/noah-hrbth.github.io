import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useBlobColors } from '../../contexts/BlobColorsContext';
import './Background.scss';

const BLOB_COUNT = 5;
const SESSION_KEY = 'portfolioBlobEntrancePlayed';

/** Entrance timing — sparkles first, then blob morphs. */
const SPARKLE_STAGGER_MS = 200;
const BLOB_MORPH_START_MS = 1200; // first blob morph begins (after all sparkles visible)
const BLOB_MORPH_STAGGER_MS = 350;

/** Sparkle positions spread across the viewport (in %). */
const SPARKLE_POSITIONS: ReadonlyArray<{ top: number; left: number }> = [
	{ top: 25, left: 28 },
	{ top: 30, left: 62 },
	{ top: 76, left: 32 },
	{ top: 48, left: 68 },
	{ top: 40, left: 50 },
];

/** Size of each blob as a percentage of the container (matches CSS --circle-size). */
const BLOB_SIZES = [80, 80, 80, 80, 160];

/** Per-blob speed multiplier for organic variety (bigger blob = slower). */
const BLOB_SPEED_MULTIPLIERS = [1.0, 1.2, 0.8, 1.1, 0.6];

/** Speed range in px/frame at 60fps. */
const SPEED_MIN = 0.4;
const SPEED_MAX = 2.0;

/** How quickly the current speed transitions toward the target speed. */
const SPEED_LERP = 0.015;

/** Frame interval range for picking a new random target speed [min, max]. */
const SPEED_CHANGE_MIN_FRAMES = 120; // ~2s at 60fps
const SPEED_CHANGE_MAX_FRAMES = 360; // ~6s at 60fps

/** How far blobs wander from their sparkle origin (fraction of viewport). */
const WANDER_RANGE_X = 0.4;
const WANDER_RANGE_Y = 0.4;

/** Px distance at which a blob picks a new random target. */
const ARRIVAL_THRESHOLD = 10;

/** Minimum speed multiplier at path endpoints (ease-in/out floor). */
const EASE_FLOOR = 0.08;

type BlobPhase = 'entrance' | 'sparkle' | 'animating' | 'ready';

interface WanderState {
	offsetX: number;
	offsetY: number;
	targetX: number;
	targetY: number;
	startX: number;
	startY: number;
	totalDist: number;
	speed: number;
	targetSpeed: number;
	framesUntilSpeedChange: number;
}

/**
 * Compute inline top/left so the sparkle point is centered within the blob.
 * Sparkle is in %, blob size is in % -> offset = sparkle - size/2.
 */
const computeBlobOrigin = (
	sparkle: { top: number; left: number },
	blobSize: number,
): { top: string; left: string } => ({
	top: `${sparkle.top - blobSize / 2}%`,
	left: `${sparkle.left - blobSize / 2}%`,
});

/** Pick a random wandering target as a px offset from the blob's origin. */
const pickRandomTarget = (): { x: number; y: number } => ({
	x: (Math.random() * 2 - 1) * window.innerWidth * WANDER_RANGE_X,
	y: (Math.random() * 2 - 1) * window.innerHeight * WANDER_RANGE_Y,
});

/** Pick a random speed within the range, scaled by the blob's multiplier. */
const pickRandomSpeed = (blobIndex: number): number => {
	const base = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
	return base * BLOB_SPEED_MULTIPLIERS[blobIndex];
};

/** Pick a random number of frames until the next speed change. */
const pickSpeedChangeDelay = (): number =>
	SPEED_CHANGE_MIN_FRAMES +
	Math.random() * (SPEED_CHANGE_MAX_FRAMES - SPEED_CHANGE_MIN_FRAMES);

/** Build a fresh WanderState starting from a given position. */
const createWanderState = (
	blobIndex: number,
	fromX: number,
	fromY: number,
): WanderState => {
	const target = pickRandomTarget();
	const dx = target.x - fromX;
	const dy = target.y - fromY;
	return {
		offsetX: fromX,
		offsetY: fromY,
		targetX: target.x,
		targetY: target.y,
		startX: fromX,
		startY: fromY,
		totalDist: Math.sqrt(dx * dx + dy * dy),
		speed: pickRandomSpeed(blobIndex),
		targetSpeed: pickRandomSpeed(blobIndex),
		framesUntilSpeedChange: pickSpeedChangeDelay(),
	};
};

/** Check whether the entrance animation has already played this session. */
const hasEntrancePlayed = (): boolean => {
	try {
		// return sessionStorage.getItem(SESSION_KEY) === 'true';
		return false;
	} catch {
		return false;
	}
};

/** Mark entrance animation as played for this session. */
const markEntrancePlayed = (): void => {
	try {
		// sessionStorage.setItem(SESSION_KEY, 'true');
	} catch {
		/* sessionStorage unavailable */
	}
};

const Background: React.FC = () => {
	const interBubbleRef = useRef<HTMLDivElement>(null);
	const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
	const wanderStates = useRef<(WanderState | null)[]>(
		Array(BLOB_COUNT).fill(null),
	);
	const readyBlobs = useRef<Set<number>>(new Set());
	const rafId = useRef<number>(0);
	const { colors } = useBlobColors();

	const skipEntrance = hasEntrancePlayed();

	const [blobPhases, setBlobPhases] = useState<BlobPhase[]>(() =>
		Array.from({ length: BLOB_COUNT }, () =>
			skipEntrance ? 'ready' : 'entrance',
		),
	);

	const [showInteractive, setShowInteractive] = useState(skipEntrance);

	/** Advance a single blob to the given phase. */
	const advanceBlob = useCallback((index: number, to: BlobPhase) => {
		setBlobPhases((prev) => {
			const next = [...prev];
			next[index] = to;
			return next;
		});
	}, []);

	/** Initialize a blob for wandering (shared by skip-entrance and reduced-motion). */
	const initBlobWander = useCallback((index: number) => {
		wanderStates.current[index] = createWanderState(index, 0, 0);
		readyBlobs.current.add(index);
		advanceBlob(index, 'ready');
	}, [advanceBlob]);

	/* ---- Skip-entrance: initialize all blobs as ready immediately ---- */
	useEffect(() => {
		if (!skipEntrance) return;

		for (let i = 0; i < BLOB_COUNT; i++) {
			initBlobWander(i);
		}
		setShowInteractive(true);
	}, [skipEntrance, initBlobWander]);

	/* ---- Entrance: sparkles first, then blob morphs ---- */
	useEffect(() => {
		if (skipEntrance) return;

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;
		if (reducedMotion) {
			for (let i = 0; i < BLOB_COUNT; i++) {
				initBlobWander(i);
			}
			setShowInteractive(true);
			return;
		}

		const timers: number[] = [];

		/* Stage 1: stagger sparkle appearances. */
		for (let i = 0; i < BLOB_COUNT; i++) {
			timers.push(
				window.setTimeout(() => {
					advanceBlob(i, 'sparkle');
				}, i * SPARKLE_STAGGER_MS),
			);
		}

		/* Stage 2: after all sparkles visible, stagger blob morphs. */
		for (let i = 0; i < BLOB_COUNT; i++) {
			timers.push(
				window.setTimeout(() => {
					advanceBlob(i, 'animating');
				}, BLOB_MORPH_START_MS + i * BLOB_MORPH_STAGGER_MS),
			);
		}

		return () => timers.forEach((t) => window.clearTimeout(t));
	}, [skipEntrance, advanceBlob, initBlobWander]);

	/** When blobEnter completes, transition to ready and begin wandering. */
	const handleAnimationEnd = useCallback(
		(index: number) => (e: React.AnimationEvent<HTMLDivElement>) => {
			if (e.animationName !== 'blobEnter') return;

			wanderStates.current[index] = createWanderState(index, 0, 0);
			readyBlobs.current.add(index);

			advanceBlob(index, 'ready');

			if (index === BLOB_COUNT - 1) {
				setShowInteractive(true);
				markEntrancePlayed();
			}
		},
		[advanceBlob],
	);

	/* ---- Random wandering loop (runs continuously) ---- */
	useEffect(() => {
		const animate = () => {
			for (const i of readyBlobs.current) {
				const state = wanderStates.current[i];
				const el = blobRefs.current[i];
				if (!state || !el) continue;

				/* Smoothly transition base speed toward target speed. */
				state.speed += (state.targetSpeed - state.speed) * SPEED_LERP;

				/* Periodically pick a new random target speed. */
				state.framesUntilSpeedChange--;
				if (state.framesUntilSpeedChange <= 0) {
					state.targetSpeed = pickRandomSpeed(i);
					state.framesUntilSpeedChange = pickSpeedChangeDelay();
				}

				/* Direction + distance to target. */
				const dx = state.targetX - state.offsetX;
				const dy = state.targetY - state.offsetY;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < ARRIVAL_THRESHOLD) {
					/* Arrived — record current position as new start, pick new target. */
					state.startX = state.offsetX;
					state.startY = state.offsetY;
					const newTarget = pickRandomTarget();
					state.targetX = newTarget.x;
					state.targetY = newTarget.y;
					const tdx = state.targetX - state.startX;
					const tdy = state.targetY - state.startY;
					state.totalDist = Math.sqrt(tdx * tdx + tdy * tdy);
				} else {
					/* Ease-in/out: sine curve over progress (0→1 along path).
					   Blobs decelerate approaching targets and accelerate leaving. */
					const progress = state.totalDist > 0
						? 1 - dist / state.totalDist
						: 0.5;
					const easeFactor = EASE_FLOOR + (1 - EASE_FLOOR) * Math.sin(progress * Math.PI);

					const effectiveSpeed = state.speed * easeFactor;
					state.offsetX += (dx / dist) * effectiveSpeed;
					state.offsetY += (dy / dist) * effectiveSpeed;
				}

				el.style.transform = `translate(${Math.round(state.offsetX)}px, ${Math.round(state.offsetY)}px)`;
			}

			rafId.current = requestAnimationFrame(animate);
		};

		rafId.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafId.current);
	}, []);

	/* ---- Mouse-following interactive blob ---- */
	useEffect(() => {
		const interBubble = interBubbleRef.current;
		if (!interBubble) return;

		let curX = 0;
		let curY = 0;
		let tgX = 0;
		let tgY = 0;
		let mouseRafId: number;

		const move = () => {
			curX += (tgX - curX) / 20;
			curY += (tgY - curY) / 20;

			interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;

			mouseRafId = requestAnimationFrame(move);
		};

		const handleMouseMove = (event: MouseEvent) => {
			tgX = event.clientX;
			tgY = event.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);
		mouseRafId = requestAnimationFrame(move);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(mouseRafId);
		};
	}, []);

	/* ---- Sync blob colors to CSS custom properties ---- */
	useEffect(() => {
		document.documentElement.style.setProperty('--color1', colors.color1);
		document.documentElement.style.setProperty('--color2', colors.color2);
		document.documentElement.style.setProperty('--color3', colors.color3);
		document.documentElement.style.setProperty('--color4', colors.color4);
		document.documentElement.style.setProperty('--color5', colors.color5);
		document.documentElement.style.setProperty(
			'--color-interactive',
			colors.colorInteractive,
		);
	}, [colors]);

	/** Get className for a blob based on its animation phase. */
	const getBlobClassName = (index: number, phase: BlobPhase): string => {
		const base = `g${index + 1}`;
		if (phase === 'entrance' || phase === 'sparkle') return `${base} g--entrance`;
		if (phase === 'animating') return `${base} g--animating`;
		return base;
	};

	/** Get inline style positioning the blob centered on its sparkle. */
	const getBlobStyle = (index: number): React.CSSProperties => {
		const origin = computeBlobOrigin(
			SPARKLE_POSITIONS[index],
			BLOB_SIZES[index],
		);
		return { top: origin.top, left: origin.left };
	};

	return (
		<div className='gradient-bg'>
			<svg xmlns='http://www.w3.org/2000/svg'>
				<defs>
					<filter id='goo'>
						<feGaussianBlur
							in='SourceGraphic'
							stdDeviation='10'
							result='blur'
						/>
						<feColorMatrix
							in='blur'
							mode='matrix'
							values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8'
							result='goo'
						/>
						<feBlend in='SourceGraphic' in2='goo' />
					</filter>
				</defs>
			</svg>
			<div className='gradients-container'>
				{Array.from({ length: BLOB_COUNT }, (_, i) => (
					<div
						key={i}
						ref={(el) => {
							blobRefs.current[i] = el;
						}}
						className={getBlobClassName(i, blobPhases[i])}
						onAnimationEnd={handleAnimationEnd(i)}
						style={getBlobStyle(i)}
					/>
				))}
				<div
					className={`interactive${showInteractive ? '' : ' interactive--hidden'}`}
					ref={interBubbleRef}
				/>
			</div>
			{!skipEntrance && (
				<div className='sparkles-container'>
					{SPARKLE_POSITIONS.map((pos, i) => (
						<div
							key={i}
							className={`sparkle${blobPhases[i] === 'sparkle' || blobPhases[i] === 'animating' ? ' sparkle--animating' : ''}`}
							style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Background;
