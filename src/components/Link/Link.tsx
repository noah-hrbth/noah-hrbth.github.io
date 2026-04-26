import { NavLink } from 'react-router';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	isNavLink?: boolean;
	to: string;
	children: React.ReactNode;
}

function Link({ isNavLink, to, children, ...props }: LinkProps) {
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
