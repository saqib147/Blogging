import { Link } from 'react-router-dom';

export default function Tag({ label, to, onClick, active = false }) {
  const className = `inline-block px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
    active
      ? 'bg-primary text-primary-text shadow-sm'
      : 'bg-primary/6 text-primary/90 hover:bg-primary/10 border border-primary/8'
  }`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
