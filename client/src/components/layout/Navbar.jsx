import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Logo from './Logo';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/search', label: 'Search' },
  { to: '/write', label: 'Write', auth: true },
  { to: '/bookmarks', label: 'Bookmarks', auth: true },
  { to: '/admin', label: 'Admin', auth: true, admin: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (to, exact) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/8 bg-surface/80 backdrop-blur-md shadow-nav">
      <nav className="max-w-container mx-auto px-4 sm:px-6 h-[4.25rem] flex items-center justify-between gap-4">
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, exact, auth, admin }) => {
            if (auth && !user) return null;
            if (admin && user?.role !== 'admin') return null;
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'text-primary bg-primary/6'
                    : 'text-neutral-body/70 hover:text-primary hover:bg-primary/4'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-lg text-neutral-body/70 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg className="w-5 h-5 transition-transform duration-300 hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </svg>
            ) : (
              // Moon Icon
              <svg className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {user ? (
            <>
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-primary/4 transition-colors"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <span className="hidden lg:inline text-sm font-medium text-neutral-heading max-w-[120px] truncate">
                  {user.name}
                </span>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="text-xs px-3 py-1.5 hidden sm:inline-flex">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-xs px-3 py-1.5">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="text-xs px-4 py-1.5">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
