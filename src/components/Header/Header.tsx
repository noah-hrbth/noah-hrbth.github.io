import Link from '../Link/Link.js';
import Button from '../Button/Button';
import useWindowSize from '../../hooks/useWindowSize';
import VIEWPORT from '../../constants.ts';
import './Header.scss';
import Logo from '../../assets/images/noah_clay_transparent.png';
import Resume from '../../assets/documents/NoahHarborthResume.pdf';
import { ReactComponent as DocumentDownloadIcon } from '../../assets/images/icons/document-download.svg';
import { ReactComponent as MenuIcon } from '../../assets/images/icons/squiggly-arrow-up.svg';
import { useState } from 'react';

function HeaderNav({ isMobile }: { isMobile?: boolean }) {
	return isMobile ? (
		<nav className={`header__nav--mobile fade-in`}>
			<ul className='header__list--mobile'>
				<li className='header__item--mobile'>
					<Link isNavLink to='/'>
						home
					</Link>
				</li>
				<li className='header__item--mobile'>
					<Link isNavLink to='/about'>
						about
					</Link>
				</li>
				<li className='header__item--mobile'>
					<Link isNavLink to='/contact'>
						contact
					</Link>
				</li>
			</ul>
		</nav>
	) : (
		<nav className={`header__nav fade-in delay-15`}>
			<ul className='header__list'>
				<li className='header__item'>
					<Link isNavLink to='/'>
						home
					</Link>
				</li>
				<li className='header__item'>
					<Link isNavLink to='/about'>
						about
					</Link>
				</li>
				<li className='header__item'>
					<Link isNavLink to='/contact'>
						contact
					</Link>
				</li>
			</ul>
		</nav>
	);
}

function HeaderResume({ isMobile }: { isMobile?: boolean }) {
	return isMobile ? (
		<div className={`header__resume--mobile fade-in`}>
			<Button
				type='link-inline'
				styleType='link-inline'
				href={Resume}
				className='header__resume-btn--mobile'
			>
				<DocumentDownloadIcon />
				<span>download resume</span>
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

const CloseIcon = () => <span>✕</span>;

// TODO: check if extractable as component

function ExpandingMenuButton() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

  // TODO: also close Menu as soon as you either click outside or you click one of the nav items
	const handleToggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};


  // TODO: animate the menu nav items animating in/out and then after delay the menu closes
	return (
		<div
			className={`header__expanding-menu-shell fade-in delay-15 ${
				isMenuOpen
					? 'header__expanding-menu-shell--open'
					: 'header__expanding-menu-shell--closed'
			}`}
		>
			<div
				className={`header__menu-actual-content ${
					isMenuOpen ? 'header__menu-actual-content--open' : ''
				}`}
				id='header__mobile-menu-content-area'
			>
				<HeaderNav isMobile={true} />
				<HeaderResume isMobile={true} />
			</div>

			{/* TODO: Make icon button as its own button component version */}
			<Button
				type='round'
				className='header__menu-icon-button'
				onClick={handleToggleMenu}
				aria-expanded={isMenuOpen}
				aria-controls='header__mobile-menu-content-area'
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
			>
				<span className='icon-wrapper'>
					{isMenuOpen ? <CloseIcon /> : <MenuIcon />}
				</span>
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
				<Link isNavLink to='/'>
					<img className={'icon--logo'} src={Logo} alt='Logo' />
				</Link>
			</div>

			{!isMobile && (
				<div className='header__container'>
					<HeaderNav />
					<HeaderResume />
				</div>
			)}

			{isMobile && <ExpandingMenuButton />}
		</header>
	);
}

export default Header;
