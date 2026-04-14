import { JSX, useCallback } from 'react';
import { useSparkle } from '../../hooks/useSparkle';
import { useTilt } from '../../hooks/useTilt';
import { Project, DELAY, getDelay } from '../../constants';

interface ProjectCardProps {
	project: Project;
	sparkleCount: number;
	index: number;
	skipEntrance: boolean;
	onAnimationEnd: (e: React.AnimationEvent<HTMLElement>) => void;
}

/** A single project card with sparkle hover and 3D tilt effects. */
const ProjectCard = ({
	project,
	sparkleCount,
	index,
	skipEntrance,
	onAnimationEnd,
}: ProjectCardProps): JSX.Element => {
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

	return (
		<li
			id={project.id}
			className='projects__item fade-slide-in--top'
			style={{
				animationDelay: getDelay(
					DELAY.PROJECTS_CARD_BASE,
					skipEntrance,
					index * (skipEntrance ? 0.1 : 0.3),
				),
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={sparkleMouseEnter}
			onBlur={sparkleMouseLeave}
			onAnimationEnd={onAnimationEnd}
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
		</li>
	);
};

export default ProjectCard;
