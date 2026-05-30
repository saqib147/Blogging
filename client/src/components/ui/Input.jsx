export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-heading">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3.5 py-2.5 bg-surface border border-primary/10 rounded-md text-neutral-body placeholder:text-neutral-body/35 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all shadow-sm ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
