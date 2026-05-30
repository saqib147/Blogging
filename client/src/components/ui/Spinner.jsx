export default function Spinner({ className = '' }) {
  return (
    <div
      className={`w-9 h-9 border-2 border-primary/15 border-t-secondary rounded-full animate-spin ${className}`}
    />
  );
}
