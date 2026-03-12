import './Projects.scss';
import { PROJECTS } from '../../constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import { useTilt } from '../../hooks/useTilt';


const Projects = (): React.JSX.Element => {
	const listRef = useRef<HTMLUListElement>(null);
	const { width } = useWindowSize();
	const [listWidth, setListWidth] = useState(800);
	const { handleMouseMove, handleMouseLeave } = useTilt();

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
				{/* <img src={RunningPixelman} className='projects__running-pixelman' /> */}
				{PROJECTS.map((project, index) => (
					<li
						key={`${project.label}-${project.id}`}
						id={project.id}
						className='projects__item fade-slide-in--top'
						style={{ animationDelay: `${1.6 + index * 0.3}s` }}
						onMouseMove={handleMouseMove}
						onMouseLeave={handleMouseLeave}
						onAnimationEnd={handleAnimationEnd}
					>
						<h4 className='projects__label'>{project.label}</h4>
						<p className='projects__description'>{project.description}</p>
						{project.link && <span className='projects__link-wrapper'>[<a className='projects__link' href={project.link} target='_blank' rel='noreferrer'>{project.link}</a>]</span>}
					</li>
				))}
			</ul>
		</main>
	);
};

export default Projects;
