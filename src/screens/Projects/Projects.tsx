import './Projects.scss';
import {
	PROJECTS,
	DEFAULT_GRID_SPAN,
	SPARKLE_COUNT_PER_SPAN,
	DELAY,
	getDelay,
	hasEntrancePlayed,
} from '../../constants';
import {
	JSX,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import { useInView } from '../../hooks/useInView';
import ProjectCard from './ProjectCard';

const Projects = (): JSX.Element => {
	const skipEntrance = hasEntrancePlayed();
	const projectsRef = useRef<HTMLElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const headlineRef = useRef<HTMLHeadingElement>(null);
	const { width } = useWindowSize();
	const [listWidth, setListWidth] = useState(800);
	const [scrollRoot, setScrollRoot] = useState<Element | null>(null);
	const [headlineEntered, setHeadlineEntered] = useState(false);

	const headlineInView = useInView(headlineRef, {
		root: scrollRoot,
		enabled: scrollRoot !== null,
	});

	useLayoutEffect(() => {
		setScrollRoot(projectsRef.current);
	}, []);

	useEffect(() => {
		if (listRef.current) {
			setListWidth(listRef.current.scrollWidth);
		}
	}, [listRef, width]);

	const handleHeadlineAnimationEnd = useCallback(() => {
		if (!headlineEntered) setHeadlineEntered(true);
	}, [headlineEntered]);

	// null (pre-observation) is treated as "in view" so the entrance plays on first paint
	const headlineAnimationClass =
		!headlineEntered || headlineInView !== false
			? 'fade-slide-in--left'
			: 'fade-slide-out--left';

	const headlineAnimationDelay = headlineEntered
		? '0s'
		: getDelay(DELAY.PROJECTS_HEADLINE, skipEntrance);

	return (
		<main ref={projectsRef} className={'projects'}>
			<h1
				ref={headlineRef}
				className={headlineAnimationClass}
				style={{ animationDelay: headlineAnimationDelay }}
				onAnimationEnd={handleHeadlineAnimationEnd}
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
						scrollRoot={scrollRoot}
					/>
				))}
			</ul>
		</main>
	);
};

export default Projects;
