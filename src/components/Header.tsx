import { NavLink } from 'react-router';
import Logo from '../assets/images/noah_claymorphism_remove-bg.png';

function Header() {
	return (
		<header className='header'>
			<nav className='header__nav'>
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

			<div className='header__logo'>
				<NavLink to='/'>
					<img className={'icon--logo'} src={Logo} alt='Logo' />
				</NavLink>
			</div>
		</header>
	);
}

export default Header;
