import './Projects.scss';
import { PROJECTS, DEFAULT_GRID_SPAN, SPARKLE_COUNT_PER_SPAN } from '../../constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import ProjectCard from './ProjectCard';


const Projects = (): JSX.Element => {
	const listRef = useRef<HTMLUListElement>(null);
	const { width } = useWindowSize();
	const [listWidth, setListWidth] = useState(800);

	const handleAnimationEnd = useCallback((e: React.AnimationEvent<HTMLElement>) => {
		const el = e.currentTarget;
		el.style.animation = 'none';
		el.style.opacity = '1';
	}, []);

	useEffect(() => {
		if (listRef.current) {
			setListWidth(listRef.current.scrollWidth);
		}
	}, [listRef, width]);

	return (
		<main className={'projects'}>
			<h1 className='fade-slide-in--top delay-15'>Projects</h1>

			<ul
				ref={listRef}
				className='projects__list'
				style={{ '--list-width': listWidth + 'px' } as React.CSSProperties}
			>
				{PROJECTS.map((project, index) => (
					<ProjectCard
						key={`${project.label}-${project.id}`}
						project={project}
						sparkleCount={(project.gridSpan ?? DEFAULT_GRID_SPAN) * SPARKLE_COUNT_PER_SPAN}
						index={index}
						onAnimationEnd={handleAnimationEnd}
					/>
				))}
			</ul>
		</main>
	);
};

export default Projects;
