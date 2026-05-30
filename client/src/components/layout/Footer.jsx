import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/8 bg-surface/60">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-neutral-body/60 max-w-sm leading-relaxed">
              A quiet corner of the web for thoughtful writing — essays, stories, and ideas that linger.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-body/45 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-neutral-body/65 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/search" className="text-neutral-body/65 hover:text-primary transition-colors">Search</Link></li>
              <li><Link to="/write" className="text-neutral-body/65 hover:text-primary transition-colors">Write a story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-body/45 mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="text-neutral-body/65 hover:text-primary transition-colors">Sign in</Link></li>
              <li><Link to="/signup" className="text-neutral-body/65 hover:text-primary transition-colors">Create account</Link></li>
              <li><Link to="/bookmarks" className="text-neutral-body/65 hover:text-primary transition-colors">Bookmarks</Link></li>
            </ul>
          </div>
        </div>

        <div className="divider-fade mb-6" />

        <p className="text-center text-xs text-neutral-body/45">
          &copy; {new Date().getFullYear()} Ink & Echo. Crafted for readers and writers.
        </p>
      </div>
    </footer>
  );
}
