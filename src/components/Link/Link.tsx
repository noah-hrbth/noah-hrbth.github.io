import { useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { NavLink } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	isNavLink?: boolean;
	to: string;
	children: React.ReactNode;
}

function Link({ isNavLink, to, children, ...props }: LinkProps) {
	const { urlChanged, setUrlChanged } = useNavigation();

	useEffect(() => {
		if (urlChanged) {
			setUrlChanged(false); // Reset the state after handling the change
		}
	}, [urlChanged, setUrlChanged]);

	return isNavLink ? (
		<NavLink to={to} {...props}>
			{children}
		</NavLink>
	) : (
		<a href={to} {...props} target='_blank' rel='noreferrer noopener'>
			{children}
		</a>
	);
}

export default Link;
