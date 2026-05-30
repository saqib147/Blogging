import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="group flex items-center gap-3 shrink-0">
      {/* <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md ring-1 ring-primary/25 transition-all duration-200 group-hover:scale-[1.04] group-hover:shadow-lg">
        <LogoMark className="h-[1.35rem] w-[1.35rem]" />
      </span> */}
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.35rem] font-bold tracking-tight text-primary">
            Ink{' '}
            <span className="text-secondary italic font-semibold">&</span>
            {' '}Echo
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-body/40">
            Stories worth sharing
          </span>
        </span>
      )}
    </Link>
  );
}
