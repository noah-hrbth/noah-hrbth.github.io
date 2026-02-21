import './Projects.scss';
import { PROJECTS } from '../../constants';
import RunningPixelman from '../../assets/images/RunningPixelman.gif';
import { useEffect, useRef, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';

function Projects() {
	const listRef = useRef<HTMLUListElement>(null);
	const { width } = useWindowSize();
	const [listWidth, setListWidth] = useState(listRef.current?.scrollWidth);

	useEffect(() => {
		if (listRef.current) {
			setListWidth(listRef.current.scrollWidth);
		}
	}, [PROJECTS.length, listRef, width]);

	return (
		<main className={'projects'}>
			<h1 className='fade-slide-in--top delay-15'>Projects</h1>

			<ul
				ref={listRef}
				className='projects__list'
				style={{ '--list-width': listWidth + 'px' } as React.CSSProperties}
			>
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				<img src={RunningPixelman} className='projects__running-pixelman' />
				{PROJECTS.map((project, index) => (
					<li
						key={`${project.label}-${project.id}`}
						id={project.id}
						className='projects__item fade-slide-in--top'
						style={{ animationDelay: `${1.6 + index * 0.3}s` }}
					>
						<h4 className='projects__label'>{project.label}</h4>
						<p className='projects__description'>{project.description}</p>
					</li>
				))}
			</ul>
		</main>
	);
}

export default Projects;
