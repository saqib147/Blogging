export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-surface rounded-lg border border-primary/6 shadow-card ${
        hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
