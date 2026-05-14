import { JSX, useCallback, useRef, useState } from 'react';
import { useSparkle } from '../../hooks/useSparkle';
import { useTilt } from '../../hooks/useTilt';
import { useInView } from '../../hooks/useInView';
import { Project, DELAY, getDelay } from '../../constants';

interface ProjectCardProps {
	project: Project;
	sparkleCount: number;
	index: number;
	skipEntrance: boolean;
	scrollRoot: Element | null;
}

/** A single project card with sparkle hover and 3D tilt effects. Slides in/out from the left as it enters/leaves the scroll root. */
const ProjectCard = ({
	project,
	sparkleCount,
	index,
	skipEntrance,
	scrollRoot,
}: ProjectCardProps): JSX.Element => {
	const cellRef = useRef<HTMLLIElement>(null);
	const inView = useInView(cellRef, {
		root: scrollRoot,
		rootMargin: '-12% 0px -12% 0px',
		enabled: scrollRoot !== null,
	});
	const [hasEntered, setHasEntered] = useState(false);
	const [skipEntranceAnim, setSkipEntranceAnim] = useState(false);
	// derived from inView: lock once card is observed offscreen before entering
	if (inView === false && !hasEntered && !skipEntranceAnim) {
		setSkipEntranceAnim(true);
	}

	const {
		sparklePositions,
		sparkleColor,
		isHovering,
		handleMouseEnter: sparkleMouseEnter,
		handleMouseLeave: sparkleMouseLeave,
	} = useSparkle(sparkleCount);
	const {
		handleMouseEnter: tiltMouseEnter,
		handleMouseMove,
		handleMouseLeave: tiltMouseLeave,
	} = useTilt();

	const handleMouseEnter = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			tiltMouseEnter(e);
			sparkleMouseEnter();
		},
		[tiltMouseEnter, sparkleMouseEnter],
	);

	const handleMouseLeave = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			tiltMouseLeave(e);
			sparkleMouseLeave();
		},
		[tiltMouseLeave, sparkleMouseLeave],
	);

	const handleAnimationEnd = useCallback(
		(e: React.AnimationEvent<HTMLElement>) => {
			// sparkle animations bubble; only react to the cell's own slide animation
			if (e.target !== e.currentTarget) return;
			if (!hasEntered) setHasEntered(true);
		},
		[hasEntered],
	);

	const animationClass = ((): string | null => {
		if (!hasEntered && skipEntranceAnim) {
			return inView ? 'fade-slide-in--left' : null;
		}
		if (!hasEntered) return 'fade-slide-in--left';
		return inView ? 'fade-slide-in--left' : 'fade-slide-out--left';
	})();

	const animationDelay =
		hasEntered || skipEntranceAnim
			? '0s'
			: getDelay(
					DELAY.PROJECTS_CARD_BASE,
					skipEntrance,
					index * (skipEntrance ? 0.1 : 0.3),
				);

	const cellClassName = `projects__cell${animationClass ? ` ${animationClass}` : ''}`;
	const cellStyle: React.CSSProperties =
		animationClass === null ? { opacity: 0 } : { animationDelay };

	return (
		<li
			ref={cellRef}
			id={project.id}
			className={cellClassName}
			style={cellStyle}
			onAnimationEnd={handleAnimationEnd}
		>
			<div
				className='projects__item'
				onMouseMove={handleMouseMove}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onFocus={sparkleMouseEnter}
				onBlur={sparkleMouseLeave}
			>
				<h4 className='projects__label'>{project.label}</h4>
				<p className='projects__description'>{project.description}</p>
				{project.link && (
					<span className='projects__link-wrapper'>
						[
						<a
							className='projects__link'
							href={project.link}
							target='_blank'
							rel='noreferrer'
						>
							{project.link}
						</a>
						]
					</span>
				)}
				{sparklePositions.map((pos, i) => (
					<span
						key={i}
						className={`sparkle${isHovering ? ' sparkle--active' : ''}`}
						style={
							{
								'--sparkle-index': i,
								'--sparkle-color': sparkleColor,
								top: pos.top,
								left: pos.left,
							} as React.CSSProperties
						}
					/>
				))}
			</div>
		</li>
	);
};

export default ProjectCard;
