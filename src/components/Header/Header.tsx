import { NavLink } from 'react-router';
import useWindowSize from '../../hooks/useWindowSize';
import VIEWPORT from '../../constants/constants';
import './Header.scss';
import Logo from '../../assets/images/noah_claymorphism_remove-bg.png';
import Resume from '../../assets/documents/noah_harborth_resume.pdf';
import { ReactComponent as DocumentDownloadIcon } from '../../assets/images/icons/document-download.svg';
import { ReactComponent as MenuIcon } from '../../assets/images/icons/squiggly-arrow-up.svg';
import Button from '../Button/Button';

function HeaderNav({ isMobile }: { isMobile?: boolean }) {
	return isMobile ? (
		<nav className={`header__nav--mobile fade-in`}>
			<ul className='header__list--mobile'>
				<li className='header__item--mobile'>
					<NavLink to='/'>home</NavLink>
				</li>
				<li className='header__item--mobile'>
					<NavLink to='/about'>about</NavLink>
				</li>
				<li className='header__item--mobile'>
					<NavLink to='/contact'>contact</NavLink>
				</li>
			</ul>
		</nav>
	) : (
		<nav className={`header__nav fade-in delay-15`}>
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
	);
}

function HeaderResume({ isMobile }: { isMobile?: boolean }) {
	return isMobile ? (
		<div className={`header__resume--mobile fade-in`}>
			<Button
				type='link'
				styleType='round'
				href={Resume}
				className='header__resume-btn--mobile'
			>
				<DocumentDownloadIcon />
			</Button>
		</div>
	) : (
		<div className={`header__resume fade-in delay-17`}>
			<Button
				type='link'
				styleType='round'
				href={Resume}
				className='header__resume-btn'
			>
				<DocumentDownloadIcon />
			</Button>
		</div>
	);
}

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

			{!isMobile && (
				<div className='header__container'>
					<HeaderNav />
					<HeaderResume />
				</div>
			)}

			{isMobile && (
				<div className='header__menu'>
					<div className='header__menu-nav'>
						<HeaderNav isMobile />
						<HeaderResume isMobile />
					</div>
					<Button styleType='round' className='header__menu-btn'>
						<MenuIcon />
					</Button>
				</div>
			)}
		</header>
	);
}

export default Header;
