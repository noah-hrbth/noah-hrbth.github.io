import Link from '../Link/Link.js';
import Button from '../Button/Button';
import useWindowSize from '../../hooks/useWindowSize';
import VIEWPORT from '../../constants.ts';
import './Header.scss';
import Logo from '../../assets/images/noah_clay_transparent.png';
import Resume from '../../assets/documents/NoahHarborthResume.pdf';
import { ReactComponent as DocumentDownloadIcon } from '../../assets/images/icons/document-download.svg';
import { ReactComponent as MenuIcon } from '../../assets/images/icons/squiggly-arrow-up.svg';
import { useEffect, useState } from 'react';
import ReactFocusLock from 'react-focus-lock';

function HeaderNav({
	isMobile,
	delayedIsMenuOpen,
}: {
	isMobile?: boolean;
	delayedIsMenuOpen?: boolean;
}) {
	return isMobile ? (
		<nav className={`header__nav--mobile`}>
			<ul className='header__list--mobile'>
				<li className='header__item--mobile'>
					<span
						style={{
							opacity: 0,
							display: delayedIsMenuOpen ? 'none' : 'block',
						}}
					>
						home
					</span>
					{delayedIsMenuOpen && (
						<Link isNavLink to='/'>
							<span className='fade-in delay'>home</span>
						</Link>
					)}
				</li>
				<li className='header__item--mobile'>
					<span
						style={{
							opacity: 0,
							display: delayedIsMenuOpen ? 'none' : 'block',
						}}
					>
						about
					</span>
					{delayedIsMenuOpen && (
						<Link isNavLink to='/about'>
							<span className='fade-in delay-03'>about</span>
						</Link>
					)}
				</li>
				<li className='header__item--mobile'>
					<span
						style={{
							opacity: 0,
							display: delayedIsMenuOpen ? 'none' : 'block',
						}}
					>
						contact
					</span>
					{delayedIsMenuOpen && (
						<Link isNavLink to='/contact'>
							<span className='fade-in delay-05'>contact</span>
						</Link>
					)}
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

function HeaderResume({
	isMobile,
	delayedIsMenuOpen,
}: {
	isMobile?: boolean;
	delayedIsMenuOpen?: boolean;
}) {
	return isMobile ? (
		<div className={`header__resume--mobile fade-in`}>
			<Button
				type='link-inline'
				styleType='link-inline'
				href={Resume}
				className='header__resume-btn--mobile'
			>
				<span
					style={{ opacity: 0, display: delayedIsMenuOpen ? 'none' : 'block' }}
				>
					download resume
				</span>
				{delayedIsMenuOpen && (
					<span className='fade-slide-in--bottom delay-07'>
						<DocumentDownloadIcon />
						<span>download resume</span>
					</span>
				)}
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
	const [delayedIsMenuOpen, setdelayedIsMenuOpen] = useState(false);

	useEffect(() => {
		const timerId = setTimeout(
			() => {
				setdelayedIsMenuOpen(isMenuOpen);
			},
			isMenuOpen ? 500 : 100
		);

		return () => {
			clearTimeout(timerId);
		};
	}, [isMenuOpen]);

	useEffect(() => {
		const handleClickOutsideToggleMenu = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const menuButton = document.querySelector(
				'.header__menu-icon-button'
			) as HTMLElement;
			const menuButtonIcon = document.querySelector(
				'.header__menu-icon-button-icon'
			) as HTMLElement;

			if (target === menuButtonIcon || target === menuButton) {
				return;
			}

			setIsMenuOpen(false);
		};

		document.addEventListener('click', handleClickOutsideToggleMenu);
		return () => {
			document.removeEventListener('click', handleClickOutsideToggleMenu);
		};
	}, []);

	const handleToggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<ReactFocusLock disabled={!isMenuOpen}>
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
					<HeaderNav isMobile={true} delayedIsMenuOpen={delayedIsMenuOpen} />
					<HeaderResume isMobile={true} delayedIsMenuOpen={delayedIsMenuOpen} />
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
					<span className='header__menu-icon-button-icon'>
						{isMenuOpen ? <CloseIcon /> : <MenuIcon />}
					</span>
				</Button>
			</div>
		</ReactFocusLock>
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
