import './Projects.scss';
import {
	PROJECTS,
	DEFAULT_GRID_SPAN,
	SPARKLE_COUNT_PER_SPAN,
	DELAY,
	getDelay,
	hasEntrancePlayed,
} from '../../constants';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import ProjectCard from './ProjectCard';

const Projects = (): JSX.Element => {
	const skipEntrance = hasEntrancePlayed();
	const listRef = useRef<HTMLUListElement>(null);
	const { width } = useWindowSize();
	const [listWidth, setListWidth] = useState(800);

	const handleAnimationEnd = useCallback(
		(e: React.AnimationEvent<HTMLElement>) => {
			const el = e.currentTarget;
			el.style.animation = 'none';
			el.style.opacity = '1';
		},
		[],
	);

	useEffect(() => {
		if (listRef.current) {
			setListWidth(listRef.current.scrollWidth);
		}
	}, [listRef, width]);

	return (
		<main className={'projects'}>
			<h1
				className='fade-slide-in--top'
				style={{
					animationDelay: getDelay(DELAY.PROJECTS_HEADLINE, skipEntrance),
				}}
			>
				projects
			</h1>

			<ul
				ref={listRef}
				className='projects__list'
				style={{ '--list-width': listWidth + 'px' } as React.CSSProperties}
			>
				{PROJECTS.map((project, index) => (
					<ProjectCard
						key={`${project.label}-${project.id}`}
						project={project}
						sparkleCount={
							(project.gridSpan ?? DEFAULT_GRID_SPAN) * SPARKLE_COUNT_PER_SPAN
						}
						index={index}
						skipEntrance={skipEntrance}
						onAnimationEnd={handleAnimationEnd}
					/>
				))}
			</ul>
		</main>
	);
};

export default Projects;
