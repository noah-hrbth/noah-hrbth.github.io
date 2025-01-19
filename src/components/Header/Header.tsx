import { NavLink } from 'react-router';
import useWindowSize from '../../hooks/useWindowSize';
import VIEWPORT from '../../constants/constants';
import './Header.scss';
import Logo from '../../assets/images/noah_claymorphism_remove-bg.png';
import Resume from '../../assets/documents/noah_harborth_resume.pdf';
import { ReactComponent as DocumentDownloadIcon } from '../../assets/images/icons/document-download.svg';
import Button from '../Button/Button';

function Header() {
	const { width } = useWindowSize();
	const isMobile = width <= VIEWPORT.SMALL;

	return (
		<header className='header'>
			<div className='header__logo fade-in delay-13'>
				<NavLink to='/'>
					<img className={'icon--logo'} src={Logo} alt='Logo' />
				</NavLink>
			</div>

			<div className='header__container'>
				<nav className='header__nav fade-in delay-15'>
					<ul className='header__list'>
						<li className='header__item'>
							<NavLink to='/'>home</NavLink>
						</li>
						<li className='header__item'>
							<NavLink to='/about'>about</NavLink>
						</li>
						<li className='header__item'>
							<NavLink to='/contact'>contact</NavLink>
						</li>
					</ul>
				</nav>
				<div className='header__resume fade-in delay-17'>
					<Button type='link' href={Resume} className='header__resume-btn'>
						<DocumentDownloadIcon />
					</Button>
				</div>
			</div>

			{/* TODO: Add mobile menu */}
			{isMobile && <div className='header__mobile-menu'></div>}
		</header>
	);
}

export default Header;
