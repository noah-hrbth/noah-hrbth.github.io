import Link from '../Link/Link.js';
import Button from '../Button/Button';
import { APP_ROUTES, DELAY, getDelay, hasEntrancePlayed } from '../../constants.ts';
import './Header.scss';
import NoahsLogo from '../../assets/images/noah_logo.png';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import CaretDown from '../../assets/images/icons/caret-down/CaretDown.tsx';
import ColorShuffleButton from '../ColorShuffleButton/ColorShuffleButton';

function HeaderNav({
	inactivePages,
	className,
}: {
	inactivePages?: { route: string; name: string }[];
	className?: string;
}) {
	return (
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

function HeaderMenuDesktopButton({
	isOpen,
	onClick,
	skipEntrance,
}: {
	isOpen: boolean;
	onClick: () => void;
	skipEntrance: boolean;
}) {
	return (
		<div
			className={`header__nav-button fade-slide-in--top ${isOpen ? 'header__nav-button--open' : ''}`}
			style={{ animationDelay: getDelay(DELAY.HEADER_NAV_BUTTON, skipEntrance) }}
		>
			<Button onClick={onClick} className={'header__desktop-nav-button'}>
				<CaretDown size={10} />
			</Button>
		</div>
	);
}

function Header() {
	const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
	const [delayedIsDesktopMenuOpen, setDelayedIsDesktopMenuOpen] =
		useState(false);
	const skipEntrance = hasEntrancePlayed();
	const location = useLocation();

	const currentActivePage = useMemo(() => {
		const path = location.pathname.slice(1);

		if (path === '') {
			return 'home';
		}

		return path;
	}, [location]);

	const currentInacitvePages = useMemo(
		() => APP_ROUTES.filter((route) => route.route !== location.pathname),
		[location],
	);

	useEffect(() => {
		const timeout = setTimeout(
			() => {
				setDelayedIsDesktopMenuOpen(isDesktopMenuOpen);
			},
			isDesktopMenuOpen ? 50 : 300,
		);

		return () => {
			clearTimeout(timeout);
		};
	}, [isDesktopMenuOpen]);

	useEffect(() => {
		setIsDesktopMenuOpen(false);
	}, [location]);

	useEffect(() => {
		const handleClickOutsideDesktopMenu = (event: MouseEvent) => {
			const target = event.target;
			const menuButtonContainer = document.querySelector(
				'.header__nav-button *',
			);
			const headerActivePage = document.querySelector('.header__active-page');

			if (target === menuButtonContainer || target === headerActivePage) {
				return;
			}

			setIsDesktopMenuOpen(false);
		};

		document.addEventListener('click', handleClickOutsideDesktopMenu);
		return () => {
			document.removeEventListener('click', handleClickOutsideDesktopMenu);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') {
				return;
			}

			setIsDesktopMenuOpen(false);
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<header className='header'>
			<div className='header__logo fade-in' style={{ animationDelay: getDelay(DELAY.HEADER_LOGO, skipEntrance) }} role='button'>
				<Link isNavLink to='/'>
					<img
						className='header__logo-img'
						src={NoahsLogo}
						alt='Noah in Ghibli art style'
					/>
				</Link>
			</div>
			<span className='fade-slide-in--top' style={{ animationDelay: getDelay(DELAY.HEADER_SLASH, skipEntrance) }}>/</span>

			<div className='header__container'>
				<Button
					onClick={() => {
						setIsDesktopMenuOpen(true);
					}}
					className='header__active-page fade-slide-in--top'
					style={{ animationDelay: getDelay(DELAY.HEADER_ACTIVE_PAGE, skipEntrance) }}
					disabled={isDesktopMenuOpen}
					styleType='no-bg'
				>
					{currentActivePage}
				</Button>
				<HeaderMenuDesktopButton
					isOpen={isDesktopMenuOpen}
					skipEntrance={skipEntrance}
					onClick={() => {
						setIsDesktopMenuOpen(!isDesktopMenuOpen);
					}}
				/>
				{(delayedIsDesktopMenuOpen || isDesktopMenuOpen) && (
					<HeaderNav
						inactivePages={currentInacitvePages}
						className={
							isDesktopMenuOpen ? 'fade-in animation--fast' : 'fade-out'
						}
					/>
				)}
			</div>

			<ColorShuffleButton />
		</header>
	);
}

export default Header;
