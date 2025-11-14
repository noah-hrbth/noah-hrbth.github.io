import Link from '../Link/Link.js';
import Button from '../Button/Button';
import useWindowSize from '../../hooks/useWindowSize';
import VIEWPORT, { APP_ROUTES } from '../../constants.ts';
import './Header.scss';
import Cyborg1 from '../../assets/images/icons/cyborg-1/Cyborg1';
import Resume from '../../assets/documents/NoahHarborthResume.pdf';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFocusLock from 'react-focus-lock';
import { useLocation } from 'react-router';
import Arrow from '../../assets/images/icons/arrow/Arrow.tsx';

function HeaderNav({
	inactivePages,
	isMobile,
	delayedIsMenuOpen,
	className,
}: {
	inactivePages?: { route: string; name: string }[];
	isMobile?: boolean;
	delayedIsMenuOpen?: boolean;
	className?: string;
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
						Home
					</span>
					{delayedIsMenuOpen && (
						<Link isNavLink to='/'>
							<span className='fade-in delay'>Home</span>
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
						About
					</span>
					{delayedIsMenuOpen && (
						<Link isNavLink to='/about'>
							<span className='fade-in delay-03'>About</span>
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
						Contact
					</span>
					{delayedIsMenuOpen && (
						<Link isNavLink to='/contact'>
							<span className='fade-in delay-05'>Contact</span>
						</Link>
					)}
				</li>
			</ul>
		</nav>
	) : (
		<nav className={`header__nav ${className || ''}`}>
			<ul className='header__list'>
				<li></li>
				{inactivePages?.map((page, index) => (
					<li className='header__item' key={`${page.name}-${index}`}>
						<Link isNavLink to={page.route}>
							{page.name}
						</Link>
					</li>
				))}
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
					Resume
				</span>
				{delayedIsMenuOpen && (
					<span className='fade-slide-in--bottom delay-07'>
						<span>Resume</span>
					</span>
				)}
			</Button>
		</div>
	) : null;
}

const MenuIcon = () => <span>|</span>;

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
					<span
						className={`header__menu-icon-button-icon ${
							isMenuOpen ? 'header__menu-icon-button-icon--open' : ''
						}`}
					>
						<MenuIcon />
					</span>
				</Button>
			</div>
		</ReactFocusLock>
	);
}

function HeaderMenuDesktopButton({
	isOpen,
	onClick,
}: {
	isOpen: boolean;
	onClick: () => void;
}) {
	return (
		<div
			className={`header__nav-button ${
				isOpen ? 'header__nav-button--open' : ''
			}`}
		>
			<Button onClick={onClick}>
				<Arrow size={10} />
			</Button>
		</div>
	);
}

function Header() {
	const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
	const [delayedIsDesktopMenuOpen, setDelayedIsDesktopMenuOpen] = useState(false);
	const { width } = useWindowSize();
	const isMobile = width <= VIEWPORT.SMALL;
	const location = useLocation();

	console.log(location);

	const currentActivePage = useMemo(() => {
		const path = location.pathname.slice(1);

		if (path === '') {
			return 'home';
		}

		return path;
	}, [location]);

	const currentInacitvePages = useMemo(
		() => APP_ROUTES.filter((route) => route.route !== location.pathname),
		[location]
	);

	useEffect(() => {
		const timeout = setTimeout(
			() => {
				setDelayedIsDesktopMenuOpen(isDesktopMenuOpen);
			},
			isDesktopMenuOpen ? 50 : 300
		);

		return () => {
			clearTimeout(timeout);
		};
	}, [isDesktopMenuOpen]);

	useEffect(() => {
		setIsDesktopMenuOpen(false);
	}, [location]);

	return (
		<header className='header'>
			<div className='header__logo fade-in delay-13'>
				<Link isNavLink to='/'>
					<Cyborg1 size={36} />
				</Link>
			</div>
			<span className='fade-slide-in--top delay-15'>/</span>

			<div className='header__container'>
				<span className='header__active-page fade-slide-in--top delay-17'>
					{currentActivePage}
				</span>
				<HeaderMenuDesktopButton
					isOpen={isDesktopMenuOpen}
					onClick={() => {
						setIsDesktopMenuOpen(!isDesktopMenuOpen);
					}}
				/>
				{(delayedIsDesktopMenuOpen || isDesktopMenuOpen) && (
					<HeaderNav
						inactivePages={currentInacitvePages}
						className={isDesktopMenuOpen ? 'fade-in animation--fast' : 'fade-out'}
					/>
				)}
			</div>

			{isMobile && <ExpandingMenuButton />}
		</header>
	);
}

export default Header;
