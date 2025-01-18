import { NavLink } from 'react-router';
import Logo from '../assets/images/noah_claymorphism_remove-bg.png';
import { ReactComponent as DocumentDownloadIcon } from '../assets/images/icons/document-download.svg';

function Header() {
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
					<a
						className='header__resume-btn'
						href=''
						target='_blank'
						rel='noreferrer'
					>
						<DocumentDownloadIcon />
					</a>
				</div>
			</div>
		</header>
	);
}

export default Header;
