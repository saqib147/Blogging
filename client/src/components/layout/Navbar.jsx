import { useState, useEffect } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (to, exact) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const visibleLinks = navLinks.filter(({ auth, admin }) => {
    if (auth && !user) return false;
    if (admin && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-primary/8 bg-surface/80 backdrop-blur-md shadow-nav">
        <nav className="max-w-container mx-auto px-4 sm:px-6 h-[4.25rem] flex items-center justify-between gap-4">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map(({ to, label, exact }) => {
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

          {/* Right-side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-lg text-neutral-body/70 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 transition-transform duration-300 hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Desktop auth */}
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
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-xs px-3 py-1.5">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="text-xs px-4 py-1.5">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-neutral-body/70 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none cursor-pointer"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-surface border-l border-primary/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-[4.25rem] border-b border-primary/8 shrink-0">
          <Logo />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-lg text-neutral-body/70 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleLinks.map(({ to, label, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'text-primary bg-primary/8'
                    : 'text-neutral-body/75 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer — auth + theme */}
        <div className="px-3 py-4 border-t border-primary/8 space-y-2 shrink-0">
          {user ? (
            <>
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-neutral-heading truncate">{user.name}</span>
                  <span className="text-xs text-neutral-body/50">View profile</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-body/70 hover:text-primary hover:bg-primary/5 transition-colors text-left cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center">Login</Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full justify-center">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Theme toggle row */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-body/70 hover:text-primary hover:bg-primary/5 transition-colors text-left cursor-pointer"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
        </div>
      </aside>
    </>
  );
}
